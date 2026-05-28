import { SessionType, SESSION_TYPES } from '@/data/sessions';
import { cn } from '@/lib/utils';

interface SessionTypeFilterProps {
  activeFilters: SessionType[];
  onToggle: (type: SessionType) => void;
}

export function SessionTypeFilter({
  activeFilters,
  onToggle,
}: SessionTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(Object.keys(SESSION_TYPES) as SessionType[]).map((type) => {
        const { label, color } = SESSION_TYPES[type];
        const isActive = activeFilters.includes(type);

        return (
          <button
            key={type}
            onClick={() => onToggle(type)}
            aria-pressed={isActive}
            className={cn(
              'rounded-chip px-3 py-1.5 text-[11px] font-extrabold leading-none transition-all',
              isActive
                ? cn(color, 'shadow-card')
                : 'bg-bg-subtle text-ink-muted hover:bg-bg-subtle/60 hover:text-ink'
            )}
          >
            {label.toLowerCase()}
          </button>
        );
      })}
    </div>
  );
}
