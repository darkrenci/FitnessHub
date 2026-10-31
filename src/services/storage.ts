import {
  ActivityType,
  DailyExerciseItem,
  NFCDevice,
  NotificationPreference,
  ScheduledWorkout,
  UserAccount,
  UserProfile,
  Workout,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'fittrack_registered_users',
  CURRENT_USER_EMAIL: 'fittrack_current_user_email',
  PROFILE: 'fittrack_profile',
  WORKOUTS: 'fittrack_workouts',
  SCHEDULE: 'fittrack_schedule',
  NFC_DEVICES: 'fittrack_nfc_devices',
  NOTIFICATIONS: 'fittrack_notifications',
  FATIGUE_SCORE: 'fittrack_fatigue',
  ONBOARDING_DONE: 'fittrack_onboarding_done',
};

// Scenic GPS Route Coordinates for central park loop (~3.5 km)
const SAMPLE_PARK_ROUTE = [
  { lat: 40.785091, lng: -73.968285, timestamp: 1730360000000, heartRate: 112 },
  { lat: 40.785834, lng: -73.966955, timestamp: 1730360060000, heartRate: 125 },
  { lat: 40.787123, lng: -73.965321, timestamp: 1730360120000, heartRate: 138 },
  { lat: 40.788542, lng: -73.964112, timestamp: 1730360180000, heartRate: 146 },
  { lat: 40.789912, lng: -73.963245, timestamp: 1730360240000, heartRate: 152 },
  { lat: 40.791534, lng: -73.962876, timestamp: 1730360300000, heartRate: 158 },
  { lat: 40.793012, lng: -73.963543, timestamp: 1730360360000, heartRate: 154 },
  { lat: 40.794223, lng: -73.965123, timestamp: 1730360420000, heartRate: 150 },
  { lat: 40.794891, lng: -73.967112, timestamp: 1730360480000, heartRate: 148 },
  { lat: 40.794512, lng: -73.969324, timestamp: 1730360540000, heartRate: 144 },
  { lat: 40.793211, lng: -73.971243, timestamp: 1730360600000, heartRate: 140 },
  { lat: 40.791245, lng: -73.972134, timestamp: 1730360660000, heartRate: 135 },
  { lat: 40.789123, lng: -73.971845, timestamp: 1730360720000, heartRate: 132 },
  { lat: 40.787234, lng: -73.970512, timestamp: 1730360780000, heartRate: 124 },
  { lat: 40.785412, lng: -73.968845, timestamp: 1730360840000, heartRate: 115 },
];

export const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_default_01',
  name: 'John Bill M. Barangan',
  email: 'john.barangan@example.com',
  age: 28,
  heightCm: 178,
  weightKg: 73,
  gender: 'male',
  fitnessExperience: 'intermediate',
  primaryGoal: 'endurance',
  targetWeeklyDistanceKm: 25,
  targetWeeklyWorkouts: 4,
  preferredDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
  preferredDurationMinutes: 30,
  maxHeartRateThreshold: 172,
  units: 'metric',
};

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'usr_default_01',
    email: 'john.barangan@example.com',
    password: 'password123',
    profile: DEFAULT_PROFILE,
    createdAt: Date.now() - 30 * 86400000,
  },
];

export const DEFAULT_NOTIFICATIONS: NotificationPreference = {
  pushEnabled: true,
  localRemindersEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  reminderLeadMinutes: 15,
  heartRateAlertsEnabled: true,
  inactivityAlertsEnabled: true,
  weeklySummaryEnabled: true,
};

export const DEFAULT_NFC_DEVICES: NFCDevice[] = [
  {
    id: 'nfc-dev-1',
    tagId: 'NFC-RUN-0482-SHOE',
    name: 'Pegasus Running Shoe Tag',
    type: 'running_shoes_tag',
    registeredAt: Date.now() - 14 * 86400000,
    lastScannedAt: Date.now() - 86400000,
    defaultActivity: 'running',
    autoStartWorkout: true,
    status: 'active',
  },
  {
    id: 'nfc-dev-2',
    tagId: 'NFC-HR-9931-STRAP',
    name: 'Polar H10 Heart Strap',
    type: 'chest_strap',
    registeredAt: Date.now() - 30 * 86400000,
    lastScannedAt: Date.now() - 3600000 * 4,
    defaultActivity: 'running',
    autoStartWorkout: false,
    status: 'paired',
  },
  {
    id: 'nfc-dev-3',
    tagId: 'NFC-GYM-1120-DESK',
    name: 'Home Workout Station Tag',
    type: 'gym_tag',
    registeredAt: Date.now() - 7 * 86400000,
    lastScannedAt: Date.now() - 86400000 * 2,
    defaultActivity: 'walking',
    autoStartWorkout: false,
    status: 'active',
  },
];

