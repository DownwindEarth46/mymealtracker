import { useState, useEffect, useCallback } from "react";
import { View, ScrollView, StyleSheet, StatusBar, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Auth
import { useAuth } from "../context/AuthContext";

// Components
import Header from "../components/Header";
import SearchSection from "../components/SearchSection";
import LogSection from "../components/LogSection";

// Constants
import { FOOD_DATABASE, DAILY_GOAL } from "../constants/foodDatabase";

// Utilities
import { apiGet, apiPost, apiDelete } from "../utils/api";

export default function HomePage() {
  const { token } = useAuth();
  const [loggedFoods, setLoggedFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [showLog, setShowLog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Derive today's date dynamically so it always reflects the current day
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Load meals from backend
  const loadMealsFromBackend = useCallback(async () => {
    setIsLoading(true);
    const result = await apiGet(token, '/meals');
    if (result.success) {
      setLoggedFoods(result.data || []);
    } else {
      console.error('Failed to load meals:', result.error);
    }
    setIsLoading(false);
  }, [token]);

  // Load meals from backend on component mount
  useEffect(() => {
    if (token) {
      loadMealsFromBackend();
    }
  }, [token, loadMealsFromBackend]);

  // Calculations
  const totalCalories = loggedFoods.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = loggedFoods.reduce((sum, f) => sum + f.protein, 0);
  const totalCarbs = loggedFoods.reduce((sum, f) => sum + f.carbs, 0);
  const totalFat = loggedFoods.reduce((sum, f) => sum + f.fat, 0);

  const remaining = DAILY_GOAL - totalCalories;
  const progress = (totalCalories / DAILY_GOAL) * 100;
  const isOver = totalCalories > DAILY_GOAL;

  const filtered = FOOD_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Handlers
  const addFood = async (food) => {
    setIsLoading(true);
    const mealData = {
      foodName: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    };

    const result = await apiPost(token, '/meals', mealData);
    if (result.success) {
      setLoggedFoods((prev) => [...prev, result.data]);
      Alert.alert('Success', `${food.name} logged!`);
    } else {
      Alert.alert('Error', `Failed to log meal: ${result.error}`);
    }
    setIsLoading(false);
  };

  // Use meal ID instead of index to avoid stale reference bugs
  const removeFood = async (id) => {
    const meal = loggedFoods.find((f) => f.id === id);
    if (!meal || !meal.id) {
      setLoggedFoods((prev) => prev.filter((f) => f.id !== id));
      return;
    }

    setIsLoading(true);
    const result = await apiDelete(token, `/meals/${meal.id}`);
    if (result.success) {
      setLoggedFoods((prev) => prev.filter((f) => f.id !== id));
      Alert.alert('Success', 'Meal removed!');
    } else {
      Alert.alert('Error', `Failed to remove meal: ${result.error}`);
    }
    setIsLoading(false);
  };

  const clearLog = async () => {
    Alert.alert(
      'Clear Log',
      'Are you sure you want to remove all meals?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            setIsLoading(true);
            // Guard against meals with missing IDs
            const deletePromises = loggedFoods
              .filter((meal) => meal.id)
              .map((meal) => apiDelete(token, `/meals/${meal.id}`));

            const results = await Promise.all(deletePromises);
            const anyFailed = results.some((r) => !r.success);

            if (anyFailed) {
              // Re-sync with backend if any deletes failed
              await loadMealsFromBackend();
              Alert.alert('Error', 'Some meals could not be deleted. Please try again.');
            } else {
              setLoggedFoods([]);
              Alert.alert('Success', 'All meals cleared!');
            }
            setIsLoading(false);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const toggleLog = () => setShowLog(!showLog);

  if (isLoading && loggedFoods.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      {/* Header Component */}
      <Header
        today={today}
        progress={progress}
        totalCalories={totalCalories}
        remaining={remaining}
        isOver={isOver}
        totalProtein={totalProtein}
        totalCarbs={totalCarbs}
        totalFat={totalFat}
        dailyGoal={DAILY_GOAL}
        loggedFoodCount={loggedFoods.length}
        showLog={showLog}
        onToggleLog={toggleLog}
      />

      {/* Body Content */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!showLog ? (
          <SearchSection
            search={search}
            onSearchChange={setSearch}
            filtered={filtered}
            onAddFood={addFood}
          />
        ) : (
          <LogSection
            loggedFoods={loggedFoods}
            totalCalories={totalCalories}
            onRemove={removeFood}
            onClearLog={clearLog}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#eef2ff",
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
