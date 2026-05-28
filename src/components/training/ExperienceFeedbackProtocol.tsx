import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ClipboardCheck, Upload, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExperienceFeedbackProtocolProps {
  onBack: () => void;
}

export default function ExperienceFeedbackProtocol({ onBack }: ExperienceFeedbackProtocolProps) {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setScreenshotUrl(url);
    }
  };

  const handleRemoveImage = () => {
    if (screenshotUrl) {
      URL.revokeObjectURL(screenshotUrl);
    }
    setScreenshotUrl(null);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-sm text-primary hover:underline flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to modules
      </button>

      <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <ClipboardCheck className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Experience Feedback Protocol (PTC)</h3>
            <p className="text-xs text-muted-foreground">Weekly acknowledgment process</p>
          </div>
        </div>

        <div className="space-y-5 text-sm">
          {/* When */}
          <div>
            <h4 className="text-primary font-semibold mb-2">When?</h4>
            <p className="text-foreground">
              Every week on <span className="font-semibold">Friday (before 3 PM)</span>.
            </p>
          </div>

          {/* What to do */}
          <div>
            <h4 className="text-primary font-semibold mb-2">What do you need to do?</h4>
            <p className="text-muted-foreground">
              Review the Parent–Toddler Club plans for the <span className="font-medium text-foreground">upcoming week</span> and 
              acknowledge whether you will use the activities mentioned in the plan or conduct other activities.
            </p>
          </div>

          {/* How it works */}
          <div>
            <h4 className="text-primary font-semibold mb-2">How does it work?</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">1.</span>
                <span>Open the session plan for the upcoming week in the app.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">2.</span>
                <span>
                  For each activity, <span className="font-medium text-foreground">tick</span> if you will do it as planned, 
                  or <span className="font-medium text-foreground">leave unticked</span> and select a reason &amp; describe what you'll do instead.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">3.</span>
                <span>Submit your acknowledgment before the deadline.</span>
              </li>
            </ul>
          </div>

          {/* What happens next */}
          <div>
            <h4 className="text-primary font-semibold mb-2">What happens with your feedback?</h4>
            <p className="text-muted-foreground">
              Based on the consolidation, a small note may be shared on the <span className="font-medium text-foreground">WhatsApp group</span> if 
              any major input has come up. These feedbacks are also used for <span className="font-medium text-foreground">planning the upcoming month</span>.
            </p>
          </div>

          {/* Screenshot section */}
          <div>
            <h4 className="text-primary font-semibold mb-2">What does it look like?</h4>
            <p className="text-muted-foreground mb-3">
              Below is a screenshot of the session acknowledgment section in the app. You can also add your own screenshot for reference.
            </p>

            {screenshotUrl ? (
              <div className="relative">
                <img
                  src={screenshotUrl}
                  alt="Session acknowledgment screenshot"
                  className="w-full rounded-lg border border-border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={handleRemoveImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Image className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground text-center">
                  Tap to add a screenshot of the session acknowledgment section
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
