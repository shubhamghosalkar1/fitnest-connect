import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Plus, TrendingUp } from "lucide-react";

interface Client { id: string; name: string; }
interface ProgressEntry {
  id: string; client_id: string; date: string;
  weight: number | null; body_fat: number | null;
  chest: number | null; waist: number | null; hips: number | null; arms: number | null;
  notes: string | null;
}

const ProgressTab = ({ trainerId }: { trainerId: string }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], weight: "", body_fat: "", chest: "", waist: "", hips: "", arms: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("clients").select("id, name").eq("trainer_id", trainerId).then(({ data }) => {
      if (data) setClients(data);
    });
  }, [trainerId]);

  useEffect(() => {
    if (!selectedClient) { setEntries([]); return; }
    supabase.from("client_progress").select("*").eq("client_id", selectedClient).order("date", { ascending: true })
      .then(({ data }) => { if (data) setEntries(data as ProgressEntry[]); });
  }, [selectedClient]);

  const handleSave = async () => {
    if (!selectedClient) return;
    setLoading(true);
    const payload = {
      client_id: selectedClient,
      date: form.date,
      weight: form.weight ? parseFloat(form.weight) : null,
      body_fat: form.body_fat ? parseFloat(form.body_fat) : null,
      chest: form.chest ? parseFloat(form.chest) : null,
      waist: form.waist ? parseFloat(form.waist) : null,
      hips: form.hips ? parseFloat(form.hips) : null,
      arms: form.arms ? parseFloat(form.arms) : null,
      notes: form.notes || null,
    };
    await supabase.from("client_progress").insert(payload);
    toast({ title: "Progress logged!" });
    setOpen(false);
    setForm({ date: new Date().toISOString().split("T")[0], weight: "", body_fat: "", chest: "", waist: "", hips: "", arms: "", notes: "" });
    setLoading(false);
    // Refresh
    const { data } = await supabase.from("client_progress").select("*").eq("client_id", selectedClient).order("date", { ascending: true });
    if (data) setEntries(data as ProgressEntry[]);
  };

  const chartData = entries.map((e) => ({
    date: new Date(e.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    Weight: e.weight, "Body Fat %": e.body_fat, Waist: e.waist,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-lg font-bold">Client Progress</h2>
        <div className="flex gap-2 items-center">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Select client" /></SelectTrigger>
            <SelectContent>
              {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {selectedClient && (
            <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => setOpen(true)}>
              <Plus size={14} className="mr-1" /> Log Entry
            </Button>
          )}
        </div>
      </div>

      {!selectedClient ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
          <p>Select a client to view and track their progress.</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          <p>No progress entries yet. Log the first one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Progress Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 18%)" />
                <XAxis dataKey="date" stroke="hsl(0 0% 64%)" fontSize={12} />
                <YAxis stroke="hsl(0 0% 64%)" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(0 0% 11%)", border: "1px solid hsl(0 0% 18%)", borderRadius: "8px", color: "hsl(0 0% 95%)" }} />
                <Legend />
                <Line type="monotone" dataKey="Weight" stroke="hsl(36 100% 50%)" strokeWidth={2} dot={{ fill: "hsl(36 100% 50%)" }} />
                <Line type="monotone" dataKey="Body Fat %" stroke="hsl(0 72% 51%)" strokeWidth={2} dot={{ fill: "hsl(0 72% 51%)" }} />
                <Line type="monotone" dataKey="Waist" stroke="hsl(36 90% 55%)" strokeWidth={2} dot={{ fill: "hsl(36 90% 55%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-4">
            <h3 className="font-semibold mb-3">History</h3>
            <div className="space-y-2">
              {[...entries].reverse().map((e) => (
                <div key={e.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/30 text-sm">
                  <span className="font-medium">{new Date(e.date).toLocaleDateString()}</span>
                  <div className="flex gap-4 text-muted-foreground">
                    {e.weight && <span>Weight: <span className="text-foreground">{e.weight}kg</span></span>}
                    {e.body_fat && <span>BF: <span className="text-foreground">{e.body_fat}%</span></span>}
                    {e.waist && <span>Waist: <span className="text-foreground">{e.waist}cm</span></span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Log Progress Entry</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Weight (kg)</Label><Input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></div>
              <div><Label>Body Fat %</Label><Input type="number" value={form.body_fat} onChange={(e) => setForm({ ...form, body_fat: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Chest (cm)</Label><Input type="number" value={form.chest} onChange={(e) => setForm({ ...form, chest: e.target.value })} /></div>
              <div><Label>Waist (cm)</Label><Input type="number" value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Hips (cm)</Label><Input type="number" value={form.hips} onChange={(e) => setForm({ ...form, hips: e.target.value })} /></div>
              <div><Label>Arms (cm)</Label><Input type="number" value={form.arms} onChange={(e) => setForm({ ...form, arms: e.target.value })} /></div>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Log Entry"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgressTab;
