import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar as CalendarIcon, Clock, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react';

const PatientDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-healthGreen-200 border-t-healthGreen-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-healthGreen-600 font-medium">Loading appointments...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Appointments</h1>
          <p className="text-gray-500 mt-2">Manage your upcoming visits and view past records.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center animate-slide-up">
            <div className="w-20 h-20 bg-healthGreen-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="w-10 h-10 text-healthGreen-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming appointments</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">It looks like you don't have any appointments scheduled yet. Book your first visit today.</p>
            <a href="/search" className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-healthGreen-500 hover:bg-healthGreen-600 shadow-md shadow-healthGreen-500/20 transition-colors">
              Find a Doctor
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-healthGreen-50 text-healthGreen-600 flex items-center justify-center shrink-0">
                      <UserIcon className="w-6 h-6" />
                    </div>
                    {booking.status === 'confirmed' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Confirmed
                      </span>
                    ) : booking.status === 'cancelled' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" /> Cancelled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{booking.doctor_id?.name || 'Unknown Doctor'}</h3>
                  <p className="text-sm text-healthGreen-600 font-medium mb-5">{booking.doctor_id?.specialty || 'General'}</p>
                  
                  <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4 mr-3 text-gray-400 shrink-0" />
                      <span className="font-medium">{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-3 text-gray-400 shrink-0" />
                      <span className="font-medium">{booking.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
