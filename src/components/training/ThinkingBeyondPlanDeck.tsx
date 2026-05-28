import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize2, Lightbulb } from 'lucide-react';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useDeckCalibration } from '@/hooks/useDeckCalibration';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DeckCalibrationOverlay from '@/components/training/DeckCalibrationOverlay';

import slide01 from '@/assets/training/thinking-beyond-plan/slide-01.jpg';
import slide02 from '@/assets/training/thinking-beyond-plan/slide-02.jpg';
import slide03 from '@/assets/training/thinking-beyond-plan/slide-03.jpg';
import slide04 from '@/assets/training/thinking-beyond-plan/slide-04.jpg';
import slide05 from '@/assets/training/thinking-beyond-plan/slide-05.jpg';
import slide06 from '@/assets/training/thinking-beyond-plan/slide-06.jpg';
import slide07 from '@/assets/training/thinking-beyond-plan/slide-07.jpg';
import slide08 from '@/assets/training/thinking-beyond-plan/slide-08.jpg';
import slide09 from '@/assets/training/thinking-beyond-plan/slide-09.jpg';
import slide10 from '@/assets/training/thinking-beyond-plan/slide-10.jpg';
import voiceoverAudio from '@/assets/training/thinking-beyond-plan-voiceover.mp3';

const SLIDES = [slide01, slide02, slide03, slide04, slide05, slide06, slide07, slide08, slide09, slide10];

const SLIDE_TITLES = [
  'Thinking Beyond the Plan', 'Two Essential Planning Elements', 'Narrative Building: Creating Flow',
  'Story Arcs and Movement', 'Guide Parents to Be Present', 'Model and Observe',
  'Reinforce Goals and Use Best Practices', 'Songs Over Instructions',
  'Set Up Environments with Clear Principles', 'Plan Read-Alouds Properly',
];

interface ThinkingBeyondPlanDeckProps { onBack?: () => void; }

export default function ThinkingBeyondPlanDeck({ onBack }: ThinkingBeyondPlanDeckProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const totalSlides = SLIDES.length;
  const calibration = useDeckCalibration('thinking-beyond-plan', totalSlides);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => {
      const duration = audio.duration;
      const currentTime = audio.currentTime;
      setProgress((currentTime / duration) * 100);
      setCurrentSlide(calibration.getSlideForTime(currentTime, duration, totalSlides));
    };
    const handleEnded = () => { setIsPlaying(false); setCurrentSlide(totalSlides - 1); };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    return () => { audio.removeEventListener('timeupdate', handleTimeUpdate); audio.removeEventListener('ended', handleEnded); };
  }, [totalSlides, calibration]);

  const togglePlay = () => { const a = audioRef.current; if (!a) return; if (isPlaying) a.pause(); else a.play(); setIsPlaying(!isPlaying); };
  const toggleMute = () => { const a = audioRef.current; if (!a) return; a.muted = !isMuted; setIsMuted(!isMuted); };

  const goToSlide = (index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newSlide = Math.max(0, Math.min(index, totalSlides - 1));
    setCurrentSlide(newSlide);
    const duration = audio.duration;
    if (duration) {
      audio.currentTime = calibration.timestamps.length >= totalSlides
        ? calibration.timestamps[newSlide]
        : (newSlide / totalSlides) * duration;
    }
  };

  const prevSlide = () => goToSlide(currentSlide - 1);
  const nextSlide = () => goToSlide(currentSlide + 1);
  const swipeHandlers = useSwipeGesture({ onSwipeLeft: nextSlide, onSwipeRight: prevSlide });

  const handleStartCalibration = useCallback(() => {
    const a = audioRef.current; if (!a) return;
    a.currentTime = 0; a.play(); setIsPlaying(true); calibration.startCalibration();
  }, [calibration]);

  const handleMarkSlide = useCallback(() => {
    const a = audioRef.current; if (!a) return;
    calibration.markSlide(a.currentTime);
  }, [calibration]);

  const renderDeckContent = (compact = false) => (
    <div className={cn("flex flex-col", compact ? "gap-3" : "gap-4")}>
      <div className="relative aspect-[16/9] bg-muted rounded-lg overflow-hidden" {...swipeHandlers}>
        <img src={SLIDES[currentSlide]} alt={`Slide ${currentSlide + 1}: ${SLIDE_TITLES[currentSlide]}`} className="w-full h-full object-contain rotate-180" />
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">{currentSlide + 1} / {totalSlides}</div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentSlide === 0} className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="default" size="icon" onClick={togglePlay} className="h-10 w-10">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}</Button>
          <Button variant="outline" size="icon" onClick={nextSlide} disabled={currentSlide === totalSlides - 1} className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">{isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}</Button>
          {!isFullscreen && <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(true)} className="h-8 w-8"><Maximize2 className="w-4 h-4" /></Button>}
        </div>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} /></div>
      <p className="text-sm font-medium text-center text-muted-foreground">{SLIDE_TITLES[currentSlide]}</p>
      <DeckCalibrationOverlay isCalibrating={calibration.isCalibrating} currentMark={calibration.isCalibrating ? calibration.timestamps.length : 0} totalSlides={totalSlides} hasCalibration={calibration.timestamps.length >= totalSlides} onStartCalibration={handleStartCalibration} onMarkSlide={handleMarkSlide} onCancel={calibration.cancelCalibration} onClear={calibration.clearCalibration} />
      <div className="flex gap-1 overflow-x-auto pb-2 -mx-2 px-2">
        {SLIDES.map((slide, index) => (
          <button key={index} onClick={() => goToSlide(index)} className={cn("flex-shrink-0 w-12 h-8 rounded overflow-hidden border-2 transition-all", index === currentSlide ? "border-primary ring-2 ring-primary/30" : "border-transparent opacity-60 hover:opacity-100")}>
            <img src={slide} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {onBack && <button onClick={onBack} className="text-sm text-primary hover:underline mb-4">← Back to modules</button>}
      <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center"><Lightbulb className="w-4 h-4 text-white" /></div>
          <div><h3 className="font-semibold text-foreground">Thinking Beyond the Plan</h3><p className="text-xs text-muted-foreground">Interactive presentation with voiceover</p></div>
        </div>
        {renderDeckContent(true)}
        <audio ref={audioRef} src={voiceoverAudio} preload="metadata" />
      </Card>
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-4xl w-[95vw] p-6">{renderDeckContent()}</DialogContent>
      </Dialog>
    </>
  );
}
