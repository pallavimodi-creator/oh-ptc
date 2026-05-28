import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Pencil, Loader2, Users, Building2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface Centre {
  id: string;
  name: string;
}

interface StaffMember {
  id: string;
  full_name: string;
  role: 'admin' | 'cd' | 'educator' | 'centre';
  centre_id: string | null;
  is_active: boolean;
  centre_name?: string;
}

export default function AdminSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [centres, setCentres] = useState<Centre[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Centre form state
  const [centreDialogOpen, setCentreDialogOpen] = useState(false);
  const [editingCentre, setEditingCentre] = useState<Centre | null>(null);
  const [centreName, setCentreName] = useState('');
  const [savingCentre, setSavingCentre] = useState(false);

  // Staff form state
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [staffForm, setStaffForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'educator' as 'admin' | 'cd' | 'educator' | 'centre',
    centre_id: '',
    is_active: true,
  });
  const [savingStaff, setSavingStaff] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Fetch centres
    const { data: centresData } = await supabase
      .from('centres')
      .select('id, name')
      .order('name');

    setCentres(centresData || []);

    // Fetch staff profiles
    const { data: staffData } = await supabase
      .from('staff_profiles')
      .select('*')
      .order('full_name');

    // Map centre names
    const centreMap = Object.fromEntries((centresData || []).map((c) => [c.id, c.name]));
    const enrichedStaff = (staffData || []).map((s: StaffMember) => ({
      ...s,
      centre_name: s.centre_id ? centreMap[s.centre_id] : undefined,
    }));

    setStaff(enrichedStaff);
    setLoading(false);
  };

  // Centre handlers
  const openCentreDialog = (centre?: Centre) => {
    if (centre) {
      setEditingCentre(centre);
      setCentreName(centre.name);
    } else {
      setEditingCentre(null);
      setCentreName('');
    }
    setCentreDialogOpen(true);
  };

  const saveCentre = async () => {
    if (!centreName.trim()) {
      toast({ title: 'Error', description: 'Centre name is required.', variant: 'destructive' });
      return;
    }

    setSavingCentre(true);

    if (editingCentre) {
      const { error } = await supabase
        .from('centres')
        .update({ name: centreName.trim() })
        .eq('id', editingCentre.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Centre updated.' });
        setCentreDialogOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from('centres').insert({ name: centreName.trim() });

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Centre added.' });
        setCentreDialogOpen(false);
        fetchData();
      }
    }

    setSavingCentre(false);
  };

  // Staff handlers
  const openStaffDialog = (member?: StaffMember) => {
    if (member) {
      setEditingStaff(member);
      setStaffForm({
        full_name: member.full_name,
        email: '',
        password: '',
        role: member.role,
        centre_id: member.centre_id || '',
        is_active: member.is_active,
      });
    } else {
      setEditingStaff(null);
      setStaffForm({
        full_name: '',
        email: '',
        password: '',
        role: 'educator',
        centre_id: '',
        is_active: true,
      });
    }
    setStaffDialogOpen(true);
  };

  const saveStaff = async () => {
    if (!staffForm.full_name.trim()) {
      toast({ title: 'Error', description: 'Full name is required.', variant: 'destructive' });
      return;
    }

    setSavingStaff(true);

    if (editingStaff) {
      // Update existing staff
      const { error } = await supabase
        .from('staff_profiles')
        .update({
          full_name: staffForm.full_name.trim(),
          role: staffForm.role,
          centre_id: staffForm.centre_id || null,
          is_active: staffForm.is_active,
        })
        .eq('id', editingStaff.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Staff member updated.' });
        setStaffDialogOpen(false);
        fetchData();
      }
    } else {
      // Create new user + profile
      if (!staffForm.email.trim() || !staffForm.password.trim()) {
        toast({ title: 'Error', description: 'Email and password are required for new staff.', variant: 'destructive' });
        setSavingStaff(false);
        return;
      }

      // Note: Creating users requires admin privileges or an edge function
      // For now, show a message about manual creation
      toast({
        title: 'Manual Step Required',
        description: 'Please create the user in Supabase Auth first, then add their profile here.',
        variant: 'default',
      });
    }

    setSavingStaff(false);
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
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Admin Settings</h1>
        </div>
      </div>

      <Tabs defaultValue="staff" className="p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff">
            <Users className="w-4 h-4 mr-2" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="centres">
            <Building2 className="w-4 h-4 mr-2" />
            Centres
          </TabsTrigger>
        </TabsList>

        {/* Staff Tab */}
        <TabsContent value="staff" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Staff Members</CardTitle>
              <Button size="sm" onClick={() => openStaffDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Centre</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.full_name}</TableCell>
                      <TableCell>
                        <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.centre_name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={member.is_active ? 'default' : 'outline'}>
                          {member.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => openStaffDialog(member)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Centres Tab */}
        <TabsContent value="centres" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Centres</CardTitle>
              <Button size="sm" onClick={() => openCentreDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Centre
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {centres.map((centre) => (
                    <TableRow key={centre.id}>
                      <TableCell className="font-medium">{centre.name}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => openCentreDialog(centre)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Centre Dialog */}
      <Dialog open={centreDialogOpen} onOpenChange={setCentreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCentre ? 'Edit Centre' : 'Add Centre'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Centre Name</Label>
              <Input
                value={centreName}
                onChange={(e) => setCentreName(e.target.value)}
                placeholder="Enter centre name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCentreDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCentre} disabled={savingCentre}>
              {savingCentre ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Staff Dialog */}
      <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={staffForm.full_name}
                onChange={(e) => setStaffForm({ ...staffForm, full_name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>

            {!editingStaff && (
              <>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={staffForm.role}
                onValueChange={(v) => setStaffForm({ ...staffForm, role: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="educator">Educator</SelectItem>
                  <SelectItem value="cd">CD</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Centre</Label>
              <Select
                value={staffForm.centre_id}
                onValueChange={(v) => setStaffForm({ ...staffForm, centre_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select centre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Centre</SelectItem>
                  {centres.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={staffForm.is_active}
                onCheckedChange={(v) => setStaffForm({ ...staffForm, is_active: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStaffDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveStaff} disabled={savingStaff}>
              {savingStaff ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
