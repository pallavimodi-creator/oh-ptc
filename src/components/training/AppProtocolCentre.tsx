import { Card } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';

interface AppProtocolCentreProps {
  onBack?: () => void;
}

export default function AppProtocolCentre({ onBack }: AppProtocolCentreProps) {
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
      
      <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">App Protocol – For CD & CC</h3>
            <p className="text-xs text-muted-foreground">Booking & attendance guidelines</p>
          </div>
        </div>

        <div className="space-y-6 text-sm">
          <div>
            <h4 className="text-blue-600 font-semibold mb-2">A. No booking = No entry</h4>
            <p className="text-muted-foreground">
              Inform parents that attending a session <span className="font-medium text-foreground">without booking</span> and 
              without showing a ticket at entry is <span className="font-medium text-foreground">not permitted under any circumstance</span>.
            </p>
            <p className="text-muted-foreground mt-1">
              This is important to maintain ratios and to be fair with all participants.
            </p>
          </div>

          <div>
            <h4 className="text-blue-600 font-semibold mb-2">B. Handling unbooked parents</h4>
            <p className="text-muted-foreground">
              If a parent has not booked and come for a session — they <span className="font-medium text-foreground">cannot be permitted to attend</span> (unless there is a technical reason).
            </p>
            <p className="text-muted-foreground mt-1">
              Parents should be helped to book another session.
            </p>
          </div>

          <div>
            <h4 className="text-blue-600 font-semibold mb-2">C. Attendance after ticket verification</h4>
            <p className="text-muted-foreground">
              After seeing the ticket — <span className="font-medium text-foreground">attendance should be marked</span>.
            </p>
            <p className="text-muted-foreground mt-1">
              If attendance is marked without viewing the ticket — it should be <span className="font-medium text-foreground">flagged on the email update</span> from cluster managers.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
