import { motion } from "framer-motion";
import { useState } from "react";
import {
  ShieldCheck, Users, AlertTriangle, CheckCircle2,
  Clock, XCircle, Eye, Search
} from "lucide-react";

type VerificationStatus = "pending" | "verified" | "rejected";

interface Trainer {
  id: string;
  name: string;
  email: string;
  certStatus: VerificationStatus;
  idStatus: VerificationStatus;
  certFile?: string;
  idFile?: string;
  joinedDate: string;
}

const mockTrainers: Trainer[] = [
  { id: "1", name: "John Doe", email: "john@example.com", certStatus: "verified", idStatus: "verified", certFile: "NASM_Cert.pdf", idFile: "DL_NY.pdf", joinedDate: "2025-12-01" },
  { id: "2", name: "Sarah Kim", email: "sarah@example.com", certStatus: "pending", idStatus: "pending", certFile: "ACE_Cert.pdf", idFile: "Passport.pdf", joinedDate: "2026-01-15" },
  { id: "3", name: "Marcus Johnson", email: "marcus@example.com", certStatus: "verified", idStatus: "rejected", certFile: "ISSA_Cert.pdf", idFile: "ID_blurry.jpg", joinedDate: "2026-02-10" },
  { id: "4", name: "Aisha Patel", email: "aisha@example.com", certStatus: "pending", idStatus: "pending", joinedDate: "2026-02-25" },
];

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
  const [trainers, setTrainers] = useState(mockTrainers);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = trainers.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: string, field: "certStatus" | "idStatus", status: VerificationStatus) => {
    setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: status } : t)));
  };

  const runAIVerification = (id: string) => {
    // Simulate AI verification
    setTrainers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          certStatus: t.certFile ? "verified" : "rejected",
          idStatus: t.idFile
            ? t.idFile.includes("blurry") ? "rejected" : "verified"
            : "rejected",
        };
      })
    );
  };

  const selectedTrainer = trainers.find((t) => t.id === selected);
  const stats = {
    total: trainers.length,
    verified: trainers.filter((t) => t.certStatus === "verified" && t.idStatus === "verified").length,
    pending: trainers.filter((t) => t.certStatus === "pending" || t.idStatus === "pending").length,
    rejected: trainers.filter((t) => t.certStatus === "rejected" || t.idStatus === "rejected").length,
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
                            <button
                              onClick={(e) => { e.stopPropagation(); runAIVerification(t.id); }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs font-semibold hover:bg-secondary/20 transition-colors"
                            >
                              <ShieldCheck size={12} /> AI Verify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Detail panel */}
            <div>
              {selectedTrainer ? (
                <div className="glass-card p-6 space-y-4">
                  <h3 className="font-bold text-lg">{selectedTrainer.name}</h3>
                  <div className="text-muted-foreground text-sm">{selectedTrainer.email}</div>
                  <div className="text-muted-foreground text-xs">Joined: {selectedTrainer.joinedDate}</div>

                  <div className="pt-4 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Certification</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{selectedTrainer.certFile || "Not uploaded"}</span>
                        <StatusBadge status={selectedTrainer.certStatus} />
                      </div>
                      {selectedTrainer.certStatus === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => updateStatus(selectedTrainer.id, "certStatus", "verified")} className="px-3 py-1 rounded bg-secondary/10 text-secondary text-xs font-semibold">Approve</button>
                          <button onClick={() => updateStatus(selectedTrainer.id, "certStatus", "rejected")} className="px-3 py-1 rounded bg-destructive/10 text-destructive text-xs font-semibold">Reject</button>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Government ID</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{selectedTrainer.idFile || "Not uploaded"}</span>
                        <StatusBadge status={selectedTrainer.idStatus} />
                      </div>
                      {selectedTrainer.idStatus === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => updateStatus(selectedTrainer.id, "idStatus", "verified")} className="px-3 py-1 rounded bg-secondary/10 text-secondary text-xs font-semibold">Approve</button>
                          <button onClick={() => updateStatus(selectedTrainer.id, "idStatus", "rejected")} className="px-3 py-1 rounded bg-destructive/10 text-destructive text-xs font-semibold">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => runAIVerification(selectedTrainer.id)}
                    className="w-full mt-4 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={16} /> Run AI Verification
                  </button>
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
