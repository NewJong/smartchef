import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { CartIngredients } from '@/interfaces/CartIngredients';
import { ThemedText } from '@/components/ThemedText';
import { franc } from 'franc';
import langs from 'langs';

const detectLanguage = (text: string): string => {
  const langCode = franc(text);
  const language = langs.where('3', langCode);
  return language ? language.name : 'English';
};

const generatePrompt = (
  ingredients: CartIngredients[],
  question: string,
): string => {
  const names = ingredients.map(item => item.ingredient.name).join(', ');
  const userPrompt = question?.trim() || 'I need a recipe.';

  const detectedLanguage = detectLanguage(userPrompt);
  const systemAddition = `You are a helpful chef assistant. Always respond in ${detectedLanguage}. Give a detailed recipe with exact measurements (grams, ml), and describe all preparation steps. Do NOT use bullet points, markdown, or formatting — only plain text.`;

  return `${systemAddition}\n\nI have the following ingredients: ${names}. ${userPrompt}`;
};
const createChatSession = async (prompt: string): Promise<string> => {
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', errorText);
      Alert.alert(
        'Error',
        'There was an error generating the recipe. Please try again.',
      );
      return 'An error occurred while generating the recipe.';
    }

    const data = await response.json();

    if (
      data &&
      Array.isArray(data.choices) &&
      data.choices.length > 0 &&
      data.choices[0].message &&
      typeof data.choices[0].message.content === 'string'
    ) {
      return data.choices[0].message.content.trim();
    } else {
      console.error(
        'Invalid response structure:',
        JSON.stringify(data, null, 2),
      );
      Alert.alert(
        'Error',
        'Unable to process response from server. Try again.',
      );
      return 'Unable to parse the recipe. Please try again.';
    }
  } catch (error) {
    console.error('API call error:', error);
    Alert.alert(
      'Error',
      'An unexpected error occurred while generating the recipe.',
    );
    return 'An error occurred while generating the recipe.';
  }
};

interface RecipeChatBotProps {
  ingredients: CartIngredients[];
  onRequestSent: () => void;
}

const RecipeChatBot: React.FC<RecipeChatBotProps> = ({
  ingredients,
  onRequestSent,
}) => {
  const [question, setQuestion] = useState<string>('');
  const [recipe, setRecipe] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = useCallback(async () => {
    if (ingredients.length === 0) {
      Alert.alert('Attention', 'No ingredients to generate recipe.');
      return;
    }
    setLoading(true);
    const prompt = generatePrompt(ingredients, question);
    const result = await createChatSession(prompt);
    setRecipe(result);
    setLoading(false);
    setQuestion('');
    onRequestSent && onRequestSent();
  }, [ingredients, question, onRequestSent]);

  return (
    <View>
      <ThemedText type="subtitle" style={styles.heading}>
        Ask the Chatbot
      </ThemedText>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder="For example: Prepare dinner from my ingredients"
        placeholderTextColor="#748189"
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleGenerate}
        disabled={loading}
      >
        <ThemedText type="greeting" style={styles.buttonText}>
          Send Request
        </ThemedText>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0A2533" />}
      {recipe !== '' && (
        <View>
          <Text style={styles.recipeText}>{recipe}</Text>
        </View>
      )}
    </View>
  );
};

export default RecipeChatBot;

const styles = StyleSheet.create({
  heading: {
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#0A2533',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#0A2533',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0A2533',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  recipeContainer: {
    maxHeight: 400,
    marginTop: 10,
  },
  recipeText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
});
