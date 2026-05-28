import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffProfile } from '@/hooks/useStaffProfile';
import { QuizDefinition } from '@/data/quizData';

export type QuizOverallStatus =
  | 'not_started'
  | 'identify' // new: user needs to enter name+email first
  | 'in_progress'
  | 'submitted'
  | 'locked'
  | 'needs_rework'
  | 'approved';

export interface QuizAttemptData {
  id: string;
  quiz_key: string;
  attempt_number: number;
  started_at: string;
  timer_expires_at: string;
  submitted_at: string | null;
  locked_at: string | null;
  locked_reason: string | null;
  mcq_score: number;
  mcq_total: number;
  admin_status: string;
  overall_status: string;
  centre_id: string;
  educator_id: string;
  taker_name: string | null;
  taker_email: string | null;
}

export interface QuizAnswerData {
  id: string;
  attempt_id: string;
  question_key: string;
  answer_text: string | null;
  is_mcq: boolean;
  is_correct: boolean | null;
  admin_approved: boolean | null;
  admin_comment: string | null;
}

export function useQuizAttempt(quiz: QuizDefinition) {
  const { user } = useAuth();
  const { staffProfile } = useStaffProfile();
  const [attempt, setAttempt] = useState<QuizAttemptData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savedAnswers, setSavedAnswers] = useState<QuizAnswerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Identity state — user must identify before we look up their attempt
  const [takerIdentified, setTakerIdentified] = useState(false);
  const [takerName, setTakerName] = useState('');
  const [takerEmail, setTakerEmail] = useState('');

  // Fetch attempt for a specific taker (by email)
  const fetchAttemptForTaker = useCallback(async (email: string) => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: attempts, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('educator_id', user.id)
        .eq('quiz_key', quiz.key)
        .eq('taker_email', email.trim().toLowerCase())
        .order('attempt_number', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching quiz attempt:', error);
        setLoading(false);
        return;
      }

      if (attempts && attempts.length > 0) {
        const att = attempts[0] as unknown as QuizAttemptData;

        // If the attempt is in_progress or needs_rework but the timer has already expired,
        // mark it as locked immediately so the UI never flashes the quiz form.
        if (
          (att.overall_status === 'in_progress' || att.overall_status === 'needs_rework') &&
          new Date(att.timer_expires_at).getTime() <= Date.now()
        ) {
          att.overall_status = 'locked';
          att.locked_reason = 'time_expired';
          // Fire-and-forget DB update
          supabase
            .from('quiz_attempts')
            .update({
              overall_status: 'locked',
              locked_at: new Date().toISOString(),
              locked_reason: 'time_expired',
            })
            .eq('id', att.id)
            .then(({ error: lockErr }) => {
              if (lockErr) console.error('Error auto-locking expired attempt:', lockErr);
            });
        }

        setAttempt(att);

        // Fetch answers
        const { data: ansData } = await supabase
          .from('quiz_answers')
          .select('*')
          .eq('attempt_id', att.id);

        if (ansData) {
          const typedAnswers = ansData as unknown as QuizAnswerData[];
          setSavedAnswers(typedAnswers);
          const ansMap: Record<string, string> = {};
          typedAnswers.forEach((a) => {
            if (a.answer_text) ansMap[a.question_key] = a.answer_text;
          });
          setAnswers(ansMap);
        }
      } else {
        setAttempt(null);
        setAnswers({});
        setSavedAnswers([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching quiz attempt:', err);
    } finally {
      setLoading(false);
    }
  }, [user, quiz.key]);

  // When taker is identified, fetch their attempt
  useEffect(() => {
    if (takerIdentified && takerEmail) {
      fetchAttemptForTaker(takerEmail);
    }
  }, [takerIdentified, takerEmail, fetchAttemptForTaker]);

  // Auto-save answers when user switches away from tab
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const attemptRef = useRef(attempt);
  attemptRef.current = attempt;

  useEffect(() => {
    if (!attempt || (attempt.overall_status !== 'in_progress' && attempt.overall_status !== 'needs_rework')) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && attemptRef.current) {
        // Fire-and-forget save when user leaves tab
        const currentAnswers = answersRef.current;
        const currentAttempt = attemptRef.current;
        const currentSavedAnswers = savedAnswers;

        for (const q of quiz.questions) {
          const answerText = currentAnswers[q.key] || '';
          if (!answerText) continue;
          const existing = currentSavedAnswers.find((a) => a.question_key === q.key);
          const isMcq = q.type === 'mcq';
          const isCorrect = isMcq ? answerText === q.correctAnswer : null;

          if (existing) {
            supabase
              .from('quiz_answers')
              .update({ answer_text: answerText, is_correct: isCorrect })
              .eq('id', existing.id)
              .then(() => {});
          } else {
            supabase.from('quiz_answers').insert({
              attempt_id: currentAttempt.id,
              question_key: q.key,
              answer_text: answerText,
              is_mcq: isMcq,
              is_correct: isCorrect,
            }).then(() => {});
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [attempt?.id, attempt?.overall_status, savedAnswers, quiz.questions]);

  // Auto-save every 60 seconds while quiz is active
  useEffect(() => {
    if (!attempt || (attempt.overall_status !== 'in_progress' && attempt.overall_status !== 'needs_rework')) return;

    const interval = setInterval(() => {
      saveAnswers(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [attempt?.id, attempt?.overall_status]);

  // Timer logic
  useEffect(() => {
    if (!attempt) return;
    if (attempt.overall_status !== 'in_progress' && attempt.overall_status !== 'needs_rework') {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const expiresAt = new Date(attempt.timer_expires_at).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        handleAutoLock();
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attempt?.id, attempt?.timer_expires_at, attempt?.overall_status]);

  const handleAutoLock = async () => {
    if (!attempt) return;
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      await saveAnswers(true);

      await supabase
        .from('quiz_attempts')
        .update({
          overall_status: 'locked',
          locked_at: new Date().toISOString(),
          locked_reason: 'time_expired',
        })
        .eq('id', attempt.id);
    } catch (err) {
      console.error('Error during auto-lock:', err);
    }

    setAttempt((prev) =>
      prev ? { ...prev, overall_status: 'locked', locked_reason: 'time_expired' } : null
    );
    setTimeRemaining(0);
  };

  // Identify the taker — called from the UI
  const identifyTaker = (name: string, email: string) => {
    setTakerName(name.trim());
    setTakerEmail(email.trim().toLowerCase());
    setTakerIdentified(true);
  };

  // Reset identity (go back to identification screen)
  const resetIdentity = () => {
    setTakerIdentified(false);
    setAttempt(null);
    setAnswers({});
    setSavedAnswers([]);
  };

  const startQuiz = async () => {
    if (!user || !takerIdentified) return;

    try {
      let centreId = staffProfile?.centre_id;
      if (!centreId) {
        const { data: centres } = await supabase
          .from('centres')
          .select('id')
          .limit(1)
          .single();
        centreId = centres?.id;
      }
      if (!centreId) return;

      const attemptNumber = attempt ? attempt.attempt_number + 1 : 1;

      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          educator_id: user.id,
          quiz_key: quiz.key,
          attempt_number: attemptNumber,
          centre_id: centreId,
          overall_status: 'in_progress',
          mcq_total: quiz.mcqTotal,
          taker_name: takerName,
          taker_email: takerEmail,
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting quiz:', error);
        return;
      }

      const newAttempt = data as unknown as QuizAttemptData;
      setAttempt(newAttempt);
      setAnswers({});
      setSavedAnswers([]);
    } catch (err) {
      console.error('Unexpected error starting quiz:', err);
    }
  };

  const saveAnswers = async (silent = false) => {
    if (!attempt) return;
    if (!silent) setSaving(true);

    try {
      for (const q of quiz.questions) {
        const answerText = answers[q.key] || '';
        if (!answerText) continue;

        const existing = savedAnswers.find((a) => a.question_key === q.key);
        const isMcq = q.type === 'mcq';
        const isCorrect = isMcq ? answerText === q.correctAnswer : null;

        if (existing) {
          await supabase
            .from('quiz_answers')
            .update({ answer_text: answerText, is_correct: isCorrect })
            .eq('id', existing.id);
        } else {
          await supabase.from('quiz_answers').insert({
            attempt_id: attempt.id,
            question_key: q.key,
            answer_text: answerText,
            is_mcq: isMcq,
            is_correct: isCorrect,
          });
        }
      }

      const { data: ansData } = await supabase
        .from('quiz_answers')
        .select('*')
        .eq('attempt_id', attempt.id);

      if (ansData) {
        setSavedAnswers(ansData as unknown as QuizAnswerData[]);
      }
    } catch (err) {
      console.error('Error saving answers:', err);
    }

    if (!silent) setSaving(false);
  };

  const submitQuiz = async () => {
    if (!attempt) return;
    setSubmitting(true);

    try {
      await saveAnswers(true);

      const { data: ansData } = await supabase
        .from('quiz_answers')
        .select('*')
        .eq('attempt_id', attempt.id);

      const typedAnswers = (ansData || []) as unknown as QuizAnswerData[];

      const mcqCorrect = typedAnswers.filter((a) => a.is_mcq && a.is_correct).length;

      await supabase
        .from('quiz_attempts')
        .update({
          submitted_at: new Date().toISOString(),
          mcq_score: mcqCorrect,
          overall_status: 'submitted',
          admin_status: 'not_reviewed',
        })
        .eq('id', attempt.id);

      setAttempt((prev) =>
        prev
          ? {
              ...prev,
              submitted_at: new Date().toISOString(),
              mcq_score: mcqCorrect,
              overall_status: 'submitted',
              admin_status: 'not_reviewed',
            }
          : null
      );
      setSavedAnswers(typedAnswers);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }

    setSubmitting(false);
  };

  const updateAnswer = (questionKey: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
  };

  const submitRating = async (rating: number) => {
    if (!attempt) return;
    await supabase
      .from('quiz_attempts')
      .update({ onboarding_rating: rating } as any)
      .eq('id', attempt.id);
    setAttempt((prev) => prev ? { ...prev, onboarding_rating: rating } as any : null);
  };

  const getStatus = (): QuizOverallStatus => {
    if (!takerIdentified) return 'identify';
    if (loading) return 'identify'; // still loading
    if (!attempt) return 'not_started';
    const s = attempt.overall_status;
    if (s === 'locked') return 'locked';
    if (s === 'in_progress') return 'in_progress';
    if (s === 'needs_rework') return 'needs_rework';
    if (s === 'submitted') {
      if (attempt.admin_status === 'approved') return 'approved';
      if (attempt.admin_status === 'needs_rework') return 'needs_rework';
      return 'submitted';
    }
    if (s === 'approved') return 'approved';
    return 'not_started';
  };

  return {
    attempt,
    answers,
    savedAnswers,
    loading,
    saving,
    submitting,
    timeRemaining,
    status: getStatus(),
    takerIdentified,
    takerName,
    takerEmail,
    identifyTaker,
    resetIdentity,
    startQuiz,
    saveAnswers,
    submitQuiz,
    updateAnswer,
    submitRating,
    refetch: () => takerEmail ? fetchAttemptForTaker(takerEmail) : Promise.resolve(),
  };
}
