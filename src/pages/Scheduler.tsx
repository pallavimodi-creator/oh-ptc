import { useState, useMemo, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  format,
  parse,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  differenceInDays,
  getDay,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  AlertTriangle,
  CheckCircle2,
  Save,
  Search,
  Trash2,
} from 'lucide-react';
import {
  ALL_SESSIONS,
  AVAILABLE_MONTHS,
  SessionType,
  SESSION_TYPES,
  CENTRES_TIMINGS,
} from '@/data/sessions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ScheduledSlot {
  date: string;
  sessionName: string | null;
  type: SessionType | null;
  excludedCentres: string[];
}

interface CatalogueEntry {
  name: string;
  type: SessionType;
}

const STORAGE_PREFIX = 'scheduler:draft:';

// Weekday anchor: Mon=Art, Tue=Sensory, Wed=Music, Thu=Movement, Sat=Special
const WEEKDAY_ANCHOR: Record<number, SessionType | null> = {
  0: null,
  1: 'art',
  2: 'sensory',
  3: 'music',
  4: 'movement',
  5: null,
  6: 'special',
};

const TYPE_TARGETS_PROGRAMME: Record<SessionType, number> = {
  art: 10,
  sensory: 10,
  music: 10,
  movement: 10,
  special: 0,
};

const CENTRES = CENTRES_TIMINGS.map((c) => c.name);

