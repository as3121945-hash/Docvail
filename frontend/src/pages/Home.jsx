import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ShieldCheck, ArrowRight, Star, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen font-sans overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-healthGreen-100/50 rounded-full blur-3xl -z-10 opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 text-center lg:text-left animate-slide-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-healthGreen-100 text-healthGreen-800 text-sm font-semibold mb-6 border border-healthGreen-200 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-healthGreen-500 mr-2 animate-pulse"></span>
                The Future of Healthcare
              </div>
              <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl leading-tight mb-6">
                <span className="block">Find a doctor &</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-healthGreen-500 to-emerald-700">book instantly.</span>
              </h1>
              <p className="mt-3 text-lg text-gray-600 sm:mt-5 sm:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Skip the waiting room. Access real-time availability across top-rated hospitals and specialists, and confirm your appointment in seconds.
              </p>
              <div className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                <Link to="/search" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-healthGreen-500 hover:bg-healthGreen-600 shadow-lg shadow-healthGreen-500/30 hover:shadow-xl hover:shadow-healthGreen-500/40 transition-all transform hover:-translate-y-1">
                  Book Appointment <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/login?register=true" className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-gray-200 text-lg font-bold rounded-full text-gray-700 bg-white hover:border-healthGreen-500 hover:text-healthGreen-600 shadow-sm hover:shadow-md transition-all">
                  Join for Free
                </Link>
              </div>
              
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 font-medium">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user"/>
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-400"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                  <p>Trusted by 10,000+ patients</p>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block lg:col-span-6 relative animate-fade-in mt-12 lg:mt-0">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img src="/hero-image.png" alt="Medical Team" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-xl flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Available Today</p>
                  <p className="text-lg font-bold text-gray-900">124+ Doctors</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white relative rounded-t-[3rem] shadow-sm z-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-sm text-healthGreen-600 font-extrabold tracking-widest uppercase">Why choose Docvail</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A premium healthcare experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-healthGreen-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-healthGreen-500 transition-colors">
                <Search className="h-7 w-7 text-healthGreen-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Discovery</h3>
              <p className="text-gray-600 leading-relaxed">Instantly find top-rated specialists near you using our intelligent matching algorithm based on your exact symptoms.</p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-healthGreen-500 rounded-3xl p-8 shadow-lg shadow-healthGreen-500/20 transform md:-translate-y-4 hover:-translate-y-6 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/20">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Booking</h3>
              <p className="text-healthGreen-50 leading-relaxed">No more waiting on hold. View live availability calendars and lock in your appointment instantly with zero friction.</p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-healthGreen-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-healthGreen-500 transition-colors">
                <ShieldCheck className="h-7 w-7 text-healthGreen-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Partners</h3>
              <p className="text-gray-600 leading-relaxed">Every doctor and hospital on Docvail is rigorously vetted to ensure you receive only the highest standard of care.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Home;
