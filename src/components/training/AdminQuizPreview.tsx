import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { QuizDefinition } from '@/data/quizData';

interface AdminQuizPreviewProps {
  quiz: QuizDefinition;
  onBack?: () => void;
}

export default function AdminQuizPreview({ quiz, onBack }: AdminQuizPreviewProps) {
  return (
    <div className="space-y-4">
      {onBack && (
        <button onClick={onBack} className="text-sm text-primary hover:underline">
          ← Back to modules
        </button>
      )}

      <Card className="p-5">
        <h2 className="text-lg font-bold mb-1">{quiz.title}</h2>
        <p className="text-sm text-muted-foreground mb-3">{quiz.instructions}</p>
        <Badge variant="secondary" className="text-xs">
          Admin Preview — {quiz.questions.length} questions, {quiz.mcqTotal} MCQs, pass threshold: {quiz.passThreshold}/{quiz.mcqTotal}
        </Badge>
      </Card>

      <div className="space-y-4">
        {quiz.questions.map((q, index) => (
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
            <Card className="p-4">
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
                  {q.type === 'mcq' ? (
                    <span className="text-xs bg-primary/10 text-primary rounded px-1.5 py-0.5 flex-shrink-0">MCQ</span>
                  ) : (
                    <span className="text-xs bg-muted text-muted-foreground rounded px-1.5 py-0.5 flex-shrink-0">Short Answer</span>
                  )}
                </div>

                {q.type === 'mcq' && q.options && (
                  <div className="space-y-2 mt-3">
                    {q.options.map((opt) => (
                      <div
                        key={opt.value}
                        className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm ${
                          opt.value === q.correctAnswer
                            ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/20'
                            : 'border-border bg-card'
                        }`}
                      >
                        <span className="font-medium mr-2">{opt.value}.</span>
                        {opt.label}
                        {opt.value === q.correctAnswer && (
                          <span className="ml-2 text-green-600 dark:text-green-400 text-xs font-medium">✓ Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {q.type === 'short_answer' && (
                  <div className="mt-3 bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground italic">
                    Short answer — educator will type their response here.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