export const DEFAULT_SCHEDULE: ScheduledWorkout[] = [
  {
    id: 'sch-1',
    userId: 'usr_default_01',
    activityType: 'running',
    title: 'Morning Endurance Jog',
    dayOfWeek: 'Monday',
    time: '07:00',
    durationMinutes: 30,
    targetDistanceKm: 4.5,
    reminderMinutesBefore: 15,
    remindersEnabled: true,
    completed: true,
  },
  {
    id: 'sch-2',
    userId: 'usr_default_01',
    activityType: 'walking',
    title: 'Brisk Lunch Walk',
    dayOfWeek: 'Wednesday',
    time: '12:30',
    durationMinutes: 25,
    targetDistanceKm: 2.8,
    reminderMinutesBefore: 15,
    remindersEnabled: true,
    completed: false,
  },
  {
    id: 'sch-3',
    userId: 'usr_default_01',
    activityType: 'running',
    title: 'Tempo Pace Builder',
    dayOfWeek: 'Friday',
    time: '18:00',
    durationMinutes: 35,
    targetDistanceKm: 5.5,
    reminderMinutesBefore: 30,
    remindersEnabled: true,
    completed: false,
  },
  {
    id: 'sch-4',
    userId: 'usr_default_01',
    activityType: 'walking',
    title: 'Weekend Nature Exploration',
    dayOfWeek: 'Saturday',
    time: '09:00',
    durationMinutes: 45,
    targetDistanceKm: 4.0,
    reminderMinutesBefore: 15,
    remindersEnabled: true,
    completed: false,
  },
];

export const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: 'wkt-01',
    userId: 'usr_default_01',
    activityType: 'running',
    title: 'Scenic Park Tempo Run',
    startTime: Date.now() - 86400000 * 1, // Yesterday
    endTime: Date.now() - 86400000 * 1 + 1620000, // 27 mins
    durationSeconds: 1620,
    distanceKm: 4.82,
    caloriesBurned: 375,
    steps: 5420,
    avgPaceSecondsPerKm: 336, // 5'36"
    bestPaceSecondsPerKm: 310, // 5'10"
    avgHeartRate: 151,
    maxHeartRate: 168,
    minHeartRate: 118,
    heartRateReadings: SAMPLE_PARK_ROUTE.map((p) => ({
      timestamp: p.timestamp,
      bpm: p.heartRate || 145,
    })),
    routeCoordinates: SAMPLE_PARK_ROUTE,
    notes: 'Felt strong throughout! Cadence was smooth and breathing was steady.',
    nfcTagId: 'NFC-RUN-0482-SHOE',
    perceivedEffort: 7,
  },
  {
    id: 'wkt-02',
    userId: 'usr_default_01',
    activityType: 'walking',
    title: 'Brisk Neighborhood Morning Walk',
    startTime: Date.now() - 86400000 * 2,
    endTime: Date.now() - 86400000 * 2 + 1500000,
    durationSeconds: 1500,
    distanceKm: 2.65,
    caloriesBurned: 132,
    steps: 3580,
    avgPaceSecondsPerKm: 566, // 9'26"
    bestPaceSecondsPerKm: 540,
    avgHeartRate: 112,
    maxHeartRate: 126,
    minHeartRate: 88,
    heartRateReadings: [
      { timestamp: Date.now() - 86400000 * 2, bpm: 95 },
      { timestamp: Date.now() - 86400000 * 2 + 300000, bpm: 108 },
      { timestamp: Date.now() - 86400000 * 2 + 600000, bpm: 114 },
      { timestamp: Date.now() - 86400000 * 2 + 900000, bpm: 119 },
      { timestamp: Date.now() - 86400000 * 2 + 1200000, bpm: 122 },
      { timestamp: Date.now() - 86400000 * 2 + 1500000, bpm: 104 },
    ],
    routeCoordinates: SAMPLE_PARK_ROUTE.slice(0, 8),
    notes: 'Sunny and crisp morning walk.',
    perceivedEffort: 4,
  },
  {
    id: 'wkt-03',
    userId: 'usr_default_01',
    activityType: 'running',
    title: 'Interval Cardio Intervals',
    startTime: Date.now() - 86400000 * 4,
    endTime: Date.now() - 86400000 * 4 + 1800000,
    durationSeconds: 1800,
    distanceKm: 5.2,
    caloriesBurned: 410,
    steps: 6100,
    avgPaceSecondsPerKm: 346,
    bestPaceSecondsPerKm: 295,
    avgHeartRate: 158,
    maxHeartRate: 174,
    minHeartRate: 122,
    heartRateReadings: SAMPLE_PARK_ROUTE.map((p) => ({
      timestamp: p.timestamp,
      bpm: (p.heartRate || 140) + 6,
    })),
    routeCoordinates: SAMPLE_PARK_ROUTE,
    notes: 'Tested threshold pace intervals on the hills.',
    perceivedEffort: 8,
  },
  {
    id: 'wkt-04',
    userId: 'usr_default_01',
    activityType: 'walking',
    title: 'Evening Sunset Unwind',
    startTime: Date.now() - 86400000 * 5,
    endTime: Date.now() - 86400000 * 5 + 1200000,
    durationSeconds: 1200,
    distanceKm: 2.1,
    caloriesBurned: 105,
    steps: 2840,
    avgPaceSecondsPerKm: 571,
    bestPaceSecondsPerKm: 550,
    avgHeartRate: 105,
    maxHeartRate: 118,
    minHeartRate: 85,
    routeCoordinates: SAMPLE_PARK_ROUTE.slice(0, 6),
    notes: 'Relaxing post-dinner walk.',
    perceivedEffort: 3,
  },
  {
    id: 'wkt-05',
    userId: 'usr_default_01',
    activityType: 'running',
    title: 'Weekend Distance Builder',
    startTime: Date.now() - 86400000 * 9,
    endTime: Date.now() - 86400000 * 9 + 2100000,
    durationSeconds: 2100,
    distanceKm: 6.2,
    caloriesBurned: 480,
    steps: 7200,
    avgPaceSecondsPerKm: 338,
    bestPaceSecondsPerKm: 315,
    avgHeartRate: 154,
    maxHeartRate: 169,
    minHeartRate: 110,
    routeCoordinates: SAMPLE_PARK_ROUTE,
    notes: 'Long run from previous weekend.',
    perceivedEffort: 7,
  },
  {
    id: 'wkt-06',
    userId: 'usr_default_01',
    activityType: 'walking',
    title: 'Midweek Power Stroll',
    startTime: Date.now() - 86400000 * 11,
    endTime: Date.now() - 86400000 * 11 + 1800000,
    durationSeconds: 1800,
    distanceKm: 3.1,
    caloriesBurned: 155,
    steps: 4200,
    avgPaceSecondsPerKm: 580,
    bestPaceSecondsPerKm: 560,
    avgHeartRate: 108,
    maxHeartRate: 121,
    minHeartRate: 88,
    routeCoordinates: SAMPLE_PARK_ROUTE.slice(0, 8),
    notes: 'Brisk walk before evening meetings.',
    perceivedEffort: 4,
  },
];

