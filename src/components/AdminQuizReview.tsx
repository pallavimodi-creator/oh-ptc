import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Unlock,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  User,
} from 'lucide-react';
import { ALL_QUIZZES, getQuizByKey } from '@/data/quizData';
import QuizStatusBadge from '@/components/training/QuizStatusBadge';
import type { QuizOverallStatus } from '@/hooks/useQuizAttempt';

interface AttemptRow {
  id: string;
  educator_id: string;
  quiz_key: string;
  attempt_number: number;
  started_at: string;
  submitted_at: string | null;
  locked_at: string | null;
  locked_reason: string | null;
  mcq_score: number;
  mcq_total: number;
  admin_status: string;
  overall_status: string;
  centre_id: string;
  timer_expires_at: string;
  taker_name: string | null;
  taker_email: string | null;
}

interface AnswerRow {
  id: string;
  attempt_id: string;
  question_key: string;
  answer_text: string | null;
  is_mcq: boolean;
  is_correct: boolean | null;
  admin_approved: boolean | null;
  admin_comment: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

interface StaffRow {
  id: string;
  full_name: string;
  centre_id: string | null;
}

interface CentreRow {
  id: string;
  name: string;
}

export default function AdminQuizReview() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerRow[]>>({});
  const [staffNames, setStaffNames] = useState<Record<string, string>>({});
  const [centreNames, setCentreNames] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'needs_rework' | 'approved'>('pending');

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    setLoading(true);

    const { data: attemptsData } = await supabase
      .from('quiz_attempts')
      .select('*')
      .order('submitted_at', { ascending: false, nullsFirst: false });

    const typedAttempts = (attemptsData || []) as unknown as AttemptRow[];
    setAttempts(typedAttempts);

    // Fetch staff names
    const educatorIds = [...new Set(typedAttempts.map((a) => a.educator_id))];
    if (educatorIds.length > 0) {
      const { data: staffData } = await supabase
        .from('staff_profiles')
        .select('id, full_name, centre_id')
        .in('id', educatorIds);

      const names: Record<string, string> = {};
      (staffData || []).forEach((s: StaffRow) => {
        names[s.id] = s.full_name;
      });
      setStaffNames(names);
    }

    // Fetch centre names
    const centreIds = [...new Set(typedAttempts.map((a) => a.centre_id))];
    if (centreIds.length > 0) {
      const { data: centreData } = await supabase
        .from('centres')
        .select('id, name')
        .in('id', centreIds);

      const cnames: Record<string, string> = {};
      (centreData || []).forEach((c: CentreRow) => {
        cnames[c.id] = c.name;
      });
      setCentreNames(cnames);
    }

