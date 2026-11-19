import { Dish } from "./Dish";
import { Ingredient } from "./Ingredient";

export interface DishWithIngredients {
  dish: Dish;
  ingredients: Ingredient[];
}