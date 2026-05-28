import { Card } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface WhatsAppProtocolEducatorProps {
  onBack?: () => void;
}

export default function WhatsAppProtocolEducator({ onBack }: WhatsAppProtocolEducatorProps) {
  return (
    <div className="space-y-4">
      {onBack && (
        <button 
          onClick={onBack}
          className="text-sm text-primary hover:underline"
        >
          ← Back to modules
        </button>
      )}
      
      <Card className="p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">WhatsApp Protocol - For Educator</h3>
            <p className="text-xs text-muted-foreground">Guidelines for session communication</p>
          </div>
        </div>

        <div className="space-y-6 text-sm">
          <div>
            <h4 className="text-orange-600 font-semibold mb-2">A. Session Preview (Daily)</h4>
            <p className="text-muted-foreground">
              One day before every session day share 1 photo of preparation (book / setup / materials) with <span className="text-primary font-medium">#sessionpreview</span>
            </p>
          </div>

          <div>
            <h4 className="text-orange-600 font-semibold mb-2">B. Club Moment of the Day (Daily)</h4>
            <p className="text-muted-foreground">
              Every day (for both slots) share 1 group photo per slot with <span className="text-primary font-medium">#clubmomentoftheday</span>
            </p>
          </div>

          <div>
            <h4 className="text-orange-600 font-semibold mb-2">C. Club Pick of the Week (Weekly)</h4>
            <p className="text-muted-foreground">
              At the end of the week share 3–4 photos from the week (different activities) with a poll for favourite activity. <span className="text-primary font-medium">#clubpickoftheweek</span>
            </p>
          </div>

          <div className="bg-destructive/10 rounded-lg p-4 mt-4">
            <h4 className="text-destructive font-semibold mb-2">Not to Do:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Don't share more than 3–4 photos at a time.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Don't repeat the same child in multiple photos.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Don't share unclear/poor setup photos.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Don't make collages.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Don't post at random times or late at night.
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
