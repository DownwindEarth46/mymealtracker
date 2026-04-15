import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const FOOD_DATABASE = [
  { id: 1, name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 2, name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { id: 3, name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { id: 4, name: "Whole Egg", calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { id: 5, name: "Greek Yogurt (170g)", calories: 100, protein: 17, carbs: 6, fat: 0.7 },
  { id: 6, name: "Almonds (28g)", calories: 164, protein: 6, carbs: 6, fat: 14 },
  { id: 7, name: "Salmon (100g)", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: 8, name: "Oatmeal (1 cup)", calories: 154, protein: 6, carbs: 27, fat: 3 },
  { id: 9, name: "Avocado (half)", calories: 120, protein: 1.5, carbs: 6, fat: 11 },
  { id: 10, name: "Sweet Potato (medium)", calories: 103, protein: 2.3, carbs: 24, fat: 0.1 },
  { id: 11, name: "Broccoli (1 cup)", calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { id: 12, name: "Cheddar Cheese (28g)", calories: 113, protein: 7, carbs: 0.4, fat: 9 },
];

const DAILY_GOAL = 2000;

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long", month: "short", day: "numeric",
});

const MacroPill = ({ label, value, unit, color }) => (
  <View style={[styles.macroPill, { backgroundColor: color }]}>
    <Text style={styles.macroPillValue}>{Math.round(value)}{unit}</Text>
    <Text style={styles.macroPillLabel}>{label}</Text>
  </View>
);

const CalorieRing = ({ progress, totalCalories }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = Math.min(progress / 100, 1) * circumference;
  const isOver = totalCalories > DAILY_GOAL;

  return (
    <View style={styles.ringContainer}>
      <Svg width={128} height={128} viewBox="0 0 128 128">
        <Circle
          cx="64" cy="64" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={10}
        />
        <Circle
          cx="64" cy="64" r={radius}
          fill="none"
          stroke={isOver ? "#fbbf24" : "#fff"}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
        />
      </Svg>
      <View style={styles.ringTextContainer}>
        <Text style={styles.ringCalories}>{totalCalories}</Text>
        <Text style={styles.ringLabel}>consumed</Text>
      </View>
    </View>
  );
};

const FoodItem = ({ food, onAdd }) => (
  <View style={styles.foodCard}>
    <View style={styles.foodCardLeft}>
      <Text style={styles.foodName}>{food.name}</Text>
      <Text style={styles.foodMacros}>
        P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
      </Text>
    </View>
    <View style={styles.foodCardRight}>
      <Text style={styles.foodCalories}>{food.calories} kcal</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => onAdd(food)} activeOpacity={0.75}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const LoggedItem = ({ food, index, onRemove }) => (
  <View style={styles.loggedItem}>
    <View style={styles.loggedItemLeft}>
      <View style={styles.loggedIndex}>
        <Text style={styles.loggedIndexText}>{index + 1}</Text>
      </View>
      <Text style={styles.loggedName}>{food.name}</Text>
    </View>
    <View style={styles.loggedItemRight}>
      <Text style={styles.loggedCalories}>{food.calories} kcal</Text>
      <TouchableOpacity onPress={() => onRemove(index)} activeOpacity={0.6} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function CalorieTracker() {
  const [loggedFoods, setLoggedFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [showLog, setShowLog] = useState(false);

  const totalCalories = loggedFoods.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = loggedFoods.reduce((sum, f) => sum + f.protein, 0);
  const totalCarbs = loggedFoods.reduce((sum, f) => sum + f.carbs, 0);
  const totalFat = loggedFoods.reduce((sum, f) => sum + f.fat, 0);

  const remaining = DAILY_GOAL - totalCalories;
  const progress = (totalCalories / DAILY_GOAL) * 100;
  const isOver = totalCalories > DAILY_GOAL;

  const filtered = FOOD_DATABASE.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const addFood = (food) => setLoggedFoods(prev => [...prev, food]);
  const removeFood = (index) => setLoggedFoods(prev => prev.filter((_, i) => i !== index));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.dateText}>{today}</Text>
            <Text style={styles.headerTitle}>Daily Calories</Text>
          </View>
          <TouchableOpacity
            style={styles.logToggle}
            onPress={() => setShowLog(!showLog)}
            activeOpacity={0.75}
          >
            <Text style={styles.logToggleText}>
              {showLog ? "← Search" : `Log (${loggedFoods.length})`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerStats}>
          <CalorieRing progress={progress} totalCalories={totalCalories} />

          <View style={styles.statsRight}>
            <Text style={styles.goalText}>
              Goal: <Text style={styles.goalBold}>{DAILY_GOAL} kcal</Text>
            </Text>
            <Text style={[styles.remainingText, isOver && styles.remainingOver]}>
              {isOver ? `+${Math.abs(remaining)}` : remaining}
              <Text style={styles.remainingUnit}> kcal {isOver ? "over" : "left"}</Text>
            </Text>
            <View style={styles.macroRow}>
              <MacroPill label="Protein" value={totalProtein} unit="g" color="rgba(16,185,129,0.85)" />
              <MacroPill label="Carbs" value={totalCarbs} unit="g" color="rgba(245,158,11,0.85)" />
              <MacroPill label="Fat" value={totalFat} unit="g" color="rgba(239,68,68,0.85)" />
            </View>
          </View>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!showLog ? (
          <>
            {/* Search bar */}
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search foods..."
                placeholderTextColor="#94a3b8"
                returnKeyType="search"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")} activeOpacity={0.7}>
                  <Text style={styles.clearSearch}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.sectionLabel}>Food Database</Text>

            {filtered.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No foods found.</Text>
                <Text style={styles.emptySubText}>Try a different search term.</Text>
              </View>
            ) : (
              filtered.map(food => (
                <FoodItem key={food.id} food={food} onAdd={addFood} />
              ))
            )}
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>
              Today's Log · {loggedFoods.length} item{loggedFoods.length !== 1 ? "s" : ""}
            </Text>

            {loggedFoods.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No foods logged yet.</Text>
                <Text style={styles.emptySubText}>Search and add foods to get started.</Text>
              </View>
            ) : (
              <>
                {loggedFoods.map((food, i) => (
                  <LoggedItem key={i} food={food} index={i} onRemove={removeFood} />
                ))}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalCalories}>{totalCalories} kcal</Text>
                </View>

                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setLoggedFoods([])}
                  activeOpacity={0.75}
                >
                  <Text style={styles.clearButtonText}>Clear Log</Text>
                </TouchableOpacity>
              </>
            )}
          </>
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

  // Header
  header: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  dateText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 2,
  },
  logToggle: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  logToggleText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  // Ring
  ringContainer: {
    width: 128,
    height: 128,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  ringTextContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ringCalories: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 26,
  },
  ringLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    marginTop: 2,
  },

  // Stats
  statsRight: {
    flex: 1,
  },
  goalText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginBottom: 4,
  },
  goalBold: {
    color: "#fff",
    fontWeight: "700",
  },
  remainingText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 30,
    marginBottom: 10,
  },
  remainingOver: {
    color: "#fbbf24",
  },
  remainingUnit: {
    fontSize: 13,
    fontWeight: "600",
  },
  macroRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  macroPill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    minWidth: 58,
  },
  macroPillValue: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  macroPillLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // Body
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 11,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 4,
  },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1e1b4b",
  },
  clearSearch: {
    color: "#94a3b8",
    fontSize: 14,
    paddingLeft: 8,
  },

  // Food card
  foodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  foodCardLeft: {
    flex: 1,
    marginRight: 12,
  },
  foodName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e1b4b",
  },
  foodMacros: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 3,
  },
  foodCardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  foodCalories: {
    fontWeight: "700",
    color: "#6366f1",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#6366f1",
    borderRadius: 10,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "400",
  },

  // Logged items
  loggedItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(99,102,241,0.08)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
  },
  loggedItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  loggedIndex: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
  },
  loggedIndexText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  loggedName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e1b4b",
    flex: 1,
  },
  loggedItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loggedCalories: {
    fontWeight: "700",
    color: "#6366f1",
    fontSize: 13,
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    color: "#cbd5e1",
    fontSize: 14,
  },

  // Total row
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  totalLabel: {
    fontWeight: "800",
    color: "#1e1b4b",
    fontSize: 15,
  },
  totalCalories: {
    fontWeight: "900",
    fontSize: 18,
    color: "#6366f1",
  },

  // Clear button
  clearButton: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#fee2e2",
    borderRadius: 14,
    padding: 13,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#ef4444",
    fontWeight: "700",
    fontSize: 14,
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 50,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "600",
  },
  emptySubText: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },
});
