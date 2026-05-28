import { useState } from 'react';
import { Loader2, Users, GraduationCap, Clock, FileText, Play, ClipboardList, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffProfile } from '@/hooks/useStaffProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import OnboardingDeck from '@/components/OnboardingDeck';
import ExperienceBookDeck from '@/components/ExperienceBookDeck';
import ThinkingBeyondPlanDeck from '@/components/training/ThinkingBeyondPlanDeck';
import BookingAppDeck from '@/components/training/BookingAppDeck';
import WhatsAppProtocolEducator from '@/components/training/WhatsAppProtocolEducator';
import WhatsAppProtocolCentre from '@/components/training/WhatsAppProtocolCentre';
import SubscriptionPricing from '@/components/training/SubscriptionPricing';
import RegisterParentVideo from '@/components/training/RegisterParentVideo';
import ExperienceBookUsageDeck from '@/components/training/ExperienceBookUsageDeck';
import ExperienceFeedbackProtocol from '@/components/training/ExperienceFeedbackProtocol';
import AppProtocolCentre from '@/components/training/AppProtocolCentre';
import QuizModule from '@/components/training/QuizModule';
import AdminQuizPreview from '@/components/training/AdminQuizPreview';
import EducatorClearanceBadge from '@/components/training/EducatorClearanceBadge';
import EducatorResources from '@/components/training/EducatorResources';
import { CENTRE_TEAM_MODULES, EDUCATOR_MODULES, TrainingModule } from '@/data/trainingContent';
import { QUIZ_EDUCATOR, QUIZ_3_CENTRE_TEAM } from '@/data/quizData';

