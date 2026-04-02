import { useQuery } from '@tanstack/react-query';
import { fetchFodClassesRaw, normalizeFodClasses, type FodListItem } from '../api/fod';

export function useFodCatalog() {
  return useQuery<FodListItem[]>({
    queryKey: ['fod', 'classes'],
    queryFn: async () => normalizeFodClasses(await fetchFodClassesRaw()),
    staleTime: 5 * 60_000,
  });
}
