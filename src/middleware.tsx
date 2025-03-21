import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  authMiddleware,
  redirectToPath,
  redirectToLogin
} from 'next-firebase-auth-edge';
import { authConfig } from '@/config/serverConfig';

const PUBLIC_PATHS = ['/register', '/login', '/reset-password'];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: '/api/login',
    logoutPath: '/api/logout',
    debug: authConfig.debug,
    enableMultipleCookies: authConfig.enableMultipleCookies,
    enableCustomToken: authConfig.enableCustomToken,
    apiKey: authConfig.apiKey,
    cookieName: authConfig.cookieName,
    cookieSerializeOptions: authConfig.cookieSerializeOptions,
    cookieSignatureKeys: authConfig.cookieSignatureKeys,
    serviceAccount: authConfig.serviceAccount,
    experimental_enableTokenRefreshOnExpiredKidHeader:
      authConfig.experimental_enableTokenRefreshOnExpiredKidHeader,
    // tenantId: authConfig.tenantId,
    dynamicCustomClaimsKeys: ["someCustomClaim"],
    handleValidToken: async ({token, decodedToken, customToken}, headers) => {
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname) || request.nextUrl.pathname === "/")
        return redirectToPath(request, "/dashboard");

      return NextResponse.next({
        request: {
          headers
        }
      });
    },
    handleInvalidToken: async (_reason) => {
      return redirectToLogin(request, {
        path: '/login',
        publicPaths: PUBLIC_PATHS
      });
    },
    handleError: async (error) => {
      console.error('Unhandled authentication error', {error});

      return redirectToLogin(request, {
        path: '/login',
        publicPaths: PUBLIC_PATHS
      });
    }
  });
}

export const config = {
  matcher: [
    '/',
    '/((?!_next|favicon.ico|__/auth|__/firebase|api|.*\\.).*)',
    '/api/login',
    '/api/logout',
  ]
};