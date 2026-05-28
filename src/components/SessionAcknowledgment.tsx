import { useState, useEffect } from 'react';
import { Check, AlertCircle, Loader2, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffProfile } from '@/hooks/useStaffProfile';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { SESSION_PLANS } from '@/data/sessions';

interface SessionAcknowledgmentProps {
  sessionId: string;
  sessionName: string;
}

const SKIP_REASONS = [
  { value: 'better_alternative', label: 'Have a better alternative' },
  { value: 'modifying', label: 'Modifying / adding to this' },
  { value: 'no_resources', label: "Don't have the resources" },
  { value: 'not_appropriate', label: "Don't think the activity is appropriate" },
] as const;

interface ActivityAcknowledgment {
  key: string;
  name: string;
  confirmed: boolean;
  reason: string;
  alternative: string;
}

interface Acknowledgment {
  id: string;
  is_confirmed: boolean;
  alternative_activity: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
}

export default function SessionAcknowledgment({ sessionId, sessionName }: SessionAcknowledgmentProps) {
  const { profile } = useAuth();
  const { staffProfile, loading: profileLoading } = useStaffProfile();
  const { toast } = useToast();

  const [acknowledgment, setAcknowledgment] = useState<Acknowledgment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Get activities from session plan
  const sessionPlan = SESSION_PLANS[sessionName];
  const allActivities: { key: string; name: string }[] = [];

  if (sessionPlan) {
    allActivities.push({ key: 'freeplay', name: 'Free Play' });
    sessionPlan.activities.forEach((activity, index) => {
      allActivities.push({ key: `activity${index + 1}`, name: activity.name });
    });
  }

  // State for each activity's acknowledgment — starts UNCHECKED
  const buildInitialStates = (): ActivityAcknowledgment[] =>
    allActivities.map(a => ({ key: a.key, name: a.name, confirmed: false, reason: '', alternative: '' }));

  const [activityStates, setActivityStates] = useState<ActivityAcknowledgment[]>(buildInitialStates);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    if (staffProfile?.centre_id) {
      fetchAcknowledgment();
    } else if (!profileLoading) {
      setLoading(false);
    }
  }, [sessionId, staffProfile?.centre_id, profileLoading]);

  // Reset activity states when session changes
  useEffect(() => {
    if (sessionPlan && !acknowledgment) {
      setActivityStates(buildInitialStates());
    }
  }, [sessionName, sessionPlan]);

  const fetchAcknowledgment = async () => {
    if (!staffProfile?.centre_id) return;

    const { data } = await supabase
      .from('session_acknowledgments')
      .select('*')
      .eq('session_id', sessionId)
      .eq('centre_id', staffProfile.centre_id)
      .maybeSingle();

    if (data) {
      setAcknowledgment(data);
      // Parse stored alternative_activity JSON to restore states
      if (data.alternative_activity) {
        try {
          const parsed = JSON.parse(data.alternative_activity);
          if (Array.isArray(parsed)) {
            setActivityStates(parsed);
          }
        } catch {
          // Legacy format - single alternative text
        }
      }
    }
    setLoading(false);
  };

  const handleCheckChange = (key: string, checked: boolean) => {
    setActivityStates(prev =>
      prev.map(a =>
        a.key === key
          ? { ...a, confirmed: checked, reason: checked ? '' : a.reason, alternative: checked ? '' : a.alternative }
          : a
      )
    );
  };

  const handleReasonChange = (key: string, value: string) => {
    setActivityStates(prev =>
      prev.map(a => (a.key === key ? { ...a, reason: value } : a))
    );
  };

  const handleAlternativeChange = (key: string, value: string) => {
    setActivityStates(prev =>
      prev.map(a => (a.key === key ? { ...a, alternative: value } : a))
    );
  };

  const handleSubmit = async () => {
    if (!staffProfile?.centre_id) {
      toast({
        title: 'Error',
        description: 'Staff profile not found. Please contact an administrator.',
        variant: 'destructive',
      });
      return;
    }

    // Every activity must be explicitly reviewed — at least one must be checked or have a reason + alternative
    const untouched = activityStates.find(a => !a.confirmed && (!a.reason || !a.alternative.trim()));
    if (untouched) {
      toast({
        title: 'Required Field',
        description: `For "${untouched.name}", please either tick that you will conduct it, or select a reason and describe what you will do instead.`,
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const allConfirmed = activityStates.every(a => a.confirmed);
      const payload = {
        session_id: sessionId,
        centre_id: staffProfile.centre_id,
        submitted_by: profile?.userId,
        is_confirmed: allConfirmed,
        alternative_activity: JSON.stringify(activityStates),
        status: 'pending',
      };

      if (acknowledgment) {
        const { error } = await supabase
          .from('session_acknowledgments')
          .update({
            is_confirmed: allConfirmed,
            alternative_activity: JSON.stringify(activityStates),
            status: 'pending',
            rejection_reason: null,
            reviewed_at: null,
            reviewed_by: null,
          })
          .eq('id', acknowledgment.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('session_acknowledgments')
          .insert(payload);

        if (error) throw error;
      }

      toast({
        title: 'Submitted ✅',
        description: 'Your acknowledgment has been submitted for admin review.',
      });
      await fetchAcknowledgment();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit acknowledgment.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isAdmin) {
    return (
      <Card className="border-muted bg-muted/30">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4" />
              <span>Session acknowledgments are reviewed in the Admin Dashboard.</span>
            </div>
            <a
              href="/admin"
              className="text-sm text-primary font-medium hover:underline"
            >
              View Dashboard →
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!staffProfile) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Staff profile not found. Please contact an administrator.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sessionPlan) {
    return (
      <Card className="border-muted bg-muted/30">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">Session plan not available.</p>
        </CardContent>
      </Card>
    );
  }

  // Show status if already submitted
  if (acknowledgment) {
    const statusConfig = {
      pending: {
        icon: Clock,
        label: 'Pending Review',
        color: 'text-warning bg-warning/10 border-warning/50',
      },
      approved: {
        icon: ThumbsUp,
        label: 'Approved',
        color: 'text-success bg-success/10 border-success/50',
      },
      rejected: {
        icon: ThumbsDown,
        label: 'Needs Revision',
        color: 'text-destructive bg-destructive/10 border-destructive/50',
      },
    };

    const status = statusConfig[acknowledgment.status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = status.icon;

    // Parse stored states for display
    let displayStates: ActivityAcknowledgment[] = activityStates;
    if (acknowledgment.alternative_activity) {
      try {
        const parsed = JSON.parse(acknowledgment.alternative_activity);
        if (Array.isArray(parsed)) {
          displayStates = parsed;
        }
      } catch {
        // Legacy format
      }
    }

    const getReasonLabel = (value: string) =>
      SKIP_REASONS.find(r => r.value === value)?.label ?? value;

    return (
      <Card className={cn('border', status.color)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <StatusIcon className="w-5 h-5" />
            Session Acknowledgment: {status.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {displayStates.map((activity) => (
              <div key={activity.key} className="text-sm">
                <div className="flex items-center gap-2">
                  {activity.confirmed ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-warning" />
                  )}
                  <span className="font-medium">{activity.name}</span>
                </div>
                {!activity.confirmed && (
                  <div className="ml-6 mt-1 space-y-0.5">
                    {activity.reason && (
                      <p className="text-muted-foreground text-xs">
                        Reason: {getReasonLabel(activity.reason)}
                      </p>
                    )}
                    {activity.alternative && (
                      <p className="text-muted-foreground">
                        Doing instead: {activity.alternative}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {acknowledgment.status === 'rejected' && acknowledgment.rejection_reason && (
            <div className="text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              <span className="font-medium text-destructive">Admin feedback: </span>
              {acknowledgment.rejection_reason}
            </div>
          )}

          {acknowledgment.status === 'rejected' && (
            <Button onClick={() => setAcknowledgment(null)} variant="outline" className="w-full">
              Revise Response
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show form for new submission
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Check className="w-5 h-5 text-primary" />
          Session Acknowledgment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/60 border border-border rounded-lg px-3 py-2">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">Review each activity below.</span>{' '}
            Tick the checkbox if you will conduct the activity as planned. If you will <strong>not</strong> conduct it,
            leave it unticked, select a reason, and describe what you will do instead.
          </p>
        </div>

        <div className="space-y-4">
          {activityStates.map((activity, index) => (
            <div
              key={activity.key}
              className={cn(
                'rounded-lg border p-3 space-y-2 transition-colors',
                activity.confirmed ? 'border-success/40 bg-success/5' : 'border-border bg-background'
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={activity.key}
                  checked={activity.confirmed}
                  onCheckedChange={(checked) => handleCheckChange(activity.key, checked === true)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor={activity.key}
                  className="text-sm font-medium cursor-pointer flex-1"
                >
                  {index === 0 ? 'Free Play' : `Activity ${index}: ${activity.name}`}
                </Label>
              </div>

              {!activity.confirmed && (
                <div className="ml-7 space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Why are you not conducting this activity?
                    </Label>
                    <Select
                      value={activity.reason}
                      onValueChange={(value) => handleReasonChange(activity.key, value)}
                    >
                      <SelectTrigger className="text-sm h-9">
                        <SelectValue placeholder="Select a reason…" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKIP_REASONS.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Describe what you will do instead
                    </Label>
                    <Input
                      placeholder="e.g. We will do a finger-painting activity with watercolours…"
                      value={activity.alternative}
                      onChange={(e) => handleAlternativeChange(activity.key, e.target.value)}
                      maxLength={200}
                      className="text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{activity.alternative.length}/200</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button onClick={handleSubmit} disabled={submitting} className="w-full">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Acknowledgment'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