// Helper for local storage
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export const StorageService = {
  // User Management & Authentication
  getUsers(): UserAccount[] {
    return getStored<UserAccount[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
  },

  getCurrentUserEmail(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_EMAIL) || null;
    } catch {
      return null;
    }
  },

  getCurrentUser(): UserAccount | null {
    const email = this.getCurrentUserEmail();
    const users = this.getUsers();
    if (!email) {
      return users.length > 0 ? users[0] : null;
    }
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return found || users[0] || null;
  },

  setCurrentUser(email: string | null): void {
    try {
      if (email) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_EMAIL, email);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
      }
    } catch (e) {
      console.error('Failed to set current user', e);
    }
  },

  registerUser(params: {
    name: string;
    email: string;
    password?: string;
    profileData?: Partial<UserProfile>;
  }): { success: boolean; user?: UserAccount; error?: string } {
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanName = params.name.trim();

    if (!cleanEmail) {
      return { success: false, error: 'Email address is required.' };
    }
    if (!cleanName) {
      return { success: false, error: 'Full name is required.' };
    }

    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      ...(params.profileData || {}),
    };

    const newAccount: UserAccount = {
      id: newProfile.id,
      email: cleanEmail,
      password: params.password || 'password123',
      profile: newProfile,
      createdAt: Date.now(),
    };

    const updatedUsers = [newAccount, ...users];
    setStored(STORAGE_KEYS.USERS, updatedUsers);
    setStored(STORAGE_KEYS.PROFILE, newProfile);
    this.setCurrentUser(cleanEmail);

    return { success: true, user: newAccount };
  },

  loginUser(
    email: string,
    password?: string
  ): { success: boolean; user?: UserAccount; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      // If logging in for the first time via social or demo, auto-provision
      if (email.includes('@gmail.com') || email.includes('@example.com')) {
        const generatedName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        return this.registerUser({
          name: generatedName.charAt(0).toUpperCase() + generatedName.slice(1),
          email: cleanEmail,
          password: password || 'password123',
        });
      }
      return { success: false, error: 'No account found with this email. Please click Sign Up to register.' };
    }

    // Verify password if provided and user has a password set
    if (password && found.password && found.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    this.setCurrentUser(found.email);
    setStored(STORAGE_KEYS.PROFILE, found.profile);
    return { success: true, user: found };
  },

  logout(): void {
    this.setCurrentUser(null);
  },

  getProfile(): UserProfile {
    const currentUser = this.getCurrentUser();
    if (currentUser?.profile) {
      return currentUser.profile;
    }
    return getStored<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  },

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    setStored(STORAGE_KEYS.PROFILE, updated);

    // Also update in registered users list
    const users = this.getUsers();
    const index = users.findIndex(
      (u) => u.email.toLowerCase() === (current.email || '').toLowerCase()
    );
    if (index >= 0) {
      users[index].profile = updated;
      if (updates.name) users[index].profile.name = updates.name;
      setStored(STORAGE_KEYS.USERS, users);
    }

    return updated;
  },

  getWorkouts(): Workout[] {
    const workouts = getStored<Workout[]>(STORAGE_KEYS.WORKOUTS, DEFAULT_WORKOUTS);
    return workouts.sort((a, b) => b.startTime - a.startTime);
  },

  saveWorkout(workout: Workout): Workout[] {
    const workouts = this.getWorkouts();
    const updated = [workout, ...workouts.filter((w) => w.id !== workout.id)];
    setStored(STORAGE_KEYS.WORKOUTS, updated);
    return updated;
  },

  deleteWorkout(id: string): Workout[] {
    const workouts = this.getWorkouts().filter((w) => w.id !== id);
    setStored(STORAGE_KEYS.WORKOUTS, workouts);
    return workouts;
  },

  getSchedule(): ScheduledWorkout[] {
    return getStored<ScheduledWorkout[]>(STORAGE_KEYS.SCHEDULE, DEFAULT_SCHEDULE);
  },

  saveScheduleItem(item: ScheduledWorkout): ScheduledWorkout[] {
    const list = this.getSchedule();
    const existingIndex = list.findIndex((s) => s.id === item.id);
    let updated: ScheduledWorkout[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = item;
    } else {
      updated = [...list, item];
    }
    setStored(STORAGE_KEYS.SCHEDULE, updated);
    return updated;
  },

  deleteScheduleItem(id: string): ScheduledWorkout[] {
    const list = this.getSchedule().filter((s) => s.id !== id);
    setStored(STORAGE_KEYS.SCHEDULE, list);
    return list;
  },

  getNfcDevices(): NFCDevice[] {
    return getStored<NFCDevice[]>(STORAGE_KEYS.NFC_DEVICES, DEFAULT_NFC_DEVICES);
  },

  saveNfcDevice(device: NFCDevice): NFCDevice[] {
    const devices = this.getNfcDevices();
    const updated = [device, ...devices.filter((d) => d.id !== device.id)];
    setStored(STORAGE_KEYS.NFC_DEVICES, updated);
    return updated;
  },

  deleteNfcDevice(id: string): NFCDevice[] {
    const devices = this.getNfcDevices().filter((d) => d.id !== id);
    setStored(STORAGE_KEYS.NFC_DEVICES, devices);
    return devices;
  },

  recordNfcScan(tagId: string): NFCDevice | null {
    const devices = this.getNfcDevices();
    const dev = devices.find((d) => d.tagId === tagId);
    if (dev) {
      dev.lastScannedAt = Date.now();
      setStored(STORAGE_KEYS.NFC_DEVICES, devices);
      return dev;
    }
    return null;
  },

  getNotificationPreferences(): NotificationPreference {
    return getStored<NotificationPreference>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  },

  updateNotificationPreferences(updates: Partial<NotificationPreference>): NotificationPreference {
    const current = this.getNotificationPreferences();
    const updated = { ...current, ...updates };
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  getFatigueScore(): number {
    return getStored<number>(STORAGE_KEYS.FATIGUE_SCORE, 3);
  },

  setFatigueScore(score: number): void {
    setStored(STORAGE_KEYS.FATIGUE_SCORE, Math.max(1, Math.min(10, score)));
  },

  isOnboardingDone(): boolean {
    return getStored<boolean>(STORAGE_KEYS.ONBOARDING_DONE, true); // true by default with replay capability
  },

  setOnboardingDone(done: boolean): void {
    setStored(STORAGE_KEYS.ONBOARDING_DONE, done);
  },

  // Reset demo data
  resetAllData(): void {
    setStored(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
    setStored(STORAGE_KEYS.WORKOUTS, DEFAULT_WORKOUTS);
    setStored(STORAGE_KEYS.SCHEDULE, DEFAULT_SCHEDULE);
    setStored(STORAGE_KEYS.NFC_DEVICES, DEFAULT_NFC_DEVICES);
    setStored(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    setStored(STORAGE_KEYS.FATIGUE_SCORE, 3);
    setStored(STORAGE_KEYS.ONBOARDING_DONE, true);
  },

  // Delete account & personal data entirely
  deleteAccountAndData(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.WORKOUTS);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
    localStorage.removeItem(STORAGE_KEYS.NFC_DEVICES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.FATIGUE_SCORE);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DONE);
  },
};
