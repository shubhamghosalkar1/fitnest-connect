import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Trainer {
  name: string;
  availableDays: string[];
  sessionDuration: string;
  sessionRate: string;
}

const TIME_SLOTS = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM",
];

interface Props {
  trainer: Trainer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookSessionDialog = ({ trainer, open, onOpenChange }: Props) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  if (!trainer) return null;

  const handleBook = () => {
    setBooked(true);
    toast.success(`Session booked with ${trainer.name}`, {
      description: `${selectedDay} at ${selectedSlot} • ${trainer.sessionDuration} min • ₹${trainer.sessionRate}`,
    });
    setTimeout(() => {
      onOpenChange(false);
      setSelectedDay(null);
      setSelectedSlot(null);
      setBooked(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      onOpenChange(v);
      if (!v) { setSelectedDay(null); setSelectedSlot(null); setBooked(false); }
    }}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Session with {trainer.name}</DialogTitle>
        </DialogHeader>

        {booked ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="mx-auto mb-4 text-secondary" />
            <h3 className="font-bold text-lg mb-1">Session Booked!</h3>
            <p className="text-muted-foreground text-sm">{selectedDay} at {selectedSlot}</p>
          </div>
        ) : (
          <>
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Calendar size={14} /> Select Day</h4>
              <div className="flex flex-wrap gap-2">
                {trainer.availableDays.length > 0 ? trainer.availableDays.map(d => (
                  <button
                    key={d}
                    onClick={() => { setSelectedDay(d); setSelectedSlot(null); }}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedDay === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {d}
                  </button>
                )) : (
                  <p className="text-muted-foreground text-sm">No available days listed.</p>
                )}
              </div>
            </div>

            {selectedDay && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Clock size={14} /> Select Time Slot</h4>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        selectedSlot === slot
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDay && selectedSlot && (
              <div className="mt-4 p-4 rounded-lg bg-muted/50 text-sm space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Day</span><span className="font-semibold">{selectedDay}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-semibold">{selectedSlot}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-semibold">{trainer.sessionDuration} min</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Rate</span><span className="font-semibold text-primary">₹{trainer.sessionRate}</span></div>
              </div>
            )}

            <Button
              onClick={handleBook}
              disabled={!selectedDay || !selectedSlot}
              className="w-full mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Confirm Booking
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookSessionDialog;
