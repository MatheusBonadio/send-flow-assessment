import { Observable } from 'rxjs';
import { onSnapshot, Query, DocumentData } from 'firebase/firestore';

export function createFirestoreObservable<T = DocumentData>(
  query: Query<T>,
): Observable<T[]> {
  return new Observable((subscriber) => {
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        subscriber.next(data);
      },
      (error) => {
        subscriber.error(error);
      },
    );

    return () => unsubscribe();
  });
}
