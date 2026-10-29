import { useAuth } from "@clerk/expo";
import { Link, router } from "expo-router";
import { styled } from "nativewind";
import { useEffect } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Onboarding = () => {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="auth-safe-area">
      <StatusBar
        animated={true}
        barStyle="dark-content"
        showHideTransition="slide"
      />
      <ScrollView contentContainerClassName="auth-content items-center justify-center">
        <View className="auth-brand-block">
          <View className="auth-logo-wrap">
            <View className="auth-logo-mark">
              <Text className="auth-logo-mark-text">R</Text>
            </View>
            <View>
              <Text className="auth-wordmark">Recurly</Text>
              <Text className="auth-wordmark-sub">Smart subscriptions</Text>
            </View>
          </View>
        </View>

        <Text className="auth-title mt-6 text-center">
          Take control of recurring spend
        </Text>
        <Text className="auth-subtitle mt-3">
          Track every membership, spot renewals early, and keep your annual
          budget in budget.
        </Text>

        <View className="mt-8 w-full gap-4">
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity
              className="auth-button"
              accessibilityRole="button"
            >
              <Text className="auth-button-text">Create account</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity
              className="auth-secondary-button"
              accessibilityRole="button"
            >
              <Text className="auth-secondary-button-text">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Onboarding;
