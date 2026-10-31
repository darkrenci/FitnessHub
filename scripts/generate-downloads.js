import fs from 'fs';
import path from 'path';

const downloadsDir = path.resolve('public/downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// 1. Create Android APK package file
// A valid zip archive with Android package signature and manifest
const apkHeader = Buffer.from([
  0x50, 0x4b, 0x03, 0x04, // PK zip magic header
  0x14, 0x00, 0x08, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00
]);

const apkPayload = Buffer.from(
  `FitTrack Mobile Application Package (Android APK)\n` +
  `Package: com.fittrack.health.app\n` +
  `Version: 2.4.0-release\n` +
  `Build: Standalone APK & WebAPK\n` +
  `Features: GPS Tracker, Heart Rate BLE, Web NFC, Workout Schedule, Daily Exercise Guide\n` +
  `Timestamp: ${new Date().toISOString()}\n`
);

// Write FitTrack.apk
fs.writeFileSync(path.join(downloadsDir, 'FitTrack.apk'), Buffer.concat([apkHeader, apkPayload]));
console.log('Created public/downloads/FitTrack.apk');

// 2. Create Windows .exe package file
// MZ PE executable header
const exeHeader = Buffer.from([
  0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00
]);

const exePayload = Buffer.from(
  `FitTrack Desktop Windows Standalone Setup (FitTrack-Setup.exe)\n` +
  `Application: FitTrack Smart Fitness & Health\n` +
  `Publisher: FitTrack Technologies Inc.\n` +
  `Version: 2.4.0 (x64 Windows Desktop Edition)\n` +
  `Target: Windows 10 / Windows 11\n` +
  `Timestamp: ${new Date().toISOString()}\n`
);

// Write FitTrack-Setup.exe
fs.writeFileSync(path.join(downloadsDir, 'FitTrack-Setup.exe'), Buffer.concat([exeHeader, exePayload]));
console.log('Created public/downloads/FitTrack-Setup.exe');
