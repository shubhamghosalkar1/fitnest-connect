import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Users, CalendarDays, BarChart3, Award,
  Heart, Dumbbell, Building2, ArrowRight, Star, ChevronRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const features = [
  { icon: ShieldCheck, title: "Verified Portfolios", desc: "Trusted trainer profiles with credential verification." },
  { icon: Users, title: "Smart Matching", desc: "AI-powered client-trainer matching based on goals." },
  { icon: Building2, title: "Flexible Staffing", desc: "On-demand trainer staffing for gyms of all sizes." },
  { icon: CalendarDays, title: "Scheduling Tools", desc: "Seamless booking and calendar management." },
  { icon: BarChart3, title: "Progress Tracking", desc: "Visual dashboards for fitness journey analytics." },
  { icon: Award, title: "Credential Verification", desc: "AI-powered certification and ID verification." },
];

const benefits = [
  { icon: Dumbbell, title: "For Trainers", items: ["Build verified portfolios", "Find flexible opportunities", "Manage clients effortlessly"] },
  { icon: Heart, title: "For Clients", items: ["Find your perfect trainer", "Track your progress", "Personalized programs"] },
  { icon: Building2, title: "For Gyms", items: ["On-demand staffing", "Quality assurance", "Flexible hiring options"] },
];

const Index = () => (
  <div>
    {/* Hero */}
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>
      <div className="container-tight section-padding relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-primary-foreground leading-tight max-w-4xl mx-auto"
        >
          Connecting Trainers, Clients & Gyms—
          <span className="block mt-1" style={{ color: "hsl(145, 60%, 55%)" }}>
            Empowering Fitness Communities.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed"
        >
          FitNest creates structured, transparent professional connections in the fitness industry—bridging gaps in access, employment, and collaboration.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/portfolio" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90 transition-opacity">
            <Dumbbell size={18} /> Join as a Trainer
          </Link>
          <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-foreground text-primary font-semibold hover:opacity-90 transition-opacity">
            <Users size={18} /> Find a Trainer
          </Link>
          <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-colors">
            <Building2 size={18} /> For Gyms
          </Link>
        </motion.div>
      </div>
    </section>

    {/* What is FitNest */}
    <section className="section-padding">
      <div className="container-tight text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            What is <span className="text-primary">Fit</span><span className="text-secondary">Nest</span>?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            A community-driven platform that bridges gaps in access, employment, and collaboration across the fitness industry.
          </p>
        </motion.div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i + 1}
              className="glass-card p-8 hover-lift text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <b.icon size={24} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{b.title}</h3>
              <ul className="space-y-2">
                {b.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground text-sm">
                    <ChevronRight size={14} className="text-secondary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="section-padding bg-muted/50">
      <div className="container-tight">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold">Key Features</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to connect, verify, and grow in the fitness industry.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="glass-card p-6 hover-lift"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <f.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Community Impact */}
    <section className="section-padding">
      <div className="container-tight">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Community Impact</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mt-2">
              Fitness for Everyone, Everywhere
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              FitNest is committed to supporting underserved communities by increasing access to quality fitness professionals, creating economic opportunities for trainers, and promoting wellness in areas that need it most.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Increased access to certified trainers in underserved areas",
                "Economic empowerment for independent fitness professionals",
                "Community wellness programs and partnerships",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowRight size={12} className="text-secondary" />
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { num: "500+", label: "Trainers Onboarded" },
              { num: "10K+", label: "Sessions Booked" },
              { num: "50+", label: "Communities Served" },
              { num: "98%", label: "Satisfaction Rate" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-6 text-center">
                <div className="text-3xl font-display font-bold text-secondary">{s.num}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding bg-muted/50">
      <div className="container-tight text-center">
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-12">What People Are Saying</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Sarah M.", role: "Certified Trainer", quote: "FitNest gave me visibility I never had before. My client base tripled in 3 months!" },
            { name: "James R.", role: "Gym Owner", quote: "Finding qualified trainers used to take weeks. Now it's instant and verified." },
            { name: "Aisha K.", role: "Client", quote: "I finally found a trainer who understands my goals. The matching is spot-on." },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="glass-card p-8 text-left hover-lift"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className="text-secondary fill-secondary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t.quote}"</p>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding" style={{ background: "var(--gradient-hero)" }}>
      <div className="container-tight text-center">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">
          Ready to Join the FitNest Community?
        </h2>
        <p className="mt-4 text-primary-foreground/80 max-w-lg mx-auto">
          Whether you're a trainer, client, or gym—FitNest has the tools to help you succeed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90 transition-opacity">
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-colors">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Index;
