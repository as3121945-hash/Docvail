import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import DocvailLogo from '../components/DocvailLogo';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Please enter your email or mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Please enter a valid 10-digit mobile number').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['patient', 'hospital', 'admin'])
}).refine((data) => data.email || data.phone, {
  message: "Either Email or Mobile Number must be provided",
  path: ["email"], // attach error to email field
});

const Login = () => {
  const { login, register, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isRegisterParam = queryParams.get('register') === 'true';

  const [isRegister, setIsRegister] = useState(isRegisterParam);
  const [serverError, setServerError] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [pendingIdentifier, setPendingIdentifier] = useState('');
  const [otp, setOtp] = useState('');

  const { register: formRegister, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: { role: 'patient' }
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      if (isRegister) {
        // Send email/phone only if they are not empty strings
        const payload = {
          name: data.name,
          email: data.email || undefined,
          phone: data.phone || undefined,
          password: data.password,
          role: data.role
        };
        const res = await register(payload.name, payload.email, payload.phone, payload.password, payload.role);
        if (res && res.requireOTP) {
          setPendingIdentifier(res.identifier || payload.email || payload.phone);
          setOtpMode(true);
          return;
        }
      } else {
        await login(data.identifier, data.password);
      }
      navigate('/'); 
    } catch (err) {
      if (err.response?.data?.requireOTP) {
        setPendingIdentifier(err.response.data.identifier || data.identifier || data.email || data.phone);
        setOtpMode(true);
      } else {
        setServerError(err.response?.data?.msg || 'Authentication failed');
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setServerError('');
    try {
      await verifyOtp(pendingIdentifier, otp);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.msg || 'OTP Verification failed');
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setServerError('');
    setOtpMode(false);
    reset();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-healthGreen-50 -z-20"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-healthGreen-200/40 blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-100/40 blur-3xl -z-10"></div>

      <div className="w-full max-w-md animate-slide-up">
        
        {/* Back Link & Logo */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-healthGreen-600 transition-colors mb-4 sm:mb-0">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <div className="flex items-center justify-center sm:justify-end">
             <DocvailLogo className="h-8 w-8 mr-2" />
             <span className="font-extrabold text-xl text-gray-900">Docvail</span>
          </div>
        </div>

        <div className="glass bg-white/80 rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/50 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-healthGreen-400 to-emerald-600"></div>
          
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              {otpMode ? 'Verify your email' : (isRegister ? 'Create an account' : 'Welcome back')}
            </h2>
            <p className="text-gray-500 text-sm">
              {otpMode ? `We sent a 6-digit code to ${pendingIdentifier}.` : (isRegister ? 'Join Docvail to book appointments instantly.' : 'Enter your details to access your dashboard.')}
            </p>
          </div>

          {serverError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in mb-5">
              <p className="text-sm text-red-700 font-medium">{serverError}</p>
            </div>
          )}

          {otpMode ? (
            <form className="space-y-5 animate-slide-up" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">6-Digit OTP</label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456" 
                  className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-healthGreen-500 focus:border-transparent transition-all text-center text-2xl font-bold tracking-[0.5em] text-gray-900 placeholder-gray-300" 
                  required
                />
              </div>
              <button type="submit" className="w-full flex justify-center py-3.5 px-4 mt-8 border border-transparent rounded-xl shadow-lg shadow-healthGreen-500/30 text-sm font-bold text-white bg-healthGreen-500 hover:bg-healthGreen-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-healthGreen-500 transition-all transform hover:-translate-y-0.5">
                Verify & Continue
              </button>
              <button type="button" onClick={() => setOtpMode(false)} className="w-full mt-4 text-sm font-bold text-gray-500 hover:text-gray-700">
                Back to Login
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {isRegister && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input type="text" {...formRegister('name')} placeholder="Jane Doe" className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-healthGreen-500 focus:border-transparent transition-all sm:text-sm text-gray-900 placeholder-gray-400" />
                  {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name.message}</p>}
                </div>
              )}

              {isRegister ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address (Optional)</label>
                    <input type="email" {...formRegister('email')} placeholder="you@example.com" className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-healthGreen-500 focus:border-transparent transition-all sm:text-sm text-gray-900 placeholder-gray-400" />
                    {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>}
                  </div>
                  <div className="animate-fade-in">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number (Optional)</label>
                    <input type="tel" {...formRegister('phone')} placeholder="9876543210" className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-healthGreen-500 focus:border-transparent transition-all sm:text-sm text-gray-900 placeholder-gray-400" />
                    {errors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone.message}</p>}
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email or Mobile Number</label>
                  <input type="text" {...formRegister('identifier')} placeholder="Email or 10-digit mobile" className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-healthGreen-500 focus:border-transparent transition-all sm:text-sm text-gray-900 placeholder-gray-400" />
                  {errors.identifier && <p className="mt-1 text-xs text-red-500 font-medium">{errors.identifier.message}</p>}
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  {!isRegister && <a href="#" className="text-xs font-medium text-healthGreen-600 hover:text-healthGreen-500">Forgot password?</a>}
                </div>
                <input type="password" {...formRegister('password')} placeholder="••••••••" className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-healthGreen-500 focus:border-transparent transition-all sm:text-sm text-gray-900 placeholder-gray-400" />
                {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>}
              </div>

              {isRegister && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">I am a...</label>
                  <select {...formRegister('role')} className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-healthGreen-500 focus:border-transparent transition-all sm:text-sm text-gray-900 appearance-none">
                    <option value="patient">Patient looking for doctors</option>
                    <option value="hospital">Doctor / Healthcare Provider</option>
                    <option value="admin">Platform Administrator</option>
                  </select>
                  {errors.role && <p className="mt-1 text-xs text-red-500 font-medium">{errors.role.message}</p>}
                </div>
              )}

              <button type="submit" className="w-full flex justify-center py-3.5 px-4 mt-8 border border-transparent rounded-xl shadow-lg shadow-healthGreen-500/30 text-sm font-bold text-white bg-healthGreen-500 hover:bg-healthGreen-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-healthGreen-500 transition-all transform hover:-translate-y-0.5">
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          )}

          {!otpMode && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                {isRegister ? 'Already have an account?' : "Don't have an account yet?"}
                <button type="button" onClick={toggleMode} className="ml-1 font-bold text-healthGreen-600 hover:text-healthGreen-500 transition-colors">
                  {isRegister ? 'Sign in' : 'Create one now'}
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
