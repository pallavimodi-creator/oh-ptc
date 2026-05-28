import { useState, useEffect } from 'react';
import { Check, X, Clock, Loader2, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FEBRUARY_2026_SESSIONS } from '@/data/sessions';
import { cn } from '@/lib/utils';

interface ActivityDetail {
  key: string;
  name: string;
  confirmed: boolean;
  alternative: string;
}

interface Acknowledgment {
  id: string;
  session_id: string;
  centre_id: string;
  is_confirmed: boolean;
  alternative_activity: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  centre_name?: string;
}

interface Centre {
  id: string;
  name: string;
}

export default function AdminSessionConfirmations() {
  const { profile } = useAuth();
  const { toast } = useToast();

  const [acknowledgments, setAcknowledgments] = useState<Acknowledgment[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [ackRes, centresRes] = await Promise.all([
      supabase
        .from('session_acknowledgments')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase.from('centres').select('id, name'),
    ]);

    if (centresRes.data) setCentres(centresRes.data);

    if (ackRes.data && centresRes.data) {
      const centreMap = new Map(centresRes.data.map((c) => [c.id, c.name]));
      const enriched = ackRes.data.map((ack) => ({
        ...ack,
        centre_name: centreMap.get(ack.centre_id) || 'Unknown Centre',
      }));
      setAcknowledgments(enriched);
    }

    setLoading(false);
  };

  const getSessionName = (sessionId: string) => {
    const session = FEBRUARY_2026_SESSIONS.find((s) => s.id === sessionId);
    return session?.name || sessionId;
  };

  const parseActivityDetails = (raw: string | null): ActivityDetail[] | null => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as ActivityDetail[];
    } catch {
      // Not JSON, return null (it's plain text)
    }
    return null;
  };

  const renderActivityDetails = (alternativeActivity: string | null) => {
    const activities = parseActivityDetails(alternativeActivity);

    if (activities) {
      return (
        <div className="bg-background rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            Activity Breakdown
          </p>
          {activities.map((act) => (
            <div key={act.key} className="flex items-start justify-between gap-2 text-sm">
              <div className="flex-1">
                <span className="font-medium">{act.name}</span>
                {!act.confirmed && act.alternative && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                    Alternative: {act.alternative}
                  </p>
                )}
              </div>
              <Badge
                variant={act.confirmed ? 'default' : 'secondary'}
                className={cn('text-xs flex-shrink-0', !act.confirmed && 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400')}
              >
                {act.confirmed ? '✓ Will follow' : 'Alternative'}
              </Badge>
            </div>
          ))}
        </div>
      );
    }

    // Fallback: plain text
    if (alternativeActivity) {
      return (
        <div className="bg-background p-3 rounded-lg text-sm">
          <span className="font-medium">Details: </span>
          {alternativeActivity}
        </div>
      );
    }

    return null;
  };

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      const { error } = await supabase
        .from('session_acknowledgments')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile?.userId,
        })
        .eq('id', id);

      if (error) throw error;

      setAcknowledgments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a))
      );
      toast({ title: 'Approved ✅', description: 'Acknowledgment has been approved.' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog) return;

    setProcessing(rejectDialog);
    try {
      const { error } = await supabase
        .from('session_acknowledgments')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason.trim() || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile?.userId,
        })
        .eq('id', rejectDialog);

      if (error) throw error;

      setAcknowledgments((prev) =>
        prev.map((a) =>
          a.id === rejectDialog
            ? { ...a, status: 'rejected', rejection_reason: rejectionReason.trim() || null }
            : a
        )
      );
      toast({ title: 'Rejected', description: 'Acknowledgment has been rejected.' });
      setRejectDialog(null);
      setRejectionReason('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
    }
  };

  const pendingAcks = acknowledgments.filter((a) => a.status === 'pending');
  const reviewedAcks = acknowledgments.filter((a) => a.status !== 'pending');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (acknowledgments.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No session acknowledgments yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Teachers will submit acknowledgments when they review session plans.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Section */}
      {pendingAcks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Review ({pendingAcks.length})
          </h3>
          <div className="space-y-3">
            {pendingAcks.map((ack) => (
              <Card key={ack.id} className="border-warning/50 bg-warning/10">
                <CardContent className="py-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{getSessionName(ack.session_id)}</p>
                        <p className="text-sm text-muted-foreground">{ack.centre_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(ack.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={ack.is_confirmed ? 'default' : 'secondary'}>
                        {ack.is_confirmed ? 'All Confirmed' : 'Has Alternatives'}
                      </Badge>
                    </div>

                    {/* Activity details */}
                    {renderActivityDetails(ack.alternative_activity)}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(ack.id)}
                        disabled={processing === ack.id}
                        className="flex-1"
                        size="sm"
                      >
                        {processing === ack.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => setRejectDialog(ack.id)}
                        disabled={processing === ack.id}
                        variant="destructive"
                        className="flex-1"
                        size="sm"
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed Section */}
      {reviewedAcks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Reviewed ({reviewedAcks.length})
          </h3>
          <div className="space-y-2">
            {reviewedAcks.map((ack) => (
              <Card
                key={ack.id}
                className={cn(
                  'border',
                  ack.status === 'approved'
                    ? 'border-success/50 bg-success/10'
                    : 'border-destructive/50 bg-destructive/10'
                )}
              >
                <CardContent className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{getSessionName(ack.session_id)}</p>
                      <p className="text-xs text-muted-foreground">{ack.centre_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={ack.is_confirmed ? 'outline' : 'secondary'} className="text-xs">
                        {ack.is_confirmed ? 'Confirmed' : 'Alt'}
                      </Badge>
                      {ack.status === 'approved' ? (
                        <ThumbsUp className="w-4 h-4 text-success" />
                      ) : (
                        <ThumbsDown className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={(open) => !open && setRejectDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Acknowledgment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Feedback for teacher (optional)</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explain why this was rejected or what needs to change..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)} disabled={!!processing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!!processing}>
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
