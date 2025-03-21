import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { clientConfig } from '@/config';

export const app = initializeApp(clientConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc };