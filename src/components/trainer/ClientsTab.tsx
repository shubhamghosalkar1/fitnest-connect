import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, UserPlus } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  age: string | null;
  gender: string | null;
  goals: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

const emptyForm = { name: "", email: "", phone: "", age: "", gender: "", goals: "", notes: "" };

const ClientsTab = ({ trainerId }: { trainerId: string }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchClients = async () => {
    const { data } = await supabase.from("clients").select("*").eq("trainer_id", trainerId).order("created_at", { ascending: false });
    if (data) setClients(data as Client[]);
  };

  useEffect(() => { fetchClients(); }, [trainerId]);

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    setLoading(true);
    const payload = { ...form, trainer_id: trainerId };
    if (editId) {
      await supabase.from("clients").update(payload).eq("id", editId);
      toast({ title: "Client updated" });
    } else {
      await supabase.from("clients").insert(payload);
      toast({ title: "Client added!" });
    }
    setOpen(false);
    setForm(emptyForm);
    setEditId(null);
    setLoading(false);
    fetchClients();
  };

  const handleEdit = (c: Client) => {
    setForm({ name: c.name, email: c.email || "", phone: c.phone || "", age: c.age || "", gender: c.gender || "", goals: c.goals || "", notes: c.notes || "" });
    setEditId(c.id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("clients").delete().eq("id", id);
    toast({ title: "Client removed" });
    fetchClients();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">My Clients ({clients.length})</h2>
        <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => { setForm(emptyForm); setEditId(null); setOpen(true); }}>
          <UserPlus size={14} className="mr-1" /> Add Client
        </Button>
      </div>

      {clients.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          <UserPlus size={40} className="mx-auto mb-3 opacity-30" />
          <p>No clients yet. Add your first client to get started!</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Goals</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.email || c.phone || "—"}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{c.goals || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "active" ? "default" : "secondary"} className="text-xs">
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}><Pencil size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 size={14} className="text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Client" : "Add New Client"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Age</Label><Input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Fitness Goals</Label><Textarea value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} rows={2} /></div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : editId ? "Update" : "Add Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsTab;
