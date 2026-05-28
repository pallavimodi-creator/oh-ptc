import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import {
  CalendarDays,
  ClipboardList,
  LayoutGrid,
  CalendarPlus,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const location = useLocation();
  const { isAdmin, isScheduler, isTrainer, signOut } = useAuth();

  // Teachers (role 'centre') see only calendar + onboarding.
  // Trainers see calendar + onboarding + trainer.
  // Schedulers see calendar + onboarding + scheduler.
  // Admins inherit all three plus dashboard.
  const navItems: { to: string; icon: typeof CalendarDays; label: string }[] = [
    { to: '/calendar', icon: CalendarDays, label: 'calendar' },
    { to: '/onboarding', icon: ClipboardList, label: 'onboarding' },
  ];

  if (isTrainer) {
    navItems.push({ to: '/trainer', icon: GraduationCap, label: 'trainer' });
  }
  if (isScheduler) {
    navItems.push({ to: '/scheduler', icon: CalendarPlus, label: 'scheduler' });
  }
  if (isAdmin) {
    navItems.push({ to: '/admin', icon: LayoutGrid, label: 'dashboard' });
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-brand-white"
      style={{
        borderTop: '1.5px solid rgba(44,43,40,0.12)',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
      }}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-around">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive =
            location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <RouterNavLink
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-2.5 text-center transition',
                isActive ? 'text-brand-orange' : 'text-ink-muted'
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
              <span className="text-[10px] font-bold leading-tight">{label}</span>
            </RouterNavLink>
          );
        })}
        <button
          onClick={signOut}
          aria-label="sign out"
          className="flex flex-col items-center gap-0.5 px-2 py-2.5 text-center text-ink-muted transition hover:text-brand-orange"
        >
          <LogOut className="h-5 w-5" strokeWidth={2} />
          <span className="text-[10px] font-bold leading-tight">sign out</span>
        </button>
      </div>
    </nav>
  );
}
