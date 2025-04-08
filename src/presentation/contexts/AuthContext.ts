import type { User } from 'firebase/auth';
import { createContext } from 'react';

export interface AuthContext {
  user: User | null;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);
