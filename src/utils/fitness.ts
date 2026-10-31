import { ActivityType, DailyExerciseItem, HeartRateZone, Recommendation, UserProfile, Workout } from '../types';

/**
 * Calculates estimated maximum heart rate based on age.
 * Standard formula: 220 - age (or Tanaka formula: 208 - 0.7 * age).
 */
export function calculateMaxHeartRate(age: number): number {
  const safeAge = Math.max(12, Math.min(100, age || 28));
  return Math.round(220 - safeAge);
}

/**
 * Generates the standard 5 cardiovascular heart rate training zones.
 */
export function calculateHeartRateZones(age: number): HeartRateZone[] {
  const maxHr = calculateMaxHeartRate(age);

  return [
    {
      name: 'Zone 1: Warm Up / Active Recovery',
      range: [Math.round(maxHr * 0.5), Math.round(maxHr * 0.6)],
      percentage: [50, 60],
      color: '#06b6d4', // Cyan
      description: 'Gentle, conversational pace. Promotes recovery and basic aerobic conditioning.',
    },
    {
      name: 'Zone 2: Fat Burn / Aerobic Base',
      range: [Math.round(maxHr * 0.6), Math.round(maxHr * 0.7)],
      percentage: [60, 70],
      color: '#10b981', // Emerald
      description: 'Comfortable endurance pace. Maximizes fat metabolism and builds cellular stamina.',
    },
    {
      name: 'Zone 3: Cardio / Aerobic Fitness',
      range: [Math.round(maxHr * 0.7), Math.round(maxHr * 0.8)],
      percentage: [70, 80],
      color: '#f59e0b', // Amber
      description: 'Moderately challenging effort. Improves lung capacity and cardiovascular stroke volume.',
    },
    {
      name: 'Zone 4: Anaerobic / Threshold',
      range: [Math.round(maxHr * 0.8), Math.round(maxHr * 0.9)],
      percentage: [80, 90],
      color: '#f97316', // Orange
      description: 'High intensity tempo. Raises lactate threshold and improves speed endurance.',
    },
    {
      name: 'Zone 5: Peak / Maximum Effort',
      range: [Math.round(maxHr * 0.9), maxHr],
      percentage: [90, 100],
      color: '#ef4444', // Red
      description: 'Maximum interval sprint. Increases peak anaerobic power and neuromuscular speed.',
    },
  ];
}

/**
 * Gets the current zone for a specific BPM reading.
 */
export function getZoneForBpm(bpm: number, age: number): HeartRateZone | null {
  const zones = calculateHeartRateZones(age);
  if (bpm < zones[0].range[0]) {
    return {
      name: 'Resting / Below Zone 1',
      range: [40, zones[0].range[0] - 1],
      percentage: [0, 49],
      color: '#64748b',
      description: 'Resting or very light casual movement.',
    };
  }
  for (const zone of zones) {
    if (bpm >= zone.range[0] && bpm <= zone.range[1]) {
      return zone;
    }
  }
  return zones[zones.length - 1]; // Zone 5 or above
}

/**
 * Calculates pace in seconds per kilometer, and formatted string like 5'32" /km.
 */
export function calculatePace(distanceKm: number, durationSeconds: number): {
  secondsPerKm: number;
  formatted: string;
} {
  if (distanceKm <= 0.01 || durationSeconds <= 0) {
    return { secondsPerKm: 0, formatted: `--'--"` };
  }
  const secondsPerKm = durationSeconds / distanceKm;
  if (!isFinite(secondsPerKm) || secondsPerKm > 3600) {
    return { secondsPerKm: 0, formatted: `--'--"` };
  }

  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);
  const formatted = `${minutes}'${seconds.toString().padStart(2, '0')}"`;
  return { secondsPerKm, formatted };
}

/**
 * Format duration seconds into hh:mm:ss or mm:ss
 */
