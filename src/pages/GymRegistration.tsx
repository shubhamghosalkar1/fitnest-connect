import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, ArrowLeft, ArrowRight, CheckCircle2,
  MapPin, Clock, IndianRupee, Dumbbell, Users
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

const steps = [
  { title: "Gym Details", icon: Building2 },
  { title: "Location & Timings", icon: MapPin },
  { title: "Membership & Offers", icon: IndianRupee },
  { title: "Facilities & Staff", icon: Dumbbell },
  { title: "Review & Submit", icon: CheckCircle2 },
];

const facilityOptions = [
  "Cardio Equipment", "Free Weights", "Strength Machines", "Swimming Pool",
  "Sauna/Steam", "Group Classes", "Personal Training", "Parking",
  "Locker Rooms", "Shower Facilities", "Juice Bar/Café", "CrossFit Area",
  "Yoga Studio", "Boxing Ring", "Basketball Court", "Running Track",
];

const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type FormData = Record<string, string | string[]>;

const GymRegistration = () => {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    ownerName: "", gymName: "", email: "", phone: "",
    city: "", state: "", fullAddress: "",
    openingTime: "", closingTime: "", workingDays: [],
    equipmentList: "",
    membershipMonthly: "", membershipQuarterly: "", membershipYearly: "",
    currentOffers: "", trainerCount: "",
    facilities: [], description: "", socialMedia: "",
  });

  const update = (k: string, v: string | string[]) => setForm(p => ({ ...p, [k]: v }));
  const toggleArray = (k: string, item: string) => {
    const arr = (form[k] as string[]) || [];
    update(k, arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const progress = ((step + 1) / steps.length) * 100;
  const canNext = () => {
    if (step === 0) return form.ownerName && form.gymName && form.email && form.phone;
    if (step === 1) return form.city && form.state && form.fullAddress && form.openingTime && form.closingTime;
    if (step === 2) return form.membershipMonthly;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("gyms").insert({
      owner_name: form.ownerName as string,
      gym_name: form.gymName as string,
      email: form.email as string,
      phone: form.phone as string,
      city: form.city as string,
      state: form.state as string,
      full_address: form.fullAddress as string,
      opening_time: form.openingTime as string,
      closing_time: form.closingTime as string,
      working_days: form.workingDays as string[],
      equipment_list: form.equipmentList as string || null,
      membership_monthly: form.membershipMonthly as string || null,
      membership_quarterly: form.membershipQuarterly as string || null,
      membership_yearly: form.membershipYearly as string || null,
      current_offers: form.currentOffers as string || null,
      trainer_count: form.trainerCount as string || null,
      facilities: form.facilities as string[],
      description: form.description as string || null,
      social_media: form.socialMedia as string || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Registration failed. Please try again.");
      console.error(error);
    } else {
      toast.success("Gym registered! It will appear on listings once approved by admin.");
      setTimeout(() => navigate("/find-gym"), 2000);
    }
  };

  const fadeVariant = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <section className="pt-8 pb-4 section-padding" style={{ background: "var(--gradient-hero)" }}>
        <div className="container-tight text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-primary-foreground">
              Register Your Gym on FitNest
            </h1>
            <p className="mt-2 text-primary-foreground/80 max-w-lg mx-auto">
              List your gym to reach more clients and connect with certified trainers.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-tight section-padding !pt-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((s, i) => (
              <button
                key={s.title}
                onClick={() => i < step && setStep(i)}
                className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                  i <= step ? "text-primary" : "text-muted-foreground"
                } ${i < step ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < step ? "bg-secondary text-secondary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <CheckCircle2 size={18} /> : <s.icon size={16} />}
                </div>
                <span className="hidden sm:block">{s.title}</span>
              </button>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="glass-card">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="g0" {...fadeVariant} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Gym Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2"><Label>Owner Name *</Label><Input placeholder="Your full name" value={form.ownerName as string} onChange={e => update("ownerName", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Gym Name *</Label><Input placeholder="Gym name" value={form.gymName as string} onChange={e => update("gymName", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Email *</Label><Input type="email" placeholder="gym@email.com" value={form.email as string} onChange={e => update("email", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Phone *</Label><Input type="tel" placeholder="+91 98765 43210" value={form.phone as string} onChange={e => update("phone", e.target.value)} /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Gym Description</Label>
                    <Textarea placeholder="Tell us about your gym..." value={form.description as string} onChange={e => update("description", e.target.value)} className="min-h-[100px]" />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="g1" {...fadeVariant} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Location & Timings</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2"><Label>City *</Label><Input placeholder="Mumbai" value={form.city as string} onChange={e => update("city", e.target.value)} /></div>
                    <div className="space-y-2"><Label>State *</Label><Input placeholder="Maharashtra" value={form.state as string} onChange={e => update("state", e.target.value)} /></div>
                  </div>
                  <div className="space-y-2"><Label>Full Address *</Label><Textarea placeholder="Complete address with landmark" value={form.fullAddress as string} onChange={e => update("fullAddress", e.target.value)} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2"><Label>Opening Time *</Label><Input type="time" value={form.openingTime as string} onChange={e => update("openingTime", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Closing Time *</Label><Input type="time" value={form.closingTime as string} onChange={e => update("closingTime", e.target.value)} /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Working Days *</Label>
                    <div className="flex flex-wrap gap-2">
                      {dayOptions.map(d => (
                        <label key={d} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors">
                          <Checkbox checked={(form.workingDays as string[]).includes(d)} onCheckedChange={() => toggleArray("workingDays", d)} />
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="g2" {...fadeVariant} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Membership & Offers</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-2"><Label>Monthly Rate (₹) *</Label><Input type="number" placeholder="1500" value={form.membershipMonthly as string} onChange={e => update("membershipMonthly", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Quarterly Rate (₹)</Label><Input type="number" placeholder="4000" value={form.membershipQuarterly as string} onChange={e => update("membershipQuarterly", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Yearly Rate (₹)</Label><Input type="number" placeholder="12000" value={form.membershipYearly as string} onChange={e => update("membershipYearly", e.target.value)} /></div>
                  </div>
                  <div className="space-y-2"><Label>Current Offers / Discounts</Label><Textarea placeholder="e.g. 20% off on yearly membership, Free trial week..." value={form.currentOffers as string} onChange={e => update("currentOffers", e.target.value)} /></div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="g3" {...fadeVariant} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Facilities & Staff</h2>
                  <div className="space-y-2">
                    <Label>Number of Trainers</Label>
                    <Input type="number" placeholder="e.g. 5" value={form.trainerCount as string} onChange={e => update("trainerCount", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Equipment / Brands Available</Label>
                    <Textarea placeholder="e.g. Life Fitness treadmills, Hammer Strength racks..." value={form.equipmentList as string} onChange={e => update("equipmentList", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Facilities (select all)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {facilityOptions.map(f => (
                        <label key={f} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors">
                          <Checkbox checked={(form.facilities as string[]).includes(f)} onCheckedChange={() => toggleArray("facilities", f)} />
                          {f}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2"><Label>Social Media / Website</Label><Input placeholder="https://..." value={form.socialMedia as string} onChange={e => update("socialMedia", e.target.value)} /></div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="g4" {...fadeVariant} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Review & Submit</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="glass-card p-4"><span className="text-muted-foreground text-xs">Gym Name</span><div className="font-semibold">{form.gymName || "—"}</div></div>
                    <div className="glass-card p-4"><span className="text-muted-foreground text-xs">Owner</span><div className="font-semibold">{form.ownerName || "—"}</div></div>
                    <div className="glass-card p-4"><span className="text-muted-foreground text-xs">Location</span><div className="font-semibold">{form.city}, {form.state}</div></div>
                    <div className="glass-card p-4"><span className="text-muted-foreground text-xs">Hours</span><div className="font-semibold">{form.openingTime} – {form.closingTime}</div></div>
                    <div className="glass-card p-4"><span className="text-muted-foreground text-xs">Monthly Rate</span><div className="font-semibold">₹{form.membershipMonthly || "—"}</div></div>
                    <div className="glass-card p-4"><span className="text-muted-foreground text-xs">Facilities</span><div className="font-semibold">{(form.facilities as string[]).length} selected</div></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-2">
                <ArrowLeft size={16} /> Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="gap-2 bg-secondary text-secondary-foreground">
                  Next <ArrowRight size={16} />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={submitting} className="gap-2 bg-secondary text-secondary-foreground">
                  <CheckCircle2 size={16} /> {submitting ? "Submitting..." : "Submit Registration"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GymRegistration;
