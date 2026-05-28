import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { QUIZ_EDUCATOR } from '@/data/quizData';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Shield, CheckCircle2, Clock, AlertCircle, MinusCircle } from 'lucide-react';
import QuizStatusBadge from '@/components/training/QuizStatusBadge';
import type { QuizOverallStatus } from '@/hooks/useQuizAttempt';

type ClearanceStatus = 'not_attempted' | 'in_progress' | 'pending_review' | 'needs_rework' | 'cleared';

export default function EducatorClearanceBadge() {
  const { user } = useAuth();
  const [quizStatus, setQuizStatus] = useState<QuizOverallStatus>('not_started');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchStatus();
  }, [user]);

  const fetchStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('quiz_attempts')
      .select('overall_status, admin_status, mcq_score, mcq_total')
      .eq('educator_id', user.id)
      .eq('quiz_key', QUIZ_EDUCATOR.key)
      .order('attempt_number', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const att = data[0];
      const s = att.overall_status as string;
      if (s === 'approved') setQuizStatus('approved');
      else if (s === 'locked') setQuizStatus('locked');
      else if (s === 'needs_rework') setQuizStatus('needs_rework');
      else if (s === 'submitted') {
        if (att.admin_status === 'approved') setQuizStatus('approved');
        else if (att.admin_status === 'needs_rework') setQuizStatus('needs_rework');
        else setQuizStatus('submitted');
      }
      else if (s === 'in_progress') setQuizStatus('in_progress');
      else setQuizStatus('not_started');
    } else {
      setQuizStatus('not_started');
    }

    setLoading(false);
  };

  const getClearance = (): ClearanceStatus => {
    if (quizStatus === 'not_started') return 'not_attempted';
    if (quizStatus === 'approved') return 'cleared';
    if (quizStatus === 'needs_rework') return 'needs_rework';
    if (quizStatus === 'submitted') return 'pending_review';
    return 'in_progress';
  };

  if (loading) return null;

  const clearance = getClearance();

  const clearanceConfig: Record<ClearanceStatus, { label: string; icon: React.ElementType; className: string }> = {
    not_attempted: { label: 'Assessment Not Attempted', icon: MinusCircle, className: 'bg-muted text-muted-foreground' },
    in_progress: { label: 'Assessment In Progress', icon: Clock, className: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' },
    pending_review: { label: 'Pending Admin Review', icon: Clock, className: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300' },
    needs_rework: { label: 'Needs Rework', icon: AlertCircle, className: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300' },
    cleared: { label: 'Cleared to Take Sessions', icon: CheckCircle2, className: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' },
  };

  const config = clearanceConfig[clearance];
  const Icon = config.icon;

  return (
    <Card className={cn('p-3 border', config.className)}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center flex-shrink-0">
          {clearance === 'cleared' ? (
            <Shield className="w-4 h-4 text-green-600" />
          ) : (
            <Icon className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">{config.label}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs">Quiz:</span>
            <QuizStatusBadge status={quizStatus} />
          </div>
        </div>
      </div>
    </Card>
  );
}
