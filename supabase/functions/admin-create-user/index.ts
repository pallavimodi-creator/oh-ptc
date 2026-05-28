// Admin-only endpoint for provisioning new user accounts (trainer, scheduler,
// centre, or admin). The frontend at /admin → Users tab calls this so admins
// don't have to write SQL or use the Supabase dashboard each time.
//
// Auth model (mirrors upload-session-image):
//   1. Caller's JWT is verified via anon-client + Authorization header.
//   2. We re-fetch the caller's role with the service-role client and
//      require role = 'admin'.
//   3. We then create the auth user and insert the user_roles row.
//
// Request body (JSON):
//   {
//     loginId: string           // "indiranagar" / "amit-trainer"
//     password: string
//     role: 'admin' | 'trainer' | 'scheduler' | 'centre'
//     centreId?: string         // required when role === 'centre'
//   }
//
// Login email convention matches Login.tsx:
//   email = `${loginId.toLowerCase().replace(/\s+/g, '')}@openhouse.internal`

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

const ALLOWED_ROLES = new Set(['admin', 'trainer', 'scheduler', 'centre']);

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

    // 1. Identify the caller
    const authedClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: userData, error: userError } = await authedClient.auth.getUser();
    if (userError || !userData.user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }
    const callerId = userData.user.id;

    // 2. Privileged client and admin-role check
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: roleRow, error: roleError } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', callerId)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleRow) {
      return jsonResponse({ error: 'Forbidden — admin only' }, 403);
    }

    // 3. Validate payload
    const payload = (await req.json().catch(() => null)) as
      | { loginId?: string; password?: string; role?: string; centreId?: string | null }
      | null;
    if (!payload) return jsonResponse({ error: 'Invalid JSON body' }, 400);

    const rawLoginId = String(payload.loginId ?? '').trim();
    const password = String(payload.password ?? '');
    const role = String(payload.role ?? '');
    const centreId = payload.centreId ? String(payload.centreId) : null;

    if (!rawLoginId) return jsonResponse({ error: 'login id is required' }, 400);
    if (!/^[a-zA-Z0-9 \-_.]+$/.test(rawLoginId)) {
      return jsonResponse({ error: 'login id contains invalid characters' }, 400);
    }
    if (password.length < 8) {
      return jsonResponse({ error: 'password must be at least 8 characters' }, 400);
    }
    if (!ALLOWED_ROLES.has(role)) {
      return jsonResponse({ error: 'invalid role' }, 400);
    }
    if (role === 'centre' && !centreId) {
      return jsonResponse({ error: 'centre id required for centre role' }, 400);
    }
    if (role !== 'centre' && centreId) {
      return jsonResponse({ error: 'centre id only allowed for centre role' }, 400);
    }

    // Same email convention as login flow
    const loginId = rawLoginId.toLowerCase().replace(/\s+/g, '');
    const email = `${loginId}@openhouse.internal`;

    // 4. Create the auth user (email auto-confirmed since this is internal)
    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { login_id: rawLoginId, created_by: callerId },
    });

    if (createError || !created.user) {
      return jsonResponse({ error: createError?.message ?? 'failed to create user' }, 400);
    }

    const newUserId = created.user.id;

    // 5. Insert the role row
    const { error: roleInsertError } = await adminClient.from('user_roles').insert({
      user_id: newUserId,
      role,
      centre_id: centreId,
    });

    if (roleInsertError) {
      // Roll back the auth user so we don't leave an orphan
      await adminClient.auth.admin.deleteUser(newUserId);
      return jsonResponse({ error: roleInsertError.message }, 400);
    }

    return jsonResponse({
      userId: newUserId,
      email,
      loginId: rawLoginId,
      role,
      centreId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({ error: message }, 500);
  }
});
