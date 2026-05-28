import { useState, useEffect, useMemo } from 'react';
import { Loader2, UserPlus, CheckCircle2, ShieldCheck, GraduationCap, CalendarPlus, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Role = 'admin' | 'trainer' | 'scheduler' | 'centre';

interface CentreRow {
  id: string;
  name: string;
}

interface CreatedUser {
  userId: string;
  email: string;
  loginId: string;
  role: Role;
  centreId: string | null;
  createdAt: string;
}

const ROLES: { key: Role; label: string; description: string; icon: typeof ShieldCheck }[] = [
  {
    key: 'trainer',
    label: 'trainer',
    description: 'reviews onboarding quizzes and book submissions',
    icon: GraduationCap,
  },
  {
    key: 'scheduler',
    label: 'scheduler',
    description: 'plans the monthly session timetable',
    icon: CalendarPlus,
  },
  {
    key: 'centre',
    label: 'centre (teacher)',
    description: 'daily session calendar for one centre',
    icon: Home,
  },
  {
    key: 'admin',
    label: 'admin',
    description: 'everything — only create when truly needed',
    icon: ShieldCheck,
  },
];

export default function AdminUserManagement() {
  const { toast } = useToast();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('trainer');
  const [centreId, setCentreId] = useState<string>('');
  const [centres, setCentres] = useState<CentreRow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [recent, setRecent] = useState<CreatedUser[]>(() => {
    try {
      const stored = localStorage.getItem('admin:recentUsers');
      return stored ? (JSON.parse(stored) as CreatedUser[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('centres')
        .select('id, name')
        .order('name');
      if (data) setCentres(data as CentreRow[]);
    })();
  }, []);

  useEffect(() => {
    if (role !== 'centre') setCentreId('');
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload: Record<string, unknown> = { loginId, password, role };
    if (role === 'centre') payload.centreId = centreId;

    const { data, error } = await supabase.functions.invoke('admin-create-user', {
      body: payload,
    });

    if (error || !data || data.error) {
      toast({
        title: 'could not create user',
        description: (data?.error as string) || error?.message || 'unknown error',
        variant: 'destructive',
      });
      setSubmitting(false);
      return;
    }

    const created: CreatedUser = {
      userId: data.userId,
      email: data.email,
      loginId: data.loginId,
      role: data.role,
      centreId: data.centreId ?? null,
      createdAt: new Date().toISOString(),
    };

    const nextRecent = [created, ...recent].slice(0, 10);
    setRecent(nextRecent);
    localStorage.setItem('admin:recentUsers', JSON.stringify(nextRecent));

    toast({
      title: 'user created',
      description: `${created.loginId} can now sign in as ${created.role}.`,
    });

    setLoginId('');
    setPassword('');
    setRole('trainer');
    setCentreId('');
    setSubmitting(false);
  };

  const centreById = useMemo(() => {
    const map: Record<string, string> = {};
    centres.forEach((c) => (map[c.id] = c.name));
    return map;
  }, [centres]);

  const formValid =
    loginId.trim().length > 0 &&
    password.length >= 8 &&
    (role !== 'centre' || centreId.length > 0);

  return (
    <div className="space-y-6">
      {/* Create-user form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-card border border-ink/10 bg-brand-white p-4 shadow-card"
      >
        <h3 className="text-[16px] font-extrabold text-ink">create a new user</h3>
        <p className="mt-1 text-[12px] text-ink-muted">
          provisions a sign-in account and assigns a role. login email is generated from the id.
        </p>

        <div className="mt-4 space-y-4">
          {/* Role chooser */}
          <div>
            <Label className="text-[11px] font-bold text-ink-muted">role</Label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const active = role === r.key;
                return (
                  <button
                    type="button"
                    key={r.key}
                    onClick={() => setRole(r.key)}
                    className={cn(
                      'flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition-colors',
                      active
                        ? 'border-brand-orange bg-brand-orange/[0.06]'
                        : 'border-ink/10 bg-bg/40 hover:border-brand-orange/40'
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon
                        className={cn(
                          'h-3.5 w-3.5',
                          active ? 'text-brand-orange' : 'text-ink-muted'
                        )}
                      />
                      <span className="text-[12px] font-extrabold text-ink">{r.label}</span>
                    </div>
                    <span className="text-[10px] leading-tight text-ink-muted">
                      {r.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login id */}
          <div>
            <Label htmlFor="newLoginId" className="text-[11px] font-bold text-ink-muted">
              login id
            </Label>
            <Input
              id="newLoginId"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder={
                role === 'centre'
                  ? 'e.g. indiranagar'
                  : role === 'trainer'
                    ? 'e.g. priya-trainer'
                    : role === 'scheduler'
                      ? 'e.g. ops-scheduler'
                      : 'e.g. founder'
              }
              required
              className="mt-1.5 h-10 rounded-lg border border-ink/10 bg-bg/40 text-[14px]"
              autoComplete="off"
            />
            <p className="mt-1 text-[10px] text-ink-subtle">
              email becomes <code className="rounded bg-bg-subtle px-1">{loginId.toLowerCase().replace(/\s+/g, '') || '<loginid>'}@openhouse.internal</code>
            </p>
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="newPassword" className="text-[11px] font-bold text-ink-muted">
              password
            </Label>
            <Input
              id="newPassword"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="at least 8 characters"
              required
              minLength={8}
              className="mt-1.5 h-10 rounded-lg border border-ink/10 bg-bg/40 text-[14px] font-mono"
              autoComplete="new-password"
            />
            <p className="mt-1 text-[10px] text-ink-subtle">
              share with the user securely. they can sign in immediately.
            </p>
          </div>

          {/* Centre selector — only for centre role */}
          {role === 'centre' && (
            <div>
              <Label htmlFor="newCentre" className="text-[11px] font-bold text-ink-muted">
                centre
              </Label>
              <select
                id="newCentre"
                value={centreId}
                onChange={(e) => setCentreId(e.target.value)}
                required
                className="mt-1.5 block h-10 w-full rounded-lg border border-ink/10 bg-bg/40 px-3 text-[14px] outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              >
                <option value="">select a centre…</option>
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!formValid || submitting}
            className="flex w-full items-center justify-center gap-2 rounded-card bg-brand-orange py-2.5 text-[14px] font-extrabold text-white transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                creating…
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                create user
              </>
            )}
          </button>
        </div>
      </form>

      {/* Recently created users */}
      {recent.length > 0 && (
        <div className="rounded-card border border-ink/10 bg-brand-white p-4 shadow-card">
          <h3 className="text-[14px] font-extrabold text-ink">recently created</h3>
          <p className="mt-0.5 text-[11px] text-ink-muted">
            local to this browser — supabase has the source of truth.
          </p>
          <ul className="mt-3 space-y-2">
            {recent.map((u) => (
              <li
                key={u.userId}
                className="flex items-start justify-between gap-3 rounded-lg border border-ink/5 bg-bg/40 p-2.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 flex-shrink-0 text-[hsl(var(--success))]" />
                    <span className="truncate text-[13px] font-bold text-ink">
                      {u.loginId}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-ink-muted">
                    {u.role}
                    {u.centreId ? ` · ${centreById[u.centreId] ?? u.centreId}` : ''}
                  </p>
                </div>
                <time className="flex-shrink-0 text-[10px] text-ink-subtle">
                  {new Date(u.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
