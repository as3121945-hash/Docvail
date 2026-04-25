import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { Clock, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const bookingSchema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters'),
  patientEmail: z.string().email('Please enter a valid email'),
  selectedDate: z.string().min(1, 'Please select a date'),
  selectedSlot: z.string().min(1, 'Please select a slot')
});

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      patientName: user ? user.name : '',
      patientEmail: user ? user.email : '',
      selectedDate: '',
      selectedSlot: ''
    }
  });

  const selectedSlot = watch('selectedSlot');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors`);
        const found = res.data.doctors ? res.data.doctors.find(d => d._id === id) : res.data.find(d => d._id === id);
        setDoctor(found);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchDoctor();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      await api.post('/bookings', {
        doctor_id: doctor._id,
        patient_name: data.patientName,
        patient_email: data.patientEmail,
        time: data.selectedSlot,
        date: data.selectedDate
      });
      setBookingStatus('success');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setBookingStatus(err.response?.data?.msg || 'Booking failed');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!doctor) return <div className="text-center py-20 text-red-500">Doctor not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md border border-healthGreen-100 overflow-hidden">
        <div className="bg-healthGreen-600 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold">{doctor.name}</h1>
          <p className="text-healthGreen-100 mt-2 text-lg">{doctor.specialty}</p>
        </div>
        
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Details</h2>
            <div className="space-y-4 text-gray-600">
               <p><strong>Hospital:</strong> {doctor.hospital ? doctor.hospital.name : 'Independent'}</p>
               <p><strong>City:</strong> {doctor.city}</p>
               <p><strong>Status:</strong> {doctor.availability ? 'Available for booking' : 'Currently Unavailable'}</p>
            </div>
            
            {bookingStatus === 'success' && (
              <div className="mt-8 p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
                <p className="font-bold">Booking Confirmed!</p>
                <p className="text-sm">Confirmation email sent to {watch('patientEmail')}</p>
                <p className="text-xs mt-2 text-gray-500">Redirecting...</p>
              </div>
            )}
            
            {bookingStatus !== '' && bookingStatus !== 'success' && (
              <div className="mt-8 p-4 bg-red-50 text-red-800 rounded-md border border-red-200">
                {bookingStatus}
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Book Appointment</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <UserIcon className="h-4 w-4 text-gray-400" />
                   </div>
                   <input type="text" {...register('patientName')} className="pl-10 focus:ring-healthGreen-500 focus:border-healthGreen-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                 </div>
                 {errors.patientName && <p className="mt-1 text-xs text-red-500">{errors.patientName.message}</p>}
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-gray-700">Email (For Confirmation)</label>
                 <input type="email" {...register('patientEmail')} className="mt-1 focus:ring-healthGreen-500 focus:border-healthGreen-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                 {errors.patientEmail && <p className="mt-1 text-xs text-red-500">{errors.patientEmail.message}</p>}
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700">Select Date</label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <CalendarIcon className="h-4 w-4 text-gray-400" />
                   </div>
                   <input type="date" {...register('selectedDate')} min={new Date().toISOString().split('T')[0]} className="pl-10 focus:ring-healthGreen-500 focus:border-healthGreen-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                 </div>
                 {errors.selectedDate && <p className="mt-1 text-xs text-red-500">{errors.selectedDate.message}</p>}
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Select Slot</label>
                 <div className="grid grid-cols-2 gap-2">
                   {doctor.slots && doctor.slots.length > 0 ? (
                     doctor.slots.map((slot, idx) => (
                       <button
                         key={idx}
                         type="button"
                         onClick={() => setValue('selectedSlot', slot, { shouldValidate: true })}
                         className={`p-2 text-sm border rounded-md text-center transition ${selectedSlot === slot ? 'bg-healthGreen-600 text-white border-healthGreen-600' : 'bg-white text-gray-700 hover:border-healthGreen-500'}`}
                       >
                         {slot}
                       </button>
                     ))
                   ) : (
                     <p className="text-sm text-gray-500 col-span-2">No slots defined by doctor</p>
                   )}
                 </div>
                 {errors.selectedSlot && <p className="mt-1 text-xs text-red-500">{errors.selectedSlot.message}</p>}
              </div>

              <button
                type="submit"
                disabled={!doctor.availability || bookingStatus === 'success'}
                className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-healthGreen-600 hover:bg-healthGreen-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
