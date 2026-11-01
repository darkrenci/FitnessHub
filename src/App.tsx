/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, Workout, NFCDevice } from './types';
import { StorageService } from './services/storage';
import { BleHeartRate, HeartRateReading } from './services/bleHeartRate';
import { Nfc } from './services/nfcService';

import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { HomeScreen } from './components/HomeScreen';
import { LiveTracker } from './components/LiveTracker';
import { HeartRateScreen } from './components/HeartRateScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { DailyGuideScreen } from './components/DailyGuideScreen';
import { ScheduleScreen } from './components/ScheduleScreen';
import { NfcScreen } from './components/NfcScreen';
import { RecommendationsScreen } from './components/RecommendationsScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNavBar, TabKey } from './components/BottomNavBar';

export type ScreenId =
  | 'splash'
  | 'login'
  | 'signup'
  | 'home'
  | 'track'
  | 'heart_rate'
  | 'progress'
  | 'daily_guide'
  | 'schedule'
  | 'nfc'
  | 'recommendations'
  | 'notifications'
  | 'profile';

export default function App() {
  // Screen state - default to 'splash' for public get started & download view
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('screen') as ScreenId;
      if (s) return s;
    }
    return 'splash';
  });

  const [activeTab, setActiveTab] = useState<TabKey>('home');

  // Core Data
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [workouts, setWorkouts] = useState<Workout[]>(() => StorageService.getWorkouts());
  const [nfcDevices, setNfcDevices] = useState<NFCDevice[]>(() => StorageService.getNfcDevices());

  // Biometric Telemetry
  const [heartRate, setHeartRate] = useState<HeartRateReading | null>(null);

  // Listen to Heart Rate
  useEffect(() => {
    const unsub = BleHeartRate.subscribe((reading) => setHeartRate(reading));
    return () => unsub();
  }, []);

  // Keep activeTab synced with currentScreen if it is a tab
  useEffect(() => {
    if (['home', 'track', 'progress', 'schedule', 'profile'].includes(currentScreen)) {
      setActiveTab(currentScreen as TabKey);
    }
  }, [currentScreen]);

  // Sync tab navigation with screens
  const handleSelectTab = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentScreen('home');
    else if (tab === 'track') setCurrentScreen('track');
    else if (tab === 'progress') setCurrentScreen('progress');
    else if (tab === 'schedule') setCurrentScreen('schedule');
    else if (tab === 'profile') setCurrentScreen('profile');
  };

  const navigateTo = (screen: ScreenId) => {
    setCurrentScreen(screen);
    if (screen === 'home' || screen === 'track' || screen === 'progress' || screen === 'schedule' || screen === 'profile') {
      setActiveTab(screen as TabKey);
    }
  };

  const handleFinishWorkout = (newWorkout: Workout) => {
    const updated = StorageService.saveWorkout(newWorkout);
    setWorkouts(updated);
    navigateTo('home');
  };

  const handleClearTodayWorkouts = () => {
    const updated = StorageService.clearTodayWorkouts();
    setWorkouts(updated);
  };

  const handleLogOut = () => {
    StorageService.logout();
    navigateTo('login');
  };

  // Screens that display the bottom navigation bar
  const isTabScreen = ['home', 'track', 'progress', 'schedule', 'profile'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col items-center justify-start select-none font-sans">
      {/* Responsive App Shell: Clean mobile container centered on desktop */}
      <div className="w-full max-w-md min-h-screen bg-[#f8fafc] flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.06)] border-x border-slate-200/80">
        {/* Dynamic Screen View */}
        <div className="flex-1 flex flex-col">
          {currentScreen === 'splash' && (
            <SplashScreen
              onGetStarted={() => {
                // If user is already registered and logged in, jump to home, else sign up
                const currentUser = StorageService.getCurrentUserEmail();
                if (currentUser) {
                  navigateTo('home');
                } else {
                  navigateTo('signup');
                }
              }}
              onSignIn={() => navigateTo('login')}
              onSignUp={() => navigateTo('signup')}
            />
          )}

          {currentScreen === 'login' && (
            <LoginScreen
              onBack={() => navigateTo('splash')}
              onLoginSuccess={(newProfile) => {
                setProfile(newProfile);
                navigateTo('home');
              }}
              onSignUpClick={() => navigateTo('signup')}
            />
          )}

          {currentScreen === 'signup' && (
            <SignUpScreen
              onBack={() => navigateTo('splash')}
              onSignUpSuccess={(newProfile) => {
                setProfile(newProfile);
                navigateTo('home');
              }}
              onLoginClick={() => navigateTo('login')}
            />
          )}

          {currentScreen === 'home' && (
            <HomeScreen
              profile={profile}
              workouts={workouts}
              heartRate={heartRate}
              onStartWorkout={() => navigateTo('track')}
              onOpenGuide={() => navigateTo('daily_guide')}
              onOpenHeartRate={() => navigateTo('heart_rate')}
              onOpenProfile={() => navigateTo('profile')}
              onClearTodayWorkouts={handleClearTodayWorkouts}
            />
          )}

          {currentScreen === 'track' && (
            <LiveTracker
              profile={profile}
              heartRate={heartRate}
              onFinishWorkout={handleFinishWorkout}
              onBack={() => navigateTo('home')}
            />
          )}

          {currentScreen === 'heart_rate' && (
            <HeartRateScreen
              heartRate={heartRate}
              onBack={() => navigateTo('home')}
            />
          )}

          {currentScreen === 'progress' && (
            <ProgressScreen onBack={() => navigateTo('home')} />
          )}

          {currentScreen === 'daily_guide' && (
            <DailyGuideScreen
              onBack={() => navigateTo('home')}
              onCompleted={() => navigateTo('home')}
            />
          )}

          {currentScreen === 'schedule' && (
            <ScheduleScreen
              onBack={() => navigateTo('home')}
              onViewAll={() => navigateTo('home')}
              onAddScheduleClick={() => navigateTo('schedule')}
            />
          )}

          {currentScreen === 'nfc' && (
            <NfcScreen
              devices={nfcDevices}
              onBack={() => navigateTo('profile')}
              onTapSimulate={() => {
                Nfc.simulateTagTap('NFC-SHOE-01', 'Pegasus Running Shoes');
                navigateTo('track');
              }}
            />
          )}

          {currentScreen === 'recommendations' && (
            <RecommendationsScreen onBack={() => navigateTo('home')} />
          )}

          {currentScreen === 'notifications' && (
            <NotificationsScreen onBack={() => navigateTo('profile')} />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              profile={profile}
              workouts={workouts}
              onBack={() => navigateTo('home')}
              onUpdateProfile={(updated) => setProfile(updated)}
              onNavigateSettings={() => navigateTo('notifications')}
              onNavigateNfc={() => navigateTo('nfc')}
              onNavigateNotifications={() => navigateTo('notifications')}
              onLogOut={handleLogOut}
            />
          )}
        </div>

        {/* Bottom Navigation Bar on Tabbed Screens */}
        {isTabScreen && (
          <BottomNavBar
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
          />
        )}
      </div>
    </div>
  );
}
