import { Link } from 'react-router-dom';
import { CalendarDays, BookOpen, Sparkles } from 'lucide-react';
import openhouseLogo from '@/assets/openhouse-logo.png';
import doodleHand from '@/assets/doodle-hand.png';
import blobCoral from '@/assets/blob-coral.png';
import blobGreen from '@/assets/blob-green.png';
import doodleStars from '@/assets/doodle-stars.png';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <img 
        src={blobCoral} 
        alt="" 
        className="absolute -top-20 -right-20 w-64 h-64 opacity-40 pointer-events-none"
      />
      <img 
        src={blobGreen} 
        alt="" 
        className="absolute -bottom-16 -left-16 w-56 h-56 opacity-50 pointer-events-none"
      />
      <img 
        src={doodleStars} 
        alt="" 
        className="absolute top-1/4 -left-8 w-32 h-32 opacity-30 pointer-events-none"
      />
      <img 
        src={doodleStars} 
        alt="" 
        className="absolute bottom-1/3 -right-8 w-40 h-40 opacity-25 pointer-events-none rotate-45"
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Logo */}
        <img 
          src={openhouseLogo} 
          alt="Openhouse" 
          className="h-12 mb-8"
        />

        {/* Hand doodle + Welcome */}
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={doodleHand} 
            alt="" 
            className="w-16 h-16"
          />
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome!
            </h1>
            <p className="text-muted-foreground">
              Teacher's Companion
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-center text-muted-foreground mb-10 max-w-xs">
          Your daily guide for running joyful, meaningful sessions with little ones ✨
        </p>

        {/* Quick links */}
        <div className="w-full max-w-xs space-y-3">
          <Link
            to="/calendar"
            className="flex items-center gap-4 w-full bg-primary text-primary-foreground rounded-2xl px-5 py-4 font-semibold shadow-lg hover:opacity-90 transition-opacity"
          >
            <CalendarDays className="w-6 h-6" />
            <div>
              <div className="text-lg">Session Calendar</div>
              <div className="text-sm opacity-80 font-normal">View upcoming sessions</div>
            </div>
          </Link>

          <Link
            to="/onboarding"
            className="flex items-center gap-4 w-full bg-card border-2 border-border rounded-2xl px-5 py-4 font-semibold hover:bg-muted/50 transition-colors"
          >
            <BookOpen className="w-6 h-6 text-primary" />
            <div>
              <div className="text-lg text-foreground">Onboarding Guide</div>
              <div className="text-sm text-muted-foreground font-normal">Rules & resources</div>
            </div>
          </Link>
        </div>

        {/* Fun footer */}
        <div className="mt-12 flex items-center gap-2 text-muted-foreground text-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Let's make learning magical!</span>
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default Index;
