import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar, User, Clock, CheckCircle2, XCircle } from 'lucide-react';

const HospitalDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-healthGreen-200 border-t-healthGreen-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-healthGreen-600 font-medium">Loading hospital data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hospital Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage all appointments and patient scheduling across your facility.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-4">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
              <span className="text-sm text-gray-500 block">Total Appointments</span>
              <span className="text-xl font-bold text-gray-900">{bookings.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl shadow-gray-200/40 rounded-3xl overflow-hidden border border-gray-100 animate-slide-up">
          <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-gray-900">All Appointments</h2>
          </div>
          
          {bookings.length === 0 ? (
            <div className="p-12 text-center bg-gray-50/50">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No appointments scheduled yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Details</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Doctor</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {bookings.map(booking => (
                    <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10 bg-healthGreen-100 rounded-full flex items-center justify-center text-healthGreen-600">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">{booking.patient_name}</div>
                            <div className="text-sm text-gray-500">{booking.patient_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.doctor_id?.name || 'Unknown'}</div>
                        <div className="text-xs text-healthGreen-600">{booking.doctor_id?.specialty || 'Specialist'}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 mb-1">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" /> {booking.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" /> {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                          ${booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                          <div className="flex space-x-3">
                            <button onClick={() => updateStatus(booking._id, 'completed')} className="text-healthGreen-600 hover:text-healthGreen-900 transition-colors flex items-center bg-healthGreen-50 px-3 py-1.5 rounded-lg border border-healthGreen-100 hover:bg-healthGreen-100">
                              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Complete
                            </button>
                            <button onClick={() => updateStatus(booking._id, 'cancelled')} className="text-red-600 hover:text-red-900 transition-colors flex items-center bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100">
                              <XCircle className="w-4 h-4 mr-1.5" /> Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
