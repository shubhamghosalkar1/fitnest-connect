import { Link } from "react-router-dom";
import logo from "@/assets/fitnest-logo.jpeg";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container-tight section-padding">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="FitNest" className="h-10 w-10 rounded-lg object-cover" />
            <span className="font-display font-bold text-xl">FitNest</span>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Connecting trainers, clients & gyms—empowering fitness communities everywhere.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-70">Platform</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/services" className="hover:opacity-100 transition-opacity">Services</Link></li>
            <li><Link to="/portfolio" className="hover:opacity-100 transition-opacity">Portfolio</Link></li>
            <li><Link to="/dashboard" className="hover:opacity-100 transition-opacity">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-70">Company</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/about" className="hover:opacity-100 transition-opacity">About</Link></li>
            <li><Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-70">Connect</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="#" className="hover:opacity-100 transition-opacity">Twitter</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Instagram</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">LinkedIn</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-60">
        © {new Date().getFullYear()} FitNest. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
