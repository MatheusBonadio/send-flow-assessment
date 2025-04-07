export const serverConfig = {
    useSecureCookies: process.env.USE_SECURE_COOKIES === 'true',
    firebaseApiKey: process.env.VITE_PUBLIC_FIREBASE_API_KEY!,
    serviceAccount: process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? {
            projectId: process.env.VITE_PUBLIC_FIREBASE_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')!
        } : undefined
};

export const authConfig = {
    apiKey: serverConfig.firebaseApiKey,
    cookieName: 'AuthToken',
    cookieSignatureKeys: [
        process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT!,
        process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS!
    ],
    cookieSerializeOptions: {
        path: '/',
        httpOnly: true,
        secure: serverConfig.useSecureCookies,
        sameSite: 'lax' as const,
        maxAge: 30 * 60 * 60 * 24
    },
    serviceAccount: serverConfig.serviceAccount,
    // Set to false in Firebase Hosting environment due to https://stackoverflow.com/questions/44929653/firebase-cloud-function-wont-store-cookie-named-other-than-session
    enableMultipleCookies: true,
    enableCustomToken: true,
    experimental_enableTokenRefreshOnExpiredKidHeader: true,
    debug: true,
    // tenantId: clientConfig.tenantId
};