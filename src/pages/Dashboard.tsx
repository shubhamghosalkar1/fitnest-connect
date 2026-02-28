import { motion } from "framer-motion";
import {
  CalendarDays, MessageSquare, Bell, Settings, User, BarChart3,
  ShieldCheck, Clock, TrendingUp, ChevronRight
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { icon: User, label: "Profile" },
  { icon: CalendarDays, label: "Schedule" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Bell, label: "Notifications" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

const overviewCards = [
  { icon: CalendarDays, label: "Upcoming Sessions", value: "3", sub: "Next: Today at 2PM", color: "text-primary" },
  { icon: MessageSquare, label: "New Messages", value: "7", sub: "2 unread from clients", color: "text-secondary" },
  { icon: TrendingUp, label: "Progress Score", value: "85%", sub: "+12% this month", color: "text-secondary" },
  { icon: ShieldCheck, label: "Verification", value: "Verified", sub: "All credentials confirmed", color: "text-secondary" },
];

const sessions = [
  { client: "Emily Chen", time: "Today, 2:00 PM", type: "Strength Training" },
  { client: "Marcus Davis", time: "Today, 4:30 PM", type: "HIIT" },
  { client: "Sofia Patel", time: "Tomorrow, 10:00 AM", type: "Yoga" },
];

const Dashboard = () => {
  const [active, setActive] = useState("Profile");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-sidebar border-r border-sidebar-border p-4">
        <div className="mb-6">
          <div className="w-12 h-12 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground font-bold text-lg">JD</div>
          <div className="mt-3 text-sidebar-foreground font-semibold text-sm">John Doe</div>
          <div className="text-sidebar-foreground/60 text-xs">Certified Trainer</div>
        </div>
        <nav className="space-y-1 flex-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active === item.label
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-6 sm:p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold mb-1">Welcome back, John 👋</h1>
          <p className="text-muted-foreground text-sm mb-8">Here's an overview of your activity.</p>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {overviewCards.map((c) => (
              <div key={c.label} className="glass-card p-5 hover-lift">
                <div className="flex items-center justify-between mb-3">
                  <c.icon size={20} className={c.color} />
                  <span className={`text-2xl font-display font-bold ${c.color}`}>{c.value}</span>
                </div>
                <div className="font-semibold text-sm">{c.label}</div>
                <div className="text-muted-foreground text-xs mt-0.5">{c.sub}</div>
              </div>
            ))}
          </div>

          {/* Upcoming sessions */}
          <div className="glass-card p-6 mb-8">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock size={18} className="text-secondary" /> Upcoming Sessions
            </h2>
            <div className="divide-y divide-border">
              {sessions.map((s) => (
                <div key={s.client} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-semibold text-sm">{s.client}</div>
                    <div className="text-muted-foreground text-xs">{s.type}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs">{s.time}</span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity chart placeholder */}
          <div className="glass-card p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" /> Weekly Activity
            </h2>
            <div className="flex items-end gap-3 h-40">
              {[40, 65, 55, 80, 70, 90, 50].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-secondary/80 transition-all"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
