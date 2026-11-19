import { Dish } from "./Dish";
import { Ingredient } from "./Ingredient";

export interface StatisticsDish {
    id: number;
    user_id: number;
    created_at: string;
    dish_ingredient: {
        dish: Dish;
        ingredients: Ingredient[];
    };
}
