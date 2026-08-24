import { SessionType, SESSION_TYPES } from '@/data/sessions';
import { cn } from '@/lib/utils';

interface SessionChipProps {
  type: SessionType;
  name: string;
  big?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SessionChip({ type, name, big, onClick, className }: SessionChipProps) {
  const { color } = SESSION_TYPES[type];

  return (
    <button
      onClick={onClick}
      title={big ? 'big playdate — extra participation expected' : undefined}
      className={cn(
        'rounded-card px-3.5 py-2 text-[13px] font-extrabold leading-tight shadow-card transition-all',
        'hover:-translate-y-0.5 hover:shadow-float active:translate-y-0 active:scale-95',
        big && 'ring-2 ring-brand-orange ring-offset-1',
        color,
        className
      )}
    >
      {name}
      {big && <sup className="ml-0.5 text-brand-orange">*</sup>}
    </button>
  );
}
