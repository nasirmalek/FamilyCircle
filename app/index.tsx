// Entry Point - Route logic with auth and family check
import { useEffect, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/template';
import { useFamily } from '@/hooks/useFamily';
import { colors } from '@/constants/theme';

export default function Index() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { currentFamily, loading: familyLoading } = useFamily();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  // Handle navigation when auth or family state changes
  useEffect(() => {
    if (hasNavigated || isFirstLaunch === null || authLoading) return;

    // Don't navigate during first launch or initial auth loading
    if (isFirstLaunch) return;

    // If authenticated and family data is loaded
    if (user && !familyLoading) {
      if (currentFamily) {
        setHasNavigated(true);
        router.replace('/(tabs)');
      } else {
        setHasNavigated(true);
        router.replace('/family/setup');
      }
    }
  }, [user, currentFamily, familyLoading, isFirstLaunch, authLoading, hasNavigated]);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        await AsyncStorage.setItem('hasLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    }
  };

  if (isFirstLaunch === null || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // First launch - show onboarding
  if (isFirstLaunch) {
    return <Redirect href="/onboarding" />;
  }

  // Not authenticated - show login
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  // Wait for family data to load
  if (familyLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // No family - show setup
  if (!currentFamily) {
    return <Redirect href="/family/setup" />;
  }

  // Has family - go to main app
  return <Redirect href="/(tabs)" />;
}