    setLoading(false);
  };

  const fetchAnswers = async (attemptId: string) => {
    if (answers[attemptId]) return;

    const { data } = await supabase
      .from('quiz_answers')
      .select('*')
      .eq('attempt_id', attemptId)
      .order('question_key');

    setAnswers((prev) => ({
      ...prev,
      [attemptId]: (data || []) as unknown as AnswerRow[],
    }));
  };

  const toggleExpand = (attemptId: string) => {
    if (expandedAttempt === attemptId) {
      setExpandedAttempt(null);
    } else {
      setExpandedAttempt(attemptId);
      fetchAnswers(attemptId);
    }
  };

  const approveAnswer = async (answerId: string, attemptId: string) => {
    if (!user) return;
    setSaving(answerId);

    await supabase
      .from('quiz_answers')
      .update({
        admin_approved: true,
        admin_comment: comments[answerId] || null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', answerId);

    // Refresh answers
    const { data } = await supabase
      .from('quiz_answers')
      .select('*')
      .eq('attempt_id', attemptId)
      .order('question_key');

    setAnswers((prev) => ({
      ...prev,
      [attemptId]: (data || []) as unknown as AnswerRow[],
    }));
    setSaving(null);
  };

  const rejectAnswer = async (answerId: string, attemptId: string) => {
    if (!user || !comments[answerId]?.trim()) return;
    setSaving(answerId);

    await supabase
      .from('quiz_answers')
      .update({
        admin_approved: false,
        admin_comment: comments[answerId],
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', answerId);

    const { data } = await supabase
      .from('quiz_answers')
      .select('*')
      .eq('attempt_id', attemptId)
      .order('question_key');

    setAnswers((prev) => ({
      ...prev,
      [attemptId]: (data || []) as unknown as AnswerRow[],
    }));
    setSaving(null);
  };

  const markOverallApproved = async (attemptId: string) => {
    setSaving(attemptId);
    await supabase
      .from('quiz_attempts')
      .update({ admin_status: 'approved', overall_status: 'approved' })
      .eq('id', attemptId);

    setAttempts((prev) =>
      prev.map((a) =>
        a.id === attemptId ? { ...a, admin_status: 'approved', overall_status: 'approved' } : a
      )
    );
    setSaving(null);
  };

  const markNeedsRework = async (attemptId: string) => {
    setSaving(attemptId);

    // Reset timer for rework
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    await supabase
      .from('quiz_attempts')
      .update({
        admin_status: 'needs_rework',
        overall_status: 'needs_rework',
        timer_expires_at: expiresAt,
        locked_at: null,
        locked_reason: null,
      })
      .eq('id', attemptId);

    setAttempts((prev) =>
      prev.map((a) =>
        a.id === attemptId
          ? { ...a, admin_status: 'needs_rework', overall_status: 'needs_rework' }
          : a
      )
    );
    setSaving(null);
  };

  const unlockQuiz = async (attemptId: string) => {
    if (!user) return;
    setSaving(attemptId);

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    await supabase
      .from('quiz_attempts')
      .update({
        overall_status: 'in_progress',
        locked_at: null,
        locked_reason: null,
        timer_expires_at: expiresAt,
      })
      .eq('id', attemptId);

    // Log the unlock
    await supabase.from('quiz_unlock_logs').insert({
      attempt_id: attemptId,
      unlocked_by: user.id,
      action: 'unlock_resume',
    });

    setAttempts((prev) =>
      prev.map((a) =>
        a.id === attemptId
          ? { ...a, overall_status: 'in_progress', locked_at: null, locked_reason: null }
          : a
      )
    );
    setSaving(null);
  };

  const resetAttempt = async (attemptId: string) => {
    if (!user) return;
    setSaving(attemptId);

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    // Clear answers
    await supabase.from('quiz_answers').delete().eq('attempt_id', attemptId);

    // Reset attempt
    await supabase
      .from('quiz_attempts')
      .update({
        overall_status: 'in_progress',
        locked_at: null,
        locked_reason: null,
        submitted_at: null,
        mcq_score: 0,
        admin_status: 'not_reviewed',
        timer_expires_at: expiresAt,
        started_at: new Date().toISOString(),
      })
      .eq('id', attemptId);

    // Log
    await supabase.from('quiz_unlock_logs').insert({
      attempt_id: attemptId,
      unlocked_by: user.id,
      action: 'reset',
    });

    // Clear cached answers
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[attemptId];
      return next;
    });

    setAttempts((prev) =>
      prev.map((a) =>
        a.id === attemptId
          ? { ...a, overall_status: 'in_progress', locked_at: null, locked_reason: null, submitted_at: null, mcq_score: 0, admin_status: 'not_reviewed' }
          : a
      )
    );
    setSaving(null);
  };

  const getStatusForDisplay = (att: AttemptRow): QuizOverallStatus => {
    if (att.overall_status === 'locked') return 'locked';
    if (att.overall_status === 'approved') return 'approved';
    if (att.overall_status === 'needs_rework') return 'needs_rework';
    if (att.overall_status === 'submitted') return 'submitted';
    if (att.overall_status === 'in_progress') return 'in_progress';
    return 'not_started';
  };

  const filtered = attempts.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return a.overall_status === 'submitted' || a.overall_status === 'locked';
    if (filter === 'needs_rework') return a.overall_status === 'needs_rework';
    if (filter === 'approved') return a.overall_status === 'approved';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['pending', 'needs_rework', 'approved', 'all'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'pending' ? 'Pending Review' : f === 'needs_rework' ? 'Needs Rework' : f === 'approved' ? 'Approved' : 'All'}
          </Button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No quiz submissions found.</p>
      )}

      {filtered.map((att) => {
        const quizDef = getQuizByKey(att.quiz_key);
        const isExpanded = expandedAttempt === att.id;
        const attemptAnswers = answers[att.id] || [];
        const adminReviewableAnswers = attemptAnswers.filter((a) => !a.is_mcq);
        const allAdminApproved = adminReviewableAnswers.length > 0 && adminReviewableAnswers.every((a) => a.admin_approved === true);
        const mcqPassed = att.mcq_score >= (quizDef?.passThreshold || 0);

        return (
          <Card key={att.id} className="overflow-hidden">
            <button
              className="w-full p-4 text-left flex items-center justify-between"
              onClick={() => toggleExpand(att.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {att.taker_name || staffNames[att.educator_id] || 'Unknown'}
                  </p>
                  {att.taker_email && (
                    <p className="text-xs text-muted-foreground">{att.taker_email}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {centreNames[att.centre_id] || ''} · {quizDef?.title || att.quiz_key}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {att.submitted_at
                      ? `Submitted: ${new Date(att.submitted_at).toLocaleString()}`
                      : `Started: ${new Date(att.started_at).toLocaleString()}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <QuizStatusBadge status={getStatusForDisplay(att)} />
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isExpanded && (
              <CardContent className="border-t pt-4 space-y-4">
                {/* MCQ Score Summary */}
                <div className="flex gap-3 flex-wrap">
                  <Badge variant={mcqPassed ? 'default' : 'destructive'} className="text-xs">
                    MCQ: {att.mcq_score}/{att.mcq_total} {mcqPassed ? '✓' : '✗'}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Attempt #{att.attempt_number}
                  </Badge>
                </div>

                {/* Admin actions for locked quizzes */}
                {att.overall_status === 'locked' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => unlockQuiz(att.id)}
                      disabled={saving === att.id}
                    >
                      <Unlock className="w-4 h-4 mr-1" />
                      Unlock & Resume (30 min)
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resetAttempt(att.id)}
                      disabled={saving === att.id}
                      className="text-destructive"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset Attempt
                    </Button>
                  </div>
                )}

                {/* Answers */}
                {attemptAnswers.length === 0 && (
                  <p className="text-sm text-muted-foreground">Loading answers...</p>
                )}

                {attemptAnswers.map((ans) => {
                  const qDef = quizDef?.questions.find((q) => q.key === ans.question_key);
                  if (!qDef) return null;

                  return (
                    <div
                      key={ans.id}
                      className={cn(
                        'border rounded-lg p-3 space-y-2',
                        ans.is_mcq
                          ? ans.is_correct
                            ? 'border-green-200 dark:border-green-800'
                            : 'border-red-200 dark:border-red-800'
                          : ans.admin_approved === true
                          ? 'border-green-200 dark:border-green-800'
                          : ans.admin_approved === false
                          ? 'border-orange-200 dark:border-orange-800'
                          : 'border-border'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{qDef.question}</p>
                        {ans.is_mcq ? (
                          ans.is_correct ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          )
                        ) : null}
                      </div>

                      <div className="bg-muted/50 rounded p-2 text-sm">
                        <p className="text-xs text-muted-foreground mb-1">Answer:</p>
                        <p>{ans.answer_text || '(empty)'}</p>
                      </div>

                      {ans.is_mcq && !ans.is_correct && (
                        <p className="text-xs text-muted-foreground">
                          Correct answer: {qDef.correctAnswer}
                        </p>
                      )}

                      {/* Admin review section for non-MCQ */}
                      {!ans.is_mcq && att.overall_status === 'submitted' && (
                        <div className="space-y-2 pt-2 border-t">
                          {qDef.adminRubric && (
                            <p className="text-xs text-muted-foreground italic">
                              Rubric: {qDef.adminRubric}
                            </p>
                          )}

                          {ans.admin_approved === null && (
                            <>
                              <Textarea
                                placeholder="Comment (required for rejection)..."
                                value={comments[ans.id] || ''}
                                onChange={(e) =>
                                  setComments((prev) => ({ ...prev, [ans.id]: e.target.value }))
                                }
                                className="text-sm min-h-[50px]"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => approveAnswer(ans.id, att.id)}
                                  disabled={saving === ans.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => rejectAnswer(ans.id, att.id)}
                                  disabled={saving === ans.id || !comments[ans.id]?.trim()}
                                  className="text-orange-600 border-orange-300"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </>
                          )}

                          {ans.admin_approved === true && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              ✓ Approved
                            </Badge>
                          )}

                          {ans.admin_approved === false && (
                            <div>
                              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                ✗ Rejected
                              </Badge>
                              {ans.admin_comment && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Comment: {ans.admin_comment}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Show review status for non-submitted */}
                      {!ans.is_mcq && att.overall_status !== 'submitted' && ans.admin_approved !== null && (
                        <div className="pt-1">
                          {ans.admin_approved ? (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                              ✓ Approved
                            </Badge>
                          ) : (
                            <div>
                              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs">
                                ✗ Rejected
                              </Badge>
                              {ans.admin_comment && (
                                <p className="text-xs text-muted-foreground mt-1">{ans.admin_comment}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Overall actions */}
                {att.overall_status === 'submitted' && mcqPassed && attemptAnswers.length > 0 && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      onClick={() => markOverallApproved(att.id)}
                      disabled={saving === att.id || !allAdminApproved}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {saving === att.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Mark as Approved
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => markNeedsRework(att.id)}
                      disabled={saving === att.id}
                      className="text-orange-600 border-orange-300"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Needs Rework
                    </Button>
                  </div>
                )}

                {att.overall_status === 'submitted' && !mcqPassed && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm text-red-700 dark:text-red-400">
                    MCQ score below threshold. Educator needs to retake the quiz.
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetAttempt(att.id)}
                        disabled={saving === att.id}
                        className="text-destructive"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset Attempt
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
