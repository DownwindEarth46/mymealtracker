import { SafeAreaProvider } from 'react-native-safe-area-context';
import CalorieTracker from './CalorieTracker';

export default function App() {
  return (
    <SafeAreaProvider>
      <CalorieTracker />
    </SafeAreaProvider>
  );
}