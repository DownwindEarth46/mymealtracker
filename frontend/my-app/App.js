import { useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Auth
import AuthPage from "./pages/AuthPage";

// Pages
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import CalendarPage from "./pages/CalendarPage";
import AchievementsPage from "./pages/AchievementsPage";
import ProfilePage from "./pages/ProfilePage";

// Components
import BottomNav from "./components/BottomNav";

export default function App() {
  const [user, setUser] = useState(null); // null = not signed in
  const [activeTab, setActiveTab] = useState("home");

  // Called by AuthPage on successful sign-in or sign-up
  const handleAuth = (userData) => {
    setUser(userData);
    setActiveTab("home");
  };

  // Show auth screen if not signed in
  if (!user) {
    return (
      <SafeAreaProvider>
        <AuthPage onAuth={handleAuth} />
      </SafeAreaProvider>
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage user={user} />;
      case "explore":
        return <ExplorePage />;
      case "calendar":
        return <CalendarPage />;
      case "achievements":
        return <AchievementsPage />;
      case "profile":
        return <ProfilePage user={user} onSignOut={() => setUser(null)} />;
      default:
        return <HomePage user={user} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        {renderPage()}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </View>
    </SafeAreaProvider>
  );
}
