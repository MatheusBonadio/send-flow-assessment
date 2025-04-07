export const clientConfig = {
    apiKey: process.env.VITE_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    // databaseURL: process.env.VITE_PUBLIC_FIREBASE_DATABASE_URL!,
    projectId: process.env.VITE_PUBLIC_FIREBASE_PROJECT_ID!,
    messagingSenderId: process.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.VITE_PUBLIC_FIREBASE_APP_ID!,
    // tenantId: process.env.VITE_PUBLIC_FIREBASE_AUTH_TENANT_ID
};