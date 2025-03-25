import { Firestore, getFirestore, collection } from "firebase/firestore";
import { clientConfig } from "@/infrastructure/config/clientConfig";
import { initializeApp } from "firebase/app";

export class FirebaseFirestore {
  public db: Firestore;

  constructor() {
    const firebaseApp = initializeApp(clientConfig);
    this.db = getFirestore(firebaseApp);
  }

  collection(collectionName: string) {
    return collection(this.db, collectionName);
  }
}
