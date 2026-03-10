import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ShieldCheck, Users, AlertTriangle, CheckCircle2,
  Clock, XCircle, Eye, Search, Trash2, Ban, Building2, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { VerificationStatus } from "@/lib/trainerStore";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusConfig = {
  pending: { icon: Clock, label: "Pending", className: "bg-primary/15 text-primary" },
  verified: { icon: CheckCircle2, label: "Verified", className: "bg-secondary/15 text-secondary" },
  rejected: { icon: XCircle, label: "Rejected", className: "bg-destructive/15 text-destructive" },
  approved: { icon: CheckCircle2, label: "Approved", className: "bg-secondary/15 text-secondary" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      <cfg.icon size={12} /> {cfg.label}
    </span>
  );
};

const Admin = () => {
  const { signOut } = useAuth();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [gyms, setGyms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [trainerRes, gymRes] = await Promise.all([
      supabase.from("trainers").select("*").order("created_at", { ascending: false }),
      supabase.from("gyms").select("*").order("created_at", { ascending: false }),
    ]);
    setTrainers(trainerRes.data || []);
    setGyms(gymRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredTrainers = trainers.filter(
    t => t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTrainer = trainers.find(t => t.id === selected);

  const stats = {
    totalTrainers: trainers.length,
    verifiedTrainers: trainers.filter(t => t.cert_status === "verified" && t.id_status === "verified").length,
    pendingTrainers: trainers.filter(t => t.cert_status === "pending" || t.id_status === "pending").length,
    totalGyms: gyms.length,
  };

  const handleDeleteTrainer = async (id: string, name: string) => {
    await supabase.from("trainers").delete().eq("id", id);
    if (selected === id) setSelected(null);
    toast.success(`${name} has been removed.`);
    fetchData();
  };

  const handleUpdateTrainerStatus = async (id: string, field: string, status: string) => {
    await supabase.from("trainers").update({ [field]: status }).eq("id", id);
    toast.success("Status updated");
    fetchData();
  };

  const handleAIVerify = async (trainer: any) => {
    setVerifying(trainer.id);
    try {
      const { data, error } = await supabase.functions.invoke("verify-trainer", {
        body: { trainer },
      });
      if (error) throw error;
      
      await supabase.from("trainers").update({
        cert_status: data.certStatus,
        id_status: data.idStatus,
      }).eq("id", trainer.id);

      toast.success(`AI Verification complete for ${trainer.name}`, {
        description: data.details?.aiReasoning || `Cert: ${data.certStatus}, ID: ${data.idStatus}`,
      });
      fetchData();
    } catch (err) {
      toast.error("AI verification failed. Please try again.");
      console.error(err);
    }
    setVerifying(null);
  };

  const handleGymStatus = async (id: string, status: string) => {
    await supabase.from("gyms").update({ status }).eq("id", id);
    toast.success(`Gym ${status}`);
    fetchData();
  };

  const handleDeleteGym = async (id: string, name: string) => {
    await supabase.from("gyms").delete().eq("id", id);
    toast.success(`${name} removed`);
    fetchData();
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading admin data...</div>;
  }

  return (
    <div>
      <section className="section-padding pb-8" style={{ background: "var(--gradient-hero)" }}>
        <div className="container-tight flex items-center justify-between">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-display font-extrabold text-foreground">
              Admin Panel
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-2 text-foreground/80">
              Manage trainers, gyms, and platform operations.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="section-padding pt-8">
        <div className="container-tight">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: "Total Trainers", value: stats.totalTrainers, color: "text-primary" },
              { icon: CheckCircle2, label: "Verified", value: stats.verifiedTrainers, color: "text-secondary" },
              { icon: Clock, label: "Pending", value: stats.pendingTrainers, color: "text-yellow-600" },
              { icon: Building2, label: "Gyms", value: stats.totalGyms, color: "text-primary" },
            ].map(s => (
              <div key={s.label} className="glass-card p-5 hover-lift">
                <s.icon size={20} className={s.color} />
                <div className={`text-2xl font-display font-bold mt-2 ${s.color}`}>{s.value}</div>
                <div className="text-muted-foreground text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          <Tabs defaultValue="trainers" className="space-y-6">
            <TabsList>
              <TabsTrigger value="trainers">Trainers</TabsTrigger>
              <TabsTrigger value="gyms">Gyms</TabsTrigger>
            </TabsList>

            {/* TRAINERS TAB */}
            <TabsContent value="trainers">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-lg">Trainer Management</h2>
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          value={search} onChange={e => setSearch(e.target.value)}
                          placeholder="Search trainers..."
                          className="pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm w-48 focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left">
                            <th className="pb-3 font-semibold text-muted-foreground">Trainer</th>
                            <th className="pb-3 font-semibold text-muted-foreground">Cert</th>
                            <th className="pb-3 font-semibold text-muted-foreground">ID</th>
                            <th className="pb-3 font-semibold text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredTrainers.map(t => (
                            <tr key={t.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelected(t.id)}>
                              <td className="py-3">
                                <div className="font-semibold">{t.name}</div>
                                <div className="text-muted-foreground text-xs">{t.email}</div>
                              </td>
                              <td className="py-3"><StatusBadge status={t.cert_status} /></td>
                              <td className="py-3"><StatusBadge status={t.id_status} /></td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={e => { e.stopPropagation(); handleAIVerify(t); }}
                                    disabled={verifying === t.id}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs font-semibold hover:bg-secondary/20 transition-colors disabled:opacity-50"
                                  >
                                    {verifying === t.id ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />} AI Verify
                                  </button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <button onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors">
                                        <Trash2 size={12} /> Delete
                                      </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Trainer</AlertDialogTitle>
                                        <AlertDialogDescription>Permanently remove <strong>{t.name}</strong>?</AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteTrainer(t.id, t.name)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filteredTrainers.length === 0 && (
                            <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No trainers found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Detail panel */}
                <div>
                  {selectedTrainer ? (
                    <div className="glass-card p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{selectedTrainer.name}</h3>
                          <div className="text-muted-foreground text-sm">{selectedTrainer.email}</div>
                          <div className="text-muted-foreground text-xs">Joined: {new Date(selectedTrainer.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="text-xs space-y-1 text-muted-foreground">
                        <div>📍 {selectedTrainer.city}, {selectedTrainer.state}</div>
                        <div>📞 {selectedTrainer.phone}</div>
                        <div>💼 {selectedTrainer.years_experience} years exp</div>
                        <div>💰 ₹{selectedTrainer.session_rate}/session</div>
                        {selectedTrainer.specialties?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {selectedTrainer.specialties.map((s: string) => (
                              <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 space-y-3">
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground mb-1">Certification — {selectedTrainer.cert_name || "N/A"}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{selectedTrainer.cert_file || "Not uploaded"}</span>
                            <StatusBadge status={selectedTrainer.cert_status} />
                          </div>
                          {selectedTrainer.cert_status === "pending" && (
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => handleUpdateTrainerStatus(selectedTrainer.id, "cert_status", "verified")} className="px-3 py-1 rounded bg-secondary/10 text-secondary text-xs font-semibold">Approve</button>
                              <button onClick={() => handleUpdateTrainerStatus(selectedTrainer.id, "cert_status", "rejected")} className="px-3 py-1 rounded bg-destructive/10 text-destructive text-xs font-semibold">Reject</button>
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-muted-foreground mb-1">Government ID — {selectedTrainer.gov_id_type || "N/A"}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{selectedTrainer.gov_id_file || "Not uploaded"}</span>
                            <StatusBadge status={selectedTrainer.id_status} />
                          </div>
                          {selectedTrainer.id_status === "pending" && (
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => handleUpdateTrainerStatus(selectedTrainer.id, "id_status", "verified")} className="px-3 py-1 rounded bg-secondary/10 text-secondary text-xs font-semibold">Approve</button>
                              <button onClick={() => handleUpdateTrainerStatus(selectedTrainer.id, "id_status", "rejected")} className="px-3 py-1 rounded bg-destructive/10 text-destructive text-xs font-semibold">Reject</button>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleAIVerify(selectedTrainer)}
                        disabled={verifying === selectedTrainer.id}
                        className="w-full mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
                      >
                        {verifying === selectedTrainer.id ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                        Run AI Verification
                      </Button>

                      {(selectedTrainer.cert_status !== "rejected" || selectedTrainer.id_status !== "rejected") && (
                        <Button
                          variant="outline"
                          onClick={async () => {
                            await supabase.from("trainers").update({ cert_status: "rejected", id_status: "rejected" }).eq("id", selectedTrainer.id);
                            toast.warning(`${selectedTrainer.name}'s profile rejected.`);
                            fetchData();
                          }}
                          className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                        >
                          <Ban size={16} /> Reject Profile
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="glass-card p-8 text-center text-muted-foreground">
                      <Eye size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Select a trainer to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* GYMS TAB */}
            <TabsContent value="gyms">
              <div className="glass-card p-6">
                <h2 className="font-bold text-lg mb-4">Gym Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 font-semibold text-muted-foreground">Gym</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Location</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Status</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {gyms.map(g => (
                        <tr key={g.id} className="hover:bg-muted/50">
                          <td className="py-3">
                            <div className="font-semibold">{g.gym_name}</div>
                            <div className="text-muted-foreground text-xs">{g.owner_name} • {g.email}</div>
                          </td>
                          <td className="py-3 text-muted-foreground text-xs">{g.city}, {g.state}</td>
                          <td className="py-3"><StatusBadge status={g.status} /></td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              {g.status === "pending" && (
                                <>
                                  <button onClick={() => handleGymStatus(g.id, "approved")} className="px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs font-semibold hover:bg-secondary/20">Approve</button>
                                  <button onClick={() => handleGymStatus(g.id, "rejected")} className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20">Reject</button>
                                </>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20">
                                    <Trash2 size={12} />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Gym</AlertDialogTitle>
                                    <AlertDialogDescription>Remove <strong>{g.gym_name}</strong> permanently?</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteGym(g.id, g.gym_name)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {gyms.length === 0 && (
                        <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No gyms registered yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Admin;
