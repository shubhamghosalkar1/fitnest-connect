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
import { Plus, Dumbbell, Trash2, X } from "lucide-react";

interface Client { id: string; name: string; }
interface Exercise { name: string; sets: string; reps: string; rest: string; }
interface WorkoutPlan {
  id: string; client_id: string; name: string; description: string | null;
  exercises: Exercise[]; frequency: string | null; duration_weeks: string | null; status: string;
}

const WorkoutPlansTab = ({ trainerId }: { trainerId: string }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ client_id: "", name: "", description: "", frequency: "", duration_weeks: "" });
  const [exercises, setExercises] = useState<Exercise[]>([{ name: "", sets: "3", reps: "10", rest: "60s" }]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPlans = async () => {
    const { data } = await supabase.from("workout_plans").select("*").eq("trainer_id", trainerId).order("created_at", { ascending: false });
    if (data) setPlans(data.map((p: any) => ({ ...p, exercises: (p.exercises as Exercise[]) || [] })));
  };

  useEffect(() => {
    supabase.from("clients").select("id, name").eq("trainer_id", trainerId).then(({ data }) => { if (data) setClients(data); });
    fetchPlans();
  }, [trainerId]);

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name || "Unknown";

  const addExercise = () => setExercises([...exercises, { name: "", sets: "3", reps: "10", rest: "60s" }]);
  const removeExercise = (i: number) => setExercises(exercises.filter((_, idx) => idx !== i));
  const updateExercise = (i: number, field: keyof Exercise, value: string) => {
    const updated = [...exercises];
    updated[i] = { ...updated[i], [field]: value };
    setExercises(updated);
  };

  const handleSave = async () => {
    if (!form.client_id || !form.name.trim()) {
      toast({ title: "Client and plan name required", variant: "destructive" });
      return;
    }
    const validExercises = exercises.filter((e) => e.name.trim());
    if (validExercises.length === 0) {
      toast({ title: "Add at least one exercise", variant: "destructive" });
      return;
    }
    setLoading(true);
    await supabase.from("workout_plans").insert({
      ...form, trainer_id: trainerId, exercises: validExercises as any,
    });
    toast({ title: "Workout plan created!" });
    setOpen(false);
    setForm({ client_id: "", name: "", description: "", frequency: "", duration_weeks: "" });
    setExercises([{ name: "", sets: "3", reps: "10", rest: "60s" }]);
    setLoading(false);
    fetchPlans();
  };

  const deletePlan = async (id: string) => {
    await supabase.from("workout_plans").delete().eq("id", id);
    toast({ title: "Plan deleted" });
    fetchPlans();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Workout Plans ({plans.length})</h2>
        <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => setOpen(true)}>
          <Plus size={14} className="mr-1" /> Create Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          <Dumbbell size={40} className="mx-auto mb-3 opacity-30" />
          <p>No workout plans created yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((p) => (
            <div key={p.id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">For: {clientName(p.client_id)}</p>
                </div>
                <div className="flex gap-1">
                  <Badge variant={p.status === "active" ? "default" : "secondary"} className="text-xs">{p.status}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => deletePlan(p.id)}><Trash2 size={14} className="text-destructive" /></Button>
                </div>
              </div>
              {p.description && <p className="text-sm text-muted-foreground mb-3">{p.description}</p>}
              <div className="flex gap-3 text-xs text-muted-foreground mb-3">
                {p.frequency && <span>Frequency: <span className="text-foreground">{p.frequency}</span></span>}
                {p.duration_weeks && <span>Duration: <span className="text-foreground">{p.duration_weeks} weeks</span></span>}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-primary">Exercises:</p>
                {p.exercises.map((e, i) => (
                  <div key={i} className="text-sm flex justify-between bg-muted/30 rounded px-3 py-1.5">
                    <span>{e.name}</span>
                    <span className="text-muted-foreground">{e.sets}×{e.reps} | Rest: {e.rest}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Workout Plan</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Client *</Label>
              <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Plan Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Beginner Strength Program" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Frequency</Label><Input value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} placeholder="e.g. 4x/week" /></div>
              <div><Label>Duration (weeks)</Label><Input value={form.duration_weeks} onChange={(e) => setForm({ ...form, duration_weeks: e.target.value })} /></div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Exercises *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addExercise}><Plus size={12} className="mr-1" /> Add</Button>
              </div>
              <div className="space-y-2">
                {exercises.map((ex, i) => (
                  <div key={i} className="flex gap-2 items-start bg-muted/20 p-2 rounded-lg">
                    <div className="flex-1 grid grid-cols-4 gap-2">
                      <Input className="col-span-4 sm:col-span-2" placeholder="Exercise name" value={ex.name} onChange={(e) => updateExercise(i, "name", e.target.value)} />
                      <Input placeholder="Sets" value={ex.sets} onChange={(e) => updateExercise(i, "sets", e.target.value)} />
                      <Input placeholder="Reps" value={ex.reps} onChange={(e) => updateExercise(i, "reps", e.target.value)} />
                    </div>
                    {exercises.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeExercise(i)}><X size={14} /></Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground" onClick={handleSave} disabled={loading}>{loading ? "Creating..." : "Create Plan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutPlansTab;
