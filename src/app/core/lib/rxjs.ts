import { map, Observable } from 'rxjs';
import {
  onSnapshot,
  Query,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';

export function collectionData<T>(
  query: Query<T | DocumentData>,
  idField = 'id',
): Observable<T[]> {
  return new Observable<QuerySnapshot<T | DocumentData>>((subscriber) => {
    const unsubscribe = onSnapshot(query, subscriber);
    return { unsubscribe };
  }).pipe(
    map((changes) =>
      changes.docs.map((snap) => {
        const data = snap.data();

        if (idField) (data as any)[idField] = snap.id;

        return data as T;
      }),
    ),
  );
}
