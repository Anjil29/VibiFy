import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, Phone, ArrowRight, Music, KeyRound } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { setUser } from '../store/slices/authSlice';
import authService from '../services/authService';
import { showToast } from '../store/slices/uiSlice';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const fillTestCredentials = () => {
    setLoginMethod('email');
    setFormData({
      email: 'codeBeats@vibify.com',
      phone: '',
      password: 'password123',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authService.login({
        email: loginMethod === 'email' ? formData.email : `${formData.phone}@vibify.local`,
        password: formData.password,
      });

      dispatch(setUser(user));
      dispatch(showToast({ message: `Welcome back, ${user.name}! 🎧`, type: 'success' }));
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Try using the test credentials button below.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-radial-[circle_at_top] from-slate-900 via-slate-950 to-slate-950 text-white">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl shadow-2xl flex flex-col gap-6 text-left">
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-3">
            <Music className="w-7 h-7 text-slate-950" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Welcome to Vibify</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to sync your vibes and liked songs</p>
        </div>

        {/* Test Credentials Banner with One-Click Fill */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              Demo Credentials
            </span>
            <button
              type="button"
              onClick={fillTestCredentials}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>
          <div className="font-mono text-[11px] text-slate-400 flex flex-col gap-0.5">
            <span>email: <span className="text-slate-200">codeBeats@vibify.com</span></span>
            <span>password: <span className="text-slate-200">password123</span></span>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {loginMethod === 'email' ? (
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@vibify.com"
              icon={Mail}
              required
            />
          ) : (
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              icon={Phone}
              required
            />
          )}

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          {/* Toggle Phone / Email */}
          <button
            type="button"
            onClick={() => {
              setLoginMethod(loginMethod === 'email' ? 'phone' : 'email');
              setError('');
            }}
            className="text-xs text-slate-400 hover:text-emerald-300 transition-colors text-center cursor-pointer mt-1"
          >
            {loginMethod === 'email'
              ? 'Continue with phone number instead'
              : 'Continue with email address instead'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>Don't have an account? </span>
          <Link to="/signup" className="font-semibold text-emerald-400 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

