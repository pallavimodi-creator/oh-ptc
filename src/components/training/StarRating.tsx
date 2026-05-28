import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  disabled?: boolean;
}

export default function StarRating({ rating, onRate, disabled }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">
        {rating > 0 ? 'Thanks for your feedback!' : 'Rate your experience with the onboarding material & test'}
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onRate(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={cn(
              'p-0.5 transition-transform hover:scale-110',
              disabled && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                'w-7 h-7 transition-colors',
                (hover || rating) >= star
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground/30'
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
