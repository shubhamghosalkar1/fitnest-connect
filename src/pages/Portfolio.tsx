import { motion } from "framer-motion";
import {
  Award, MapPin, Star, Calendar, Camera, Upload, ShieldCheck,
  Dumbbell, Heart, Users, ChevronRight
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";

const Portfolio = () => {
  const { toast } = useToast();
  

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
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-display font-extrabold text-primary-foreground">
            Trainer Portfolio
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-primary-foreground/80 text-lg">
            Verified profiles that showcase expertise and build trust.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight">
          {/* Profile header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="w-28 h-28 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-display text-3xl font-bold flex-shrink-0">
              JD
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">John Doe</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
                  <ShieldCheck size={12} /> Verified
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><MapPin size={14} /> New York, NY</span>
                <span className="flex items-center gap-1"><Award size={14} /> NASM Certified</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> 8 Years Experience</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                Passionate fitness professional specializing in strength training, functional fitness, and sports conditioning. Dedicated to helping clients of all levels achieve their health and fitness goals through science-based programming.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Strength Training", "HIIT", "Functional Fitness", "Sports Conditioning", "Nutrition"].map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-muted text-xs font-medium">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Experience */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-lg mb-4">Experience</h3>
                <div className="space-y-4">
                  {[
                    { role: "Head Trainer", place: "FitLife Gym", period: "2020 – Present" },
                    { role: "Personal Trainer", place: "ActiveBody Studio", period: "2017 – 2020" },
                    { role: "Fitness Instructor", place: "Community Wellness Center", period: "2015 – 2017" },
                  ].map((e) => (
                    <div key={e.role} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm">{e.role}</div>
                        <div className="text-muted-foreground text-xs">{e.place} · {e.period}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-lg mb-4">Client Reviews</h3>
                <div className="space-y-4">
                  {[
                    { name: "Emily C.", text: "John completely transformed my fitness journey. His programs are challenging but achievable.", rating: 5 },
                    { name: "Marcus D.", text: "Professional, knowledgeable, and genuinely cares about his clients' success.", rating: 5 },
                  ].map((r) => (
                    <div key={r.name} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex gap-1 mb-2">
                        {[...Array(r.rating)].map((_, j) => <Star key={j} size={14} className="text-secondary fill-secondary" />)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">"{r.text}"</p>
                      <span className="text-xs font-semibold">{r.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Camera size={18} /> Media Gallery</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                      <Dumbbell size={24} className="text-muted-foreground/30" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <button className="w-full px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90 transition-opacity">
                Book a Session
              </button>

              {/* Upload Credentials */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Upload size={16} className="text-primary" /> Upload Credentials
                </h3>
                <p className="text-muted-foreground text-xs mb-4">
                  Submit your certifications and government ID for AI-powered verification.
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

              {/* Stats */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-sm mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  {[
                    { icon: Users, label: "Active Clients", value: "24" },
                    { icon: Star, label: "Avg Rating", value: "4.9" },
                    { icon: Calendar, label: "Sessions/Week", value: "18" },
                    { icon: Heart, label: "Success Stories", value: "120+" },
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
