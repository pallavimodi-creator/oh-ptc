import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parse, parseISO } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  ImageIcon,
  Settings2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  ALL_SESSIONS,
  AVAILABLE_MONTHS,
  SessionType,
} from '@/data/sessions';
import { SessionTypeFilter } from '@/components/SessionTypeFilter';
import { SessionChip } from '@/components/SessionChip';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const SESSION_TYPE_IMAGES: SessionType[] = ['art', 'music', 'movement', 'sensory'];

// Pick today's month if it's in AVAILABLE_MONTHS; otherwise the next future
// month; otherwise the last (most recent) one. Means a teacher opening the
// app in May lands on May, not February.
function getDefaultMonth(): string {
  const today = new Date();
  const todayLabel = format(today, 'MMMM yyyy');
  if (AVAILABLE_MONTHS.includes(todayLabel)) return todayLabel;
  const future = AVAILABLE_MONTHS.find(
    (m) => parse(m, 'MMMM yyyy', new Date()) >= today
  );
  if (future) return future;
  return AVAILABLE_MONTHS[AVAILABLE_MONTHS.length - 1] ?? 'February 2026';
}

// Cached image-URL lookup so we render instantly on repeat visits.
function readCachedImages(): { types: Record<string, string>; hero: string | null } {
  if (typeof window === 'undefined') return { types: {}, hero: null };
  try {
    const raw = localStorage.getItem('calendar:imageCache');
    if (!raw) return { types: {}, hero: null };
    const parsed = JSON.parse(raw);
    return {
      types: parsed.types ?? {},
      hero: parsed.hero ?? null,
    };
  } catch {
    return { types: {}, hero: null };
  }
}

