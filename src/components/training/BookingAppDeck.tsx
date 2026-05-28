import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Smartphone } from 'lucide-react';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Import all slides
import slide01 from '@/assets/training/booking-app/slide-01.jpg';
import slide02 from '@/assets/training/booking-app/slide-02.jpg';
import slide03 from '@/assets/training/booking-app/slide-03.jpg';
import slide04 from '@/assets/training/booking-app/slide-04.jpg';

const SLIDES = [slide01, slide02, slide03, slide04];

const SLIDE_TITLES = [
  'Download the Openhouse App',
  'Navigate to Toddler Club',
  'Enter Child Details',
  'Select Session & Book',
];

interface BookingAppDeckProps {
  onBack?: () => void;
}

export default function BookingAppDeck({ onBack }: BookingAppDeckProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = SLIDES.length;

  const goToSlide = (index: number) => {
    const newSlide = Math.max(0, Math.min(index, totalSlides - 1));
    setCurrentSlide(newSlide);
  };

  const prevSlide = () => goToSlide(currentSlide - 1);
  const nextSlide = () => goToSlide(currentSlide + 1);

  const swipeHandlers = useSwipeGesture({ onSwipeLeft: nextSlide, onSwipeRight: prevSlide });

  const renderDeckContent = (compact = false) => (
    <div className={cn("flex flex-col", compact ? "gap-3" : "gap-4")}>
      <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden" {...swipeHandlers}>
        <img
          src={SLIDES[currentSlide]}
          alt={`Slide ${currentSlide + 1}: ${SLIDE_TITLES[currentSlide]}`}
          className="w-full h-full object-contain rotate-180"
        />
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {currentSlide + 1} / {totalSlides}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentSlide === 0} className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextSlide} disabled={currentSlide === totalSlides - 1} className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        {!isFullscreen && (
          <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(true)} className="h-8 w-8">
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <p className="text-sm font-medium text-center text-muted-foreground">
        {SLIDE_TITLES[currentSlide]}
      </p>

      <div className="flex gap-1 overflow-x-auto pb-2 -mx-2 px-2 justify-center">
        {SLIDES.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "flex-shrink-0 w-12 h-10 rounded overflow-hidden border-2 transition-all",
              index === currentSlide
                ? "border-primary ring-2 ring-primary/30"
                : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <img src={slide} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {onBack && (
        <button onClick={onBack} className="text-sm text-primary hover:underline mb-4">
          ← Back to modules
        </button>
      )}

      <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Booking a Session on the App</h3>
            <p className="text-xs text-muted-foreground">Step-by-step guide</p>
          </div>
        </div>

        {renderDeckContent(true)}
      </Card>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-4xl w-[95vw] p-6">
          {renderDeckContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
