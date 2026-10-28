import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, Phone, User as UserIcon, ArrowRight, Music } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { setUser } from '../store/slices/authSlice';
import authService from '../services/authService';
import { showToast } from '../store/slices/uiSlice';

export const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authService.signup(formData);
      dispatch(setUser(user));
      dispatch(showToast({ message: `Welcome to Vibify, ${user.name}! 🎉`, type: 'success' }));
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
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
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Join Vibify</h1>
          <p className="text-xs text-slate-400 mt-1">Start your personalized music vibe journey today</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ada Lovelace"
            icon={UserIcon}
            required
          />

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

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            icon={Phone}
          />

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
            className="w-full mt-3"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Login Link */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold text-emerald-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

