# TrackWise - Expense Tracker

This is a Next.js application for tracking personal expenses and income, built with Firebase and Genkit AI.

## Features

- **Authentication**: Secure login and registration using Firebase Authentication.
- **Dashboard**: At-a-glance summary of your income, expenses, and current balance.
- **Transactions**: Full CRUD (Create, Read, Update, Delete) functionality for your transactions.
- **AI-Powered Categorization**: Get smart category suggestions for your transactions based on their descriptions.
- **Reporting**: Generate monthly reports with data visualizations to understand your spending habits.
- **Modern UI**: A clean, responsive, and aesthetically pleasing interface built with shadcn/ui and Tailwind CSS.

## Getting Started

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 2. Set up Firebase

1.  Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
2.  In your project, go to **Authentication** and enable the **Email/Password** sign-in method.
3.  Go to **Firestore Database** and create a new database. Start in **test mode** for now. You can secure it later with security rules.
4.  Go to **Project settings** > **General** and find your project's web app configuration.

### 3. Environment Variables

Create a `.env.local` file in the root of the project and add your Firebase configuration. You can copy the config object directly from your Firebase project settings.

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Install Dependencies and Run

Install the necessary packages and run the development server.

```bash
npm install
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).
