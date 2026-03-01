import { motion } from "framer-motion";
import { useState } from "react";
import {
  ShieldCheck, Users, AlertTriangle, CheckCircle2,
  Clock, XCircle, Eye, Search, Trash2, Ban
} from "lucide-react";
import { useTrainers, trainerStore, getIdTypeLabel } from "@/lib/trainerStore";
import type { VerificationStatus } from "@/lib/trainerStore";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const statusConfig = {
  pending: { icon: Clock, label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  verified: { icon: CheckCircle2, label: "Verified", className: "bg-green-100 text-green-700" },
  rejected: { icon: XCircle, label: "Rejected", className: "bg-red-100 text-red-700" },
};

const StatusBadge = ({ status }: { status: VerificationStatus }) => {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      <cfg.icon size={12} /> {cfg.label}
    </span>
  );
};

const Admin = () => {
  const trainers = useTrainers();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = trainers.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTrainer = trainers.find((t) => t.id === selected);
  const stats = {
    total: trainers.length,
    verified: trainers.filter((t) => t.certStatus === "verified" && t.idStatus === "verified").length,
    pending: trainers.filter((t) => t.certStatus === "pending" || t.idStatus === "pending").length,
    rejected: trainers.filter((t) => t.certStatus === "rejected" || t.idStatus === "rejected").length,
  };

  const handleDelete = (id: string, name: string) => {
    trainerStore.deleteTrainer(id);
    if (selected === id) setSelected(null);
    toast.success(`${name} has been removed.`);
  };

  return (
    <div>
      <section className="section-padding pb-8" style={{ background: "var(--gradient-hero)" }}>
        <div className="container-tight">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-display font-extrabold text-primary-foreground">
            Admin Panel
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-2 text-primary-foreground/80">
            Manage trainers, verify credentials, and oversee platform operations.
          </motion.p>
        </div>
      </section>

      <section className="section-padding pt-8">
        <div className="container-tight">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: "Total Trainers", value: stats.total, color: "text-primary" },
              { icon: CheckCircle2, label: "Verified", value: stats.verified, color: "text-secondary" },
              { icon: Clock, label: "Pending", value: stats.pending, color: "text-yellow-600" },
              { icon: AlertTriangle, label: "Rejected", value: stats.rejected, color: "text-destructive" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-5 hover-lift">
                <s.icon size={20} className={s.color} />
                <div className={`text-2xl font-display font-bold mt-2 ${s.color}`}>{s.value}</div>
                <div className="text-muted-foreground text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Trainer list */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">Trainer Management</h2>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
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
                        <th className="pb-3 font-semibold text-muted-foreground">Certification</th>
                        <th className="pb-3 font-semibold text-muted-foreground">ID</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map((t) => (
                        <tr key={t.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelected(t.id)}>
                          <td className="py-3">
                            <div className="font-semibold">{t.name}</div>
                            <div className="text-muted-foreground text-xs">{t.email}</div>
                          </td>
                          <td className="py-3"><StatusBadge status={t.certStatus} /></td>
                          <td className="py-3"><StatusBadge status={t.idStatus} /></td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); trainerStore.runAIVerification(t.id); toast.info(`AI verification run for ${t.name}`); }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs font-semibold hover:bg-secondary/20 transition-colors"
                              >
                                <ShieldCheck size={12} /> AI Verify
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors"
                                  >
                                    <Trash2 size={12} /> Delete
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Trainer Profile</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to permanently remove <strong>{t.name}</strong>'s profile? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(t.id, t.name)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
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
                      <div className="text-muted-foreground text-xs">Joined: {selectedTrainer.joinedDate}</div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Trainer</AlertDialogTitle>
                          <AlertDialogDescription>Remove {selectedTrainer.name}'s profile permanently?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(selectedTrainer.id, selectedTrainer.name)} className="bg-destructive text-destructive-foreground">Remove</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {/* Details */}
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <div>📍 {selectedTrainer.city}, {selectedTrainer.state}</div>
                    <div>📞 {selectedTrainer.phone}</div>
                    <div>💼 {selectedTrainer.yearsExperience} years exp</div>
                    <div>💰 ₹{selectedTrainer.sessionRate}/session</div>
                    {selectedTrainer.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedTrainer.specialties.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Certification — {selectedTrainer.certName || "N/A"}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{selectedTrainer.certFile || "Not uploaded"}</span>
                        <StatusBadge status={selectedTrainer.certStatus} />
                      </div>
                      {selectedTrainer.certStatus === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => trainerStore.updateStatus(selectedTrainer.id, "certStatus", "verified")} className="px-3 py-1 rounded bg-secondary/10 text-secondary text-xs font-semibold">Approve</button>
                          <button onClick={() => trainerStore.updateStatus(selectedTrainer.id, "certStatus", "rejected")} className="px-3 py-1 rounded bg-destructive/10 text-destructive text-xs font-semibold">Reject</button>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Government ID — {getIdTypeLabel(selectedTrainer.govIdType) || "N/A"}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{selectedTrainer.govIdFile || "Not uploaded"}</span>
                        <StatusBadge status={selectedTrainer.idStatus} />
                      </div>
                      {selectedTrainer.idStatus === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => trainerStore.updateStatus(selectedTrainer.id, "idStatus", "verified")} className="px-3 py-1 rounded bg-secondary/10 text-secondary text-xs font-semibold">Approve</button>
                          <button onClick={() => trainerStore.updateStatus(selectedTrainer.id, "idStatus", "rejected")} className="px-3 py-1 rounded bg-destructive/10 text-destructive text-xs font-semibold">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => { trainerStore.runAIVerification(selectedTrainer.id); toast.info("AI verification complete"); }}
                    className="w-full mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
                  >
                    <ShieldCheck size={16} /> Run AI Verification
                  </Button>

                  {/* Reject entire profile */}
                  {(selectedTrainer.certStatus !== "rejected" || selectedTrainer.idStatus !== "rejected") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        trainerStore.updateStatus(selectedTrainer.id, "certStatus", "rejected");
                        trainerStore.updateStatus(selectedTrainer.id, "idStatus", "rejected");
                        toast.warning(`${selectedTrainer.name}'s profile rejected.`);
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
        </div>
      </section>
    </div>
  );
};

export default Admin;
