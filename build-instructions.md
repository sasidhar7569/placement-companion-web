# Build, Sync, and Deployment Instructions

This document provides the exact commands required to build your web app, sync it to the Android Capacitor project, build the final APK, start the backend server, and push your repository to GitHub.

## 1. Rebuild the Vite Production Build
To create the latest optimized production bundle of the web application, run:
```bash
npm run build
```

## 2. Sync Capacitor Android
To synchronize your newly built web assets into the Android native project, run:
```bash
npx cap sync android
```

## 3. Build the Android APK
After syncing the web assets, build the debug APK using Gradle:
```bash
cd android
.\gradlew.bat assembleDebug
```

> [!TIP]
> **APK Output Path:**
> Once the build is complete, you can find the APK at:
> `android/app/build/outputs/apk/debug/app-debug.apk`

## 4. Backend Server Startup
To start your backend server (now configured to listen on all interfaces `0.0.0.0` for network traffic), run:
```bash
node server.cjs
```
Your backend will now accept connections from `http://10.141.95.184:5000`.

## 5. Prepare Project for GitHub Push
To push all components (frontend, backend, Android Capacitor project, Selenium tests, Appium tests) to your GitHub repository, ensure you are in the root directory `WebApp` and run the following Git commands:

```bash
# Initialize git if not already initialized
git init

# Stage all files
git add .

# Commit changes
git commit -m "chore: setup mobile api routing, cleartext traffic, and automated testing"

# Add your remote repository (replace URL with your actual GitHub repo URL)
# git remote add origin https://github.com/yourusername/your-repo.git

# Push to the main branch
git push -u origin main
```
