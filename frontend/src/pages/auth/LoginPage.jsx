import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { ShieldCheckIcon, AcademicCapIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useDashboard();
  const [selectedRole, setSelectedRole] = useState('mentor');
  const [username, setUsername] = useState('arulraj.k');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(selectedRole);
    if (selectedRole === 'super_admin') {
      navigate('/admin');
    } else if (selectedRole === 'hod') {
      navigate('/departments');
    } else {
      navigate('/mentor');
    }
  };

  const handleDemoSelect = (role) => {
    setSelectedRole(role);
    if (role === 'super_admin') {
      setUsername('principal.velmurugan');
    } else if (role === 'hod') {
      setUsername('hod.manohar');
    } else {
      setUsername('arulraj.k');
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF3F8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Institutional Top Header */}
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mx-auto w-16 h-16 bg-[#5B82C5] rounded-2xl flex items-center justify-center text-white shadow-lg text-2xl font-black tracking-wider mb-4 border-2 border-white">
          FX
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          FRANCIS XAVIER ENGINEERING COLLEGE
        </h2>
        <p className="text-xs font-bold text-[#5B82C5] tracking-widest uppercase mt-1">
          Autonomous Institution • Affiliated to Anna University • NAAC 'A+' Grade
        </p>
        <p className="text-sm font-semibold text-gray-600 mt-2">
          Academic Mentor & Student Success ERP Portal
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 w-full max-w-md mx-auto">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-200 sm:px-10">
          {/* Quick Demo Role Selector */}
          <div className="mb-6 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
            <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center mb-1.5">
              Select Demo Role Persona
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => handleDemoSelect('super_admin')}
                className={`py-2.5 px-1 text-center text-xs font-bold rounded-lg transition-all min-h-[44px] ${
                  selectedRole === 'super_admin'
                    ? 'bg-[#5B82C5] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('hod')}
                className={`py-2.5 px-1 text-center text-xs font-bold rounded-lg transition-all min-h-[44px] ${
                  selectedRole === 'hod'
                    ? 'bg-[#5B82C5] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                HOD CSE
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('mentor')}
                className={`py-2.5 px-1 text-center text-xs font-bold rounded-lg transition-all min-h-[44px] ${
                  selectedRole === 'mentor'
                    ? 'bg-[#5B82C5] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Faculty Mentor
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleLoginSubmit}>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Institutional Username / Email
              </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
                  placeholder="enter.name@francisxavier.ac.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#5B82C5] focus:ring-[#5B82C5] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-gray-700">
                  Remember Me on this Workstation
                </label>
              </div>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('For password resets, contact FXEC IT Cell at support@francisxavier.ac.in');
                }}
                className="text-xs font-bold text-[#5B82C5] hover:underline px-2 py-2 min-h-[44px] inline-block"
              >
                Forgot Password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-black text-white bg-[#5B82C5] hover:bg-[#4A6FA8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B82C5] transition-all"
              >
                Sign In to Academic ERP Portal
              </button>
            </div>
          </form>

          {/* Footer Security Badge */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center space-x-2 text-xs font-semibold text-gray-500">
            <ShieldCheckIcon className="w-4 h-4 text-[#4CAF50]" />
            <span>256-Bit SSL Encrypted ERP Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};
