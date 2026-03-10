import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", type: "Client", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "Our team will respond within 24–48 hours." });
    setForm({ name: "", email: "", type: "Client", subject: "", message: "" });
  };

  return (
    <div>
      <section className="section-padding" style={{ background: "var(--gradient-hero)" }}>
        <div className="container-tight text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-display font-extrabold text-foreground">
            Get in Touch
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-primary-foreground/80 text-lg">
            We'd love to hear from you. Our team will respond within 24–48 hours.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name</label>
                  <input
                    required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input
                    required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">I am a</label>
                  <select
                    value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Client</option>
                    <option>Trainer</option>
                    <option>Gym</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Subject</label>
                  <input
                    required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="How can we help?"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Message</label>
                <textarea
                  required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Tell us more..."
                />
              </div>
              <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90 transition-opacity">
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: "hello@fitnest.com" },
              { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
              { icon: MapPin, label: "Address", value: "123 Fitness Ave, New York, NY" },
              { icon: Clock, label: "Hours", value: "Mon–Fri, 9AM–6PM EST" },
            ].map((c) => (
              <div key={c.label} className="glass-card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <c.icon size={18} className="text-secondary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{c.label}</div>
                  <div className="text-muted-foreground text-sm">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
