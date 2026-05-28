import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Loader2, Clock, AlertTriangle, CheckCircle2, Save, ShieldCheck } from 'lucide-react';
import { useQuizAttempt } from '@/hooks/useQuizAttempt';
import QuizStatusBadge from '@/components/training/QuizStatusBadge';
import type { QuizDefinition } from '@/data/quizData';
import StarRating from '@/components/training/StarRating';

interface QuizModuleProps {
  quiz: QuizDefinition;
  onBack?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function QuizModule({ quiz, onBack }: QuizModuleProps) {
  const {
    attempt,
    answers,
    savedAnswers,
    loading,
    saving,
    submitting,
    timeRemaining,
    status,
    takerIdentified,
    takerName: identifiedName,
    identifyTaker,
    resetIdentity,
    startQuiz,
    saveAnswers,
    submitQuiz,
    updateAnswer,
    submitRating,
  } = useQuizAttempt(quiz);

  const [showConfirm, setShowConfirm] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [identityError, setIdentityError] = useState('');
  const [starting, setStarting] = useState(false);

  const currentRating = (attempt as any)?.onboarding_rating || 0;

  // Step 1: Identify the quiz taker
  if (status === 'identify') {
    const handleIdentify = () => {
      const name = nameInput.trim();
      const email = emailInput.trim().toLowerCase();

      if (!name) {
        setIdentityError('Please enter your full name.');
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setIdentityError('Please enter a valid email address.');
        return;
      }

      setIdentityError('');
      identifyTaker(name, email);
    };

    return (
      <div className="space-y-4">
        {onBack && (
          <button onClick={onBack} className="text-sm text-primary hover:underline">
            ← Back to modules
          </button>
        )}
        <Card className="p-5">
          <h2 className="text-lg font-bold mb-2">{quiz.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Multiple people from your centre can take this quiz. Please identify yourself first.
          </p>

          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold">Who is taking this quiz?</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your name and email so we can track your individual progress.
            </p>
            <div className="space-y-2">
              <div>
                <Label htmlFor="taker-name" className="text-xs">Full Name *</Label>
                <Input
                  id="taker-name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="taker-email" className="text-xs">Official Email ID *</Label>
                <Input
                  id="taker-email"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your official email"
                  className="mt-1"
                  maxLength={255}
                />
              </div>
            </div>
            {identityError && (
              <p className="text-xs text-destructive">{identityError}</p>
            )}
          </div>

          <Button onClick={handleIdentify} className="w-full mt-4" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
            Continue
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const isEditable = status === 'in_progress' || status === 'needs_rework';
  const isTimerWarning = timeRemaining !== null && timeRemaining < 300;

  const rejectedKeys = new Set(
    savedAnswers.filter((a) => a.admin_approved === false).map((a) => a.question_key)
  );

  const canEditQuestion = (questionKey: string) => {
    if (status === 'in_progress') return true;
    if (status === 'needs_rework') return rejectedKeys.has(questionKey);
    return false;
  };

  const allAnswered = quiz.questions.every((q) => {
    const ans = answers[q.key];
    return ans && ans.trim().length > 0;
  });

  const handleStartQuiz = async () => {
    setStarting(true);
    await startQuiz();
    setStarting(false);
  };

  // Not started — show quiz info + start button (identity already collected)
  if (status === 'not_started') {
    return (
      <div className="space-y-4">
        {onBack && (
          <button onClick={onBack} className="text-sm text-primary hover:underline">
            ← Back to modules
          </button>
        )}
        <Card className="p-5">
          <h2 className="text-lg font-bold mb-2">{quiz.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">{quiz.instructions}</p>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800 dark:text-amber-300">
                <p className="font-medium">30-Minute Time Limit</p>
                <p className="mt-1">
                  Once you start, you have 30 minutes to complete the quiz. The timer cannot be
                  paused. If time runs out, the quiz will be locked automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 mb-4 text-sm">
            <p className="text-muted-foreground">
              Taking quiz as: <strong className="text-foreground">{identifiedName}</strong>
            </p>
            <button onClick={resetIdentity} className="text-xs text-primary hover:underline mt-1">
              Not you? Change identity
            </button>
          </div>

          <Button onClick={handleStartQuiz} className="w-full" disabled={starting}>
            {starting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
            Start Quiz
          </Button>
        </Card>
      </div>
    );
  }

  if (status === 'locked') {
    return (
      <div className="space-y-4">
        {onBack && (
          <button onClick={onBack} className="text-sm text-primary hover:underline">
            ← Back to modules
          </button>
        )}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-bold">{quiz.title}</h2>
            <QuizStatusBadge status="locked" />
          </div>
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="font-semibold text-red-700 dark:text-red-400">
              Time is up. This quiz is locked.
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              Please contact an admin to unlock.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'submitted') {
    const mcqPassed = attempt && attempt.mcq_score >= quiz.passThreshold;
    return (
      <div className="space-y-4">
        {onBack && (
          <button onClick={onBack} className="text-sm text-primary hover:underline">
            ← Back to modules
          </button>
        )}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-bold">{quiz.title}</h2>
            <QuizStatusBadge status="submitted" />
          </div>
          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <p>
                <strong>MCQ Score:</strong> {attempt?.mcq_score}/{attempt?.mcq_total}{' '}
                {mcqPassed ? (
                  <span className="text-green-600">✓ Passed</span>
                ) : (
                  <span className="text-red-600">✗ Not passed — please review onboarding material and retry</span>
                )}
              </p>
            </div>
            {mcqPassed && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
                <p className="text-amber-700 dark:text-amber-300">
                  Your short answers are pending admin review.
                </p>
              </div>
            )}
            <div className="mt-4 pt-3 border-t border-border">
              <StarRating rating={currentRating} onRate={submitRating} />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="space-y-4">
        {onBack && (
          <button onClick={onBack} className="text-sm text-primary hover:underline">
            ← Back to modules
          </button>
        )}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-bold">{quiz.title}</h2>
            <QuizStatusBadge status="approved" />
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-700 dark:text-green-400">
              Quiz cleared! You are approved.
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              MCQ Score: {attempt?.mcq_score}/{attempt?.mcq_total}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <StarRating rating={currentRating} onRate={submitRating} />
          </div>
        </Card>
      </div>
    );
  }

  // Active quiz (in_progress or needs_rework)
  return (
    <div className="space-y-4">
      {onBack && (
        <button onClick={onBack} className="text-sm text-primary hover:underline">
          ← Back to modules
        </button>
      )}

      {/* Header with timer */}
      <div className="sticky top-[65px] z-30 bg-background/95 backdrop-blur-sm border-b border-border -mx-4 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">{quiz.title}</h2>
          {timeRemaining !== null && (
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-semibold',
                isTimerWarning
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              )}
            >
              <Clock className="w-4 h-4" />
              {formatTime(timeRemaining)}
            </div>
          )}
        </div>
        {status === 'needs_rework' && (
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            Please revise the rejected answers below and resubmit.
          </p>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {quiz.questions.map((q, index) => {
          const editable = canEditQuestion(q.key);
          const savedAnswer = savedAnswers.find((a) => a.question_key === q.key);
          const isRejected = savedAnswer?.admin_approved === false;
          const isApproved = savedAnswer?.admin_approved === true;

          return (
            <div key={q.key}>
              {q.sectionTitle && (
                <div className="flex items-center gap-2 mb-3 mt-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-semibold text-muted-foreground px-2">
                    {q.sectionTitle}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
              <Card
                className={cn(
                  'p-4',
                  isRejected && 'border-orange-300 dark:border-orange-700',
                  isApproved && 'border-green-300 dark:border-green-700'
                )}
              >
              <CardContent className="p-0">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xs font-bold text-muted-foreground bg-muted rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{q.question}</p>
                    {q.instruction && (
                      <p className="text-xs text-muted-foreground mt-1 italic">{q.instruction}</p>
                    )}
                  </div>
                  {q.type === 'mcq' && (
                    <span className="text-xs bg-primary/10 text-primary rounded px-1.5 py-0.5 flex-shrink-0">
                      MCQ
                    </span>
                  )}
                </div>

                {isRejected && savedAnswer?.admin_comment && (
                  <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded p-2 mb-3 text-xs">
                    <p className="font-medium text-orange-700 dark:text-orange-400">
                      Admin feedback:
                    </p>
                    <p className="text-orange-600 dark:text-orange-400 mt-0.5">
                      {savedAnswer.admin_comment}
                    </p>
                  </div>
                )}

                {q.type === 'mcq' ? (
                  <div className="space-y-2 mt-3">
                    {q.options?.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => editable && updateAnswer(q.key, opt.value)}
                        disabled={!editable}
                        className={cn(
                          'w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all',
                          answers[q.key] === opt.value
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-card hover:border-primary/30',
                          !editable && 'opacity-70 cursor-not-allowed'
                        )}
                      >
                        <span className="font-medium mr-2">{opt.value}.</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Textarea
                    value={answers[q.key] || ''}
                    onChange={(e) => editable && updateAnswer(q.key, e.target.value)}
                    disabled={!editable}
                    placeholder="Type your answer here..."
                    className="mt-3 min-h-[80px] text-sm"
                    rows={3}
                  />
                )}
              </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pb-4">
        <Button
          variant="outline"
          onClick={() => saveAnswers()}
          disabled={saving || !isEditable}
          className="flex-1"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
          Save Progress
        </Button>
        <Button
          onClick={() => setShowConfirm(true)}
          disabled={!allAnswered || submitting || !isEditable}
          className="flex-1"
        >
          Submit Quiz
        </Button>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-5">
            <h3 className="font-semibold mb-2">Submit Quiz?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once submitted, you cannot change your MCQ answers. Short answers may be sent back
              for rework if needed.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowConfirm(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowConfirm(false);
                  submitQuiz();
                }}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
