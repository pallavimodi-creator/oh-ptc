import { SessionType, SESSION_TYPES } from '@/data/sessions';
import { cn } from '@/lib/utils';

interface SessionChipProps {
  type: SessionType;
  name: string;
  onClick?: () => void;
  className?: string;
}

export function SessionChip({ type, name, onClick, className }: SessionChipProps) {
  const { color } = SESSION_TYPES[type];

  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-card px-3.5 py-2 text-[13px] font-extrabold leading-tight shadow-card transition-all',
        'hover:-translate-y-0.5 hover:shadow-float active:translate-y-0 active:scale-95',
        color,
        className
      )}
    >
      {name}
    </button>
  );
}
