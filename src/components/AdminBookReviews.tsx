import { useState, useEffect } from 'react';
import { Check, X, Loader2, ExternalLink, Image, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface CustomBook {
  session_type: string;
  book_title: string;
  amazon_link: string;
}

interface BookSubmission {
  id: string;
  centre_id: string;
  centre_name: string;
  submission_type: 'photo' | 'custom_books';
  photo_url: string | null;
  custom_books: CustomBook[] | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  submitted_at: string;
}

const SESSION_TYPES = ['Art', 'Music', 'Movement', 'Sensory'] as const;

export default function AdminBookReviews() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<BookSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // Rejection dialog state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('book_submissions')
      .select('*, centres(name)')
      .eq('month', 'february_2026')
      .order('submitted_at', { ascending: false });

    if (!error && data) {
      const mapped = data.map((item) => ({
        id: item.id,
        centre_id: item.centre_id,
        centre_name: (item.centres as { name: string } | null)?.name || 'Unknown Centre',
        submission_type: item.submission_type as 'photo' | 'custom_books',
        photo_url: item.photo_url,
        custom_books: Array.isArray(item.custom_books) ? (item.custom_books as unknown as CustomBook[]) : null,
        status: item.status as 'pending' | 'approved' | 'rejected',
        rejection_reason: item.rejection_reason,
        submitted_at: item.submitted_at,
      }));
      setSubmissions(mapped);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    setProcessing(id);
    const { error } = await supabase
      .from('book_submissions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve submission.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Approved! ✅',
        description: 'Book submission has been approved.',
      });
      fetchSubmissions();
    }
    setProcessing(null);
  };

  const handleReject = async () => {
    if (!rejectingId) return;

    setProcessing(rejectingId);
    const { error } = await supabase
      .from('book_submissions')
      .update({
        status: 'rejected',
        rejection_reason: rejectionReason.trim() || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', rejectingId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject submission.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Rejected',
        description: 'Book submission has been rejected.',
      });
      fetchSubmissions();
    }
    setProcessing(null);
    setRejectingId(null);
    setRejectionReason('');
  };

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const reviewedSubmissions = submissions.filter((s) => s.status !== 'pending');

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Reviews */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          Pending Reviews ({pendingSubmissions.length})
        </h3>
        
        {pendingSubmissions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Check className="w-12 h-12 text-[hsl(var(--success))] mx-auto mb-4" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm text-muted-foreground">No pending book submissions to review.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingSubmissions.map((sub) => (
              <Card key={sub.id} className="border-amber-500/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{sub.centre_name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {sub.submission_type === 'photo' ? (
                          <>
                            <Image className="w-4 h-4" />
                            Photo submission
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4" />
                            Custom books list
                          </>
                        )}
                        <span>•</span>
                        {new Date(sub.submitted_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {sub.submission_type === 'photo' && sub.photo_url && (
                    <a href={sub.photo_url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={sub.photo_url}
                        alt="Books photo"
                        className="w-full max-w-md rounded-lg border hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    </a>
                  )}

                  {sub.submission_type === 'custom_books' && sub.custom_books && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SESSION_TYPES.map((type) => {
                        const typeBooks = sub.custom_books!.filter((b) => b.session_type === type);
                        return (
                          <div key={type} className="p-3 bg-muted rounded-lg">
                            <h4 className="font-medium text-sm mb-2">{type}</h4>
                            <div className="space-y-1">
                              {typeBooks.map((book, i) => (
                                <a
                                  key={i}
                                  href={book.amazon_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {book.book_title}
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleApprove(sub.id)}
                      disabled={processing === sub.id}
                      className="flex-1"
                    >
                      {processing === sub.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setRejectingId(sub.id)}
                      disabled={processing === sub.id}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reviewed Submissions */}
      {reviewedSubmissions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Previously Reviewed</h3>
          <div className="space-y-3">
            {reviewedSubmissions.map((sub) => (
              <Card
                key={sub.id}
                className={cn(
                  sub.status === 'approved' && 'border-[hsl(var(--success))]/30',
                  sub.status === 'rejected' && 'border-destructive/30'
                )}
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{sub.centre_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {sub.submission_type === 'photo' ? 'Photo' : 'Custom books'} •{' '}
                        {new Date(sub.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-1 rounded-full',
                        sub.status === 'approved' && 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]',
                        sub.status === 'rejected' && 'bg-destructive/10 text-destructive'
                      )}
                    >
                      {sub.status === 'approved' ? 'Approved ✅' : 'Rejected ❌'}
                    </span>
                  </div>
                  {sub.status === 'rejected' && sub.rejection_reason && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      Reason: {sub.rejection_reason}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Dialog */}
      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason for rejection (optional)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!!processing}>
              {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