function buildCatalogue(): CatalogueEntry[] {
  const seen = new Map<string, SessionType>();
  Object.values(ALL_SESSIONS)
    .flat()
    .forEach((s) => {
      if (!seen.has(s.name)) seen.set(s.name, s.type);
    });
  return Array.from(seen.entries())
    .map(([name, type]) => ({ name, type }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function parseMonth(month: string): Date {
  return parse(month, 'MMMM yyyy', new Date());
}

function iso(d: Date) {
  return format(d, 'yyyy-MM-dd');
}

function buildInitialDraft(month: string): ScheduledSlot[] {
  const md = parseMonth(month);
  const days = eachDayOfInterval({ start: startOfMonth(md), end: endOfMonth(md) });

  // localStorage override wins
  const stored = localStorage.getItem(STORAGE_PREFIX + month);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as ScheduledSlot[];
      if (Array.isArray(parsed)) {
        const byDate = new Map(parsed.map((s) => [s.date, s]));
        return days.map((d) => {
          const k = iso(d);
          return (
            byDate.get(k) ?? {
              date: k,
              sessionName: null,
              type: null,
              excludedCentres: [],
            }
          );
        });
      }
    } catch {
      // ignore
    }
  }

  // Seed from existing published sessions
  const existing = ALL_SESSIONS[month] || [];
  const byDate = new Map(existing.map((s) => [s.date, s]));
  return days.map((d) => {
    const k = iso(d);
    const s = byDate.get(k);
    return {
      date: k,
      sessionName: s?.name ?? null,
      type: s?.type ?? null,
      excludedCentres: s?.excludedCentres ?? [],
    };
  });
}

interface Issue {
  level: 'warn' | 'ok';
  message: string;
}

function validate(draft: ScheduledSlot[]): Issue[] {
  const issues: Issue[] = [];
  const filled = draft.filter((s) => s.sessionName);

  // 1. Repetition gap — < 7 days is too tight
  const occByName = new Map<string, string[]>();
  filled.forEach((s) => {
    const arr = occByName.get(s.sessionName!) ?? [];
    arr.push(s.date);
    occByName.set(s.sessionName!, arr);
  });
  for (const [name, dates] of occByName) {
    dates.sort();
    for (let i = 1; i < dates.length; i++) {
      const gap = differenceInDays(parseISO(dates[i]), parseISO(dates[i - 1]));
      if (gap < 7) {
        issues.push({
          level: 'warn',
          message: `"${name}" repeats with only ${gap}-day gap (${format(parseISO(dates[i - 1]), 'd MMM')} → ${format(parseISO(dates[i]), 'd MMM')}). Aim for 7+.`,
        });
      }
    }
  }

  // 2. Weekday anchor mismatch (skips special which is treated as flexible)
  filled.forEach((s) => {
    if (!s.type || s.type === 'special') return;
    const dow = getDay(parseISO(s.date));
    const anchor = WEEKDAY_ANCHOR[dow];
    if (anchor && anchor !== 'special' && s.type !== anchor) {
      issues.push({
        level: 'warn',
        message: `${format(parseISO(s.date), 'EEE d MMM')}: ${s.sessionName} (${SESSION_TYPES[s.type].label}) on a ${SESSION_TYPES[anchor].label} day.`,
      });
    }
  });

  // 3. Saturday with no Special
  const saturdays = filled.filter((s) => getDay(parseISO(s.date)) === 6);
  saturdays.forEach((s) => {
    if (s.type !== 'special') {
      issues.push({
        level: 'warn',
        message: `${format(parseISO(s.date), 'd MMM')} (Sat): ${s.sessionName} — consider a Special playdate on Saturdays.`,
      });
    }
  });

  return issues;
}

function typeCounts(draft: ScheduledSlot[]) {
  // Unique sessions per type for the month (not occurrences)
  const uniqueByType: Record<SessionType, Set<string>> = {
    art: new Set(),
    sensory: new Set(),
    music: new Set(),
    movement: new Set(),
    special: new Set(),
  };
  draft.forEach((s) => {
    if (s.sessionName && s.type) uniqueByType[s.type].add(s.sessionName);
  });
  return uniqueByType;
}

function getDefaultMonth(): string {
  const today = new Date();
  const todayLabel = format(today, 'MMMM yyyy');
  if (AVAILABLE_MONTHS.includes(todayLabel)) return todayLabel;
  const future = AVAILABLE_MONTHS.find(
    (m) => parse(m, 'MMMM yyyy', new Date()) >= today
  );
  if (future) return future;
  return AVAILABLE_MONTHS[AVAILABLE_MONTHS.length - 1] ?? 'June 2026';
}

export default function Scheduler() {
  const { toast } = useToast();
  const { isScheduler, loading: authLoading } = useAuth();
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('scheduler:currentMonth');
      if (stored && AVAILABLE_MONTHS.includes(stored)) return stored;
    }
    return getDefaultMonth();
  });

  useEffect(() => {
    localStorage.setItem('scheduler:currentMonth', currentMonth);
  }, [currentMonth]);
  const [draft, setDraft] = useState<ScheduledSlot[]>(() =>
    buildInitialDraft(currentMonth)
  );
  const [pickerDate, setPickerDate] = useState<string | null>(null);
  const [exclusionDate, setExclusionDate] = useState<string | null>(null);

  const catalogue = useMemo(buildCatalogue, []);
  const issues = useMemo(() => validate(draft), [draft]);
  const counts = useMemo(() => typeCounts(draft), [draft]);

  useEffect(() => {
    setDraft(buildInitialDraft(currentMonth));
  }, [currentMonth]);

  const goPrevMonth = () => {
    const idx = AVAILABLE_MONTHS.indexOf(currentMonth);
    if (idx > 0) setCurrentMonth(AVAILABLE_MONTHS[idx - 1]);
  };
  const goNextMonth = () => {
    const idx = AVAILABLE_MONTHS.indexOf(currentMonth);
    if (idx >= 0 && idx < AVAILABLE_MONTHS.length - 1) {
      setCurrentMonth(AVAILABLE_MONTHS[idx + 1]);
    } else {
      // Extend forward by 1 month — lets scheduler plan ahead
      const next = format(addMonths(parseMonth(currentMonth), 1), 'MMMM yyyy');
      setCurrentMonth(next);
    }
  };

  const assign = (date: string, entry: CatalogueEntry | null) => {
    setDraft((prev) =>
      prev.map((s) =>
        s.date === date
          ? {
              ...s,
              sessionName: entry?.name ?? null,
              type: entry?.type ?? null,
            }
          : s
      )
    );
    setPickerDate(null);
  };

  const toggleExclusion = (date: string, centre: string) => {
    setDraft((prev) =>
      prev.map((s) => {
        if (s.date !== date) return s;
        const present = s.excludedCentres.includes(centre);
        return {
          ...s,
          excludedCentres: present
            ? s.excludedCentres.filter((c) => c !== centre)
            : [...s.excludedCentres, centre],
        };
      })
    );
  };

  const saveDraft = () => {
    localStorage.setItem(STORAGE_PREFIX + currentMonth, JSON.stringify(draft));
    toast({
      title: 'Schedule saved',
      description: `${currentMonth} draft saved locally.`,
    });
  };

  // Route guard — teachers (role 'centre') cannot reach this page even via
  // direct URL. AppLayout already handles unauthenticated; this layer keeps
  // out authenticated non-schedulers.
  if (!authLoading && !isScheduler) {
    return <Navigate to="/calendar" replace />;
  }

  const clearMonth = () => {
    if (!confirm(`Clear all sessions for ${currentMonth}?`)) return;
    setDraft((prev) =>
      prev.map((s) => ({ ...s, sessionName: null, type: null, excludedCentres: [] }))
    );
  };

  const warnCount = issues.filter((i) => i.level === 'warn').length;

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto max-w-content px-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-[11px] font-bold text-ink-muted">
                scheduler
              </p>
              <h1 className="mt-0.5 text-[26px] font-extrabold leading-[1.05] text-ink">
                {currentMonth.toLowerCase()}
              </h1>
              <div className="-ml-1 mt-2 flex items-center gap-1">
                <button
                  type="button"
                  aria-label="previous month"
                  className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-bg-subtle hover:text-ink disabled:opacity-30"
                  disabled={AVAILABLE_MONTHS.indexOf(currentMonth) <= 0}
                  onClick={goPrevMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="next month"
                  className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-bg-subtle hover:text-ink"
                  onClick={goNextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button
              onClick={saveDraft}
              className="flex h-9 items-center gap-1.5 rounded-card bg-brand-orange px-3 text-[12px] font-extrabold lowercase text-white transition hover:opacity-95 active:scale-[0.99]"
            >
              <Save className="h-3.5 w-3.5" />
              save draft
            </button>
          </div>

          {/* Balance row */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(['art', 'sensory', 'music', 'movement'] as SessionType[]).map((t) => {
              const used = counts[t].size;
              const target = TYPE_TARGETS_PROGRAMME[t];
              return (
                <div
                  key={t}
                  className="rounded-card border border-ink/10 bg-brand-white px-2.5 py-1.5"
                >
                  <div className="text-[10px] font-bold text-ink-muted">
                    {SESSION_TYPES[t].label.split(' ')[0].toLowerCase()}
                  </div>
                  <div className="mt-0.5 text-[16px] font-extrabold leading-none text-ink">
                    {used}
                    <span className="text-[12px] font-bold text-ink-subtle">
                      /{target}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary line */}
          <div className="mt-2.5 flex items-center gap-2 text-[12px]">
            {warnCount === 0 ? (
              <span className="inline-flex items-center gap-1 text-[hsl(var(--success))]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                all principles on track
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[hsl(var(--warning))]">
                <AlertTriangle className="h-3.5 w-3.5" />
                {warnCount} advisory {warnCount === 1 ? 'note' : 'notes'}
              </span>
            )}
            <span className="text-ink-muted">
              · {draft.filter((s) => s.sessionName).length} dates filled
            </span>
            <button
              onClick={clearMonth}
              className="ml-auto text-ink-muted hover:text-destructive"
              aria-label="clear month"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Date list */}
      <main className="mx-auto max-w-content px-4 py-4">
        <ul className="space-y-2">
          {draft.map((slot) => {
            const parsed = parseISO(slot.date);
            const dow = getDay(parsed);
            const anchor = WEEKDAY_ANCHOR[dow];
            const offDay = anchor === null;
            const mismatch =
              slot.type &&
              slot.type !== 'special' &&
              anchor &&
              anchor !== 'special' &&
              slot.type !== anchor;
            return (
              <li
                key={slot.date}
                className={cn(
                  'rounded-card border border-ink/10 bg-brand-white p-3 transition-colors',
                  offDay && 'bg-bg-subtle/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 flex-shrink-0 text-center">
                    <div className="text-[10px] font-bold text-ink-muted">
                      {format(parsed, 'EEE').toLowerCase()}
                    </div>
                    <div className="text-[18px] font-extrabold leading-none text-ink">
                      {format(parsed, 'd')}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    {slot.sessionName ? (
                      <button
                        onClick={() => setPickerDate(slot.date)}
                        className={cn(
                          'w-full rounded-lg px-3 py-2 text-left text-[13px] font-extrabold shadow-card transition-colors',
                          slot.type && SESSION_TYPES[slot.type].color
                        )}
                      >
                        <div className="truncate">{slot.sessionName.toLowerCase()}</div>
                        <div className="text-[10px] font-bold opacity-75">
                          {slot.type && SESSION_TYPES[slot.type].label.toLowerCase()}
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => setPickerDate(slot.date)}
                        className="flex w-full items-center justify-between rounded-lg border border-dashed border-ink/15 bg-bg/60 px-3 py-2 text-left text-[12px] font-medium text-ink-muted transition-colors hover:border-brand-orange hover:text-ink"
                      >
                        <span>
                          {offDay
                            ? 'add session (off-day)'
                            : `add ${anchor ? SESSION_TYPES[anchor].label.toLowerCase() : 'session'}`}
                        </span>
                        <Plus className="h-4 w-4" />
                      </button>
                    )}

                    {slot.sessionName && (
                      <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                        {mismatch && (
                          <span className="inline-flex items-center gap-1 text-[hsl(var(--warning))]">
                            <AlertTriangle className="h-3 w-3" />
                            anchor mismatch
                          </span>
                        )}
                        <button
                          onClick={() => setExclusionDate(slot.date)}
                          className="text-ink-muted underline-offset-2 hover:text-ink hover:underline"
                        >
                          {slot.excludedCentres.length === 0
                            ? 'all centres'
                            : `${slot.excludedCentres.length} centre${slot.excludedCentres.length === 1 ? '' : 's'} excluded`}
                        </button>
                        <button
                          onClick={() => assign(slot.date, null)}
                          aria-label="remove session"
                          className="ml-auto text-ink-muted hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Principles checker */}
        <section className="mt-6 rounded-card border border-ink/10 bg-brand-white p-4 shadow-card">
          <h2 className="text-[11px] font-bold text-ink-muted">
            principles · advisory
          </h2>
          {issues.length === 0 ? (
            <p className="mt-2 inline-flex items-center gap-2 text-[13px] text-[hsl(var(--success))]">
              <CheckCircle2 className="h-4 w-4" />
              no issues detected.
            </p>
          ) : (
            <ul className="mt-2.5 space-y-2">
              {issues.map((iss, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[13px] text-ink"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--warning))]" />
                  <span className="leading-relaxed">{iss.message}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
            notes are advisory — you can still save. anchors: mon · art, tue ·
            sensory, wed · music, thu · movement, sat · special.
          </p>
        </section>
      </main>

      {/* Picker dialog */}
      <SessionPicker
        open={pickerDate !== null}
        onOpenChange={(o) => !o && setPickerDate(null)}
        date={pickerDate}
        catalogue={catalogue}
        onSelect={(entry) => pickerDate && assign(pickerDate, entry)}
      />

      {/* Centre exclusion dialog */}
      <ExclusionDialog
        open={exclusionDate !== null}
        onOpenChange={(o) => !o && setExclusionDate(null)}
        date={exclusionDate}
        currentExclusions={
          exclusionDate
            ? draft.find((s) => s.date === exclusionDate)?.excludedCentres ?? []
            : []
        }
        onToggle={(centre) => exclusionDate && toggleExclusion(exclusionDate, centre)}
      />
    </div>
  );
}

/* ---------- Sub-components ---------- */

interface SessionPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string | null;
  catalogue: CatalogueEntry[];
  onSelect: (entry: CatalogueEntry) => void;
}

function SessionPicker({
  open,
  onOpenChange,
  date,
  catalogue,
  onSelect,
}: SessionPickerProps) {
  const [filter, setFilter] = useState<SessionType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [customName, setCustomName] = useState('');
  const [customType, setCustomType] = useState<SessionType>('art');

  useEffect(() => {
    if (open && date) {
      // Default filter to anchor type for the date
      const anchor = WEEKDAY_ANCHOR[getDay(parseISO(date))];
      setFilter(anchor ?? 'all');
      setSearch('');
      setCustomName('');
    }
  }, [open, date]);

  const filtered = catalogue.filter((e) => {
    if (filter !== 'all' && e.type !== filter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const dateLabel = date ? format(parseISO(date), 'EEE, d MMM') : '';
  const anchor = date ? WEEKDAY_ANCHOR[getDay(parseISO(date))] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base">
            Add session — {dateLabel}
          </DialogTitle>
          {anchor && (
            <p className="text-xs text-muted-foreground">
              Suggested type:{' '}
              <span className="font-medium text-foreground">
                {SESSION_TYPES[anchor].label}
              </span>
            </p>
          )}
        </DialogHeader>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
              filter === 'all'
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            )}
          >
            All
          </button>
          {(['art', 'sensory', 'music', 'movement', 'special'] as SessionType[]).map(
            (t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition-all',
                  filter === t
                    ? cn(SESSION_TYPES[t].color, 'ring-1 ring-black/5')
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                )}
              >
                {SESSION_TYPES[t].label.split(' ')[0]}
              </button>
            )
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search catalogue…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl pl-9"
          />
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto pr-1">
          <ul className="space-y-1.5">
            {filtered.length === 0 ? (
              <li className="rounded-lg border border-dashed border-border/70 py-6 text-center text-xs text-muted-foreground">
                No matching sessions.
              </li>
            ) : (
              filtered.map((entry) => (
                <li key={entry.name}>
                  <button
                    onClick={() => onSelect(entry)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-border/70 px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
                  >
                    <span className="text-sm font-medium">{entry.name}</span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-black/5',
                        SESSION_TYPES[entry.type].color
                      )}
                    >
                      {SESSION_TYPES[entry.type].label.split(' ')[0]}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Custom session entry */}
        <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
          <Label className="text-[11px] font-semibold text-muted-foreground">
            Or add a custom session
          </Label>
          <div className="mt-2 flex gap-2">
            <Input
              placeholder="Session name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="h-9 flex-1 rounded-lg"
            />
            <select
              value={customType}
              onChange={(e) => setCustomType(e.target.value as SessionType)}
              className="h-9 rounded-lg border border-input bg-background px-2 text-xs"
            >
              {(['art', 'sensory', 'music', 'movement', 'special'] as SessionType[]).map(
                (t) => (
                  <option key={t} value={t}>
                    {SESSION_TYPES[t].label.split(' ')[0]}
                  </option>
                )
              )}
            </select>
            <Button
              size="sm"
              disabled={!customName.trim()}
              onClick={() =>
                onSelect({ name: customName.trim(), type: customType })
              }
              className="h-9 rounded-lg px-3 text-xs"
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ExclusionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string | null;
  currentExclusions: string[];
  onToggle: (centre: string) => void;
}

function ExclusionDialog({
  open,
  onOpenChange,
  date,
  currentExclusions,
  onToggle,
}: ExclusionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base">
            Exclude centres
            {date && (
              <span className="ml-2 text-xs font-medium text-muted-foreground">
                · {format(parseISO(date), 'EEE, d MMM')}
              </span>
            )}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Tap a centre to skip this session there.
          </p>
        </DialogHeader>
        <div className="flex flex-wrap gap-1.5">
          {CENTRES.map((c) => {
            const excluded = currentExclusions.includes(c);
            return (
              <button
                key={c}
                onClick={() => onToggle(c)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  excluded
                    ? 'border-destructive/30 bg-destructive/10 text-destructive line-through'
                    : 'border-border bg-background hover:bg-muted'
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
