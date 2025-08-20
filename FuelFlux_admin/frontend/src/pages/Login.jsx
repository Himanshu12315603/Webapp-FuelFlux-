import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regMessage, setRegMessage] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Decide endpoint by email
      let endpoint = '/api/auth/user/login';
      let loginEmail = email.trim().toLowerCase();
      // If no @, treat as admin username and append @admin.com
      if (!loginEmail.includes('@')) {
        loginEmail = `${loginEmail}@admin.com`;
      }
      if (loginEmail.endsWith('@admin.com')) {
        endpoint = '/api/auth/admin/login';
      }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: loginEmail, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Login failed');
        throw new Error(data.error || 'Login failed');
      }
      // Store token or flag in sessionStorage for PrivateRoute to detect
      sessionStorage.setItem('token', data.token || 'loggedin');
      setMessage('Login successful! Redirecting...');
      // Use navigate for SPA navigation
      navigate('/admin/dashboard');
    } catch (err) {
      setMessage(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegMessage('');
    try {
      // Determine if this is an admin registration
      let isAdmin = false;
      let regEmailFixed = regEmail.trim().toLowerCase();
      
      // Check for admin registration conditions
      if ((!regEmailFixed.includes('@') && regUsername && regEmailFixed === '') ||
          !regEmailFixed.includes('@') || 
          regEmailFixed.endsWith('@admin.com')) {
        isAdmin = true;
        if (!regEmailFixed.includes('@')) {
          regEmailFixed = regEmailFixed || regUsername.toLowerCase();
          regEmailFixed = `${regEmailFixed}@admin.com`;
        }
      }

      const endpoint = isAdmin ? '/api/auth/admin/register' : '/api/auth/register';
      
      console.log('Registration request to:', endpoint);
      console.log('Payload:', { 
        username: regUsername, 
        email: regEmailFixed, 
        phoneNumber: regPhone, 
        password: regPassword 
      });

      // Define valid permissions based on the Admin model
      const validPermissions = [
        'manage_stations',
        'manage_employees',
        'manage_bookings',
        'manage_nozzles',
        'view_reports'
      ];
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          username: regUsername.trim(), 
          email: regEmailFixed, 
          phoneNumber: regPhone, 
          password: regPassword,
          role: isAdmin ? 'admin' : 'user',
          // Use all valid permissions for admin, empty array for regular users
          permissions: isAdmin ? validPermissions : []
        })
      });
      
      const data = await res.json().catch(err => ({}));
      
      if (!res.ok) {
        console.error('Registration failed:', data);
        throw new Error(data.message || data.error || 'Registration failed');
      }
      
      setRegMessage('Registration successful! You can now login.');
    } catch (err) {
      console.error('Registration error:', err);
      setRegMessage(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2 py-8">
      <div className="w-full max-w-md border border-gray-300 rounded shadow-xl bg-white">
        {/* Header with logo and tagline */}
        <div className="bg-black rounded-t px-8 pt-8 pb-4 flex flex-col items-center">
          <div className="flex justify-center items-center mb-4">
            <img 
              src="/src/assets/LOGO.png" 
              alt="FuelFlux Logo" 
              className="h-14 w-auto object-contain"
            />
          </div>
          <h2 className="text-white text-lg font-bold text-center">Welcome to <span className="text-orange-500">FuelFlux</span></h2>
          <p className="text-white text-sm text-center mt-1">Fast & Reliable fuel delivery service at your fingertips. Find the nearest fuel stations and book with ease.</p>
        </div>
        {/* Tabs as underlined links */}
        <div className="flex justify-center mt-6 gap-8">
          <button
            className={`text-lg font-bold pb-1 transition-colors duration-200 border-b-4 ${!isRegister ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-700'} focus:outline-none`}
            onClick={() => setIsRegister(false)}
            type="button"
          >
            Login
          </button>
          <button
            className={`text-lg font-bold pb-1 transition-colors duration-200 border-b-4 ${isRegister ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-700'} focus:outline-none`}
            onClick={() => setIsRegister(true)}
            type="button"
          >
            Register
          </button>
        </div>
        <div className="px-8 pb-8 pt-4">
          {isRegister ? (
            <form className="px-8 pt-6 pb-8" onSubmit={handleRegister}>
              <label className="block font-bold text-black mb-1" htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                type="text"
                placeholder="Username"
                value={regUsername}
                onChange={e => setRegUsername(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-orange-500 text-black bg-white"
                required
              />
              <label className="block font-bold text-black mb-1" htmlFor="reg-email">Email</label>
              <div className="flex mb-4">
                <input
                  id="reg-username-email"
                  type="text"
                  placeholder="Username"
                  value={regEmail.endsWith('@admin.com') ? regEmail.split('@')[0] : regEmail}
                  onChange={e => setRegEmail(e.target.value + '@admin.com')}
                  className="w-2/3 p-2 border border-gray-300 rounded-l focus:outline-orange-500 text-black bg-white"
                  required
                />
                <div className="w-1/3 bg-gray-100 border border-l-0 border-gray-300 rounded-r flex items-center justify-center text-gray-600">
                  @admin.com
                </div>
              </div>
              <input
                id="reg-phone"
                type="tel"
                placeholder="Phone Number"
                value={regPhone}
                onChange={e => setRegPhone(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-orange-500 text-black bg-white"
                required
              />
              <label className="block font-bold text-black mb-1" htmlFor="reg-password">Password</label>
              <div className="relative mb-4">
                <input
                  id="reg-password"
                  type={regShowPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-orange-500 text-black bg-white"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-2 text-sm text-orange-500"
                  onClick={() => setRegShowPassword(s => !s)}
                  tabIndex={-1}
                >
                  {regShowPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-bold transition mt-2"
                disabled={regLoading}
              >
                {regLoading ? 'Registering...' : 'Register'}
              </button>
              {regMessage && <div className="mt-4 text-center text-orange-600">{regMessage}</div>}
            </form>
          ) : (
            <form onSubmit={handleLogin} className="mt-6">
              <label className="block font-bold text-black mb-1" htmlFor="login-email">Email</label>
              <div className="flex mb-4">
                <input
                  id="login-username"
                  type="text"
                  placeholder="Username"
                  value={email.endsWith('@admin.com') ? email.split('@')[0] : email}
                  onChange={e => setEmail(e.target.value + '@admin.com')}
                  className="w-2/3 p-2 border border-gray-300 rounded-l focus:outline-orange-500 text-black bg-white"
                  required
                />
                <div className="w-1/3 bg-gray-100 border border-l-0 border-gray-300 rounded-r flex items-center justify-center text-gray-600">
                  @admin.com
                </div>
              </div>
              <label className="block font-bold text-black mb-1" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-orange-500 text-black bg-white"
                required
              />
              <div className="flex items-center justify-between mb-4">
                <label className="inline-flex items-center text-sm">
                  <input type="checkbox" className="form-checkbox mr-1" />
                  Remember me
                </label>
                <button type="button" className="text-orange-600 text-sm hover:underline font-semibold">Forgot Password?</button>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-bold transition"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              {message && <div className="mt-4 text-center text-orange-600">{message}</div>}

            </form>
          )}
          <div className="mt-6 text-center">
            {!isRegister ? (
              <>
                <span className="text-gray-700">Don't have an account?</span>
                <button type="button" className="ml-2 text-orange-700 hover:underline font-bold" onClick={() => setIsRegister(true)}>Register</button>
              </>
            ) : (
              <>
                <span className="text-gray-700">Already have an account?</span>
                <button type="button" className="ml-2 text-orange-700 hover:underline font-bold" onClick={() => setIsRegister(false)}>Login</button>
              </>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="text-center text-gray-400 text-xs py-4"> 2025 FuelFlux. All rights reserved.</div>
      </div> 
    </div>
  );
}

export default Login;