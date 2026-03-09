import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/fitnest-logo.jpeg";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/find-trainer", label: "Find Trainer" },
  { to: "/find-gym", label: "Find Gym" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container-tight flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="FitNest" className="h-10 w-10 rounded-lg object-cover" />
          <span className="font-display font-bold text-xl tracking-tight">
            <span className="text-primary">Fit</span>
            <span className="text-secondary">Nest</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user && isAdmin ? (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to="/admin"
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold transition-colors hover:opacity-90"
              >
                Admin
              </Link>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/admin-login"
              className="ml-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold transition-colors hover:opacity-90"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === l.to
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to={user && isAdmin ? "/admin" : "/admin-login"}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-semibold text-secondary"
              >
                Admin
              </Link>
              {user && isAdmin && (
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-destructive"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
