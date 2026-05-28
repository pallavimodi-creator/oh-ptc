import { Button } from '@/components/ui/button';
import { Settings2, X, CheckCircle2 } from 'lucide-react';

interface DeckCalibrationOverlayProps {
  isCalibrating: boolean;
  currentMark: number;
  totalSlides: number;
  hasCalibration: boolean;
  onStartCalibration: () => void;
  onMarkSlide: () => void;
  onCancel: () => void;
  onClear: () => void;
}

export default function DeckCalibrationOverlay({
  isCalibrating,
  currentMark,
  totalSlides,
  hasCalibration,
  onStartCalibration,
  onMarkSlide,
  onCancel,
  onClear,
}: DeckCalibrationOverlayProps) {
  if (isCalibrating) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-700">
            Calibrating: Mark slide {currentMark + 1} of {totalSlides}
          </span>
          <Button variant="ghost" size="icon" onClick={onCancel} className="h-6 w-6">
            <X className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Play the audio, then tap "Mark" when the next slide should appear.
        </p>
        <Button
          size="sm"
          variant="default"
          onClick={onMarkSlide}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          Mark Slide {currentMark + 1}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onStartCalibration}
        className="h-7 text-xs gap-1"
      >
        <Settings2 className="w-3 h-3" />
        {hasCalibration ? 'Re-calibrate' : 'Calibrate'} slides
      </Button>
      {hasCalibration && (
        <>
          <span className="text-xs text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Synced
          </span>
          <Button variant="ghost" size="sm" onClick={onClear} className="h-7 text-xs text-muted-foreground">
            Reset
          </Button>
        </>
      )}
    </div>
  );
}
