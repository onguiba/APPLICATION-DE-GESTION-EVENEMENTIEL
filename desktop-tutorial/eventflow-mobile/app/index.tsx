import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login by default
    // In a real app, you would check AsyncStorage for auth token here
    setTimeout(() => {
      router.replace('/(auth)/login');
    }, 500);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
      <ActivityIndicator size="large" color="#f97316" />
    </View>
  );
}
