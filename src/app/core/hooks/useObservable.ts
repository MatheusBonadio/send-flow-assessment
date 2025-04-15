import React from 'react';
import { Observable } from 'rxjs';

export default function useObservable<T>(
  observable: () => Observable<T>,
  deps: any[] = [],
): T | undefined {
  const [state, setState] = React.useState<T | undefined>(undefined);

  React.useEffect(() => {
    const subscription = observable().subscribe(setState);

    return () => {
      subscription.unsubscribe();
      setState(undefined);
    };
  }, deps);

  return state;
}
