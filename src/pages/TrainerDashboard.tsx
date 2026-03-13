import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, Activity, ClipboardList, Dumbbell, LogOut } from "lucide-react";
import ClientsTab from "@/components/trainer/ClientsTab";
import ProgressTab from "@/components/trainer/ProgressTab";
import SessionsTab from "@/components/trainer/SessionsTab";
import WorkoutPlansTab from "@/components/trainer/WorkoutPlansTab";

const TrainerDashboard = () => {
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [trainerName, setTrainerName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/trainer-login"); return; }

      const { data: trainer } = await supabase
        .from("trainers")
        .select("id, name")
        .eq("email", user.email)
        .maybeSingle();

      if (!trainer) {
        toast({ title: "No trainer profile", description: "Your email is not linked to a trainer account.", variant: "destructive" });
        navigate("/trainer-login");
        return;
      }
      setTrainerId(trainer.id);
      setTrainerName(trainer.name);
      setLoading(false);
    };
    init();
  }, [navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/trainer-login");
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading dashboard...</div>;

  return (
    <div className="section-padding">
      <div className="container-tight">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Welcome, <span className="gradient-text">{trainerName}</span></h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your clients, track progress, and create workout plans.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={14} className="mr-1" /> Logout
          </Button>
        </motion.div>

        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="clients" className="text-xs sm:text-sm"><Users size={14} className="mr-1 hidden sm:inline" /> Clients</TabsTrigger>
            <TabsTrigger value="progress" className="text-xs sm:text-sm"><Activity size={14} className="mr-1 hidden sm:inline" /> Progress</TabsTrigger>
            <TabsTrigger value="sessions" className="text-xs sm:text-sm"><ClipboardList size={14} className="mr-1 hidden sm:inline" /> Sessions</TabsTrigger>
            <TabsTrigger value="plans" className="text-xs sm:text-sm"><Dumbbell size={14} className="mr-1 hidden sm:inline" /> Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientsTab trainerId={trainerId!} />
          </TabsContent>
          <TabsContent value="progress">
            <ProgressTab trainerId={trainerId!} />
          </TabsContent>
          <TabsContent value="sessions">
            <SessionsTab trainerId={trainerId!} />
          </TabsContent>
          <TabsContent value="plans">
            <WorkoutPlansTab trainerId={trainerId!} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrainerDashboard;
