import { motion } from "framer-motion";
import {
  Dumbbell, Heart, Building2, Eye, Briefcase, Users, BarChart3,
  Award, CalendarDays, MessageSquare, ShieldCheck, Target
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const sections = [
  {
    id: "trainers",
    icon: Dumbbell,
    title: "For Trainers",
    desc: "Build your career with verified visibility and powerful tools.",
    features: [
      { icon: Eye, title: "Visibility & Verified Portfolios", desc: "Stand out with a verified profile that showcases your certifications, specialties, and client success stories." },
      { icon: Briefcase, title: "Flexible Job Opportunities", desc: "Access short-term and long-term positions at gyms, studios, and private clients." },
      { icon: Users, title: "Client Management Tools", desc: "Track sessions, manage schedules, and communicate with clients—all in one place." },
      { icon: Award, title: "Credential Tracking", desc: "Keep your certifications organized and get AI-verified to build trust." },
    ],
  },
  {
    id: "clients",
    icon: Heart,
    title: "For Clients",
    desc: "Find your perfect fitness match and track your journey.",
    features: [
      { icon: Target, title: "Personalized Trainer Matching", desc: "Our smart matching algorithm connects you with trainers based on your goals, location, and preferences." },
      { icon: BarChart3, title: "Goal-Based Programs", desc: "Get customized workout plans designed around your specific fitness objectives." },
      { icon: BarChart3, title: "Progress Tracking", desc: "Visual dashboards to monitor your fitness journey and celebrate milestones." },
      { icon: MessageSquare, title: "Direct Communication", desc: "Message trainers, schedule sessions, and get support—all from one dashboard." },
    ],
  },
  {
    id: "gyms",
    icon: Building2,
    title: "For Gyms",
    desc: "Staff smarter with verified, on-demand fitness professionals.",
    features: [
      { icon: Users, title: "On-Demand Trainer Staffing", desc: "Fill gaps in your roster quickly with pre-verified, qualified trainers." },
      { icon: ShieldCheck, title: "Verification & QA", desc: "Every trainer on FitNest is AI-verified—credentials, certifications, and identity confirmed." },
      { icon: CalendarDays, title: "Flexible Hiring Options", desc: "Hire for a single session or a full season. Scale your team as your gym grows." },
      { icon: BarChart3, title: "Performance Analytics", desc: "Track trainer performance, client satisfaction, and operational metrics." },
    ],
  },
];

const Services = () => (
  <div>
    <section className="section-padding" style={{ background: "var(--gradient-hero)" }}>
      <div className="container-tight text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-display font-extrabold text-foreground">
          Our Services
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-foreground/80 text-lg max-w-2xl mx-auto">
          Tools and services designed for every stakeholder in the fitness ecosystem.
        </motion.p>
      </div>
    </section>

    {sections.map((section, si) => (
      <section key={section.id} className={`section-padding ${si % 2 === 1 ? "bg-muted/50" : ""}`}>
        <div className="container-tight">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <section.icon size={20} className="text-secondary" />
            </div>
            <h2 className="text-3xl font-display font-bold">{section.title}</h2>
          </motion.div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.5} className="text-muted-foreground mb-10 ml-[52px]">
            {section.desc}
          </motion.p>
          <div className="grid sm:grid-cols-2 gap-6">
            {section.features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="glass-card p-6 hover-lift">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    ))}
  </div>
);

export default Services;
