import { useState } from 'react';
import { format, getDay } from 'date-fns';
import { Check, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useWATasks } from '@/hooks/useWATasks';
import { useStaffProfile } from '@/hooks/useStaffProfile';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function StaffChecklist() {
  const { profile } = useAuth();
  const { staffProfile, loading: profileLoading } = useStaffProfile();
  const { taskDefinitions, loading, getTaskStatus, markTaskComplete } = useWATasks();
  const { toast } = useToast();

  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [primaryTeacher, setPrimaryTeacher] = useState('');
  const [optionalNote, setOptionalNote] = useState('');
  const [optionalLink, setOptionalLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  const isFriday = getDay(today) === 5;
  const currentHour = today.getHours();

  // Filter tasks for today
  const todaysTasks = taskDefinitions.filter((task) => {
    if (task.task_code === 'WEEKLY_PLAN') {
      return isFriday;
    }
    return true;
  });

  const getPendingReminder = (taskCode: string) => {
    const status = getTaskStatus(taskCode);
    if (status) return null;

    if (taskCode === 'CLUB_MOMENT' && currentHour >= 17) {
      return 'Club Moment is pending! Please complete and mark as done.';
    }
    if (taskCode === 'WEEKLY_PLAN' && isFriday && currentHour >= 13) {
      return 'Club Pick of the Week is pending! Please complete and mark as done.';
    }
    if (taskCode === 'PREVIEW') {
      return 'Session Preview pending. Complete for all sessions today.';
    }
    return null;
  };

  const handleMarkDone = (taskCode: string) => {
    setSelectedTask(taskCode);
    setPrimaryTeacher('');
    setOptionalNote('');
    setOptionalLink('');
  };

  const handleSubmit = async () => {
    if (!selectedTask || !primaryTeacher.trim()) {
      toast({
        title: 'Required Field',
        description: 'Primary Teacher Name is required.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await markTaskComplete(
        selectedTask,
        primaryTeacher.trim(),
        optionalNote.trim() || undefined,
        optionalLink.trim() || undefined
      );
      toast({
        title: 'Task Completed ✅',
        description: 'Successfully marked as done.',
      });
      setSelectedTask(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to mark task as complete.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!staffProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground">
              Your staff profile has not been set up yet. Please contact an administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-4">
        <h1 className="text-xl font-bold">Checklist</h1>
        <p className="text-sm text-muted-foreground">
          {format(today, 'EEEE, MMMM d, yyyy')} • {profile?.centreName || 'Your Centre'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="font-medium">Daily:</span> Session Preview, Club Moment of the Day
          {' • '}
          <span className="font-medium">Weekly:</span> Club Pick of the Week
        </p>
      </div>

      {/* Helper text */}
      <div className="px-4 py-3 bg-muted/50 border-b">
        <p className="text-xs text-muted-foreground">
          💡 Tick each task only after it is completed for <strong>all sessions</strong> you ran today.
        </p>
      </div>

      {/* Tasks */}
      <div className="p-4 space-y-4">
        {todaysTasks.map((task) => {
          const completion = getTaskStatus(task.task_code);
          const reminder = getPendingReminder(task.task_code);
          const isCompleted = !!completion;

          return (
            <Card
              key={task.id}
              className={cn(
                'transition-all',
                isCompleted && 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      {isCompleted && <Check className="w-5 h-5 text-green-600" />}
                      {task.task_name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{task.due_rule}</p>
                  </div>
                  {isCompleted && (
                    <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded">
                      DONE ✅
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                {isCompleted ? (
                  <div className="text-xs space-y-1 bg-green-100/50 dark:bg-green-900/30 p-3 rounded-lg">
                    <p>
                      <span className="font-medium">Primary Teacher:</span> {completion.primary_teacher_name}
                    </p>
                    <p>
                      <span className="font-medium">Completed at:</span>{' '}
                      {format(new Date(completion.completed_at), 'HH:mm')}
                    </p>
                    {completion.optional_note && (
                      <p>
                        <span className="font-medium">Note:</span> {completion.optional_note}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    {reminder && (
                      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg mb-3">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">{reminder}</span>
                      </div>
                    )}
                    <Button
                      onClick={() => handleMarkDone(task.task_code)}
                      className="w-full h-12 text-base font-semibold"
                      size="lg"
                    >
                      MARK AS DONE
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mark as Done Modal */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Task Complete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="primaryTeacher">
                Primary Teacher Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="primaryTeacher"
                placeholder="Enter primary teacher name"
                value={primaryTeacher}
                onChange={(e) => setPrimaryTeacher(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="optionalNote">Note / Caption (optional)</Label>
              <Textarea
                id="optionalNote"
                placeholder="Add any context or caption"
                value={optionalNote}
                onChange={(e) => setOptionalNote(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="optionalLink">Proof Link (optional)</Label>
              <Input
                id="optionalLink"
                placeholder="https://..."
                value={optionalLink}
                onChange={(e) => setOptionalLink(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTask(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
