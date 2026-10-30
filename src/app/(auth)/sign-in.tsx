import { useAuth, useSignIn } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignIn = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn]);

  const handleSignIn = async () => {
    if (!isLoaded) return;

    const trimmedEmail = emailAddress.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setFormError("Email and password are required.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setFormError("Enter a valid email address.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      // Step 1: Create the sign-in attempt
      const result = await signIn.create({
        identifier: trimmedEmail,
      });

      // Step 2: Submit the password
      const { error } = await signIn.password({
        password: trimmedPassword,
      });

      if (error) {
        throw new Error(`Hmm... ${error.message}`);
      }

      if (signIn.status === "complete") {
        // Step 4: Activate/finalize the session
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            // Handle  any pending session task  separately
            if (session?.currentTask) return;

            // Step 5: Navigate after session activation
            router.replace(decorateUrl("/(tabs)") as Href);
          },
        });
        return;
      }

      setFormError(
        "Your sign-in is still pending. Please try again in a moment.",
      );
    } catch (error: any) {
      const message =
        error?.errors?.[0]?.longMessage ||
        error?.message ||
        "We couldn’t sign you in. Please check your details and try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="auth-scroll"
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="auth-content"
          >
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

            <View className="items-center">
              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">
                Keep every renewal, recurring payment, and budget decision in
                one place.
              </Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Email address</Text>
                  <TextInput
                    value={emailAddress}
                    placeholder="name@example.com"
                    onChangeText={setEmailAddress}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    className={`auth-input ${formError ? "auth-input-error" : ""}`}
                    placeholderTextColor="#6B7280"
                    accessibilityLabel="Email address"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    value={password}
                    placeholder="Enter your password"
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    className={`auth-input ${formError ? "auth-input-error" : ""}`}
                    placeholderTextColor="#6B7280"
                    accessibilityLabel="Password"
                  />
                </View>

                {formError ? (
                  <Text className="auth-error">{formError}</Text>
                ) : null}

                <TouchableOpacity
                  onPress={handleSignIn}
                  disabled={isSubmitting}
                  className={`auth-button ${isSubmitting ? "auth-button-disabled" : ""}`}
                  accessibilityRole="button"
                >
                  <Text className="auth-button-text">
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">New to Recurly?</Text>
              <Link href="/(auth)/sign-up">
                <Text className="auth-link">Create account</Text>
              </Link>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
