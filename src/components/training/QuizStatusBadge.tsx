import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, AlertCircle, Lock, Send, MinusCircle } from 'lucide-react';
import type { QuizOverallStatus } from '@/hooks/useQuizAttempt';

const STATUS_CONFIG: Record<
  QuizOverallStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  identify: {
    label: 'Not Attempted',
    icon: MinusCircle,
    className: 'bg-muted text-muted-foreground',
  },
  not_started: {
    label: 'Not Attempted',
    icon: MinusCircle,
    className: 'bg-muted text-muted-foreground',
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  submitted: {
    label: 'Pending Admin Review',
    icon: Send,
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  needs_rework: {
    label: 'Needs Rework',
    icon: AlertCircle,
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  locked: {
    label: 'Locked — Admin unlock required',
    icon: Lock,
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  approved: {
    label: 'Cleared',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
};

interface QuizStatusBadgeProps {
  status: QuizOverallStatus;
  className?: string;
}

export default function QuizStatusBadge({ status, className }: QuizStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={cn('text-xs gap-1', config.className, className)}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}
