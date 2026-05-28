import { Card } from '@/components/ui/card';
import { UserPlus, ArrowLeft } from 'lucide-react';
import registerVideo from '@/assets/training/register-parent-video.mp4';

interface RegisterParentVideoProps {
  onBack?: () => void;
}

export default function RegisterParentVideo({ onBack }: RegisterParentVideoProps) {
  return (
    <div className="space-y-4">
      {onBack && (
        <button 
          onClick={onBack}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to modules
        </button>
      )}
      
      <Card className="p-4 bg-gradient-to-br from-teal-500/5 to-teal-500/10 border-teal-500/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">How to Register a Parent as a Subscriber</h3>
            <p className="text-xs text-muted-foreground">Step-by-step video walkthrough</p>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden bg-muted">
          <video
            controls
            playsInline
            preload="metadata"
            className="w-full"
          >
            <source src={registerVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </Card>
    </div>
  );
}
