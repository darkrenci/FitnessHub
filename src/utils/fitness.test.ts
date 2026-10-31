import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMaxHeartRate,
  calculateHeartRateZones,
  getZoneForBpm,
  calculatePace,
  formatDuration,
  calculateCalories,
  calculateDistanceKm,
  calculateStreak,
  generateDailyExerciseGuide,
  generateRecommendations,
} from './fitness';
import { Workout } from '../types';

test('calculateMaxHeartRate correctly derives 220 - age', () => {
  assert.equal(calculateMaxHeartRate(30), 190);
  assert.equal(calculateMaxHeartRate(20), 200);
  assert.equal(calculateMaxHeartRate(50), 170);
});

test('calculateHeartRateZones produces 5 distinct progressive zones', () => {
  const zones = calculateHeartRateZones(30); // maxHr = 190
  assert.equal(zones.length, 5);
  assert.equal(zones[0].range[0], 95); // 50% of 190
  assert.equal(zones[0].range[1], 114); // 60% of 190
  assert.equal(zones[4].range[1], 190); // 100% of 190
  assert.ok(zones[1].range[0] <= zones[1].range[1]);
});

test('getZoneForBpm identifies correct zone', () => {
  // Age 30: max 190. Zone 1 is 95-114, Zone 2 is 114-133, Zone 3 is 133-152, Zone 4 is 152-171, Zone 5 is 171-190.
  const resting = getZoneForBpm(75, 30);
  assert.match(resting?.name || '', /Resting/i);

  const zone2 = getZoneForBpm(120, 30);
  assert.match(zone2?.name || '', /Zone 2/i);

  const zone5 = getZoneForBpm(180, 30);
  assert.match(zone5?.name || '', /Zone 5/i);
});

test('calculatePace computes minutes and seconds accurately', () => {
  // 5 km in 1500 seconds (25 minutes) => 300 s/km = 5'00"
  const pace = calculatePace(5.0, 1500);
  assert.equal(pace.secondsPerKm, 300);
  assert.equal(pace.formatted, `5'00"`);

  // Edge case 0 distance
  const zeroPace = calculatePace(0, 100);
  assert.equal(zeroPace.formatted, `--'--"`);
});

test('formatDuration formats seconds properly', () => {
  assert.equal(formatDuration(45), '00:45');
  assert.equal(formatDuration(125), '02:05');
  assert.equal(formatDuration(3665), '1:01:05');
});

test('calculateCalories produces reasonable burn estimates', () => {
  // Running 30 mins (1800s) for 70kg at ~10 km/h: MET 9.8 * 70 * 0.5 = 343 kcal
  const runCal = calculateCalories('running', 1800, 70, 10);
  assert.ok(runCal >= 300 && runCal <= 400, `Expected ~343 kcal, got ${runCal}`);

  // Walking 60 mins (3600s) for 70kg at ~5 km/h: MET 3.5 * 70 * 1 = 245 kcal
  const walkCal = calculateCalories('walking', 3600, 70, 5);
  assert.ok(walkCal >= 200 && walkCal <= 300, `Expected ~245 kcal, got ${walkCal}`);
});

test('calculateDistanceKm Haversine gives accurate distance', () => {
  // Distance between London (51.5074, -0.1278) and Paris (48.8566, 2.3522) is ~343 km
  const dist = calculateDistanceKm(51.5074, -0.1278, 48.8566, 2.3522);
  assert.ok(dist > 340 && dist < 350, `Expected ~343 km, got ${dist}`);
});

test('generateDailyExerciseGuide adapts to high fatigue', () => {
  const freshPlan = generateDailyExerciseGuide({ primaryGoal: 'general_fitness' }, 2);
  const exhaustedPlan = generateDailyExerciseGuide({ primaryGoal: 'general_fitness' }, 9);

  // Monday workout duration should be shorter when exhausted
  assert.ok(exhaustedPlan[0].durationMinutes <= freshPlan[0].durationMinutes);
});

test('generateRecommendations suggests rest/recovery for fatigue >= 7', () => {
  const recs = generateRecommendations([], { primaryGoal: 'general_fitness' }, 8);
  const fatigueRec = recs.find((r) => r.category === 'recovery');
  assert.ok(fatigueRec, 'Should provide recovery recommendation when fatigue is high');
});
