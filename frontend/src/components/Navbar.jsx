import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X } from 'lucide-react';
import DocvailLogo from './DocvailLogo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="bg-healthGreen-500 p-2 rounded-lg group-hover:bg-healthGreen-600 transition-colors shadow-sm">
                <DocvailLogo className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 font-extrabold text-2xl tracking-tight text-gray-900 group-hover:text-healthGreen-700 transition-colors">Docvail</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="text-gray-600 hover:text-healthGreen-600 px-3 py-2 text-sm font-medium transition-colors">Home</Link>
              <Link to="/search" className="text-gray-600 hover:text-healthGreen-600 px-3 py-2 text-sm font-medium transition-colors">Find a Doctor</Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600 font-medium">Hello, <span className="font-bold text-gray-900">{user.name}</span></span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium text-healthGreen-600 hover:text-healthGreen-500 transition-colors">Admin Panel</Link>
                )}
                {user.role === 'hospital' && (
                  <Link to="/hospital" className="text-sm font-medium text-healthGreen-600 hover:text-healthGreen-500 transition-colors">Dashboard</Link>
                )}
                {user.role === 'patient' && (
                  <Link to="/patient" className="text-sm font-medium text-healthGreen-600 hover:text-healthGreen-500 transition-colors">My Appointments</Link>
                )}
                <button onClick={handleLogout} className="bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Log in</Link>
                <Link to="/login?register=true" className="bg-healthGreen-500 text-white hover:bg-healthGreen-600 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Sign Up Free</Link>
              </div>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass absolute w-full border-b border-gray-100 animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg rounded-b-xl">
             <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-healthGreen-600 hover:bg-healthGreen-50">Home</Link>
             <Link to="/search" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-healthGreen-600 hover:bg-healthGreen-50">Find a Doctor</Link>
             {!user && (
               <>
                 <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-healthGreen-600 hover:bg-healthGreen-50">Log in</Link>
                 <Link to="/login?register=true" className="block px-3 py-2 mt-2 text-center rounded-md text-base font-medium bg-healthGreen-500 text-white hover:bg-healthGreen-600">Sign Up Free</Link>
               </>
             )}
             {user && (
               <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 mt-2">Logout</button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
