import { Card } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface WhatsAppProtocolCentreProps {
  onBack?: () => void;
}

export default function WhatsAppProtocolCentre({ onBack }: WhatsAppProtocolCentreProps) {
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
            <h3 className="font-semibold text-foreground">WhatsApp Group Protocol - For CD & CC</h3>
            <p className="text-xs text-muted-foreground">Guidelines for group management</p>
          </div>
        </div>

        <div className="space-y-6 text-sm">
          <div>
            <h4 className="text-orange-600 font-semibold mb-2">A. Add parents to the WhatsApp group</h4>
            <p className="text-muted-foreground">
              Add every new parent who attends a Parent–Toddler Club session.
            </p>
          </div>

          <div>
            <h4 className="text-orange-600 font-semibold mb-2">B. Resolve booking queries (DM only)</h4>
            <p className="text-muted-foreground">
              All booking questions must be handled on DM, not in the group.
            </p>
            <p className="text-muted-foreground mt-1">
              If a parent is unable to book, raise a ticket / escalate to Manjushree.
            </p>
          </div>

          <div>
            <h4 className="text-orange-600 font-semibold mb-2">C. Share weekly session reminders</h4>
            <div className="space-y-2 text-muted-foreground">
              <p className="flex items-center gap-2">
                <span>📌</span>
                <strong>Saturday | 3:00 PM</strong> — Share sessions for the coming week
              </p>
              <p className="flex items-center gap-2">
                <span>📌</span>
                <strong>Friday | 1:00 PM</strong> — Send reminder for the Saturday playdate
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
