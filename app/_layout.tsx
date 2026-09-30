import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#4f46e5' },
        headerTintColor: '#ffffff',
      }}
    >
      <Stack.Screen name="index" options={{ title: '📺 Minhas Séries' }} />
    </Stack>
  );
}