function TrainingModuleCard({ module, onShowDeck }: { module: TrainingModule; onShowDeck?: (key: string) => void }) {
  const isReady = module.hasContent;
  
  const handleClick = () => {
    if (isReady && onShowDeck) {
      onShowDeck(module.key);
    }
  };

  return (
    <Card 
      className={cn(
        'transition-all',
        isReady ? 'cursor-pointer hover:border-primary/50 hover:shadow-md' : 'opacity-60'
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
              isReady ? 'bg-primary/10' : 'bg-muted'
            )}>
              {module.type === 'deck' || module.type === 'video' ? (
                <Play className={cn('w-5 h-5', isReady ? 'text-primary' : 'text-muted-foreground')} />
              ) : (
                <FileText className={cn('w-5 h-5', isReady ? 'text-primary' : 'text-muted-foreground')} />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{module.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{module.description}</p>
            </div>
          </div>
          <Badge 
            variant={isReady ? 'default' : 'secondary'}
            className={cn(
              'text-xs flex-shrink-0',
              !isReady && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            )}
          >
            {isReady ? 'Ready' : (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Coming Soon
              </span>
            )}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function QuizCard({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <Card
      className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
            <ClipboardList className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Onboarding() {
  const { loading: authLoading, isAdmin, profile } = useAuth();
  const { staffProfile, loading: profileLoading } = useStaffProfile();
  const [activeDeck, setActiveDeck] = useState<string | null>(null);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleShowDeck = (key: string) => {
    setActiveDeck(key);
  };

  const handleCloseDeck = () => {
    setActiveDeck(null);
  };

  // Determine which tabs to show based on role (check both staff_profiles and user_roles)
  const staffRole = staffProfile?.role;
  const authRole = profile?.role;
  const showCentreTeamTab = isAdmin || staffRole === 'cd' || staffRole === 'centre' || authRole === 'centre';
  const showEducatorTab = isAdmin || staffRole === 'educator';
  const defaultTab = showCentreTeamTab ? 'centre_team' : 'educator';

  const renderContentView = (deck: string) => {
    switch (deck) {
      case 'about_ptc':
        return (
          <div className="space-y-4">
            <button onClick={handleCloseDeck} className="text-sm text-primary hover:underline">
              ← Back to modules
            </button>
            <OnboardingDeck />
          </div>
        );
      case 'experience_book':
        return (
          <div className="space-y-4">
            <button onClick={handleCloseDeck} className="text-sm text-primary hover:underline">
              ← Back to modules
            </button>
            <ExperienceBookDeck />
          </div>
        );
      case 'thinking_beyond_plan':
        return <ThinkingBeyondPlanDeck onBack={handleCloseDeck} />;
      case 'booking_session':
        return <BookingAppDeck onBack={handleCloseDeck} />;
      case 'whatsapp_protocol_educator':
        return <WhatsAppProtocolEducator onBack={handleCloseDeck} />;
      case 'whatsapp_protocol_centre':
        return <WhatsAppProtocolCentre onBack={handleCloseDeck} />;
      case 'subscription_pricing':
        return <SubscriptionPricing onBack={handleCloseDeck} />;
      case 'register_subscriber':
        return <RegisterParentVideo onBack={handleCloseDeck} />;
      case 'how_to_use_experience_book':
        return <ExperienceBookUsageDeck onBack={handleCloseDeck} />;
      case 'experience_feedback_protocol':
        return <ExperienceFeedbackProtocol onBack={handleCloseDeck} />;
      case 'app_protocol_centre':
        return <AppProtocolCentre onBack={handleCloseDeck} />;
      case 'quiz_educator_onboarding':
        return isAdmin
          ? <AdminQuizPreview quiz={QUIZ_EDUCATOR} onBack={handleCloseDeck} />
          : <QuizModule quiz={QUIZ_EDUCATOR} onBack={handleCloseDeck} />;
      case 'quiz_3_centre_team':
        return isAdmin
          ? <AdminQuizPreview quiz={QUIZ_3_CENTRE_TEAM} onBack={handleCloseDeck} />
          : <QuizModule quiz={QUIZ_3_CENTRE_TEAM} onBack={handleCloseDeck} />;
      case 'educator_resources':
        return <EducatorResources onBack={handleCloseDeck} />;
      default:
        return null;
    }
  };

  // If only one tab is visible, render without tabs
  const singleTab = showCentreTeamTab && !showEducatorTab ? 'centre_team' : 
                     !showCentreTeamTab && showEducatorTab ? 'educator' : null;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">Initial Onboarding</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Training materials for your role
          </p>
        </div>
      </header>

      <div className="px-4 py-4">
        {singleTab ? (
          // Single tab — no tab UI needed
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              {singleTab === 'centre_team'
                ? 'Training materials for centre directors and team members.'
                : 'Training materials for educators conducting sessions.'}
            </div>

            {activeDeck ? (
              renderContentView(activeDeck)
            ) : singleTab === 'centre_team' ? (
              <CentreTeamContent onShowDeck={handleShowDeck} isAdmin={isAdmin} />
            ) : (
              <EducatorContent onShowDeck={handleShowDeck} isAdmin={isAdmin} />
            )}
          </div>
        ) : (
          // Both tabs visible (admin)
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="centre_team" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Centre Team
              </TabsTrigger>
              <TabsTrigger value="educator" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Educator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="centre_team" className="space-y-4 mt-0">
              <div className="text-sm text-muted-foreground mb-4">
                Training materials for centre directors and team members.
              </div>
              {activeDeck ? (
                renderContentView(activeDeck)
              ) : (
                <CentreTeamContent onShowDeck={handleShowDeck} isAdmin={isAdmin} />
              )}
            </TabsContent>

            <TabsContent value="educator" className="space-y-4 mt-0">
              <div className="text-sm text-muted-foreground mb-4">
                Training materials for educators conducting sessions.
              </div>
              {activeDeck ? (
                renderContentView(activeDeck)
              ) : (
                <EducatorContent onShowDeck={handleShowDeck} isAdmin={isAdmin} />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function CentreTeamContent({ onShowDeck, isAdmin }: { onShowDeck: (key: string) => void; isAdmin: boolean }) {
  return (
    <div className="space-y-3">
      {CENTRE_TEAM_MODULES.map((module) => (
        <TrainingModuleCard 
          key={module.key} 
          module={module} 
          onShowDeck={onShowDeck}
        />
      ))}

      {/* Assessment Section */}
      <div className="pt-4 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          Assessment
        </h3>
        <div className="space-y-3">
          <QuizCard
            title="Quiz — Centre Team Onboarding"
            description="Program understanding, parent FAQs, WhatsApp & app protocol, fees, and program pitching. 21 MCQs + 4 short answers."
            onClick={() => onShowDeck('quiz_3_centre_team')}
          />
        </div>
      </div>
    </div>
  );
}

function EducatorContent({ onShowDeck, isAdmin }: { onShowDeck: (key: string) => void; isAdmin: boolean }) {
  return (
    <div className="space-y-3">
      {/* Clearance Status — hidden for admin */}
      {!isAdmin && <EducatorClearanceBadge />}

      {/* Training modules */}
      {EDUCATOR_MODULES.map((module) => (
        <TrainingModuleCard 
          key={module.key} 
          module={module} 
          onShowDeck={onShowDeck}
        />
      ))}

      {/* Resources Section */}
      <div className="pt-4 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Resources
        </h3>
        <div className="space-y-3">
          <Card
            className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
            onClick={() => onShowDeck('educator_resources')}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Books, Songs & Rhymes</h3>
                  <p className="text-xs text-muted-foreground mt-1">Recommended books and songs for sessions. You can also suggest additional books.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assessment Section */}
      <div className="pt-4 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          Assessment
        </h3>
        <div className="space-y-3">
          <QuizCard
            title="Educator Onboarding Quiz"
            description="Part 1 (PTC) + Part 2 (Experience Book). 9 MCQs + 8 short answers. 30-minute time limit."
            onClick={() => onShowDeck('quiz_educator_onboarding')}
          />
        </div>
      </div>
    </div>
  );
}