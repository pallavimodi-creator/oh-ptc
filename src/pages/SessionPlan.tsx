import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ImagePlus, Loader2 } from 'lucide-react';
import { ALL_SESSIONS, SESSION_PLANS, SESSION_TYPES } from '@/data/sessions';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import SessionAcknowledgment from '@/components/SessionAcknowledgment';

interface SessionImage {
  activity_key: string;
  image_url: string;
}

export default function SessionPlan() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [sessionImages, setSessionImages] = useState<SessionImage[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);

  const session = Object.values(ALL_SESSIONS).flat().find((s) => s.id === id);
  const plan = session ? SESSION_PLANS[session.name] : null;

  useEffect(() => {
    if (session?.name) {
      fetchSessionImages();
    }
  }, [session?.name]);

  const fetchSessionImages = async () => {
    if (!session?.name) return;
    
    const { data } = await supabase
      .from('session_images')
      .select('activity_key, image_url')
      .eq('session_name', session.name);
    
    if (data) {
      setSessionImages(data);
    }
  };

  const getImageForActivity = (activityKey: string) => {
    return sessionImages.find(img => img.activity_key === activityKey)?.image_url;
  };

  const handleImageUpload = async (activityKey: string, file: File) => {
    if (!session?.name || !profile?.role) return;
    
    setUploading(activityKey);
    
    try {
      // Upload via backend function (bypasses storage RLS and enforces admin role server-side)
      const form = new FormData();
      form.append('sessionName', session.name);
      form.append('activityKey', activityKey);
      form.append('file', file);

      const { data, error } = await supabase.functions.invoke('upload-session-image', {
        body: form,
      });

      if (error) throw error;
      if (!data?.publicUrl) throw new Error('Upload failed');
      
      await fetchSessionImages();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(null);
    }
  };

  if (!session || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Session not found</p>
      </div>
    );
  }

  const { label, color } = SESSION_TYPES[session.type];
  const isAdmin = profile?.role === 'admin';

  const ImageSection = ({ activityKey, label }: { activityKey: string; label: string }) => {
    const imageUrl = getImageForActivity(activityKey);
    const isUploading = uploading === activityKey;
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(activityKey, file);
      }
      // Reset input so same file can be selected again
      e.target.value = '';
    };
    
    return (
      <div className="mt-3">
        {imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt={label}
              loading="lazy"
              decoding="async"
              className="w-full rounded-lg"
            />
            {isAdmin && (
              <label className="absolute bottom-2 right-2 bg-background/90 p-2 rounded-lg cursor-pointer hover:bg-background transition-colors">
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ImagePlus className="w-4 h-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        ) : isAdmin ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <ImagePlus className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Upload image</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="flex items-center justify-center w-full h-24 bg-muted/30 border border-dashed border-border rounded-lg">
            <span className="text-xs text-muted-foreground">Image coming soon</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-content items-center gap-3 px-4 py-3.5">
          <button
            onClick={() => navigate(-1)}
            aria-label="back"
            className="-ml-1 rounded-full p-2 text-ink-muted transition-colors hover:bg-bg-subtle hover:text-ink"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <span className={cn('mb-1 inline-block rounded-chip px-2.5 py-0.5 text-[10px] font-extrabold lowercase tracking-wide', color)}>
              {label.toLowerCase()}
            </span>
            <h1 className="truncate text-[20px] font-extrabold leading-tight text-ink">
              {session.name.toLowerCase()}
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-content space-y-6 px-4 py-6">
        {/* Session Acknowledgment */}
        <SessionAcknowledgment sessionId={session.id} sessionName={session.name} />

        {/* Note */}
        <div className="rounded-card border border-ink/10 bg-bg-subtle/60 px-3.5 py-2.5">
          <p className="text-[12px] leading-relaxed text-ink-muted">
            <span className="font-bold text-ink">note ·</span> images are representative — please read plans carefully &amp; in advance.
          </p>
        </div>

        {/* Overview */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-bold text-ink-muted">
            overview
          </h2>
          <p className="text-[15px] leading-relaxed text-ink">{plan.overview}</p>
        </section>

        {/* Materials */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-bold text-ink-muted">
            materials needed
          </h2>
          <ul className="space-y-1.5">
            {plan.materials.map((material, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[14px] text-ink">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-orange" />
                <span>{material}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Free Play */}
        <section className="rounded-card border border-brand-orange/15 bg-brand-orange/[0.05] p-4">
          <h2 className="mb-3 text-[11px] font-bold text-brand-orange">
            free play
          </h2>
          <ImageSection activityKey="freeplay" label="Free Play" />
          <div className="mt-4 space-y-4">
            <div>
              <span className="text-[11px] font-bold text-ink-muted">purpose</span>
              <p className="mt-1 text-[14px] leading-relaxed text-ink">{plan.freePlay.purpose}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-ink-muted">set-up</span>
              <ul className="mt-1.5 space-y-1">
                {plan.freePlay.setup.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed text-ink">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-ink/35" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[11px] font-bold text-ink-muted">teacher models</span>
              <p className="mt-1 text-[14px] leading-relaxed text-ink">{plan.freePlay.teacherModels}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-ink-muted">what to say</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {plan.freePlay.whatToSay.map((phrase, i) => (
                  <span key={i} className="rounded-chip bg-brand-white px-2.5 py-1 text-[12px] text-ink ring-1 ring-ink/10">
                    "{phrase}"
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Activities */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-bold text-ink-muted">
            activities
          </h2>
          <div className="space-y-4">
            {plan.activities.map((activity, i) => (
              <div key={i} className="rounded-card border border-ink/10 bg-brand-white p-4 shadow-card">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange text-[13px] font-extrabold text-white">
                    {i + 1}
                  </span>
                  <h3 className="text-[15px] font-extrabold leading-tight text-ink">{activity.name.toLowerCase()}</h3>
                </div>

                <ImageSection activityKey={`activity${i + 1}`} label={activity.name} />

                <p className="my-3 text-[14px] leading-relaxed text-ink">{activity.description}</p>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-ink-muted">set-up</span>
                    <ul className="mt-1.5 space-y-1">
                      {activity.setup.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-[14px] leading-relaxed text-ink">
                          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-ink/35" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-ink-muted">what to say</span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {activity.whatToSay.map((phrase, j) => (
                        <span key={j} className="rounded-chip bg-bg-subtle px-2.5 py-1 text-[12px] text-ink">
                          "{phrase}"
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-brand-orange/[0.07] px-3 py-2">
                    <span className="text-[11px] font-bold text-ink-muted">goal</span>
                    <p className="mt-0.5 text-[14px] font-bold text-brand-orange">{activity.goal}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}