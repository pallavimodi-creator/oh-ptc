import { useState, useMemo } from 'react';
import { format, getDay, subDays } from 'date-fns';
import { Check, X, Copy, Eye, AlertTriangle, Loader2, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useAllCentresTasks, useCompletionHistory } from '@/hooks/useWATasks';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

const TASK_CODES = ['PREVIEW', 'CLUB_MOMENT', 'WEEKLY_PLAN'] as const;
const TASK_NAMES: Record<string, string> = {
  PREVIEW: 'Session Preview',
  CLUB_MOMENT: 'Club Moment',
  WEEKLY_PLAN: 'Weekly Plan',
};

export default function ComplianceDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const { centres, centreCompletions, loading } = useAllCentresTasks(selectedDate);

  const isFriday = getDay(selectedDate) === 5;
  const tasksForDay = isFriday ? TASK_CODES : TASK_CODES.filter((t) => t !== 'WEEKLY_PLAN');

  // Build exceptions list
  const exceptions = useMemo(() => {
    const list: { centreId: string; centreName: string; taskCode: string; taskName: string }[] = [];

    centres.forEach((centre) => {
      const completions = centreCompletions[centre.id] || [];
      tasksForDay.forEach((taskCode) => {
        const done = completions.some((c) => c.task_code === taskCode);
        if (!done) {
          list.push({
            centreId: centre.id,
            centreName: centre.name,
            taskCode,
            taskName: TASK_NAMES[taskCode],
          });
        }
      });
    });

    return list;
  }, [centres, centreCompletions, tasksForDay]);

  const copyAllExceptions = () => {
    if (exceptions.length === 0) return;

    // Group exceptions by centre
    const grouped: Record<string, string[]> = {};
    exceptions.forEach((exc) => {
      if (!grouped[exc.centreName]) {
        grouped[exc.centreName] = [];
      }
      grouped[exc.centreName].push(exc.taskName);
    });

    // Build message
    const dateStr = format(selectedDate, 'EEEE, MMM d');
    let message = `📋 Pending Tasks - ${dateStr}\n\n`;
    Object.entries(grouped).forEach(([centreName, tasks]) => {
      message += `🔴 ${centreName}\n`;
      tasks.forEach((task) => {
        message += `   • ${task}\n`;
      });
      message += '\n';
    });
    message += `Please complete and mark DONE in the app. Primary Teacher name required.`;

    navigator.clipboard.writeText(message);
    toast({
      title: 'Copied!',
      description: `${exceptions.length} pending tasks copied to clipboard.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-4">
        <h1 className="text-xl font-bold">Compliance Dashboard</h1>
        <div className="flex items-center gap-2 mt-2">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                {format(selectedDate, 'MMM d, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setDatePickerOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="status" className="p-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="exceptions" className="relative">
            Exceptions
            {exceptions.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {exceptions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Status Tab */}
        <TabsContent value="status" className="mt-4 space-y-3">
          {/* Nudge Button - only show when there are pending tasks */}
          {exceptions.length > 0 && (
            <Button onClick={copyAllExceptions} variant="outline" className="w-full gap-2">
              <Copy className="w-4 h-4" />
              Copy Nudge Message ({exceptions.length} pending)
            </Button>
          )}

          {centres.map((centre) => {
            const completions = centreCompletions[centre.id] || [];

            return (
              <Card key={centre.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{centre.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {tasksForDay.map((taskCode) => {
                      const completion = completions.find((c) => c.task_code === taskCode);
                      const isDone = !!completion;

                      return (
                        <div
                          key={taskCode}
                          className={cn(
                            'flex items-center gap-2 p-2 rounded-lg text-sm',
                            isDone
                              ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                              : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                          )}
                        >
                          {isDone ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{TASK_NAMES[taskCode]}</p>
                            {isDone && (
                              <p className="text-xs opacity-75 truncate">
                                {format(new Date(completion.completed_at), 'HH:mm')} •{' '}
                                {completion.primary_teacher_name}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => navigate(`/compliance/centre/${centre.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Centre
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Exceptions Tab */}
        <TabsContent value="exceptions" className="mt-4">
          {exceptions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="font-medium">All tasks completed!</p>
                <p className="text-sm text-muted-foreground">No missing items for today.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Copy All Button */}
              <Button onClick={copyAllExceptions} className="w-full gap-2">
                <Copy className="w-4 h-4" />
                Copy All Pending ({exceptions.length})
              </Button>

              {/* Grouped by Centre */}
              {(() => {
                const grouped: Record<string, typeof exceptions> = {};
                exceptions.forEach((exc) => {
                  if (!grouped[exc.centreName]) {
                    grouped[exc.centreName] = [];
                  }
                  grouped[exc.centreName].push(exc);
                });

                return Object.entries(grouped).map(([centreName, centreExceptions]) => (
                  <Card key={centreName}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          {centreName}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/compliance/centre/${centreExceptions[0].centreId}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {centreExceptions.map((exc) => (
                          <span
                            key={exc.taskCode}
                            className="text-sm bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 px-2 py-1 rounded"
                          >
                            {exc.taskName}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ));
              })()}
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          <HistorySection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HistorySection() {
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedCentre, setSelectedCentre] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<string>('all');
  const [centres, setCentres] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    supabase
      .from('centres')
      .select('id, name')
      .order('name')
      .then(({ data }) => setCentres(data || []));
  }, []);

  const { completions, loading } = useCompletionHistory({
    startDate,
    endDate,
    centreId: selectedCentre === 'all' ? undefined : selectedCentre,
    taskCode: selectedTask === 'all' ? undefined : selectedTask,
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="justify-start">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {startDate ? format(startDate, 'MMM d') : 'Start'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="justify-start">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {endDate ? format(endDate, 'MMM d') : 'End'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
          </PopoverContent>
        </Popover>

        <Select value={selectedCentre} onValueChange={setSelectedCentre}>
          <SelectTrigger>
            <SelectValue placeholder="Centre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Centres</SelectItem>
            {centres.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTask} onValueChange={setSelectedTask}>
          <SelectTrigger>
            <SelectValue placeholder="Task" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            {TASK_CODES.map((code) => (
              <SelectItem key={code} value={code}>
                {TASK_NAMES[code]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Primary Teacher</TableHead>
                <TableHead className="hidden md:table-cell">Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No completions found for the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                completions.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{format(new Date(c.date), 'MMM d')}</TableCell>
                    <TableCell>{c.centre_name}</TableCell>
                    <TableCell>{TASK_NAMES[c.task_code]}</TableCell>
                    <TableCell>{format(new Date(c.completed_at), 'HH:mm')}</TableCell>
                    <TableCell>{c.primary_teacher_name}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                      {c.optional_note || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
