import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import openhouseLogo from '@/assets/openhouse-logo.png';

export default function Login() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // getPublicUrl is synchronous — no network. We just attempt to load it
    // and let the <img onError> handler clear it if it doesn't exist. This
    // saves a serial HEAD round-trip and lets the browser cache the image.
    const { data } = supabase.storage
      .from('calendar-images')
      .getPublicUrl('login-hero.png');
    setHeroImage(data.publicUrl);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const email = `${loginId.toLowerCase().replace(/\s+/g, '')}@openhouse.internal`;
    const { error } = await signIn(email, password);
    if (error) {
      toast({
        title: 'sign in failed',
        description: 'incorrect login id or password',
        variant: 'destructive',
      });
    } else {
      navigate('/calendar');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen max-w-content flex-col items-center px-5 pt-10 pb-10">
        {/* Logo */}
        <img
          src={openhouseLogo}
          alt="openhouse"
          className="h-9 w-auto"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Hero copy */}
        <div className="mt-5 w-full text-center">
          <h1 className="text-[28px] font-extrabold leading-[1.1] text-ink">
            parent–toddler club
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
            session plans, schedules and rhythm-of-day — at your fingertips.
          </p>
        </div>

        {/* Optional hero illustration */}
        {heroImage && (
          <div className="mt-6 w-full overflow-hidden rounded-card shadow-card">
            <img
              src={heroImage}
              alt=""
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
              onError={() => setHeroImage(null)}
            />
          </div>
        )}

        {/* Sign-in card */}
        <div className="mt-6 w-full rounded-card bg-brand-white p-6 shadow-float">
          <h2 className="text-[22px] font-extrabold leading-tight text-ink">
            sign in
          </h2>
          <p className="mt-1 text-[13px] text-ink-muted">
            enter the login id and password you were given.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="loginId"
                className="text-[11px] font-bold text-ink-muted"
              >
                login id
              </label>
              <input
                id="loginId"
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="centre name or admin"
                autoComplete="username"
                required
                className="mt-1.5 block w-full rounded-lg border border-ink/10 bg-bg/40 px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-[11px] font-bold text-ink-muted"
              >
                password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="mt-1.5 block w-full rounded-lg border border-ink/10 bg-bg/40 px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !loginId.trim() || !password}
              className="flex w-full items-center justify-center gap-2 rounded-card bg-brand-orange py-3 text-[14px] font-extrabold text-white transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  signing in…
                </>
              ) : (
                'sign in'
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-[10px] text-ink-subtle">
            this stores your session on this device. no account creation.
          </p>
        </div>

        {/* Tagline */}
        <p className="mt-7 text-center text-[13px] text-ink-muted">
          raising <span className="font-bold text-ink">curious humans</span>,{' '}
          <span className="font-bold text-brand-orange">together.</span>
        </p>
      </div>
    </div>
  );
}
