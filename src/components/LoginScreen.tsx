import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Dumbbell, AlertCircle, Sparkles } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { StorageService } from '../services/storage';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onBack: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  onSignUpClick: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onBack,
  onLoginSuccess,
  onSignUpClick,
}) => {
  const [email, setEmail] = useState('john.barangan@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = StorageService.loginUser(email, password);
    if (!res.success || !res.user) {
      setErrorMsg(res.error || 'Login failed. Please check your credentials or click Sign Up.');
      return;
    }

    onLoginSuccess(res.user.profile);
  };

  const handleDemoLogin = () => {
    setEmail('john.barangan@example.com');
    setPassword('password123');
    setErrorMsg(null);
    const res = StorageService.loginUser('john.barangan@example.com', 'password123');
    if (res.user) {
      onLoginSuccess(res.user.profile);
    }
  };

  const handleSocialLogin = (socialEmail: string, name: string) => {
    const res = StorageService.loginUser(socialEmail, 'social123');
    if (res.user) {
      onLoginSuccess(res.user.profile);
    } else {
      // auto register social
      const reg = StorageService.registerUser({
        name,
        email: socialEmail,
        password: 'social123',
      });
      if (reg.user) {
        onLoginSuccess(reg.user.profile);
      }
    }
  };

  return (
    <div className="relative min-h-[780px] h-full flex flex-col justify-between bg-[#f8fafc] text-slate-800 px-6 pb-8">
      <StatusBar onBack={onBack} transparent />

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4">
        {/* Dumbbell Icon with soft glow */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full" />
            <div className="relative w-16 h-16 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-md">
              <Dumbbell className="w-8 h-8 stroke-[2.2]" />
            </div>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome Back!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Let's continue your fitness journey.
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email Address */}
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-colors"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-2xl pl-11 pr-11 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/25 active:scale-[0.99] transition-all mt-2"
          >
            Log In
          </button>

          {/* 1-Click Demo Login */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs tracking-wide transition-colors flex items-center justify-center space-x-1.5 border border-slate-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Quick Demo Login (John)</span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-slate-200" />
          <span className="px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            or continue with
          </span>
          <div className="flex-1 border-t border-slate-200" />
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialLogin('john.barangan@gmail.com', 'John Google')}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300/80 shadow-sm text-xs font-semibold text-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={() => handleSocialLogin('john.apple@example.com', 'John Apple')}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300/80 shadow-sm text-xs font-semibold text-slate-700 transition-colors"
          >
            <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 0.92-2.84-.9.04-2 .6-2.64 1.34-.56.64-1.06 1.7-0.92 2.71 1 .08 2.02-.46 2.64-1.21Z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Switch to Sign Up */}
        <div className="text-center">
          <span className="text-xs text-slate-500">
            Don't have an account?{' '}
          </span>
          <button
            type="button"
            onClick={onSignUpClick}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
