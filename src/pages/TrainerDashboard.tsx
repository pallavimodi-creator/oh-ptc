import { useState, useEffect } from 'react';
import { Loader2, BookOpen, GraduationCap } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminQuizReview from '@/components/AdminQuizReview';
import AdminBookReviews from '@/components/AdminBookReviews';

/**
 * Trainer dashboard — for staff who run the educator onboarding programme.
 * Trainers can:
 *   - approve / disapprove individual quiz answers
 *   - mark an attempt as approved or needs-rework (re-attempt)
 *   - unlock locked quizzes, reset attempts
 *   - review monthly book submissions
 *
 * Session acknowledgments are intentionally excluded — those are daily
 * operational confirmations from centre teachers, not onboarding work.
 *
 * Admins also see this view by virtue of `isTrainer` being true for admins.
 */
export default function TrainerDashboard() {
  const { isTrainer, loading: authLoading } = useAuth();
  const [pendingQuizCount, setPendingQuizCount] = useState(0);
  const [pendingBookCount, setPendingBookCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isTrainer) return;
    (async () => {
      const [quizRes, bookRes] = await Promise.all([
        supabase
          .from('quiz_attempts')
          .select('id')
          .in('overall_status', ['submitted', 'locked']),
        supabase
          .from('book_submissions')
          .select('id')
          .eq('status', 'pending'),
      ]);
      setPendingQuizCount(quizRes.data?.length ?? 0);
      setPendingBookCount(bookRes.data?.length ?? 0);
      setLoading(false);
    })();
  }, [isTrainer]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (!isTrainer) {
    return <Navigate to="/calendar" replace />;
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto max-w-content px-4 pt-4 pb-3">
          <p className="text-[11px] font-bold text-ink-muted">trainer</p>
          <h1 className="mt-0.5 text-[26px] font-extrabold leading-[1.05] text-ink">
            onboarding approvals
          </h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            review quizzes and educator submissions for the programme.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="mx-auto max-w-content px-4 py-4">
        <Tabs defaultValue="quizzes">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quizzes" className="relative">
              <GraduationCap className="mr-1.5 h-4 w-4" />
              quizzes
              {pendingQuizCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                  {pendingQuizCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="books" className="relative">
              <BookOpen className="mr-1.5 h-4 w-4" />
              books
              {pendingBookCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                  {pendingBookCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quizzes" className="mt-4">
            <AdminQuizReview />
          </TabsContent>

          <TabsContent value="books" className="mt-4">
            <AdminBookReviews />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
