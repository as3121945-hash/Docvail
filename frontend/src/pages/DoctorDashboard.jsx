import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/doctor-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Error updating booking status.');
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthGreen-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your appointments and patient schedules.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center">
            <div className="bg-blue-50 p-4 rounded-xl mr-4">
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Bookings</p>
              <h3 className="text-3xl font-bold text-gray-900">{bookings.length}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center">
            <div className="bg-healthGreen-50 p-4 rounded-xl mr-4">
              <CheckCircle className="h-8 w-8 text-healthGreen-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Confirmed</p>
              <h3 className="text-3xl font-bold text-gray-900">{confirmedBookings.length}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center">
            <div className="bg-yellow-50 p-4 rounded-xl mr-4">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Requests</p>
              <h3 className="text-3xl font-bold text-gray-900">{pendingBookings.length}</h3>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900">Upcoming Appointments</h3>
          </div>
          
          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">You have no appointment requests yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <li key={booking._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-healthGreen-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-healthGreen-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{booking.patient_name}</h4>
                        <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {booking.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {booking.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>

                      {booking.status === 'pending' && (
                        <div className="flex gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-healthGreen-600 hover:bg-healthGreen-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" /> Confirm
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                          >
                            <XCircle className="h-4 w-4" /> Decline
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
