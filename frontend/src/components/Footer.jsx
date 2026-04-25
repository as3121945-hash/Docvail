import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import DocvailLogo from './DocvailLogo';

const Footer = () => {
  return (
    <footer className="bg-healthGreen-950 text-healthGreen-50 pt-16 pb-8 border-t border-healthGreen-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-healthGreen-500 p-2 rounded-xl">
                <DocvailLogo className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Docvail</span>
            </Link>
            <p className="text-healthGreen-200 text-sm leading-relaxed max-w-xs">
              Revolutionizing healthcare access. Find expert specialists, book appointments instantly, and manage your health journey with AI-powered ease.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-healthGreen-400 hover:text-white transition-colors"><Globe className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/search" className="text-healthGreen-200 hover:text-white transition-colors text-sm">Find a Doctor</Link></li>
              <li><Link to="/hospitals" className="text-healthGreen-200 hover:text-white transition-colors text-sm">Top Hospitals</Link></li>
              <li><Link to="/ai-symptom-checker" className="text-healthGreen-200 hover:text-white transition-colors text-sm">AI Symptom Checker</Link></li>
              <li><Link to="/about" className="text-healthGreen-200 hover:text-white transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">For Providers</h3>
            <ul className="space-y-3">
              <li><Link to="/register-doctor" className="text-healthGreen-200 hover:text-white transition-colors text-sm">Join as a Doctor</Link></li>
              <li><Link to="/register-hospital" className="text-healthGreen-200 hover:text-white transition-colors text-sm">Partner Hospital Program</Link></li>
              <li><Link to="/doctor-dashboard" className="text-healthGreen-200 hover:text-white transition-colors text-sm">Provider Portal</Link></li>
              <li><Link to="/resources" className="text-healthGreen-200 hover:text-white transition-colors text-sm">Medical Resources</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-3 text-sm text-healthGreen-200">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-healthGreen-500 shrink-0 mt-0.5" />
                <span>123 Healthway Avenue,<br />Tech Park, Jaipur 302022</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-healthGreen-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-healthGreen-500 shrink-0" />
                <span>support@docvail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-healthGreen-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-healthGreen-400 text-sm">
            © {new Date().getFullYear()} Docvail Healthcare. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-healthGreen-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-healthGreen-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="text-healthGreen-400 hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
