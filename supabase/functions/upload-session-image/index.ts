import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Json = Record<string, unknown>;

function jsonResponse(body: Json, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    // Validate user via signing keys using anon client + incoming JWT
    const authedClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userData, error: userError } = await authedClient.auth.getUser();
    if (userError || !userData.user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const userId = userData.user.id;

    // Privileged client for storage + DB writes
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Authorize: must be admin role
    const { data: roleRow, error: roleError } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleRow) {
      return jsonResponse({ error: 'Forbidden' }, 403);
    }

    const form = await req.formData();
    const sessionName = String(form.get('sessionName') ?? '');
    const activityKey = String(form.get('activityKey') ?? '');
    const file = form.get('file');

    if (!sessionName || !activityKey || !(file instanceof File)) {
      return jsonResponse({ error: 'Invalid payload' }, 400);
    }

    // Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse({ error: 'File too large. Maximum 5MB allowed.' }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return jsonResponse({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP allowed.' }, 400);
    }

    // Validate file extension
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileExt = (file.name.split('.').pop() || '').toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      return jsonResponse({ error: 'Invalid file extension.' }, 400);
    }

    // Validate input parameters (alphanumeric, spaces, hyphens, ampersands only)
    if (!/^[a-zA-Z0-9\s\-&]+$/.test(sessionName)) {
      return jsonResponse({ error: 'Invalid session name.' }, 400);
    }
    if (!/^[a-z0-9_]+$/.test(activityKey)) {
      return jsonResponse({ error: 'Invalid activity key.' }, 400);
    }

    const safeSession = sessionName.toLowerCase().replace(/\s+/g, '-');
    const objectPath = `${safeSession}/${activityKey}.${fileExt}`;

    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error: uploadError } = await adminClient.storage
      .from('session-images')
      .upload(objectPath, bytes, { upsert: true, contentType: file.type });

    if (uploadError) {
      return jsonResponse({ error: uploadError.message }, 400);
    }

    const { data: pub } = adminClient.storage.from('session-images').getPublicUrl(objectPath);
    const publicUrl = pub.publicUrl;

    // Update DB mapping (session_images)
    const { data: existing } = await adminClient
      .from('session_images')
      .select('id')
      .eq('session_name', sessionName)
      .eq('activity_key', activityKey)
      .maybeSingle();

    if (existing?.id) {
      const { error: updErr } = await adminClient
        .from('session_images')
        .update({ image_url: publicUrl })
        .eq('id', existing.id);
      if (updErr) return jsonResponse({ error: updErr.message }, 400);
    } else {
      const { error: insErr } = await adminClient
        .from('session_images')
        .insert({ session_name: sessionName, activity_key: activityKey, image_url: publicUrl });
      if (insErr) return jsonResponse({ error: insErr.message }, 400);
    }

    return jsonResponse({ publicUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({ error: message }, 500);
  }
});
