import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock, IndianRupee, Building2, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const FindGym = () => {
  const [gyms, setGyms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGyms = async () => {
      const { data } = await supabase.from("gyms").select("*").eq("status", "approved");
      setGyms(data || []);
      setLoading(false);
    };
    fetchGyms();
  }, []);

  const allCities = [...new Set(gyms.map(g => g.city).filter(Boolean))].sort();

  const filtered = gyms.filter(g => {
    const matchSearch = g.gym_name.toLowerCase().includes(search.toLowerCase()) ||
      (g.description || "").toLowerCase().includes(search.toLowerCase());
    const matchCity = city === "all" || g.city === city;
    return matchSearch && matchCity;
  });

  return (
    <div>
      <section className="section-padding pb-8" style={{ background: "var(--gradient-hero)" }}>
        <div className="container-tight text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-display font-extrabold text-primary-foreground">
            Find a Gym Near You
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-2 text-primary-foreground/80 max-w-lg mx-auto">
            Browse verified gyms with facilities, membership plans, and more.
          </motion.p>
        </div>
      </section>

      <section className="section-padding pt-8">
        <div className="container-tight">
          <div className="glass-card p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gyms..." className="pl-10" />
            </div>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="City" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {allCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="glass-card p-12 text-center text-muted-foreground">Loading gyms...</div>
          ) : filtered.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Building2 size={48} className="mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="font-bold text-lg mb-2">No Gyms Found</h3>
              <p className="text-muted-foreground text-sm mb-4">Be the first to register your gym!</p>
              <Link to="/register-gym"><Button className="bg-secondary text-secondary-foreground">Register Your Gym</Button></Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((g, i) => (
                <motion.div key={g.id} initial="hidden" animate="visible" variants={fadeUp} custom={i} className="glass-card p-6 hover-lift">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 size={24} className="text-primary" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg">{g.gym_name}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                    <MapPin size={12} /> {g.city}, {g.state}
                  </div>
                  <p className="text-muted-foreground text-sm mt-3 line-clamp-2">{g.description || "Quality fitness facility."}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {(g.facilities || []).slice(0, 3).map((f: string) => (
                      <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                    ))}
                    {(g.facilities || []).length > 3 && <Badge variant="outline" className="text-[10px]">+{g.facilities.length - 3}</Badge>}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><Clock size={12} /> {g.opening_time} – {g.closing_time}</div>
                    <div className="flex items-center gap-1"><IndianRupee size={12} /> From ₹{g.membership_monthly}/month</div>
                    <div className="flex items-center gap-1"><Phone size={12} /> {g.phone}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center mt-8 text-muted-foreground text-sm">
            {!loading && `Showing ${filtered.length} gym${filtered.length !== 1 ? "s" : ""}`}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindGym;
