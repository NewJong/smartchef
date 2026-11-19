import { fetchData } from "@/constants/fetchData";
import { Dish } from "@/interfaces/Dish";
import { Ingredient } from "@/interfaces/Ingredient";
import { useEffect, useState } from "react";

const useDishes = () => {
    const [dishes, setDishes] = useState<{ dish: Dish; ingredients: Ingredient[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const loadDishes = async () => {
        setLoading(true);
        setError(null);
        const allDishes = await fetchData("dishes");
  
        if (allDishes) {
          setDishes(allDishes);
        } else {
          setError("Error");
        }
  
        setLoading(false);
      };
  
      loadDishes();
    }, []);
  
    return { dishes, loading, error };
};
  
export default useDishes;