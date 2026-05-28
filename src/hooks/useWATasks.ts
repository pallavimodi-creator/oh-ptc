import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useStaffProfile } from './useStaffProfile';

export interface TaskDefinition {
  id: string;
  task_code: string;
  task_name: string;
  description: string;
  due_rule: string;
  active: boolean;
}

export interface TaskCompletion {
  id: string;
  date: string;
  centre_id: string;
  task_code: string;
  completed_by_user_id: string;
  completed_at: string;
  primary_teacher_name: string;
  optional_note: string | null;
  optional_proof_link: string | null;
}

export function useWATasks(date?: Date, centreId?: string) {
  const { staffProfile, loading: profileLoading } = useStaffProfile();
  const [taskDefinitions, setTaskDefinitions] = useState<TaskDefinition[]>([]);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  // Important: avoid `new Date()` on every render (it breaks memoization/deps and can cause infinite refetch loops)
  const targetDate = useMemo(() => date || new Date(), [date?.getTime()]);
  const targetCentreId = centreId || staffProfile?.centre_id;

  const fetchData = useCallback(async () => {
    try {
      // Fetch task definitions
      const { data: definitions, error: definitionsError } = await supabase
        .from('wa_task_definitions')
        .select('*')
        .eq('active', true);

      if (definitionsError) throw definitionsError;
      setTaskDefinitions((definitions as TaskDefinition[]) || []);

      // Fetch completions for the date and centre
      if (targetCentreId) {
        const dateStr = format(targetDate, 'yyyy-MM-dd');
        const { data: completionData, error: completionError } = await supabase
          .from('wa_task_completions')
          .select('*')
          .eq('date', dateStr)
          .eq('centre_id', targetCentreId);

        if (completionError) throw completionError;
        setCompletions((completionData as TaskCompletion[]) || []);
      }
    } catch (e) {
      console.error('useWATasks: fetch failed', e);
    } finally {
      setLoading(false);
    }
  }, [targetDate, targetCentreId]);

  useEffect(() => {
    // Wait for profile to load before fetching
    if (profileLoading) {
      return;
    }
    setLoading(true);
    fetchData();
  }, [fetchData, profileLoading]);

  const markTaskComplete = async (
    taskCode: string,
    primaryTeacherName: string,
    optionalNote?: string,
    optionalProofLink?: string
  ) => {
    if (!targetCentreId || !staffProfile) {
      throw new Error('No centre or profile found');
    }

    const dateStr = format(targetDate, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('wa_task_completions')
      .insert({
        date: dateStr,
        centre_id: targetCentreId,
        task_code: taskCode,
        completed_by_user_id: staffProfile.id,
        primary_teacher_name: primaryTeacherName,
        optional_note: optionalNote || null,
        optional_proof_link: optionalProofLink || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Refresh completions
    await fetchData();
    return data;
  };

  const getTaskStatus = (taskCode: string) => {
    return completions.find((c) => c.task_code === taskCode);
  };

  return {
    taskDefinitions,
    completions,
    loading,
    markTaskComplete,
    getTaskStatus,
    refetch: fetchData,
  };
}

export function useAllCentresTasks(date?: Date) {
  const [centreCompletions, setCentreCompletions] = useState<Record<string, TaskCompletion[]>>({});
  const [centres, setCentres] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const targetDate = date || new Date();

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Fetch all centres
    const { data: centresData } = await supabase
      .from('centres')
      .select('id, name')
      .order('name');

    setCentres(centresData || []);

    // Fetch all completions for the date
    const dateStr = format(targetDate, 'yyyy-MM-dd');
    const { data: completionsData } = await supabase
      .from('wa_task_completions')
      .select('*')
      .eq('date', dateStr);

    // Group by centre
    const grouped: Record<string, TaskCompletion[]> = {};
    (completionsData as TaskCompletion[] || []).forEach((c) => {
      if (!grouped[c.centre_id]) {
        grouped[c.centre_id] = [];
      }
      grouped[c.centre_id].push(c);
    });

    setCentreCompletions(grouped);
    setLoading(false);
  }, [targetDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { centres, centreCompletions, loading, refetch: fetchData };
}

export function useCompletionHistory(filters: {
  startDate?: Date;
  endDate?: Date;
  centreId?: string;
  taskCode?: string;
}) {
  const [completions, setCompletions] = useState<(TaskCompletion & { centre_name?: string; completed_by_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from('wa_task_completions')
      .select('*')
      .order('date', { ascending: false })
      .order('completed_at', { ascending: false });

    if (filters.startDate) {
      query = query.gte('date', format(filters.startDate, 'yyyy-MM-dd'));
    }
    if (filters.endDate) {
      query = query.lte('date', format(filters.endDate, 'yyyy-MM-dd'));
    }
    if (filters.centreId) {
      query = query.eq('centre_id', filters.centreId);
    }
    if (filters.taskCode) {
      query = query.eq('task_code', filters.taskCode);
    }

    const { data } = await query.limit(100);

    // Fetch centre names
    const { data: centres } = await supabase.from('centres').select('id, name');
    const centreMap = Object.fromEntries((centres || []).map((c) => [c.id, c.name]));

    // Fetch staff names
    const { data: staff } = await supabase.from('staff_profiles').select('id, full_name');
    const staffMap = Object.fromEntries((staff || []).map((s) => [s.id, s.full_name]));

    const enriched = (data || []).map((c: TaskCompletion) => ({
      ...c,
      centre_name: centreMap[c.centre_id] || 'Unknown',
      completed_by_name: staffMap[c.completed_by_user_id] || 'Unknown',
    }));

    setCompletions(enriched);
    setLoading(false);
  }, [filters.startDate, filters.endDate, filters.centreId, filters.taskCode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { completions, loading, refetch: fetchData };
}
