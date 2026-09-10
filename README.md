# SubPilot — Subscription Management App

SubPilot is a full-stack mobile app that helps users track and manage their recurring subscriptions in one centralized dashboard, with automated email reminders before renewal dates.

## Table of Contents

1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Available Scripts](#available-scripts)

## Introduction

SubPilot gives users a single place to see everything they're paying for on a recurring basis — active and inactive subscriptions alike — so nothing slips through the cracks. The app pairs a React Native/Expo client with a Node.js/Express API and MongoDB database, and sends scheduled email reminders ahead of upcoming billing dates.

## Tech Stack

**Frontend & Mobile**
- [React Native](https://reactnative.dev/) — cross-platform native mobile framework
- [Expo](https://expo.dev/) — tooling, file-based routing (Expo Router), and build services
- [TypeScript](https://www.typescriptlang.org/) — static typing across the codebase
- [NativeWind](https://www.nativewind.dev/) — Tailwind CSS utility classes for React Native

**Backend & Database**
- [Node.js](https://nodejs.org/) — backend runtime
- [Express](https://expressjs.com/) — API routing and middleware
- [MongoDB](https://www.mongodb.com/) — document database for users and subscriptions

**Infrastructure & Tools**
- [Clerk](https://clerk.com/) — authentication and user/session management
- [PostHog](https://posthog.com/) — product analytics
- Scheduled jobs (e.g. `node-cron`) + an email provider — automated renewal reminders

## Features

- **Subscription Dashboard** — a clean, centralized view of all recurring expenses
- **Active & Inactive Tracking** — categorize subscriptions to spot unused services worth cancelling
- **Automated Email Reminders** — scheduled notifications sent ahead of renewal dates
- **Secure Authentication** — sign-up, login, and session handling via Clerk
- **Native Tab Navigation** — a custom tab experience for iOS and Android
- **Full-Stack Persistence** — subscription data backed by an Express API and MongoDB
- **Product Analytics** — usage tracked through PostHog to guide iteration

## Project Structure

```txt
app/                  # Screens and routes (Expo Router)
  (auth)/
  (tabs)/
  subscription/
components/           # Reusable UI components
constants/             # Colors, categories, centralized image imports
lib/                   # API client, Clerk/PostHog helpers
src/
  config/
  server/              # Express app
    models/            # Mongoose schemas
    routes/
    controllers/
    middleware/
    jobs/              # Scheduled reminder jobs
assets/
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- npm

### Clone the repository

```bash
git clone <your-repo-url>
cd subpilot
```

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env` file in the project root (see [Environment Variables](#environment-variables) below).

### Run the app

Start the backend API:

```bash
npm run server
```

Start the Expo client:

```bash
npx expo start
```

This starts Metro Bundler and shows a QR code plus shortcut keys in the terminal:

- `a` — open on Android
- `i` — open in iOS Simulator (macOS only)
- `w` — open in a browser
- `r` — reload
- `m` — open the dev menu

The easiest way to test on a physical device is with the **Expo Go** app — install it from the App Store or Google Play, then scan the QR code from the terminal.

> **Note:** If you're on iOS and having trouble connecting, make sure any VPN is turned off and that local network permissions are granted to Expo Go.

## Environment Variables

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
MONGODB_URI=
POSTHOG_PROJECT_TOKEN=
POSTHOG_HOST=https://us.i.posthog.com
EMAIL_PROVIDER_API_KEY=
```

Only variables prefixed `EXPO_PUBLIC_` are exposed to the mobile client — everything else (database URI, Clerk secret key, email credentials) stays server-side only.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` / `npx expo start` | Start the Expo development server |
| `npm run server` | Start the Express API |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

---

Built with React Native, Expo, NativeWind, Clerk, and MongoDB.
