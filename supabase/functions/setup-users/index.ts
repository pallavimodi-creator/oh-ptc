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

// Generate a secure random password
function generateSecurePassword(length = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + special;
  
  // Ensure at least one of each type
  let password = '';
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += special.charAt(Math.floor(Math.random() * special.length));
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Privileged client for admin operations
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Check if any admin exists (bootstrap mode)
    const { data: existingAdmins } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    const isBootstrapMode = !existingAdmins || existingAdmins.length === 0;

    // If not bootstrap mode, require admin authentication
    if (!isBootstrapMode) {
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

      // Authorize: must be admin role
      const { data: roleRow, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userData.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError || !roleRow) {
        return jsonResponse({ error: 'Forbidden - Admin access required' }, 403);
      }
    }

    const centres = [
      'Indiranagar',
      'Sahakar Nagar', 
      'Whitefield',
      'HSR',
      'Jayanagar',
      'JP Nagar',
      'Haralur',
      'Sarjapur',
      'HRBR',
      'Sadashivnagar',
    ];

    const results: { centre: string; status: string; temporaryPassword?: string }[] = [];

    // Create centre users
    for (const centreName of centres) {
      const email = `${centreName.toLowerCase().replace(/\s+/g, '')}@openhouse.internal`;

      // Check if user exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users.find(u => u.email === email);

      if (existingUser) {
        results.push({ centre: centreName, status: 'already exists' });
        continue;
      }

      // Generate secure random password
      const password = generateSecurePassword();

      // Create user
      const { data: newUserData, error: createUserError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { must_reset_password: true }
      });

      if (createUserError) {
        results.push({ centre: centreName, status: `error: ${createUserError.message}` });
        continue;
      }

      // Get centre ID
      const { data: centreData } = await supabase
        .from('centres')
        .select('id')
        .eq('name', centreName)
        .single();

      if (centreData && newUserData.user) {
        // Create user role
        await supabase.from('user_roles').insert({
          user_id: newUserData.user.id,
          role: 'centre',
          centre_id: centreData.id,
        });
      }

      results.push({ 
        centre: centreName, 
        status: 'created',
        temporaryPassword: password // Return password for admin to distribute securely
      });
    }

    // Create admin user
    const adminEmail = 'pallavimodi@openhouse.internal';
    const adminPassword = 'marypoppins';
    
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingAdmin = existingUsers?.users.find(u => u.email === adminEmail);

    if (!existingAdmin) {
      const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { must_reset_password: true }
      });

      if (adminError) {
        results.push({ centre: 'Admin', status: `error: ${adminError.message}` });
      } else if (adminData.user) {
        await supabase.from('user_roles').insert({
          user_id: adminData.user.id,
          role: 'admin',
          centre_id: null,
        });
        results.push({ 
          centre: 'Admin', 
          status: 'created',
          temporaryPassword: adminPassword
        });
      }
    } else {
      results.push({ centre: 'Admin', status: 'already exists' });
    }

    return jsonResponse({ 
      success: true, 
      results,
      note: 'Temporary passwords are shown once. Distribute securely and require users to change on first login.'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({ error: message }, 500);
  }
});
