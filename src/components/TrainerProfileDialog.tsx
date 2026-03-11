import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Award, Calendar, IndianRupee, Dumbbell, Users, Clock, Wifi, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  bio: string;
  specialties: string[];
  yearsExperience: string;
  sessionRate: string;
  packageRate: string;
  sessionDuration: string;
  availableDays: string[];
  trainingStyle: string;
  onlineTraining: string;
  travelWilling: string;
  maxClients: string;
  certName: string;
}

interface Props {
  trainer: Trainer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrainerProfileDialog = ({ trainer, open, onOpenChange }: Props) => {
  if (!trainer) return null;

  const initials = trainer.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Trainer Profile</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold">{trainer.name}</h2>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MapPin size={14} /> {trainer.city}, {trainer.state}
            </div>
          </div>
        </div>

        {trainer.bio && <p className="text-muted-foreground text-sm mb-4">{trainer.bio}</p>}

        {trainer.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {trainer.specialties.map(s => (
              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
            ))}
          </div>
        )}

        <div className="space-y-3 text-sm">
          {[
            { icon: Award, label: "Certification", value: trainer.certName },
            { icon: Calendar, label: "Experience", value: trainer.yearsExperience ? `${trainer.yearsExperience} years` : undefined },
            { icon: IndianRupee, label: "Session Rate", value: trainer.sessionRate ? `₹${trainer.sessionRate}` : undefined },
            { icon: IndianRupee, label: "Package (10 sessions)", value: trainer.packageRate ? `₹${trainer.packageRate}` : undefined },
            { icon: Clock, label: "Session Duration", value: trainer.sessionDuration ? `${trainer.sessionDuration} min` : undefined },
            { icon: Dumbbell, label: "Training Style", value: trainer.trainingStyle },
            { icon: Users, label: "Max Clients", value: trainer.maxClients },
            { icon: Wifi, label: "Online Training", value: trainer.onlineTraining },
            { icon: Car, label: "Willing to Travel", value: trainer.travelWilling },
          ].filter(r => r.value).map(r => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="flex items-center gap-2 text-muted-foreground">
                <r.icon size={14} /> {r.label}
              </span>
              <span className="font-semibold capitalize">{r.value}</span>
            </div>
          ))}
        </div>

        {trainer.availableDays && trainer.availableDays.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Available Days</h4>
            <div className="flex flex-wrap gap-2">
              {trainer.availableDays.map(d => (
                <span key={d} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">{d}</span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-muted-foreground">
          📞 {trainer.phone} &nbsp;•&nbsp; ✉️ {trainer.email}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerProfileDialog;
