import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { clientConfig } from '@/infrastructure/config/clientConfig';
import { getFirestore } from "firebase/firestore";

export const app = initializeApp(clientConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);