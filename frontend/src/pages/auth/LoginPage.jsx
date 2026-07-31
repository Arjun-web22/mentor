import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheckIcon, AcademicCapIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { login as loginApi, googleLogin as googleLoginApi } from '../../services/authService';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const googleButtonRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const [googleScriptError, setGoogleScriptError] = useState(false);

  // Load Google Identity Services script
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        setGoogleScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleScriptLoaded(true);
      };
      script.onerror = () => {
        setGoogleScriptError(true);
        console.error('Failed to load Google Identity Services script');
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  // Initialize Google Sign-In after script loads
  useEffect(() => {
    if (googleScriptLoaded && window.google && !googleScriptError) {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
          callback: handleGoogleCredentialResponse,
          auto_select: false,
        });

        // Render the Google Sign-In button
        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        }
      } catch (err) {
        console.error('Error initializing Google Sign-In:', err);
        setGoogleScriptError(true);
      }
    }
  }, [googleScriptLoaded, googleScriptError]);

  const handleGoogleCredentialResponse = async (response) => {
    setIsLoading(true);
    setError('');

    try {
      const apiResponse = await googleLoginApi(response.credential);

      if (apiResponse.success) {
        login(apiResponse.token, apiResponse.user);

        const userRole = apiResponse.user.role;
        if (userRole === 'SUPER_ADMIN') {
          navigate('/admin');
        } else if (userRole === 'COLLEGE_ADMIN') {
          navigate('/college');
        } else if (userRole === 'HOD') {
          navigate('/departments');
        } else if (userRole === 'MENTOR') {
          navigate('/mentor');
        } else {
          navigate('/departments');
        }
      } else {
        setError(apiResponse.message || 'Google login failed');
      }
    } catch (err) {
      console.error('Google login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Unable to authenticate with Google. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await loginApi(username, password);

      if (response.success) {
        // Store token and user in AuthContext
        login(response.token, response.user);

        // Navigate based on user role from backend (not frontend selection)
        const userRole = response.user.role;
        
        if (userRole === 'SUPER_ADMIN') {
          navigate('/admin');
        } else if (userRole === 'COLLEGE_ADMIN') {
          navigate('/college');
        } else if (userRole === 'HOD') {
          navigate('/departments');
        } else if (userRole === 'MENTOR') {
          navigate('/mentor');
        } else {
          navigate('/departments'); // Default fallback
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Unable to connect to server. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
          {/* Error Message */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-red-800 text-center">{error}</p>
            </div>
          )}

          {/* Google Script Error */}
          {googleScriptError && (
            <div className="mb-5 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-yellow-800 text-center">
                Google Sign-In failed to load. Please use email/password login or refresh the page.
              </p>
            </div>
          )}

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
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-black text-white bg-[#5B82C5] hover:bg-[#4A6FA8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B82C5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In to Academic ERP Portal'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <div className="flex justify-center">
              {googleScriptLoaded ? (
                <div ref={googleButtonRef} className="w-full"></div>
              ) : googleScriptError ? (
                <div className="w-full text-center text-xs font-semibold text-gray-500 py-3">
                  Google Sign-In unavailable
                </div>
              ) : (
                <div className="w-full flex justify-center items-center py-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>
                  <span className="ml-2 text-xs font-semibold text-gray-600">Loading Google Sign-In...</span>
                </div>
              )}
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
