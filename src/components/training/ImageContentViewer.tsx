import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ImageContentViewerProps {
  title: string;
  imageSrc: string;
  onBack: () => void;
}

export default function ImageContentViewer({ title, imageSrc, onBack }: ImageContentViewerProps) {
  return (
    <div className="space-y-4">
      <button 
        onClick={onBack}
        className="text-sm text-primary hover:underline flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to modules
      </button>
      
      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-4">{title}</h3>
        <div className="relative aspect-auto">
          <img
            src={imageSrc}
            alt={title}
            className="w-full rounded-lg"
          />
        </div>
      </Card>
    </div>
  );
}
