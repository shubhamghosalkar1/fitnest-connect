import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Dumbbell } from "lucide-react";

const TrainerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Check if email exists in trainers table
        const { data: trainer } = await supabase
          .from("trainers")
          .select("id, email")
          .eq("email", email)
          .maybeSingle();

        if (!trainer) {
          toast({ title: "Not Found", description: "No trainer registration found with this email. Please register as a trainer first.", variant: "destructive" });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: "Account Created!", description: "Please check your email to verify your account, then log in." });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Verify trainer exists
        const { data: trainer } = await supabase
          .from("trainers")
          .select("id")
          .eq("email", email)
          .maybeSingle();

        if (!trainer) {
          await supabase.auth.signOut();
          toast({ title: "Access Denied", description: "This account is not linked to a trainer profile.", variant: "destructive" });
          setLoading(false);
          return;
        }

        toast({ title: "Welcome back!", description: "Redirecting to your dashboard..." });
        navigate("/trainer-dashboard");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="text-primary" size={28} />
          </div>
          <h1 className="text-2xl font-display font-bold">Trainer Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isSignUp ? "Create your trainer account" : "Sign in to manage your clients"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email (used during registration)</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
            <LogIn size={16} className="mr-2" />
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isSignUp ? (
            <>Already have an account?{" "}
              <button onClick={() => setIsSignUp(false)} className="text-primary hover:underline">Sign In</button>
            </>
          ) : (
            <>First time here?{" "}
              <button onClick={() => setIsSignUp(true)} className="text-primary hover:underline">Create Account</button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TrainerLogin;
