import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Search, MapPin, Building2, Mic, Send, Sparkles, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetchDoctors();
    
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN'; // Support Hindi/English mix

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAiInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const fetchDoctors = async (searchCity = city, searchSpecialty = specialty) => {
    setLoading(true);
    try {
      let query = '?';
      if (searchCity) query += `city=${searchCity}&`;
      if (searchSpecialty) query += `specialty=${searchSpecialty}`;
      
      const res = await api.get(`/doctors${query}`);
      setDoctors(res.data.doctors || res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleAiAnalyze = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await api.post('/ai/analyze', { text: aiInput });
      const { city: detectedCity, specialty: detectedSpecialty } = res.data;
      
      setCity(detectedCity || '');
      setSpecialty(detectedSpecialty || '');
      setAiInput('');
      fetchDoctors(detectedCity, detectedSpecialty);
    } catch (err) {
      console.error('AI analysis failed:', err);
      alert('AI Assistant is unavailable. Please search manually.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-healthGreen-100 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50 -z-10"></div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Find the Best <span className="text-healthGreen-600">Care</span> Near You
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search manually or use our AI assistant to find the right specialist based on your symptoms.
          </p>
        </div>

        {/* AI Assistant Section */}
        <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-healthGreen-400 to-emerald-500"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-healthGreen-500 p-2 rounded-xl text-white shadow-lg shadow-healthGreen-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Symptom Assistant</h2>
                <p className="text-sm text-gray-500 italic">"Try saying: 'Mera pet dard kr rha h, Jaipur m specialist dikhao'"</p>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Describe your symptoms or what you're looking for..."
                className="w-full bg-white/80 border border-gray-200 rounded-2xl px-6 py-4 pr-32 focus:ring-2 focus:ring-healthGreen-500 focus:border-transparent transition-all shadow-sm text-lg"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAiAnalyze()}
              />
              <div className="absolute right-2 top-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  title="Voice Search (Hindi/English)"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={handleAiAnalyze}
                  disabled={isAiLoading || !aiInput.trim()}
                  className="bg-healthGreen-600 text-white p-3 rounded-xl hover:bg-healthGreen-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-healthGreen-600/20 transition-all"
                >
                  {isAiLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Search Section */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-healthGreen-500 focus:border-transparent shadow-sm transition-all text-gray-900"
                placeholder="Specialty (e.g. Cardiologist)"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
            </div>
            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-healthGreen-500 focus:border-transparent shadow-sm transition-all text-gray-900"
                placeholder="City (e.g. Jaipur)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="md:col-span-2 bg-gray-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-gray-800 shadow-xl shadow-gray-900/20 transition-all transform hover:-translate-y-0.5"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))
          ) : doctors.length > 0 ? (
            doctors.map((doc, index) => (
              <div key={doc._id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-healthGreen-50 rounded-2xl flex items-center justify-center text-healthGreen-600">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=f0fdf4&color=16a34a&bold=true&size=64`} alt={doc.name} className="w-full h-full rounded-2xl object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{doc.name}</h3>
                      <div className="inline-block px-2 py-0.5 bg-healthGreen-50 text-healthGreen-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {doc.specialty}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest ${doc.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {doc.availability ? 'Active' : 'Offline'}
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-500">
                    <Building2 className="h-4 w-4 mr-3 text-gray-400 shrink-0" />
                    <span className="line-clamp-1">{doc.hospital ? doc.hospital.name : 'Independent Specialist'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400 shrink-0" />
                    <span>{doc.city}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 font-medium">
                    <Sparkles className="h-4 w-4 mr-3 text-healthGreen-500 shrink-0" />
                    <span>{doc.experience || '10+ years'} Experience</span>
                  </div>
                </div>

                <Link
                  to={`/doctor/${doc._id}`}
                  className="block w-full text-center bg-gray-50 text-gray-900 border border-gray-100 hover:bg-healthGreen-500 hover:text-white hover:border-healthGreen-500 py-3 rounded-2xl font-bold transition-all duration-300"
                >
                  Book Appointment
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your filters or describe your symptoms to the AI assistant.</p>
              <button onClick={() => { setCity(''); setSpecialty(''); fetchDoctors('', ''); }} className="mt-6 text-healthGreen-600 font-bold hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDoctors;
