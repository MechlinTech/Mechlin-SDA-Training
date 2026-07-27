# React Native Setup Guide - Day 19

## Overview

Day 19 focused on setting up a complete React Native development environment and successfully running a React Native mobile application on an Android Emulator.

The primary objective was to prepare a stable development environment that will be used for implementing mobile application features in the upcoming training days.

---

# Objectives Completed

- Successfully installed and configured React Native development environment.
- Configured Java Development Kit (JDK 17).
- Configured Android SDK.
- Configured Gradle build environment.
- Successfully connected Android Emulator.
- Built the Android application successfully.
- Installed and launched the application on the emulator.
- Verified that React Native development environment is working correctly.

---

# Development Environment

## Operating System

Windows 11

## Development Tools

- Visual Studio Code
- Android Studio
- Android Emulator
- Node.js
- npm
- React Native CLI
- Git

---

# Project Created

Project Name

```
SDATrainingApp
```

The project was created as a standalone React Native application for mobile development and testing.

---

# Environment Configuration

## Java Development Kit

Installed

```
JDK 17
```

Configured

```
JAVA_HOME
```

Verified Java installation using

```bash
java -version
```

---

## Android SDK

Configured Android SDK environment variables.

Verified

- ANDROID_HOME
- Platform Tools
- Build Tools
- Emulator

---

## Emulator Setup

Started Android Emulator successfully.

Verified device connection using

```bash
adb devices
```

Output

```
emulator-5554 device
```

---

# Gradle Build

Cleaned previous build cache

```bash
cd android
gradlew clean
```

The clean process completed successfully.

---

# Application Build

Generated Android application using

```bash
npx react-native run-android
```

Build Result

```
BUILD SUCCESSFUL
```

The application was installed automatically on the Android Emulator.

---

# Application Verification

Successfully verified

- Application launches correctly.
- Dashboard screen loads successfully.
- Native Android build is working.
- Metro Bundler connects successfully.
- Fast Refresh is available for development.

---

# Challenges Faced

During environment setup several issues were encountered.

## JDK Version Issue

Initially Java 21 was configured.

React Native required JDK 17 for stable Gradle builds.

Solution

Installed JDK 17 and updated JAVA_HOME.

---

## JAVA_HOME Conflict

Both User and System JAVA_HOME variables existed.

Windows was using the incorrect Java installation.

Solution

Updated JAVA_HOME to use JDK 17.

---

## Android Emulator Detection

Initially no Android device was detected.

Solution

Started Android Emulator and verified using

```bash
adb devices
```

---

## Gradle Build Errors

Performed

```bash
gradlew clean
```

Rebuilt the application.

Build completed successfully.

---

# Project Structure Overview

```
SDATrainingApp
│
├── android/
├── ios/
├── app/
├── node_modules/
├── package.json
└── android.gradle
```

---

# Commands Used

Start Metro

```bash
npx react-native start
```

Run Android Application

```bash
npx react-native run-android
```

Clean Gradle

```bash
cd android
gradlew clean
```

Check Connected Device

```bash
adb devices
```

---

# Learning Outcome

After completing Day 19, I can

- Configure a React Native development environment.
- Configure Android SDK and JDK.
- Build React Native Android applications.
- Run applications on Android Emulator.
- Troubleshoot common React Native environment issues.
- Understand the React Native project structure.
- Prepare the development environment for future mobile application development.

---

# Future Scope

The configured React Native project is now ready for implementing

- Navigation
- State Management
- API Integration
- Local Storage
- Offline Support
- Push Notifications
- Authentication
- Mobile UI Components

These features will be implemented in the upcoming training days.

---

# Conclusion

Day 19 successfully established a complete React Native development environment.

The application builds successfully, runs on the Android Emulator, and the environment is now ready for developing cross-platform mobile applications using React Native.





## My Progress

### Completed

- React Native environment setup
- JDK 17 configuration
- Android SDK configuration
- Android Emulator setup
- Gradle configuration
- Successfully built Android application
- Successfully launched application on Android Emulator

### Status

✅ Environment Ready

The React Native development environment is fully configured and ready for implementing the remaining Day 19 tasks such as navigation, state management, API integration and offline support.
