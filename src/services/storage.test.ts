import test from 'node:test';
import assert from 'node:assert/strict';
import { StorageService } from './storage';

// Mock localStorage for node environment
const storageMock: Record<string, string> = {};
(globalThis as any).localStorage = {
  getItem: (k: string) => storageMock[k] || null,
  setItem: (k: string, v: string) => {
    storageMock[k] = v;
  },
  removeItem: (k: string) => {
    delete storageMock[k];
  },
  clear: () => {
    Object.keys(storageMock).forEach((k) => delete storageMock[k]);
  },
};

test('StorageService.registerUser creates account and sets active profile', () => {
  const res = StorageService.registerUser({
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    password: 'password123',
    profileData: {
      age: 29,
      weightKg: 62,
      primaryGoal: 'endurance',
    },
  });

  assert.equal(res.success, true);
  assert.equal(res.user?.email, 'sarah@example.com');
  assert.equal(res.user?.profile.name, 'Sarah Connor');
  assert.equal(res.user?.profile.weightKg, 62);

  // Check active user
  const current = StorageService.getCurrentUser();
  assert.equal(current?.email, 'sarah@example.com');
});

test('StorageService.registerUser prevents duplicate email', () => {
  const dup = StorageService.registerUser({
    name: 'Sarah 2',
    email: 'sarah@example.com',
    password: 'password999',
  });

  assert.equal(dup.success, false);
  assert.match(dup.error || '', /already exists/i);
});

test('StorageService.loginUser verifies credentials', () => {
  const badLogin = StorageService.loginUser('sarah@example.com', 'wrongpassword');
  assert.equal(badLogin.success, false);
  assert.match(badLogin.error || '', /incorrect password/i);

  const goodLogin = StorageService.loginUser('sarah@example.com', 'password123');
  assert.equal(goodLogin.success, true);
  assert.equal(goodLogin.user?.profile.name, 'Sarah Connor');
});

test('StorageService.updateProfile syncs changes', () => {
  const updated = StorageService.updateProfile({
    name: 'Sarah C. Brewster',
    weightKg: 60,
  });

  assert.equal(updated.name, 'Sarah C. Brewster');
  assert.equal(updated.weightKg, 60);

  const current = StorageService.getCurrentUser();
  assert.equal(current?.profile.name, 'Sarah C. Brewster');
});

test('StorageService.logout clears current session', () => {
  StorageService.logout();
  assert.equal(StorageService.getCurrentUserEmail(), null);
});
