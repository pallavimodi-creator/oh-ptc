import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, subDays, getDay } from 'date-fns';
import { ArrowLeft, Check, X, Loader2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const TASK_CODES = ['PREVIEW', 'CLUB_MOMENT', 'WEEKLY_PLAN'] as const;
const TASK_NAMES: Record<string, string> = {
  PREVIEW: 'Session Preview',
  CLUB_MOMENT: 'Club Moment',
  WEEKLY_PLAN: 'Weekly Plan',
};

interface Completion {
  id: string;
  date: string;
  task_code: string;
  completed_at: string;
  primary_teacher_name: string;
  optional_note: string | null;
}

export default function CentreComplianceView() {
  const { centreId } = useParams<{ centreId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [centre, setCentre] = useState<{ id: string; name: string } | null>(null);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const last7Days = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => subDays(today, i));
  }, []);

  useEffect(() => {
    if (!centreId) return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch centre
      const { data: centreData } = await supabase
        .from('centres')
        .select('id, name')
        .eq('id', centreId)
        .maybeSingle();

      setCentre(centreData);

      // Fetch completions for last 7 days
      const startDate = format(subDays(today, 7), 'yyyy-MM-dd');
      const endDate = format(today, 'yyyy-MM-dd');

      const { data: completionData } = await supabase
        .from('wa_task_completions')
        .select('*')
        .eq('centre_id', centreId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      setCompletions((completionData as Completion[]) || []);
      setLoading(false);
    };

    fetchData();
  }, [centreId]);

  const getCompletion = (date: Date, taskCode: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return completions.find((c) => c.date === dateStr && c.task_code === taskCode);
  };

  const shouldShowTask = (date: Date, taskCode: string) => {
    if (taskCode === 'WEEKLY_PLAN') {
      return getDay(date) === 5; // Friday only
    }
    return true;
  };

  const copyNudgeMessage = (taskName: string) => {
    const message = `Reminder: Please complete "${taskName}" and mark DONE in the compliance tracker once posted on WhatsApp. Primary Teacher name is required.`;
    navigator.clipboard.writeText(message);
    toast({
      title: 'Copied!',
      description: 'Nudge message copied to clipboard.',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!centre) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Centre not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{centre.name}</h1>
            <p className="text-sm text-muted-foreground">Compliance Overview</p>
          </div>
        </div>
      </div>

      {/* Today's Status */}
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today's Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TASK_CODES.filter((code) => shouldShowTask(today, code)).map((taskCode) => {
                const completion = getCompletion(today, taskCode);
                const isDone = !!completion;

                return (
                  <div
                    key={taskCode}
                    className={cn(
                      'p-3 rounded-lg',
                      isDone
                        ? 'bg-green-50 dark:bg-green-950/30'
                        : 'bg-red-50 dark:bg-red-950/30'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{TASK_NAMES[taskCode]}</span>
                      {isDone ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    {isDone ? (
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>✅ {format(new Date(completion.completed_at), 'HH:mm')}</p>
                        <p>👤 {completion.primary_teacher_name}</p>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => copyNudgeMessage(TASK_NAMES[taskCode])}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Nudge
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last 7 Days Table */}
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Club Moment</TableHead>
                  <TableHead>Weekly Plan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {last7Days.map((date) => {
                  const isFriday = getDay(date) === 5;

                  return (
                    <TableRow key={date.toISOString()}>
                      <TableCell className="font-medium">
                        {format(date, 'EEE, MMM d')}
                      </TableCell>
                      {TASK_CODES.map((taskCode) => {
                        const show = shouldShowTask(date, taskCode);
                        if (!show) {
                          return (
                            <TableCell key={taskCode} className="text-muted-foreground">
                              —
                            </TableCell>
                          );
                        }

                        const completion = getCompletion(date, taskCode);
                        return (
                          <TableCell key={taskCode}>
                            {completion ? (
                              <div className="flex items-center gap-1">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(completion.completed_at), 'HH:mm')}
                                </span>
                              </div>
                            ) : (
                              <X className="w-4 h-4 text-red-500" />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
