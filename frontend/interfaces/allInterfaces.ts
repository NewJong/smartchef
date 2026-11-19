import { Dish } from "./Dish";
import { Ingredient } from "./Ingredient";
export type SortOption = 'calories_asc' | 'calories_desc' | 'time_desc' | 'time_asc' | 'created_asc' | 'created_desc';

export interface Sort {
  sort?: SortOption;
}

export interface AddToStatisticsButtonProps {
  userId: number;
  dishId: number;
}

export interface AddAllToCartButtonProps {
  userId: number;
  ingredients: Ingredient[];
}

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  sort?: SortOption;
}

export interface CardProps {
  visible?: boolean;
  onPress: () => void;
  dish: Dish;
  initiallyFavorite?: boolean;
  onLongDelete?: () => void;
}