import "@/global.css";
import { ClerkProvider, useAuth, useClerk } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { router, SplashScreen, Stack, usePathname } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function AppNavigator() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const isAuthRoute =
      pathname === "/onboarding" ||
      pathname === "/" ||
      pathname === "/sign-in" ||
      pathname === "/sign-up" ||
      pathname.startsWith("/(auth)");

    if (!isSignedIn && !isAuthRoute) {
      router.replace("/onboarding");
      return;
    }

    if (isSignedIn && isAuthRoute && pathname !== "/") {
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn, pathname]);

  useEffect(() => {
    if (pathname === "/onboarding" && isLoaded && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn, pathname]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-light": require("../../assets/fonts/PlusJakartaSans-Light.ttf"),
    "sans-regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-semibold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("../../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AppNavigator />
    </ClerkProvider>
  );
}
