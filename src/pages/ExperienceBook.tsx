import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, BookOpen } from 'lucide-react';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { cn } from '@/lib/utils';

// The current Parent-Toddler Club experience book, rendered to web-sized page
// images in public/experience-book/ (page-01.jpg … page-38.jpg) with a compact
// downloadable PDF alongside. Regenerate these from the latest book PDF.
const TOTAL_PAGES = 38;
const PAGES = Array.from(
  { length: TOTAL_PAGES },
  (_, i) => `/experience-book/page-${String(i + 1).padStart(2, '0')}.jpg`
);
const PDF_URL = '/experience-book/ptc-experience-book.pdf';

export default function ExperienceBook() {
  const [page, setPage] = useState(0);

  const go = (next: number) => setPage((p) => Math.max(0, Math.min(next, TOTAL_PAGES - 1)));
  const prev = () => go(page - 1);
  const next = () => go(page + 1);
  const swipe = useSwipeGesture({ onSwipeLeft: next, onSwipeRight: prev });

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-content items-center gap-3 px-4 py-3.5">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
            <BookOpen className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[18px] font-extrabold leading-tight text-ink">experience book</h1>
            <p className="text-[12px] text-ink-muted">parent–toddler club · ages 1–3</p>
          </div>
          <a
            href={PDF_URL}
            download
            className="flex items-center gap-1.5 rounded-chip bg-brand-orange px-3 py-2 text-[12px] font-bold text-white transition-colors hover:bg-brand-orange/90"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">download pdf</span>
            <span className="sm:hidden">pdf</span>
          </a>
        </div>
      </header>

      {/* Reader */}
      <main className="mx-auto max-w-content px-4 py-5">
        <div className="relative mx-auto max-w-[480px]" {...swipe}>
          <img
            key={page}
            src={PAGES[page]}
            alt={`experience book page ${page + 1}`}
            loading="eager"
            decoding="async"
            className="w-full rounded-xl border border-ink/10 shadow-card"
          />

          {/* Prev / next overlay buttons */}
          <button
            onClick={prev}
            disabled={page === 0}
            aria-label="previous page"
            className={cn(
              'absolute left-1 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-white/90 text-ink shadow-card transition',
              page === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-brand-white'
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            disabled={page === TOTAL_PAGES - 1}
            aria-label="next page"
            className={cn(
              'absolute right-1 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-white/90 text-ink shadow-card transition',
              page === TOTAL_PAGES - 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-brand-white'
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Page counter */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            disabled={page === 0}
            className="rounded-chip bg-bg-subtle px-3 py-1.5 text-[13px] font-bold text-ink-muted transition hover:text-ink disabled:opacity-40"
          >
            prev
          </button>
          <span className="text-[13px] font-bold tabular-nums text-ink">
            {page + 1} / {TOTAL_PAGES}
          </span>
          <button
            onClick={next}
            disabled={page === TOTAL_PAGES - 1}
            className="rounded-chip bg-bg-subtle px-3 py-1.5 text-[13px] font-bold text-ink-muted transition hover:text-ink disabled:opacity-40"
          >
            next
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {PAGES.map((src, i) => (
            <button
              key={src}
              onClick={() => go(i)}
              aria-label={`go to page ${i + 1}`}
              className={cn(
                'flex-shrink-0 overflow-hidden rounded-md border-2 transition',
                i === page ? 'border-brand-orange' : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <img src={src} alt="" loading="lazy" decoding="async" className="h-16 w-auto" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
