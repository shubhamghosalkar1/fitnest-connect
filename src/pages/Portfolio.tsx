import { motion } from "framer-motion";
import {
  Award, MapPin, Star, Calendar, Camera, Upload, ShieldCheck,
  Dumbbell, Heart, Users, ChevronRight
} from "lucide-react";
import { useLocation, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface TrainerData {
  fullName?: string;
  city?: string;
  state?: string;
  certName?: string;
  certIssuer?: string;
  yearsExperience?: string;
  bio?: string;
  specialties?: string[];
  sessionRate?: string;
  packageRate?: string;
  sessionDuration?: string;
  availableDays?: string[];
  maxClients?: string;
  trainingStyle?: string;
  onlineTraining?: string;
  travelWilling?: string;
}

const Portfolio = () => {
  const { toast } = useToast();
  const location = useLocation();
  const trainerData = (location.state as { trainerData?: TrainerData })?.trainerData;

  if (!trainerData) {
    return <Navigate to="/join-trainer" replace />;
  }

  const name = (trainerData.fullName as string) || "Trainer";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleUpload = (type: string) => {
    toast({
      title: `${type} Uploaded`,
      description: "Your document is being reviewed by our AI verification system. You'll be notified within 24 hours.",
    });
  };

  return (
    <div>
      <section className="section-padding" style={{ background: "var(--gradient-hero)" }}>
        <div className="container-tight text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-display font-extrabold text-foreground">
            Your Trainer Portfolio
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-foreground/80 text-lg">
            Your registration was successful! Here's your portfolio preview.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight">
          {/* Profile header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="w-28 h-28 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-display text-3xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{name}</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                  <ShieldCheck size={12} /> Pending Verification
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                {trainerData.city && <span className="flex items-center gap-1"><MapPin size={14} /> {trainerData.city}{trainerData.state ? `, ${trainerData.state}` : ""}</span>}
                {trainerData.certName && <span className="flex items-center gap-1"><Award size={14} /> {trainerData.certName}</span>}
                {trainerData.yearsExperience && <span className="flex items-center gap-1"><Calendar size={14} /> {trainerData.yearsExperience} Years Experience</span>}
              </div>
              {trainerData.bio && (
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">{trainerData.bio as string}</p>
              )}
              {trainerData.specialties && (trainerData.specialties as string[]).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {(trainerData.specialties as string[]).map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-muted text-xs font-medium">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Info Card */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-lg mb-4">Registration Details</h3>
                <div className="space-y-3">
                  {[
                    { label: "Training Style", value: trainerData.trainingStyle },
                    { label: "Session Rate", value: trainerData.sessionRate ? `₹${trainerData.sessionRate}` : undefined },
                    { label: "Package Rate (10 sessions)", value: trainerData.packageRate ? `₹${trainerData.packageRate}` : undefined },
                    { label: "Session Duration", value: trainerData.sessionDuration ? `${trainerData.sessionDuration} min` : undefined },
                    { label: "Online Training", value: trainerData.onlineTraining },
                    { label: "Willing to Travel", value: trainerData.travelWilling },
                  ].filter(r => r.value).map((r) => (
                    <div key={r.label} className="flex justify-between items-center py-2 border-b border-border last:border-0 last:pb-0">
                      <span className="text-sm text-muted-foreground">{r.label}</span>
                      <span className="text-sm font-semibold capitalize">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Days */}
              {trainerData.availableDays && (trainerData.availableDays as string[]).length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="font-bold text-lg mb-4">Availability</h3>
                  <div className="flex flex-wrap gap-2">
                    {(trainerData.availableDays as string[]).map((d) => (
                      <span key={d} className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">{d}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Media */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Camera size={18} /> Media Gallery</h3>
                <p className="text-muted-foreground text-sm mb-4">Upload photos once your profile is verified.</p>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                      <Dumbbell size={24} className="text-muted-foreground/30" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="glass-card p-6 text-center">
                <ShieldCheck size={32} className="text-secondary mx-auto mb-3" />
                <h3 className="font-bold text-sm mb-2">Verification In Progress</h3>
                <p className="text-muted-foreground text-xs">
                  Your credentials are being reviewed by our AI verification system. You'll be notified within 24–48 hours.
                </p>
              </div>

              {/* Upload Credentials */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Upload size={16} className="text-primary" /> Upload Credentials
                </h3>
                <p className="text-muted-foreground text-xs mb-4">
                  Submit additional documents for faster verification.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleUpload("Certification")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-input bg-background text-sm hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-2"><Award size={14} className="text-secondary" /> Upload Certification</span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleUpload("Government ID")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-input bg-background text-sm hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /> Upload Government ID</span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-sm mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  {[
                    { icon: Users, label: "Max Clients", value: trainerData.maxClients || "—" },
                    { icon: Star, label: "Rating", value: "New" },
                    { icon: Calendar, label: "Days/Week", value: trainerData.availableDays ? `${(trainerData.availableDays as string[]).length}` : "—" },
                    { icon: Heart, label: "Status", value: "Pending" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <s.icon size={14} /> {s.label}
                      </span>
                      <span className="font-semibold text-sm">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
