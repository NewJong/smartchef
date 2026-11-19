import { fetchData } from "@/constants/fetchData";
import { DishWithIngredients } from "@/interfaces/DishWithIngredients";
import { useEffect, useState } from "react";

export function useFavoriteDishes(email: string, isLoggedIn: boolean, isFocused = true) {
    const [favoriteDishes, setFavoriteDishes] = useState<DishWithIngredients[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadDishes = async () => {
        if (!isLoggedIn || !email) {
          setFavoriteDishes([]);
          setLoading(false);
          return;
        }
  
        try {
          const data = await fetchData(`favorites-dishes/get?email=${email}`);
          if (data && data.favorite_dishes) {
            setFavoriteDishes(data.favorite_dishes);
          } else {
            setFavoriteDishes([]);
          }
          // console.log("SERVER RESPONSE", data);
        } catch (error) {
          console.error("Error loading favorite dishes:", error);
          setFavoriteDishes([]);
        } finally {
          setLoading(false);
        }
      };
  
      loadDishes();
    }, [email, isLoggedIn, isFocused]);


  
  
    return { favoriteDishes, loading };
}