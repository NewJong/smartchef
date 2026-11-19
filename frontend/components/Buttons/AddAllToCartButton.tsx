import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { fetchData } from '@/constants/fetchData'; 
import { AddAllToCartButtonProps } from '@/interfaces/allInterfaces';

const AddAllToCartButton: React.FC<AddAllToCartButtonProps> = ({ userId, ingredients }) => {
    const [buttonColor, setButtonColor] = useState("#70B9BE"); 
    const [isProcessing, setIsProcessing] = useState(false); 
  
    const handleAddAllToCart = async () => {
      setIsProcessing(true);
      setButtonColor("#4CAF50"); 
  
      try {
        for (const ingredient of ingredients) {
          const body = {
            user_id: userId,
            ingredient_id: ingredient.id,
            quantity: ingredient.quantity || 1,
          };
          const response = await fetchData("cart/add-ingredients", "POST", body);
        }
  
        setTimeout(() => {
          setButtonColor("#70B9BE"); 
          setIsProcessing(false);
        }, 500); 
      } catch (error) {
        console.error('Error adding ingredients to cart:', error);
        setButtonColor("#F44336"); 
        setTimeout(() => {
          setButtonColor("#70B9BE");
          setIsProcessing(false);
        }, 500);
      }
    };
  
    return (
      <TouchableOpacity
        style={[styles.buttonCart, { backgroundColor: buttonColor }]} 
        onPress={handleAddAllToCart}
        disabled={isProcessing} 
      >
        <Text style={styles.buttonText}>{isProcessing ? 'Adding...' : 'Add All to Cart'}</Text>
      </TouchableOpacity>
    );
  };

const styles = StyleSheet.create({
    buttonCart: {
        marginTop: 12,
        marginBottom: 24,
        paddingVertical: 16,
        backgroundColor: "#70B9BE",
        borderRadius: 16,
    },
    buttonText: {
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default AddAllToCartButton;