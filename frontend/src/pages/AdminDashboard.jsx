import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Shield, Activity, Users, MapPin } from 'lucide-react';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors');
        setDoctors(res.data.doctors || res.data); // Handle pagination response
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-healthGreen-200 border-t-healthGreen-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-healthGreen-600 font-medium">Loading platform data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="bg-gray-900 p-3 rounded-2xl mr-4 shadow-lg shadow-gray-900/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platform Admin</h1>
              <p className="text-gray-500 mt-1">System overview and provider management.</p>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-0 flex gap-4">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Users className="w-5 h-5"/></div>
              <div>
                <span className="text-xs text-gray-500 block font-bold uppercase tracking-wider">Total Doctors</span>
                <span className="text-xl font-bold text-gray-900">{doctors.length}</span>
              </div>
            </div>
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="bg-healthGreen-50 p-2 rounded-lg text-healthGreen-600"><Activity className="w-5 h-5"/></div>
              <div>
                <span className="text-xs text-gray-500 block font-bold uppercase tracking-wider">Active</span>
                <span className="text-xl font-bold text-gray-900">{doctors.filter(d => d.availability).length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl shadow-gray-200/40 rounded-3xl overflow-hidden border border-gray-100 animate-slide-up">
          <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-gray-900">Registered Providers</h2>
            <button className="text-sm font-bold text-healthGreen-600 hover:text-healthGreen-700 bg-healthGreen-50 px-4 py-2 rounded-xl transition-colors">Export Directory</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor Details</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Specialty</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Platform Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {doctors.map(doctor => (
                  <tr key={doctor._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{doctor.name}</div>
                          <div className="text-sm text-gray-500">ID: {doctor._id.substring(0,8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{doctor.specialty}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1.5 text-gray-400" /> {doctor.city}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${doctor.availability ? 'bg-healthGreen-100 text-healthGreen-800 border border-healthGreen-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                        {doctor.availability ? (
                          <><span className="w-1.5 h-1.5 rounded-full bg-healthGreen-600 mr-1.5"></span> Active</>
                        ) : (
                          <><span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5"></span> Unavailable</>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