export default function Calendar() {
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();
  const [activeFilters, setActiveFilters] = useState<SessionType[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('calendar:currentMonth');
      if (
        stored &&
        AVAILABLE_MONTHS.some(
          (m) => m.trim().toLowerCase() === stored.trim().toLowerCase()
        )
      ) {
        return stored;
      }
    }
    return getDefaultMonth();
  });

  useEffect(() => {
    localStorage.setItem('calendar:currentMonth', currentMonth);
  }, [currentMonth]);

  const initialImages = readCachedImages();
  const [typeImages, setTypeImages] = useState<Record<string, string>>(initialImages.types);
  const [loginHeroImage, setLoginHeroImage] = useState<string | null>(initialImages.hero);
  const [uploading, setUploading] = useState<string | null>(null);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  // Resolve URLs synchronously — getPublicUrl makes no network request.
  // We let the browser try to load them; broken ones are cleared via the
  // <img onError> handler below. No more sequential HEAD requests.
  useEffect(() => {
    const images: Record<string, string> = {};
    for (const type of SESSION_TYPE_IMAGES) {
      const { data } = supabase.storage
        .from('calendar-images')
        .getPublicUrl(`${type}.png`);
      images[type] = data.publicUrl;
    }
    setTypeImages(images);

    const { data: heroData } = supabase.storage
      .from('calendar-images')
      .getPublicUrl('login-hero.png');
    setLoginHeroImage(heroData.publicUrl);
  }, []);

  // Persist whatever's currently known-good so a re-mount paints instantly.
  useEffect(() => {
    localStorage.setItem(
      'calendar:imageCache',
      JSON.stringify({ types: typeImages, hero: loginHeroImage })
    );
  }, [typeImages, loginHeroImage]);

  const handleTypeImageError = (type: SessionType) => {
    setTypeImages((prev) => {
      if (!(type in prev)) return prev;
      const next = { ...prev };
      delete next[type];
      return next;
    });
  };

  const handleHeroError = () => setLoginHeroImage(null);

  const handleLoginHeroUpload = async (file: File) => {
    setUploading('login-hero');

    const { error } = await supabase.storage
      .from('calendar-images')
      .upload('login-hero.png', file, { upsert: true });

    if (!error) {
      const { data } = supabase.storage
        .from('calendar-images')
        .getPublicUrl('login-hero.png');

      // Single cache-bust on upload, so the admin sees their new image,
      // but normal page loads use the cached URL.
      setLoginHeroImage(`${data.publicUrl}?v=${Date.now()}`);
    }

    setUploading(null);
  };

  const handleImageUpload = async (type: SessionType, file: File) => {
    setUploading(type);

    const { error } = await supabase.storage
      .from('calendar-images')
      .upload(`${type}.png`, file, { upsert: true });

    if (!error) {
      const { data } = supabase.storage
        .from('calendar-images')
        .getPublicUrl(`${type}.png`);

      setTypeImages((prev) => ({
        ...prev,
        [type]: `${data.publicUrl}?v=${Date.now()}`,
      }));
    }

    setUploading(null);
  };

  const toggleFilter = (type: SessionType) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const currentSessions = ALL_SESSIONS[currentMonth] || [];

  const filteredSessions = useMemo(() => {
    let sessions = currentSessions;

    if (activeFilters.length > 0) {
      sessions = sessions.filter((s) => activeFilters.includes(s.type));
    }

    if (profile?.centreName) {
      sessions = sessions.filter(
        (s) => !s.excludedCentres?.includes(profile.centreName!)
      );
    }

    return sessions;
  }, [activeFilters, profile?.centreName, currentSessions]);

  const groupedSessions = useMemo(() => {
    const groups: Record<string, typeof filteredSessions> = {};
    filteredSessions.forEach((session) => {
      if (!groups[session.date]) {
        groups[session.date] = [];
      }
      groups[session.date].push(session);
    });
    return groups;
  }, [filteredSessions]);

  const sortedDates = Object.keys(groupedSessions).sort();

  const noSessionDates = useMemo(() => {
    if (!profile?.centreName) return [];

    const excludedDates: string[] = [];
    currentSessions.forEach((session) => {
      if (session.excludedCentres?.includes(profile.centreName!)) {
        excludedDates.push(session.date);
      }
    });
    return excludedDates;
  }, [profile?.centreName, currentSessions]);

  const activeImage = useMemo(() => {
    if (activeFilters.length === 1) {
      return typeImages[activeFilters[0]];
    }
    return null;
  }, [activeFilters, typeImages]);

  const getMonthIndex = (month: string) =>
    AVAILABLE_MONTHS.findIndex(
      (m) => m.trim().toLowerCase() === month.trim().toLowerCase()
    );

  const currentMonthIndex = getMonthIndex(currentMonth);
  const canGoPrev = currentMonthIndex > 0;
  const canGoNext =
    currentMonthIndex >= 0
      ? currentMonthIndex < AVAILABLE_MONTHS.length - 1
      : AVAILABLE_MONTHS.length > 1;

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => {
      const idx = getMonthIndex(prev);
      if (idx <= 0) return AVAILABLE_MONTHS[0] ?? prev;
      return AVAILABLE_MONTHS[idx - 1] ?? prev;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const idx = getMonthIndex(prev);
      if (idx < 0) return AVAILABLE_MONTHS[1] ?? AVAILABLE_MONTHS[0] ?? prev;
      if (idx >= AVAILABLE_MONTHS.length - 1) return prev;
      return AVAILABLE_MONTHS[idx + 1] ?? prev;
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto max-w-content px-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-ink-muted">
                sessions
              </p>
              <h1 className="mt-0.5 text-[26px] font-extrabold leading-[1.05] text-ink">
                {currentMonth.toLowerCase()}
              </h1>

              {/* Month selector */}
              <div className="-ml-1 mt-2 flex items-center gap-1">
                <button
                  type="button"
                  aria-label="previous month"
                  className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-bg-subtle hover:text-ink disabled:opacity-30"
                  disabled={!canGoPrev}
                  onClick={goToPrevMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="next month"
                  className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-bg-subtle hover:text-ink disabled:opacity-30"
                  disabled={!canGoNext}
                  onClick={goToNextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Floating session-type thumbnail when a single filter is active */}
            {activeImage && activeFilters.length === 1 && (
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-card border border-ink/10 shadow-card">
                <img
                  src={activeImage}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  onError={() => handleTypeImageError(activeFilters[0])}
                />
              </div>
            )}
          </div>

          {/* Filter chips */}
          <div className="mt-3">
            <SessionTypeFilter
              activeFilters={activeFilters}
              onToggle={toggleFilter}
            />
          </div>
        </div>
      </header>

      {/* Admin Image Upload — collapsible */}
      {isAdmin && (
        <div className="border-b border-ink/10 bg-bg-subtle/60">
          <button
            type="button"
            onClick={() => setAdminPanelOpen((v) => !v)}
            className="mx-auto flex w-full max-w-content items-center justify-between px-4 py-3 text-left"
          >
            <span className="flex items-center gap-2 text-[11px] font-bold text-ink-muted">
              <Settings2 className="h-3.5 w-3.5" />
              admin · manage images
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-ink-muted transition-transform',
                adminPanelOpen && 'rotate-180'
              )}
            />
          </button>

          {adminPanelOpen && (
            <div className="mx-auto max-w-content px-4 pb-4">
              {/* Login Hero Image */}
              <div className="mb-4">
                <p className="mb-2 text-[11px] font-bold text-ink-muted">
                  login page hero
                </p>
                <label
                  className={cn(
                    'relative block w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all',
                    loginHeroImage
                      ? 'border-primary/30'
                      : 'aspect-video border-border bg-background hover:border-primary/50'
                  )}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLoginHeroUpload(file);
                    }}
                    disabled={uploading === 'login-hero'}
                  />

                  {uploading === 'login-hero' ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : loginHeroImage ? (
                    <img
                      src={loginHeroImage}
                      alt="Login hero"
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full"
                      onError={handleHeroError}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-7 w-7 text-muted-foreground" />
                    </div>
                  )}
                </label>
              </div>

              {/* Session Type Images */}
              <p className="mb-2 text-[11px] font-bold text-ink-muted">
                session types
              </p>
              <div className="grid grid-cols-4 gap-3">
                {SESSION_TYPE_IMAGES.map((type) => (
                  <label
                    key={type}
                    className={cn(
                      'relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all',
                      typeImages[type]
                        ? 'border-primary/30'
                        : 'border-border bg-background hover:border-primary/50'
                    )}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(type, file);
                      }}
                      disabled={uploading === type}
                    />

                    {uploading === type ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    ) : typeImages[type] ? (
                      <img
                        src={typeImages[type]}
                        alt={type}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        onError={() => handleTypeImageError(type)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Agenda list */}
      <main className="mx-auto max-w-content space-y-5 px-4 py-5">
        {sortedDates.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink/15 bg-bg-subtle/60 py-14 text-center">
            <p className="text-[13px] text-ink-muted">
              no sessions match the selected filters.
            </p>
          </div>
        ) : (
          sortedDates.map((date) => {
            const parsed = parseISO(date);
            return (
              <div key={date} className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-[11px] font-bold text-ink-muted">
                    {format(parsed, 'EEE')}
                  </h3>
                  <span className="text-[12px] font-medium text-ink-subtle">
                    · {format(parsed, 'd MMM')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {groupedSessions[date].map((session) => (
                    <SessionChip
                      key={session.id}
                      type={session.type}
                      name={session.name}
                      onClick={() => navigate(`/session/${session.id}`)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}

        {/* Show "No Session" for excluded dates */}
        {noSessionDates.length > 0 && activeFilters.length === 0 && (
          <div className="mt-6 border-t border-ink/10 pt-4">
            <h4 className="mb-2 text-[11px] font-bold text-ink-muted">
              no sessions scheduled
            </h4>
            <ul className="space-y-1">
              {noSessionDates.map((date) => (
                <li key={date} className="text-[13px] text-ink-muted">
                  {format(parseISO(date), 'EEE, d MMM')} — no session for{' '}
                  {profile?.centreName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
