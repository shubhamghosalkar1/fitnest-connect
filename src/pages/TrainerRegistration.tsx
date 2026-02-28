import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import {
  ArrowLeft, ArrowRight, Upload, ShieldCheck, Dumbbell,
  User, DollarSign, FileCheck, CheckCircle2
} from "lucide-react";

type FormData = Record<string, string | string[] | boolean>;

const steps = [
  { title: "Personal Info", icon: User },
  { title: "Professional Background", icon: Dumbbell },
  { title: "Certifications & ID", icon: ShieldCheck },
  { title: "Pricing & Availability", icon: DollarSign },
  { title: "Review & Submit", icon: FileCheck },
];

const specialties = [
  "Strength Training", "HIIT", "Yoga", "Pilates", "CrossFit",
  "Boxing", "Swimming", "Nutrition Coaching", "Rehabilitation",
  "Senior Fitness", "Youth Training", "Prenatal/Postnatal",
  "Functional Training", "Sports Performance", "Bodybuilding",
];

const TrainerRegistration = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    // Step 1 – Personal Info
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zipCode: "",
    gender: "",
    dateOfBirth: "",
    // Step 2 – Professional
    yearsExperience: "",
    specialties: [] as string[],
    trainingStyle: "",
    bio: "",
    clientTypes: "",
    maxClients: "",
    languages: "",
    socialMedia: "",
    // Step 3 – Certifications
    certName: "",
    certIssuer: "",
    certFile: "",
    govIdType: "",
    govIdFile: "",
    cprCertified: "",
    // Step 4 – Pricing
    sessionRate: "",
    packageRate: "",
    sessionDuration: "",
    availableDays: [] as string[],
    travelWilling: "",
    onlineTraining: "",
  });

  const update = (key: string, value: string | string[] | boolean) =>
    setForm((p) => ({ ...p, [key]: value }));

  const toggleArrayItem = (key: string, item: string) => {
    const arr = (form[key] as string[]) || [];
    update(key, arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const progress = ((step + 1) / steps.length) * 100;

  const canNext = () => {
    if (step === 0) return form.fullName && form.email && form.phone && form.city;
    if (step === 1) return form.yearsExperience && (form.specialties as string[]).length > 0;
    if (step === 2) return form.certName && form.govIdType;
    if (step === 3) return form.sessionRate && form.sessionDuration;
    return true;
  };

  const handleSubmit = () => {
    toast.success("Registration submitted! Our AI verification will review your credentials within 24-48 hours.");
  };

  const fadeVariant = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <section className="pt-8 pb-4 section-padding" style={{ background: "var(--gradient-hero)" }}>
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-primary-foreground">
              Join FitNest as a Trainer
            </h1>
            <p className="mt-2 text-primary-foreground/80 max-w-lg mx-auto">
              Complete your profile to get verified and start connecting with clients.
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
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i < step
                      ? "bg-secondary text-secondary-foreground"
                      : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <CheckCircle2 size={18} /> : <s.icon size={16} />}
                </div>
                <span className="hidden sm:block">{s.title}</span>
              </button>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Steps */}
        <Card className="glass-card">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* STEP 0: Personal Info */}
              {step === 0 && (
                <motion.div key="s0" {...fadeVariant} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Personal Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input placeholder="John Doe" value={form.fullName as string} onChange={(e) => update("fullName", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address *</Label>
                      <Input type="email" placeholder="john@email.com" value={form.email as string} onChange={(e) => update("email", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input type="tel" placeholder="+1 (555) 000-0000" value={form.phone as string} onChange={(e) => update("phone", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input type="date" value={form.dateOfBirth as string} onChange={(e) => update("dateOfBirth", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>City *</Label>
                      <Input placeholder="New York" value={form.city as string} onChange={(e) => update("city", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input placeholder="NY" value={form.state as string} onChange={(e) => update("state", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Zip Code</Label>
                      <Input placeholder="10001" value={form.zipCode as string} onChange={(e) => update("zipCode", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={form.gender as string} onValueChange={(v) => update("gender", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="nonbinary">Non-binary</SelectItem>
                          <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 1: Professional Background */}
              {step === 1 && (
                <motion.div key="s1" {...fadeVariant} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Professional Background</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Years of Experience *</Label>
                      <Select value={form.yearsExperience as string} onValueChange={(v) => update("yearsExperience", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1–3 years</SelectItem>
                          <SelectItem value="3-5">3–5 years</SelectItem>
                          <SelectItem value="5-10">5–10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Training Style</Label>
                      <Select value={form.trainingStyle as string} onValueChange={(v) => update("trainingStyle", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-on-one">One-on-One</SelectItem>
                          <SelectItem value="group">Group Training</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                          <SelectItem value="online">Online Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Client Types</Label>
                      <Select value={form.clientTypes as string} onValueChange={(v) => update("clientTypes", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginners">Beginners</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced/Athletes</SelectItem>
                          <SelectItem value="seniors">Seniors</SelectItem>
                          <SelectItem value="all">All Levels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Max Concurrent Clients</Label>
                      <Input type="number" placeholder="e.g. 15" value={form.maxClients as string} onChange={(e) => update("maxClients", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Languages Spoken</Label>
                      <Input placeholder="English, Spanish" value={form.languages as string} onChange={(e) => update("languages", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Social Media / Website</Label>
                      <Input placeholder="https://instagram.com/..." value={form.socialMedia as string} onChange={(e) => update("socialMedia", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Specialties * (select all that apply)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {specialties.map((s) => (
                        <label key={s} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors">
                          <Checkbox
                            checked={(form.specialties as string[]).includes(s)}
                            onCheckedChange={() => toggleArrayItem("specialties", s)}
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Professional Bio</Label>
                    <Textarea
                      placeholder="Tell potential clients about yourself, your approach, and what makes you unique..."
                      className="min-h-[120px]"
                      value={form.bio as string}
                      onChange={(e) => update("bio", e.target.value)}
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Certifications & ID */}
              {step === 2 && (
                <motion.div key="s2" {...fadeVariant} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Certifications & Identification</h2>
                  <p className="text-muted-foreground text-sm">
                    Upload your credentials for AI-powered verification. Our system reviews documents within 24–48 hours.
                  </p>

                  <div className="glass-card p-6 space-y-5">
                    <h3 className="font-semibold flex items-center gap-2">
                      <ShieldCheck size={18} className="text-secondary" /> Primary Certification
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label>Certification Name *</Label>
                        <Input placeholder="e.g. NASM-CPT, ACE, ISSA" value={form.certName as string} onChange={(e) => update("certName", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Issuing Organization</Label>
                        <Input placeholder="e.g. NASM" value={form.certIssuer as string} onChange={(e) => update("certIssuer", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Upload Certification Document</Label>
                      <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload size={24} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload PDF, JPG, or PNG (max 10MB)</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => update("certFile", e.target.files?.[0]?.name || "")}
                        />
                        {form.certFile && (
                          <span className="text-xs font-medium text-secondary">{form.certFile as string}</span>
                        )}
                      </label>
                    </div>
                    <div className="space-y-2">
                      <Label>CPR/AED Certified?</Label>
                      <RadioGroup value={form.cprCertified as string} onValueChange={(v) => update("cprCertified", v)} className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="yes" id="cpr-yes" />
                          <Label htmlFor="cpr-yes" className="cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="cpr-no" />
                          <Label htmlFor="cpr-no" className="cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="glass-card p-6 space-y-5">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileCheck size={18} className="text-primary" /> Government ID Verification
                    </h3>
                    <div className="space-y-2">
                      <Label>ID Type *</Label>
                      <Select value={form.govIdType as string} onValueChange={(v) => update("govIdType", v)}>
                        <SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="drivers-license">Driver's License</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="state-id">State ID</SelectItem>
                          <SelectItem value="military-id">Military ID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Upload Government ID</Label>
                      <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload size={24} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload front of your ID (JPG, PNG, PDF)</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => update("govIdFile", e.target.files?.[0]?.name || "")}
                        />
                        {form.govIdFile && (
                          <span className="text-xs font-medium text-secondary">{form.govIdFile as string}</span>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      🔒 Your ID is encrypted and used only for identity verification. It is never shared publicly.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Pricing & Availability */}
              {step === 3 && (
                <motion.div key="s3" {...fadeVariant} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Pricing & Availability</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Per-Session Rate (USD) *</Label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input type="number" placeholder="75" className="pl-9" value={form.sessionRate as string} onChange={(e) => update("sessionRate", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Package Rate (10 sessions, USD)</Label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input type="number" placeholder="650" className="pl-9" value={form.packageRate as string} onChange={(e) => update("packageRate", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Session Duration *</Label>
                      <Select value={form.sessionDuration as string} onValueChange={(v) => update("sessionDuration", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Willing to Travel to Clients?</Label>
                      <RadioGroup value={form.travelWilling as string} onValueChange={(v) => update("travelWilling", v)} className="flex gap-6 pt-2">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="yes" id="travel-yes" />
                          <Label htmlFor="travel-yes" className="cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="travel-no" />
                          <Label htmlFor="travel-no" className="cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Offer Online Training?</Label>
                      <RadioGroup value={form.onlineTraining as string} onValueChange={(v) => update("onlineTraining", v)} className="flex gap-6 pt-2">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="yes" id="online-yes" />
                          <Label htmlFor="online-yes" className="cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="online-no" />
                          <Label htmlFor="online-no" className="cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Available Days (select all that apply)</Label>
                    <div className="flex flex-wrap gap-2">
                      {days.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleArrayItem("availableDays", d)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            (form.availableDays as string[]).includes(d)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Review */}
              {step === 4 && (
                <motion.div key="s4" {...fadeVariant} className="space-y-6">
                  <h2 className="text-2xl font-display font-bold">Review Your Application</h2>
                  <p className="text-muted-foreground text-sm">Please review your information before submitting.</p>

                  <div className="space-y-4">
                    {[
                      { label: "Full Name", value: form.fullName },
                      { label: "Email", value: form.email },
                      { label: "Phone", value: form.phone },
                      { label: "Location", value: [form.city, form.state, form.zipCode].filter(Boolean).join(", ") },
                      { label: "Experience", value: form.yearsExperience ? `${form.yearsExperience} years` : "" },
                      { label: "Specialties", value: (form.specialties as string[]).join(", ") },
                      { label: "Training Style", value: form.trainingStyle },
                      { label: "Certification", value: form.certName },
                      { label: "Cert Document", value: form.certFile || "Not uploaded" },
                      { label: "Gov ID Type", value: form.govIdType },
                      { label: "Gov ID Document", value: form.govIdFile || "Not uploaded" },
                      { label: "Session Rate", value: form.sessionRate ? `$${form.sessionRate}` : "" },
                      { label: "Package Rate (10)", value: form.packageRate ? `$${form.packageRate}` : "" },
                      { label: "Session Duration", value: form.sessionDuration ? `${form.sessionDuration} min` : "" },
                      { label: "Available Days", value: (form.availableDays as string[]).join(", ") },
                      { label: "Travel to Clients", value: form.travelWilling },
                      { label: "Online Training", value: form.onlineTraining },
                    ]
                      .filter((r) => r.value)
                      .map((r) => (
                        <div key={r.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                          <span className="text-sm text-muted-foreground">{r.label}</span>
                          <span className="text-sm font-medium text-right max-w-[60%]">{r.value as string}</span>
                        </div>
                      ))}
                  </div>

                  <div className="glass-card p-4 flex items-start gap-3">
                    <ShieldCheck size={20} className="text-secondary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      By submitting, you agree to FitNest's Terms of Service and consent to AI-powered verification of your certifications and government ID. Verification typically completes within 24–48 hours.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 0}
                className="gap-2"
              >
                <ArrowLeft size={16} /> Back
              </Button>

              {step < steps.length - 1 ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="gap-2">
                  Next <ArrowRight size={16} />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <CheckCircle2 size={16} /> Submit Application
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainerRegistration;
