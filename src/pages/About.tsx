import { motion } from "framer-motion";
import { Target, Eye, Lightbulb, Users, Shield, Heart } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const About = () => (
  <div>
    {/* Hero */}
    <section className="section-padding" style={{ background: "var(--gradient-hero)" }}>
      <div className="container-tight text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-display font-extrabold text-foreground"
        >
          About FitNest
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto"
        >
          Building bridges in fitness—one connection at a time.
        </motion.p>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="section-padding">
      <div className="container-tight grid md:grid-cols-2 gap-12">
        {[
          { icon: Target, title: "Our Mission", text: "To create a transparent, accessible platform that connects fitness professionals with clients and gyms—empowering communities through health and wellness." },
          { icon: Eye, title: "Our Vision", text: "A world where every person has access to verified, quality fitness support—and every trainer has the tools and opportunities to thrive." },
        ].map((item, i) => (
          <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="glass-card p-8 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <item.icon size={24} className="text-secondary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">{item.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* The Problem */}
    <section className="section-padding bg-muted/50">
      <div className="container-tight max-w-3xl text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">The Problem</span>
          <h2 className="text-3xl font-display font-bold mt-2">An Industry in Need of Structure</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            The fitness industry suffers from a lack of transparency—clients can't verify trainer credentials, trainers struggle with inconsistent opportunities, and gyms face challenges in finding qualified staff quickly. Underserved communities are hit hardest, with limited access to quality fitness support.
          </p>
        </motion.div>
      </div>
    </section>

    {/* The Solution */}
    <section className="section-padding">
      <div className="container-tight text-center">
        <h2 className="text-3xl font-display font-bold mb-12">The FitNest Solution</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Centralization & Verification", desc: "All trainers verified through AI-powered credential checks." },
            { icon: Lightbulb, title: "Structured Tools", desc: "Scheduling, messaging, and progress tracking—all in one place." },
            { icon: Heart, title: "Community First", desc: "Focused on inclusion, wellness equity, and empowerment." },
          ].map((s, i) => (
            <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="glass-card p-8 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <s.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section-padding bg-muted/50">
      <div className="container-tight text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Our Values</h2>
        <p className="text-muted-foreground mb-12 max-w-xl mx-auto">Guiding everything we build and every community we serve.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Transparency", "Inclusion", "Empowerment", "Excellence"].map((v, i) => (
            <motion.div key={v} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="glass-card p-6 hover-lift">
              <Users size={20} className="text-secondary mx-auto mb-2" />
              <span className="font-semibold text-sm">{v}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
