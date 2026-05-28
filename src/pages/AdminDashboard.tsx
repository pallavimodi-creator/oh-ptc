import { useState, useEffect } from 'react';
import { Loader2, ClipboardCheck, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminSessionConfirmations from '@/components/AdminSessionConfirmations';
import AdminUserManagement from '@/components/AdminUserManagement';

/**
 * Admin dashboard — operational and account-management work only.
 *
 * Onboarding approvals (quiz reviews, book submissions) live on the
 * trainer dashboard at /trainer. Admins still see them via the trainer tab
 * (they inherit isTrainer), so nothing is lost — but the two dashboards
 * now have visibly different jobs:
 *
 *   /admin   → sessions, users
 *   /trainer → quizzes, books
 */
export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingSessionCount, setPendingSessionCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const { data } = await supabase
        .from('session_acknowledgments')
        .select('id')
        .eq('status', 'pending');
      setPendingSessionCount(data?.length ?? 0);
      setLoading(false);
    })();
  }, [isAdmin]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/calendar" replace />;
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto max-w-content px-4 pt-4 pb-3">
          <p className="text-[11px] font-bold text-ink-muted">admin</p>
          <h1 className="mt-0.5 text-[26px] font-extrabold leading-[1.05] text-ink">
            dashboard
          </h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            operations and account management. onboarding approvals live on the trainer tab.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="mx-auto max-w-content px-4 py-4">
        <Tabs defaultValue="sessions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sessions" className="relative">
              <ClipboardCheck className="mr-1.5 h-4 w-4" />
              sessions
              {pendingSessionCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                  {pendingSessionCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-1.5 h-4 w-4" />
              users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="mt-4">
            <AdminSessionConfirmations />
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <AdminUserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
