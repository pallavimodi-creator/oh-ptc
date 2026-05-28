import { Card } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface SubscriptionPricingProps {
  onBack?: () => void;
}

export default function SubscriptionPricing({ onBack }: SubscriptionPricingProps) {
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
      
      <Card className="p-4 bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Fees & Subscription</h3>
            <p className="text-xs text-muted-foreground">Pricing structure for parents</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Single Session */}
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎟️</span>
                <h4 className="text-xl font-medium">single session</h4>
              </div>
              <span className="text-2xl font-bold">₹750<span className="text-sm font-normal text-muted-foreground">+GST</span></span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span>•</span>
                Try before you commit
              </li>
              <li className="flex items-center gap-2">
                <span>•</span>
                Perfect for first-timers or occasional visits
              </li>
            </ul>
          </div>

          {/* Membership */}
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">👑</span>
                <h4 className="text-xl font-medium">membership</h4>
              </div>
              <span className="text-2xl font-bold">₹12,000<span className="text-sm font-normal text-muted-foreground">+GST</span></span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span>•</span>
                Attend unlimited sessions (3 months)
              </li>
              <li className="flex items-center gap-2">
                <span>•</span>
                Experience Book included
              </li>
              <li className="flex items-center gap-2">
                <span>•</span>
                Priority booking
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
