export type ActivityType = 'running' | 'walking' | 'cycling' | 'stretching';

export type FitnessGoal = 'endurance' | 'weight_loss' | 'daily_activity' | 'general_fitness';

export type FitnessExperience = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
  gender: 'male' | 'female' | 'other';
  fitnessExperience: FitnessExperience;
  primaryGoal: FitnessGoal;
  targetWeeklyDistanceKm: number;
  targetWeeklyWorkouts: number;
  preferredDays: string[]; // ['Mon', 'Wed', 'Fri', 'Sat']
  preferredDurationMinutes: number;
  maxHeartRateThreshold: number; // e.g. 165 bpm alert
  units: 'metric' | 'imperial';
}

export interface UserAccount {
  id: string;
  email: string;
  password?: string;
  profile: UserProfile;
  createdAt: number;
}

export interface GPSCoordinate {
  lat: number;
  lng: number;
  altitude?: number;
  timestamp: number;
  speed?: number; // m/s
  heartRate?: number;
}

export interface Workout {
  id: string;
  userId: string;
  activityType: ActivityType;
  title: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  distanceKm: number;
  caloriesBurned: number;
  steps: number;
  avgPaceSecondsPerKm: number;
  bestPaceSecondsPerKm: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  minHeartRate?: number;
  heartRateReadings?: { timestamp: number; bpm: number }[];
  routeCoordinates: GPSCoordinate[];
  notes?: string;
  nfcTagId?: string;
  perceivedEffort?: number; // 1-10
}

export interface HeartRateZone {
  name: string;
  range: [number, number]; // [minBpm, maxBpm]
  percentage: [number, number]; // [min%, max%]
  color: string;
  description: string;
}

export interface ScheduledWorkout {
  id: string;
  userId: string;
  activityType: ActivityType;
  title: string;
  dayOfWeek: string; // 'Monday', 'Tuesday', ...
  time: string; // '07:30'
  durationMinutes: number;
  targetDistanceKm?: number;
  reminderMinutesBefore: number;
  remindersEnabled: boolean;
  notes?: string;
  completed?: boolean;
}

export interface DailyExerciseItem {
  id: string;
  dayName: string; // 'Monday'
  title: string;
  activityType: ActivityType;
  durationMinutes: number;
  intensity: 'light' | 'moderate' | 'vigorous' | 'rest';
  warmUpMinutes: number;
  warmUpDescription: string;
  coolDownMinutes: number;
  coolDownDescription: string;
  explanation: string;
  targetPaceRange?: string;
  isRestDay: boolean;
  isToday?: boolean;
  status?: 'pending' | 'completed' | 'skipped';
}

export interface Recommendation {
  id: string;
  category: 'activity' | 'recovery' | 'milestone' | 'warning' | 'praise';
  title: string;
  message: string;
  actionText?: string;
  severity: 'info' | 'success' | 'warning';
  icon: string;
  createdAt: number;
}

export interface NFCDevice {
  id: string;
  tagId: string;
  name: string;
  type: 'smartwatch' | 'wristband' | 'chest_strap' | 'gym_tag' | 'running_shoes_tag';
  registeredAt: number;
  lastScannedAt?: number;
  defaultActivity: ActivityType;
  autoStartWorkout: boolean;
  status: 'active' | 'paired' | 'inactive';
}

export interface NotificationPreference {
  pushEnabled: boolean;
  localRemindersEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  reminderLeadMinutes: number; // 15
  heartRateAlertsEnabled: boolean;
  inactivityAlertsEnabled: boolean;
  weeklySummaryEnabled: boolean;
}
