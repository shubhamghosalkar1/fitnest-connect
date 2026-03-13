import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, ClipboardList, Calendar } from "lucide-react";

interface Client { id: string; name: string; }
interface SessionLog {
  id: string; client_id: string; date: string; session_type: string;
  duration: string | null; notes: string | null; exercises: string | null;
}

const SESSION_TYPES = ["Training", "Assessment", "Cardio", "Flexibility", "Recovery", "Nutrition Consult"];

const SessionsTab = ({ trainerId }: { trainerId: string }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ client_id: "", date: new Date().toISOString().split("T")[0], session_type: "Training", duration: "60", notes: "", exercises: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSessions = async () => {
    const { data } = await supabase.from("session_logs").select("*").eq("trainer_id", trainerId).order("date", { ascending: false });
    if (data) setSessions(data as SessionLog[]);
  };

  useEffect(() => {
    supabase.from("clients").select("id, name").eq("trainer_id", trainerId).then(({ data }) => { if (data) setClients(data); });
    fetchSessions();
  }, [trainerId]);

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name || "Unknown";

  const handleSave = async () => {
    if (!form.client_id) { toast({ title: "Select a client", variant: "destructive" }); return; }
    setLoading(true);
    await supabase.from("session_logs").insert({ ...form, trainer_id: trainerId });
    toast({ title: "Session logged!" });
    setOpen(false);
    setForm({ client_id: "", date: new Date().toISOString().split("T")[0], session_type: "Training", duration: "60", notes: "", exercises: "" });
    setLoading(false);
    fetchSessions();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Session Logs ({sessions.length})</h2>
        <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => setOpen(true)}>
          <Plus size={14} className="mr-1" /> Log Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
          <p>No sessions logged yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="glass-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{clientName(s.client_id)}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Calendar size={12} /> {new Date(s.date).toLocaleDateString()}
                    {s.duration && <span>• {s.duration} min</span>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">{s.session_type}</Badge>
              </div>
              {s.exercises && <p className="text-sm mt-2 text-muted-foreground"><span className="text-foreground font-medium">Exercises:</span> {s.exercises}</p>}
              {s.notes && <p className="text-sm mt-1 text-muted-foreground">{s.notes}</p>}
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Log Session</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Client *</Label>
              <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div>
                <Label>Type</Label>
                <Select value={form.session_type} onValueChange={(v) => setForm({ ...form, session_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SESSION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Duration (min)</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
            <div><Label>Exercises</Label><Textarea value={form.exercises} onChange={(e) => setForm({ ...form, exercises: e.target.value })} rows={2} placeholder="e.g. Squats 3x10, Bench Press 4x8..." /></div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Log Session"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionsTab;
