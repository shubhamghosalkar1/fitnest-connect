import { useSyncExternalStore } from "react";

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface RegisteredTrainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  gender: string;
  dateOfBirth: string;
  yearsExperience: string;
  specialties: string[];
  trainingStyle: string;
  bio: string;
  clientTypes: string;
  maxClients: string;
  languages: string;
  socialMedia: string;
  certName: string;
  certIssuer: string;
  certFile: string;
  govIdType: string;
  govIdFile: string;
  cprCertified: string;
  sessionRate: string;
  packageRate: string;
  sessionDuration: string;
  availableDays: string[];
  travelWilling: string;
  onlineTraining: string;
  certStatus: VerificationStatus;
  idStatus: VerificationStatus;
  joinedDate: string;
}

const AUTHORIZED_CERTS = [
  "NASM", "ACE", "ISSA", "NSCA", "ACSM", "NESTA", "AFAA", "CSCS",
  "NASM-CPT", "ACE-CPT", "ISSA-CPT", "NSCA-CPT", "ACSM-CPT",
];

const VALID_ID_TYPES = ["drivers-license", "passport", "pan-card", "aadhar-card"];

const ID_TYPE_LABELS: Record<string, string> = {
  "drivers-license": "Driver's License",
  "passport": "Passport",
  "pan-card": "PAN Card",
  "aadhar-card": "Aadhar Card",
};

export const getIdTypeLabel = (type: string) => ID_TYPE_LABELS[type] || type;

let trainers: RegisteredTrainer[] = [
  {
    id: "1", name: "John Doe", email: "john@example.com", phone: "+91 98765 43210",
    city: "Mumbai", state: "Maharashtra", gender: "male", dateOfBirth: "1990-05-15",
    yearsExperience: "5-10", specialties: ["Strength Training", "HIIT", "Bodybuilding"],
    trainingStyle: "one-on-one", bio: "Certified personal trainer with 8 years of experience.",
    clientTypes: "all", maxClients: "20", languages: "English, Hindi", socialMedia: "",
    certName: "NASM-CPT", certIssuer: "NASM", certFile: "NASM_Cert.pdf",
    govIdType: "drivers-license", govIdFile: "DL_MH.pdf", cprCertified: "yes",
    sessionRate: "1500", packageRate: "12000", sessionDuration: "60",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    travelWilling: "yes", onlineTraining: "yes",
    certStatus: "verified", idStatus: "verified", joinedDate: "2025-12-01",
  },
  {
    id: "2", name: "Sarah Kim", email: "sarah@example.com", phone: "+91 87654 32109",
    city: "Delhi", state: "Delhi", gender: "female", dateOfBirth: "1993-08-22",
    yearsExperience: "3-5", specialties: ["Yoga", "Pilates", "Prenatal/Postnatal"],
    trainingStyle: "both", bio: "Yoga and Pilates instructor passionate about holistic wellness.",
    clientTypes: "beginners", maxClients: "15", languages: "English, Korean, Hindi", socialMedia: "",
    certName: "ACE-CPT", certIssuer: "ACE", certFile: "ACE_Cert.pdf",
    govIdType: "passport", govIdFile: "Passport.pdf", cprCertified: "yes",
    sessionRate: "1200", packageRate: "10000", sessionDuration: "60",
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    travelWilling: "no", onlineTraining: "yes",
    certStatus: "pending", idStatus: "pending", joinedDate: "2026-01-15",
  },
  {
    id: "3", name: "Marcus Johnson", email: "marcus@example.com", phone: "+91 76543 21098",
    city: "Bangalore", state: "Karnataka", gender: "male", dateOfBirth: "1988-03-10",
    yearsExperience: "10+", specialties: ["CrossFit", "Functional Training", "Sports Performance"],
    trainingStyle: "group", bio: "CrossFit Level 2 trainer and former competitive athlete.",
    clientTypes: "advanced", maxClients: "25", languages: "English", socialMedia: "",
    certName: "ISSA-CPT", certIssuer: "ISSA", certFile: "ISSA_Cert.pdf",
    govIdType: "aadhar-card", govIdFile: "ID_blurry.jpg", cprCertified: "yes",
    sessionRate: "2000", packageRate: "16000", sessionDuration: "90",
    availableDays: ["Tuesday", "Thursday", "Saturday", "Sunday"],
    travelWilling: "yes", onlineTraining: "no",
    certStatus: "verified", idStatus: "rejected", joinedDate: "2026-02-10",
  },
  {
    id: "4", name: "Aisha Patel", email: "aisha@example.com", phone: "+91 65432 10987",
    city: "Pune", state: "Maharashtra", gender: "female", dateOfBirth: "1995-11-05",
    yearsExperience: "1-3", specialties: ["Nutrition Coaching", "Senior Fitness"],
    trainingStyle: "one-on-one", bio: "Nutrition coach focused on sustainable lifestyle changes.",
    clientTypes: "seniors", maxClients: "10", languages: "English, Hindi, Marathi", socialMedia: "",
    certName: "Unknown Cert", certIssuer: "Random Institute", certFile: "",
    govIdType: "", govIdFile: "", cprCertified: "no",
    sessionRate: "800", packageRate: "6500", sessionDuration: "45",
    availableDays: ["Monday", "Wednesday", "Friday"],
    travelWilling: "no", onlineTraining: "yes",
    certStatus: "pending", idStatus: "pending", joinedDate: "2026-02-25",
  },
];