export function formatDuration(seconds: number): string {
  const s = Math.floor(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculates estimated calories burned using standard MET (Metabolic Equivalent of Task).
 * Calories = MET * Weight(kg) * Time(hours)
 */
export function calculateCalories(
  activity: ActivityType,
  durationSeconds: number,
  weightKg: number,
  avgSpeedKmh?: number
): number {
  if (durationSeconds <= 0 || weightKg <= 0) return 0;
  const hours = durationSeconds / 3600;

  let met = 4.0;
  if (activity === 'walking') {
    if (avgSpeedKmh && avgSpeedKmh > 5.5) {
      met = 4.8; // brisk walking ~ 3.5-4.0 mph
    } else {
      met = 3.5; // moderate walking ~ 3 mph
    }
  } else if (activity === 'running') {
    if (avgSpeedKmh && avgSpeedKmh > 11.5) {
      met = 11.5; // fast run ~ 7 mph
    } else if (avgSpeedKmh && avgSpeedKmh > 9) {
      met = 9.8; // standard run ~ 6 mph
    } else {
      met = 8.3; // jog ~ 5 mph
    }
  } else if (activity === 'cycling') {
    met = 7.0;
  } else if (activity === 'stretching') {
    met = 2.5;
  }

  const kcal = met * weightKg * hours;
  return Math.round(kcal);
}

/**
 * Haversine formula to compute distance in km between two GPS coordinates.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Computes weekly workout streak from workouts history.
 */
export function calculateStreak(workouts: Workout[]): number {
  if (!workouts || workouts.length === 0) return 0;

  // Extract unique sorted active days in YYYY-MM-DD
  const days = Array.from(
    new Set(
      workouts
        .map((w) => {
          const d = new Date(w.startTime);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })
    )
  ).sort().reverse();

  if (days.length === 0) return 0;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  // If latest workout was today or yesterday, streak continues
  let streak = 0;
  let checkDate = new Date();

  // If not completed today, start checking from yesterday or today
  if (!days.includes(todayStr) && !days.includes(yesterdayStr)) {
    return 0;
  }

  if (!days.includes(todayStr)) {
    checkDate = yesterday;
  }

  while (true) {
    const dStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    if (days.includes(dStr)) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Generate adaptive 7-day personalized exercise guide.
 */
export function generateDailyExerciseGuide(
  profile: Partial<UserProfile>,
  fatigueScore: number = 3 // 1 (fresh) to 10 (exhausted)
): DailyExerciseItem[] {
  const goal = profile.primaryGoal || 'general_fitness';
  const exp = profile.fitnessExperience || 'beginner';
  const prefDuration = profile.preferredDurationMinutes || 30;

  // If user reports high fatigue (>= 7), reduce intensity & recommend recovery
  const fatigueMultiplier = fatigueScore >= 8 ? 0.6 : fatigueScore >= 6 ? 0.8 : 1.0;

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0, Sunday = 6

  const basePlans: Record<string, DailyExerciseItem[]> = {
    general_fitness: [
      {
        id: 'guide-mon',
        dayName: 'Monday',
        title: 'Brisk Kickoff Walk',
        activityType: 'walking',
        durationMinutes: Math.round(20 * fatigueMultiplier),
        intensity: 'moderate',
        warmUpMinutes: 3,
        warmUpDescription: '3 min relaxed ankle rolls, hip openers, and light walking pace.',
        coolDownMinutes: 3,
        coolDownDescription: '3 min easy walk and calf stretch against a wall.',
        explanation: 'Gradually elevates circulation after the weekend to reactivate metabolic baseline safely.',
        isRestDay: false,
      },
      {
        id: 'guide-tue',
        dayName: 'Tuesday',
        title: exp === 'beginner' ? 'Interval Power Walk' : 'Easy Jog & Cadence Focus',
        activityType: exp === 'beginner' ? 'walking' : 'running',
        durationMinutes: Math.round(25 * fatigueMultiplier),
        intensity: 'moderate',
        warmUpMinutes: 5,
        warmUpDescription: '5 min dynamic leg swings, high knees, and walking lunges.',
        coolDownMinutes: 5,
        coolDownDescription: '5 min easy walking followed by quad and hamstring stretches.',
        explanation: 'Builds cardiovascular rhythm without inducing structural joint stress.',
        isRestDay: false,
      },
      {
        id: 'guide-wed',
        dayName: 'Wednesday',
        title: 'Active Recovery & Mobility',
        activityType: 'stretching',
        durationMinutes: 15,
        intensity: 'light',
        warmUpMinutes: 2,
        warmUpDescription: 'Deep belly breathing and shoulder rolls.',
        coolDownMinutes: 2,
        coolDownDescription: 'Lying spinal twists and child pose.',
        explanation: 'Recovery day. Lowers cortisol levels and allows muscle glycogen stores to replenish.',
        isRestDay: true,
      },
      {
        id: 'guide-thu',
        dayName: 'Thursday',
        title: exp === 'advanced' ? '30-Minute Aerobic Tempo Run' : '25-Minute Brisk Walk / Jog',
        activityType: exp === 'beginner' ? 'walking' : 'running',
        durationMinutes: Math.round((exp === 'beginner' ? 25 : 30) * fatigueMultiplier),
        intensity: fatigueScore >= 7 ? 'light' : 'moderate',
        warmUpMinutes: 5,
        warmUpDescription: '5 min progressive walk-to-jog build-up with arm swings.',
        coolDownMinutes: 5,
        coolDownDescription: '5 min slow walk and standing hamstring stretch.',
        explanation: 'Sustained aerobic conditioning to train mitochondrial density and fat oxidation.',
        isRestDay: false,
      },
      {
        id: 'guide-fri',
        dayName: 'Friday',
        title: 'Steady 20-Minute Refresh Walk',
        activityType: 'walking',
        durationMinutes: Math.round(20 * fatigueMultiplier),
        intensity: 'light',
        warmUpMinutes: 3,
        warmUpDescription: '3 min light stroll and gentle neck / shoulder mobility.',
        coolDownMinutes: 3,
        coolDownDescription: '3 min cool-down walk to bring heart rate below 100 bpm.',
        explanation: 'Promotes muscle flushing and unwinds workweek postural tension.',
        isRestDay: false,
      },
      {
        id: 'guide-sat',
        dayName: 'Saturday',
        title: 'Extended Weekend Endurance Explorer',
        activityType: exp === 'beginner' ? 'walking' : 'running',
        durationMinutes: Math.round((exp === 'beginner' ? 35 : 45) * fatigueMultiplier),
        intensity: 'moderate',
        warmUpMinutes: 5,
        warmUpDescription: '5 min brisk walking plus glute activations.',
        coolDownMinutes: 5,
        coolDownDescription: '5 min leisurely walk and deep lower body static stretches.',
        explanation: 'Longer sustained aerobic session to build capillary density and cardiovascular resilience.',
        isRestDay: false,
      },
      {
        id: 'guide-sun',
        dayName: 'Sunday',
        title: 'Rest & Weekly Progress Reflection',
        activityType: 'stretching',
        durationMinutes: 10,
        intensity: 'rest',
        warmUpMinutes: 0,
        warmUpDescription: 'None needed.',
        coolDownMinutes: 0,
        coolDownDescription: 'Gentle full-body foam rolling or relaxed breathing.',
        explanation: 'Full biological recovery. Crucial for neuromuscular rebuilding and injury prevention.',
        isRestDay: true,
      },
    ],
  };

  const plan = basePlans.general_fitness;

  return plan.map((item, idx) => ({
    ...item,
    isToday: idx === todayIndex,
  }));
}

/**
 * Computes tailored, safe, and realistic recommendations.
 */
export function generateRecommendations(
  workouts: Workout[],
  profile: Partial<UserProfile>,
  fatigueScore: number = 3
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const now = Date.now();

  // 1. Fatigue check
  if (fatigueScore >= 7) {
    recommendations.push({
      id: 'rec-fatigue',
      category: 'recovery',
      title: 'High Fatigue Detected: Prioritize Active Recovery',
      message: `You reported a fatigue level of ${fatigueScore}/10. Switch today's session to a gentle 15-minute recovery walk or gentle stretching to prevent overtraining.`,
      actionText: 'View Recovery Guide',
      severity: 'warning',
      icon: 'Moon',
      createdAt: now,
    });
  }

  // 2. Inactivity check
  const oneDayMs = 24 * 60 * 60 * 1000;
  const recentWorkouts = workouts.filter((w) => now - w.startTime < 7 * oneDayMs);
  const lastWorkout = workouts[0]; // assuming sorted newest first
  const hoursSinceLast = lastWorkout ? (now - lastWorkout.startTime) / (1000 * 3600) : 999;

  if (hoursSinceLast > 60) {
    recommendations.push({
      id: 'rec-inactivity',
      category: 'activity',
      title: 'Time to Re-ignite Your Routine',
      message: "It has been over 2.5 days since your last recorded activity. A quick 15-minute brisk walk today will help restore energy and restart your streak!",
      actionText: 'Start 15-min Walk',
      severity: 'info',
      icon: 'Zap',
      createdAt: now,
    });
  }

  // 3. Progressive overload suggestion
  if (recentWorkouts.length >= 3 && fatigueScore <= 4) {
    const avgDuration = recentWorkouts.reduce((acc, w) => acc + w.durationSeconds, 0) / recentWorkouts.length / 60;
    recommendations.push({
      id: 'rec-progressive',
      category: 'activity',
      title: 'Ready for Progressive Build-Up',
      message: `You've comfortably completed ${recentWorkouts.length} sessions this week averaging ${Math.round(avgDuration)} minutes. Consider increasing your next workout by 5 minutes.`,
      actionText: 'Update Schedule',
      severity: 'success',
      icon: 'TrendingUp',
      createdAt: now,
    });
  }

  // 4. Heart rate zone optimization
  const hasHR = workouts.some((w) => w.avgHeartRate && w.avgHeartRate > 0);
  if (hasHR) {
    recommendations.push({
      id: 'rec-hr-zones',
      category: 'milestone',
      title: 'Cardiovascular Zone Efficiency',
      message: 'Aim to keep 70% of your training volume in Zone 2 (60-70% Max HR). This maximizes mitochondrial adaptation while keeping fatigue low.',
      actionText: 'Check HR Zones',
      severity: 'info',
      icon: 'HeartPulse',
      createdAt: now,
    });
  }

  // 5. Default encouraging baseline
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-daily-encouragement',
      category: 'praise',
      title: 'Consistent Movement Matters',
      message: 'Consistent, moderate activity beats sporadic high-intensity workouts. Stay hydrated and enjoy your daily movement!',
      actionText: 'Log Activity',
      severity: 'info',
      icon: 'Smile',
      createdAt: now,
    });
  }

  return recommendations;
}
