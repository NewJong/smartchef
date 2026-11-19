import { useState } from "react";
import type { Dish } from "@/interfaces/Dish";
import type { Ingredient } from "@/interfaces/Ingredient";
import { DishWithIngredients } from "@/interfaces/DishWithIngredients";

export function useDishModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<DishWithIngredients | null>(null);

  const openModal = (dish: Dish, ingredients: Ingredient[]) => {
    setSelected({ dish, ingredients });
    setModalVisible(true);
  };

  
  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
  };

  return {
    modalVisible,
    selected,
    openModal,
    closeModal,
    
  };
}
