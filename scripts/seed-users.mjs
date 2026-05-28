#!/usr/bin/env node
/**
 * One-off seed: provisions the admin + trainer + per-centre logins.
 *
 * Idempotent — re-running:
 *   - reuses existing auth users (matched by email), just resets their
 *     password to whatever this script says
 *   - re-asserts the role row in user_roles
 *
 * Usage:
 *   SUPABASE_URL=https://<project>.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=<service-role-key> \
 *     node scripts/seed-users.mjs
 *
 * Or with a `.env` file in the project root containing the two vars,
 * then `node --env-file=.env scripts/seed-users.mjs` (Node ≥ 20.6).
 *
 * The service role key has full DB access — keep it out of git and out
 * of any shipped frontend bundle. It lives only on the operator's
 * machine when running this script.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Missing env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.'
  );
  process.exit(1);
}

// Mirrors the login flow in src/pages/Login.tsx
function loginIdToEmail(loginId) {
  return `${loginId.toLowerCase().replace(/\s+/g, '')}@openhouse.internal`;
}

// Mirrors the centre-list in src/data/sessions.ts CENTRES_TIMINGS
const CENTRES = [
  'Haralur',
  'HRBR',
  'HSR',
  'Indiranagar',
  'Jayanagar',
  'JP Nagar',
  'Sadashivnagar',
  'Sahakar Nagar',
  'Sarjapur',
  'Whitefield',
];

const USERS = [
  { loginId: 'admin', password: 'openhouselxd', role: 'admin', centreName: null },
  { loginId: 'trainer', password: 'oh.trainer', role: 'trainer', centreName: null },
  ...CENTRES.map((name) => {
    const id = name.toLowerCase().replace(/\s+/g, '');
    return {
      loginId: name, // keep cased name; loginIdToEmail handles normalisation
      password: `oh.${id}`,
      role: 'centre',
      centreName: name,
    };
  }),
];

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Build a name → id map for centres so we can fill user_roles.centre_id.
async function loadCentreMap() {
  const { data, error } = await admin.from('centres').select('id, name');
  if (error) throw new Error(`Failed to load centres: ${error.message}`);
  const map = new Map();
  for (const c of data || []) map.set(c.name, c.id);
  return map;
}

async function findUserByEmail(email) {
  // Paginate; small project so one page is fine but loop anyway.
  let page = 1;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(`listUsers failed: ${error.message}`);
    const found = data.users.find((u) => u.email === email);
    if (found) return found;
    if (data.users.length < 200) return null;
    page += 1;
  }
}

async function upsertUser({ loginId, password, role, centreName }, centreMap) {
  const email = loginIdToEmail(loginId);
  const centreId = centreName ? centreMap.get(centreName) ?? null : null;

  if (role === 'centre' && !centreId) {
    throw new Error(
      `Centre "${centreName}" not found in public.centres — seed centres first.`
    );
  }

  // 1. Ensure auth user exists with the desired password
  let user = await findUserByEmail(email);
  if (!user) {
    const { data: created, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { login_id: loginId },
    });
    if (error) throw new Error(`createUser ${email}: ${error.message}`);
    user = created.user;
    console.log(`  + created auth user ${email}`);
  } else {
    const { error } = await admin.auth.admin.updateUserById(user.id, { password });
    if (error) throw new Error(`updateUser ${email}: ${error.message}`);
    console.log(`  ~ reset password for existing user ${email}`);
  }

  // 2. Upsert the role row (one row per user, keyed on user_id)
  const { data: existing, error: roleErr } = await admin
    .from('user_roles')
    .select('id, role, centre_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (roleErr) throw new Error(`select user_roles ${email}: ${roleErr.message}`);

  if (existing) {
    if (existing.role !== role || existing.centre_id !== centreId) {
      const { error: updErr } = await admin
        .from('user_roles')
        .update({ role, centre_id: centreId })
        .eq('id', existing.id);
      if (updErr) throw new Error(`update user_roles ${email}: ${updErr.message}`);
      console.log(`    → updated role to ${role}${centreId ? ` (centre)` : ''}`);
    }
  } else {
    const { error: insErr } = await admin
      .from('user_roles')
      .insert({ user_id: user.id, role, centre_id: centreId });
    if (insErr) throw new Error(`insert user_roles ${email}: ${insErr.message}`);
    console.log(`    → assigned role ${role}${centreId ? ` (centre)` : ''}`);
  }
}

async function main() {
  console.log(`Seeding ${USERS.length} users against ${SUPABASE_URL}\n`);
  const centreMap = await loadCentreMap();

  for (const user of USERS) {
    console.log(`• ${user.loginId} (${user.role})`);
    try {
      await upsertUser(user, centreMap);
    } catch (e) {
      console.error(`  ! ${e.message}`);
    }
  }

  console.log('\nDone. Credentials summary:');
  console.log('─'.repeat(50));
  for (const u of USERS) {
    console.log(`${u.loginId.padEnd(20)} ${u.password}`);
  }
  console.log('─'.repeat(50));
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
