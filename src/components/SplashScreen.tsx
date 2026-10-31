import React, { useState } from 'react';
import { Download, Smartphone, Monitor, ChevronRight, CheckCircle2, Apple, X, Info } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface SplashScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onSignUp?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onGetStarted,
  onSignIn,
  onSignUp,
}) => {
  const {
    isInstallable,
    isInstalled,
    isAndroid,
    isWindows,
    isIOS,
    promptInstall,
    downloadApk,
    downloadExe,
  } = usePWAInstall();

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleAndroidClick = async () => {
    if (isInstallable) {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        setDownloadNotice('FitTrack installed to your home screen!');
        setTimeout(() => setDownloadNotice(null), 4000);
        return;
      }
    }
    // If not installable via browser event (or on desktop previewing android, or already dismissed)
    // offer direct APK download & open hub
    downloadApk();
    setDownloadNotice('Downloading FitTrack.apk package...');
    setTimeout(() => setDownloadNotice(null), 4000);
    setShowDownloadModal(true);
  };

  const handleWindowsClick = () => {
    downloadExe();
    setDownloadNotice('Downloading FitTrack-Setup.exe installer...');
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="relative flex-1 min-h-[640px] flex flex-col justify-between bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-800 overflow-hidden pb-4">
      {/* Download Alert Toast */}
      {downloadNotice && (
        <div className="absolute top-12 left-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between animate-fade-in border border-slate-700">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
          <button onClick={() => setDownloadNotice(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Logo & Tagline */}
      <div className="pt-6 px-6 text-center z-10">
        <div className="flex items-center justify-center space-x-2 mb-2">
          {/* Running Person and Pulse Shield */}
          <div className="relative w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-200/80 flex items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
              {/* Running person */}
              <circle cx="27" cy="10" r="4.5" fill="#10b981" />
              <path
                d="M23 16L18 25L23 27L20 38M23 16L30 22L27 30L34 38M23 16L17 19M30 22L36 21"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Pulse line */}
              <path
                d="M4 27H12L15 22L18 32L21 27H44"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-black italic tracking-tight flex items-center justify-center space-x-0.5">
          <span className="text-slate-900">Fit</span>
          <span className="text-emerald-600">Track</span>
        </h1>
        <p className="text-xs font-semibold text-slate-500 tracking-wide mt-0.5">
          Track. Improve. Achieve.
        </p>

        {isInstalled && (
          <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> App Installed
          </span>
        )}
      </div>

      {/* Hero Runner Silhouette & City Skyline */}
      <div className="relative flex-1 flex items-center justify-center my-2 overflow-hidden">
        {/* Soft glowing aura */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute bottom-8 w-80 h-32 bg-teal-300/20 blur-2xl rounded-full" />
        </div>

        {/* Dynamic Graphic SVG */}
        <svg viewBox="0 0 320 340" className="w-full max-w-[280px] h-auto z-10" fill="none">
          <defs>
            <linearGradient id="cityGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="curveNeonLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <radialGradient id="skyGlowLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glowing background aura */}
          <circle cx="160" cy="170" r="105" fill="url(#skyGlowLight)" />

          {/* City skyline silhouettes */}
          <path
            d="M20 260V210H45V190H65V220H80V160H100V260H120V180H140V150H165V260H185V170H210V210H230V190H250V260H300V290H20V260Z"
            fill="url(#cityGradLight)"
            opacity="0.55"
          />

          {/* Neon track curves */}
          <path
            d="M-20 300C60 250 200 320 340 260"
            stroke="url(#curveNeonLight)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M-10 320C90 260 230 340 350 280"
            stroke="#10b981"
            strokeWidth="2.5"
            opacity="0.8"
          />

          {/* Dynamic athletic runner silhouette */}
          <g transform="translate(110, 68) scale(1.15)">
            {/* Head */}
            <circle cx="52" cy="22" r="10" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
            {/* Torso */}
            <path
              d="M45 35L36 65L48 68L56 42Z"
              fill="#0f172a"
              stroke="#10b981"
              strokeWidth="2.5"
            />
            {/* Arms */}
            <path
              d="M48 40L65 52L78 46M44 42L28 48L20 40"
              stroke="#0f172a"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M48 40L65 52L78 46M44 42L28 48L20 40"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Legs */}
            <path
              d="M38 65L18 85L8 108M46 66L62 88L78 102"
              stroke="#0f172a"
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M38 65L18 85L8 108M46 66L62 88L78 102"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {/* Bottom Action Area: Get Started & Download Options */}
      <div className="px-5 space-y-2.5 z-10">
        {/* Main Get Started Button */}
        <button
          onClick={onGetStarted}
          className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/30 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
        >
          <span>Get Started</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Android Download / Install Button */}
        <button
          onClick={handleAndroidClick}
          className="w-full py-3 rounded-2xl bg-[#1e7e34] hover:bg-[#155d27] text-white font-bold text-xs tracking-wide shadow-md shadow-green-900/15 active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 border border-green-600"
          title="Download Android APK or install to home screen"
        >
          {/* Android Robot Icon */}
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.996-3.456c.105-.182.043-.414-.139-.519-.182-.105-.414-.043-.519.139l-2.022 3.502c-1.442-.656-3.056-1.026-4.796-1.026s-3.354.37-4.796 1.026l-2.022-3.502c-.105-.182-.337-.244-.519-.139-.182.105-.244.337-.139.519l1.996 3.456c-3.23 1.76-5.421 5.09-5.631 8.977h21.905c-.21-3.887-2.401-7.217-5.631-8.977" />
          </svg>
          <span>Download for Android (.apk / App)</span>
          <Download className="w-3.5 h-3.5 opacity-80" />
        </button>

        {/* Windows Desktop (.exe) Download Button */}
        <button
          onClick={handleWindowsClick}
          className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs tracking-wide shadow-sm active:scale-[0.99] transition-all flex items-center justify-center space-x-2 border border-slate-700"
          title="Download desktop installer for Windows 10/11"
        >
          {/* Windows Icon */}
          <svg className="w-3.5 h-3.5 fill-current shrink-0 text-cyan-400" viewBox="0 0 24 24">
            <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4h-13.051M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.849" />
          </svg>
          <span>Download for Windows (.exe)</span>
          <Download className="w-3.5 h-3.5 opacity-70" />
        </button>

        {/* Secondary Links: Sign In, Sign Up & Install Hub */}
        <div className="flex items-center justify-between pt-1 px-1 text-xs">
          <button
            onClick={() => setShowDownloadModal(true)}
            className="text-slate-600 hover:text-slate-900 font-medium flex items-center space-x-1"
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>Install Options</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onSignIn}
              className="text-slate-600 hover:text-slate-900 font-semibold"
            >
              Sign In
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={onSignUp || onGetStarted}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Download & Install Hub Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 w-full max-w-sm space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Install FitTrack App</h3>
                  <p className="text-[11px] text-slate-500">Available on Mobile and Desktop</p>
                </div>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Android Option */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
                    🤖
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Android Phone</h4>
                    <p className="text-[10px] text-slate-500">Fast install or direct package</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  v2.4.0
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {isInstallable && (
                  <button
                    onClick={promptInstall}
                    className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <span>1-Tap Install</span>
                  </button>
                )}
                <a
                  href="/downloads/FitTrack.apk"
                  download="FitTrack.apk"
                  onClick={() => setDownloadNotice('Downloading FitTrack.apk...')}
                  className={`py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-[11px] flex items-center justify-center space-x-1.5 ${!isInstallable ? 'col-span-2' : ''}`}
                >
                  <Download className="w-3.5 h-3.5 text-green-600" />
                  <span>Download .APK</span>
                </a>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                Tip: On Chrome for Android, tap ⋮ and choose "Install app" or "Add to Home screen".
              </p>
            </div>

            {/* Windows Desktop Option */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <Monitor className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Windows PC / Desktop</h4>
                    <p className="text-[10px] text-slate-500">Windows 10 & 11 compatible</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                  .EXE
                </span>
              </div>

              <a
                href="/downloads/FitTrack-Setup.exe"
                download="FitTrack-Setup.exe"
                onClick={() => setDownloadNotice('Downloading FitTrack-Setup.exe...')}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download FitTrack-Setup.exe</span>
              </a>
            </div>

            {/* Apple iOS iPhone Guide */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center">
                  <Apple className="w-4 h-4 text-slate-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Apple iPhone (iOS)</h4>
                  <p className="text-[10px] text-slate-500">Safari Add to Home Screen</p>
                </div>
              </div>
              <ol className="text-[11px] text-slate-600 list-decimal list-inside space-y-0.5 pt-1">
                <li>Open this web page in Safari</li>
                <li>Tap the <span className="font-semibold text-slate-800">Share</span> icon (square with arrow)</li>
                <li>Scroll down and tap <span className="font-semibold text-slate-800">"Add to Home Screen"</span></li>
              </ol>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 py-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
