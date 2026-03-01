import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTrainers, getIdTypeLabel } from "@/lib/trainerStore";
import { Search, MapPin, Star, Dumbbell, CheckCircle2, IndianRupee, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const FindTrainer = () => {
  const trainers = useTrainers();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [city, setCity] = useState("all");

  // Only show fully verified trainers
  const verified = trainers.filter((t) => t.certStatus === "verified" && t.idStatus === "verified");

  const allSpecialties = [...new Set(verified.flatMap((t) => t.specialties))].sort();
  const allCities = [...new Set(verified.map((t) => t.city).filter(Boolean))].sort();

  const filtered = verified.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchSpecialty = specialty === "all" || t.specialties.includes(specialty);
    const matchCity = city === "all" || t.city === city;
    return matchSearch && matchSpecialty && matchCity;
  });

  return (
    <div>
      {/* Hero */}
      <section className="section-padding pb-8" style={{ background: "var(--gradient-hero)" }}>
        <div className="container-tight text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-display font-extrabold text-primary-foreground">
            Find Your Perfect Trainer
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-2 text-primary-foreground/80 max-w-lg mx-auto">
            Browse verified fitness professionals ready to help you achieve your goals.
          </motion.p>
        </div>
      </section>

      <section className="section-padding pt-8">
        <div className="container-tight">
          {/* Filters */}
          <div className="glass-card p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or specialty..."
                className="pl-10"
              />
            </div>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {allSpecialties.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {allCities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Dumbbell size={48} className="mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="font-bold text-lg mb-2">No Verified Trainers Found</h3>
              <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters or check back later.</p>
              <Link to="/join-trainer">
                <Button className="bg-secondary text-secondary-foreground">Become a Trainer</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={i}
                  className="glass-card p-6 hover-lift"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-secondary font-semibold">
                      <CheckCircle2 size={14} /> Verified
                    </div>
                  </div>

                  <h3 className="font-bold text-lg">{t.name}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                    <MapPin size={12} /> {t.city}, {t.state}
                  </div>

                  <p className="text-muted-foreground text-sm mt-3 line-clamp-2">{t.bio || "Experienced fitness professional."}</p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {t.specialties.slice(0, 3).map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                    {t.specialties.length > 3 && (
                      <Badge variant="outline" className="text-[10px]">+{t.specialties.length - 3}</Badge>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-bold text-primary">
                      <IndianRupee size={14} /> {t.sessionRate}/session
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.sessionDuration} min • {t.yearsExperience} yrs exp
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs">
                      Book Session
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      View Profile
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 text-muted-foreground text-sm">
            Showing {filtered.length} verified trainer{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindTrainer;
