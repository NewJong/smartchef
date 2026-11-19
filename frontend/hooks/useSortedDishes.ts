import { useMemo } from 'react';
import { SortOption } from '@/components/SortDropdown';

export function useSortedDishes(dishes: any[], sortOption: SortOption) {
  return useMemo(() => {
    if (!dishes || dishes.length === 0) return [];

    const sorted = [...dishes];
    switch (sortOption) {
      case 'calories_desc':
        sorted.sort((a, b) => (b.dish.calories || 0) - (a.dish.calories || 0));
        break;
      case 'calories_asc':
        sorted.sort((a, b) => (a.dish.calories || 0) - (b.dish.calories || 0));
        break;
      case 'time_desc':
        sorted.sort((a, b) => (b.dish.preparation_time || 0) - (a.dish.preparation_time || 0));
        break;
      case 'time_asc':
        sorted.sort((a, b) => (a.dish.preparation_time || 0) - (b.dish.preparation_time || 0));
        break;
      case 'created_asc':
        sorted.sort((a, b) => (new Date(b.dish.created_at).getTime() - new Date(a.dish.created_at).getTime()));
        break;
      case 'created_desc':
        sorted.sort((a, b) => (new Date(a.dish.created_at).getTime() - new Date(b.dish.created_at).getTime()));
        break;
      default:
        break;
    }
    return sorted;
  }, [dishes, sortOption]);
}