type Listener = () => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());

export const trainerStore = {
  getTrainers: () => trainers,
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },

  addTrainer: (formData: Record<string, string | string[] | boolean>) => {
    const newTrainer: RegisteredTrainer = {
      id: Date.now().toString(),
      name: formData.fullName as string,
      email: formData.email as string,
      phone: formData.phone as string,
      city: formData.city as string,
      state: formData.state as string,
      gender: formData.gender as string,
      dateOfBirth: formData.dateOfBirth as string,
      yearsExperience: formData.yearsExperience as string,
      specialties: (formData.specialties as string[]) || [],
      trainingStyle: formData.trainingStyle as string,
      bio: formData.bio as string,
      clientTypes: formData.clientTypes as string,
      maxClients: formData.maxClients as string,
      languages: formData.languages as string,
      socialMedia: formData.socialMedia as string,
      certName: formData.certName as string,
      certIssuer: formData.certIssuer as string,
      certFile: formData.certFile as string,
      govIdType: formData.govIdType as string,
      govIdFile: formData.govIdFile as string,
      cprCertified: formData.cprCertified as string,
      sessionRate: formData.sessionRate as string,
      packageRate: formData.packageRate as string,
      sessionDuration: formData.sessionDuration as string,
      availableDays: (formData.availableDays as string[]) || [],
      travelWilling: formData.travelWilling as string,
      onlineTraining: formData.onlineTraining as string,
      certStatus: "pending",
      idStatus: "pending",
      joinedDate: new Date().toISOString().split("T")[0],
    };
    trainers = [...trainers, newTrainer];
    emit();
  },

  updateStatus: (id: string, field: "certStatus" | "idStatus", status: VerificationStatus) => {
    trainers = trainers.map((t) => (t.id === id ? { ...t, [field]: status } : t));
    emit();
  },

  deleteTrainer: (id: string) => {
    trainers = trainers.filter((t) => t.id !== id);
    emit();
  },

  runAIVerification: (id: string) => {
    trainers = trainers.map((t) => {
      if (t.id !== id) return t;
      const certUpper = (t.certName || "").toUpperCase();
      const issuerUpper = (t.certIssuer || "").toUpperCase();
      const isAuthorizedCert = AUTHORIZED_CERTS.some(
        (ac) => certUpper.includes(ac.toUpperCase()) || issuerUpper.includes(ac.toUpperCase())
      );
      const certVerified = isAuthorizedCert && !!t.certFile;
      const hasValidIdType = VALID_ID_TYPES.includes(t.govIdType);
      const hasIdFile = !!t.govIdFile && !t.govIdFile.toLowerCase().includes("blurry");
      const idVerified = hasValidIdType && hasIdFile;
      return {
        ...t,
        certStatus: certVerified ? "verified" as const : "rejected" as const,
        idStatus: idVerified ? "verified" as const : "rejected" as const,
      };
    });
    emit();
  },
};

export const useTrainers = () =>
  useSyncExternalStore(trainerStore.subscribe, trainerStore.getTrainers);
