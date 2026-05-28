import { useState, useEffect } from 'react';
import { Check, Upload, BookOpen, Loader2, ExternalLink, AlertCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import type { Json } from '@/integrations/supabase/types';

interface BookSubmission {
  id: string;
  submission_type: 'photo' | 'custom_books';
  photo_url: string | null;
  custom_books: CustomBook[] | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  submitted_at: string;
}

interface CustomBook {
  session_type: string;
  book_title: string;
  amazon_link: string;
}

const SESSION_TYPES = ['Art', 'Music', 'Movement', 'Sensory'] as const;

export default function BookSubmissionSection() {
  const { profile, user } = useAuth();
  const { toast } = useToast();

  const [submission, setSubmission] = useState<BookSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [hasRecommendedBooks, setHasRecommendedBooks] = useState<boolean | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [customBooks, setCustomBooks] = useState<Record<string, { book1: string; book2: string; link1: string; link2: string }>>({
    Art: { book1: '', book2: '', link1: '', link2: '' },
    Music: { book1: '', book2: '', link1: '', link2: '' },
    Movement: { book1: '', book2: '', link1: '', link2: '' },
    Sensory: { book1: '', book2: '', link1: '', link2: '' },
  });

  useEffect(() => {
    if (profile?.centreId) {
      fetchSubmission();
    } else {
      setLoading(false);
    }
  }, [profile?.centreId]);

  const fetchSubmission = async () => {
    if (!profile?.centreId) return;

    const { data, error } = await supabase
      .from('book_submissions')
      .select('*')
      .eq('centre_id', profile.centreId)
      .eq('month', 'february_2026')
      .maybeSingle();

    if (!error && data) {
      setSubmission({
        id: data.id,
        submission_type: data.submission_type as 'photo' | 'custom_books',
        photo_url: data.photo_url,
        custom_books: Array.isArray(data.custom_books) ? (data.custom_books as unknown as CustomBook[]) : null,
        status: data.status as 'pending' | 'approved' | 'rejected',
        rejection_reason: data.rejection_reason,
        submitted_at: data.submitted_at,
      });
    }
    setLoading(false);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmitPhoto = async () => {
    if (!photoFile || !profile?.centreId || !user?.id) return;

    setSubmitting(true);
    try {
      // Upload to storage
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${user.id}/${profile.centreId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('book-photos')
        .upload(fileName, photoFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('book-photos')
        .getPublicUrl(fileName);

      // Create submission
      const { error: insertError } = await supabase
        .from('book_submissions')
        .insert([{
          centre_id: profile.centreId,
          submission_type: 'photo',
          photo_url: urlData.publicUrl,
          submitted_by: user.id,
          month: 'february_2026',
        }]);

      if (insertError) throw insertError;

      toast({
        title: 'Submitted! ✅',
        description: 'Your book photo has been submitted for review.',
      });

      fetchSubmission();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit photo.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitCustomBooks = async () => {
    if (!profile?.centreId || !user?.id) return;

    // Validate all fields
    const books: CustomBook[] = [];
    for (const type of SESSION_TYPES) {
      const entry = customBooks[type];
      if (!entry.book1.trim() || !entry.book2.trim() || !entry.link1.trim() || !entry.link2.trim()) {
        toast({
          title: 'Missing Information',
          description: `Please fill in all book details for ${type}.`,
          variant: 'destructive',
        });
        return;
      }
      books.push({ session_type: type, book_title: entry.book1.trim(), amazon_link: entry.link1.trim() });
      books.push({ session_type: type, book_title: entry.book2.trim(), amazon_link: entry.link2.trim() });
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('book_submissions')
        .insert([{
          centre_id: profile.centreId,
          submission_type: 'custom_books',
          custom_books: JSON.parse(JSON.stringify(books)) as Json,
          submitted_by: user.id,
          month: 'february_2026',
        }]);

      if (error) throw error;

      toast({
        title: 'Submitted! ✅',
        description: 'Your book list has been submitted for approval.',
      });

      fetchSubmission();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit book list.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateCustomBook = (type: string, field: 'book1' | 'book2' | 'link1' | 'link2', value: string) => {
    setCustomBooks((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // If submission exists, show status
  if (submission) {
    return (
      <Card className={cn(
        'border-2',
        submission.status === 'approved' && 'border-[hsl(var(--success))] bg-[hsl(var(--success))]/5',
        submission.status === 'pending' && 'border-amber-500 bg-amber-50 dark:bg-amber-950/20',
        submission.status === 'rejected' && 'border-destructive bg-destructive/5'
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {submission.status === 'approved' && <Check className="w-5 h-5 text-[hsl(var(--success))]" />}
            {submission.status === 'pending' && <Clock className="w-5 h-5 text-amber-600" />}
            {submission.status === 'rejected' && <XCircle className="w-5 h-5 text-destructive" />}
            Book Confirmation
          </CardTitle>
          <CardDescription>
            {submission.status === 'approved' && 'Your submission has been approved! ✅'}
            {submission.status === 'pending' && 'Your submission is pending review.'}
            {submission.status === 'rejected' && 'Your submission was not approved.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submission.submission_type === 'photo' && submission.photo_url && (
            <div className="space-y-3">
              <img
                src={submission.photo_url}
                alt="Books photo"
                className="w-full max-w-md rounded-lg border"
              />
            </div>
          )}

          {submission.submission_type === 'custom_books' && submission.custom_books && (
            <div className="space-y-3">
              {SESSION_TYPES.map((type) => {
                const typeBooks = submission.custom_books!.filter((b) => b.session_type === type);
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

          {submission.status === 'rejected' && submission.rejection_reason && (
            <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive font-medium">Feedback:</p>
              <p className="text-sm text-muted-foreground">{submission.rejection_reason}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            Submitted on {new Date(submission.submitted_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    );
  }

  // No submission yet - show form
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Book Confirmation
        </CardTitle>
        <CardDescription>
          Confirm that you have the recommended books ready for your sessions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasRecommendedBooks === null ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              I have reviewed all the recommended books, have them available, and want to use them for my sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setHasRecommendedBooks(true)}
                variant="outline"
                className="flex-1 h-12"
              >
                <Check className="w-4 h-4 mr-2" />
                Yes, I have them
              </Button>
              <Button
                onClick={() => setHasRecommendedBooks(false)}
                variant="outline"
                className="flex-1 h-12"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                No, I'll use my own
              </Button>
            </div>
          </div>
        ) : hasRecommendedBooks ? (
          // Photo upload flow
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                📸 Please upload a photo of your books placed at the session location.
              </p>
            </div>

            {photoPreview ? (
              <div className="space-y-3">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full max-w-md rounded-lg border"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                  >
                    Change Photo
                  </Button>
                  <Button onClick={handleSubmitPhoto} disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Submit for Review
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to select a photo
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Max 5MB
                    </p>
                  </div>
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHasRecommendedBooks(null)}
            >
              ← Go back
            </Button>
          </div>
        ) : (
          // Custom books form
          <div className="space-y-6">
            <div className="p-3 bg-muted rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                Please enter 2 books for each session type with their Amazon links. These will be reviewed for approval.
              </p>
            </div>

            {SESSION_TYPES.map((type) => (
              <div key={type} className="space-y-3">
                <h4 className="font-semibold text-sm">{type} Session</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Book 1 Title</Label>
                    <Input
                      placeholder="Enter book title"
                      value={customBooks[type].book1}
                      onChange={(e) => updateCustomBook(type, 'book1', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Book 1 Amazon Link</Label>
                    <Input
                      placeholder="https://amazon.in/..."
                      value={customBooks[type].link1}
                      onChange={(e) => updateCustomBook(type, 'link1', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Book 2 Title</Label>
                    <Input
                      placeholder="Enter book title"
                      value={customBooks[type].book2}
                      onChange={(e) => updateCustomBook(type, 'book2', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Book 2 Amazon Link</Label>
                    <Input
                      placeholder="https://amazon.in/..."
                      value={customBooks[type].link2}
                      onChange={(e) => updateCustomBook(type, 'link2', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setHasRecommendedBooks(null)}
              >
                ← Go back
              </Button>
              <Button onClick={handleSubmitCustomBooks} disabled={submitting} className="flex-1">
                {submitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Submit for Approval
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
