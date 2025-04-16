import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export function useRxValue<T>(
  observable$: Observable<T>,
  deps: unknown[] = [],
): T | undefined {
  const [value, setValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    const subscription = observable$.subscribe(setValue);
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return value;
}
