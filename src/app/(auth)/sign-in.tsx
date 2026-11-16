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
import { usePostHog } from "posthog-react-native";

import { posthogLog } from "@/src/lib/posthog-logs";

const SafeAreaView = styled(RNSafeAreaView);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignIn = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const posthog = usePostHog();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn]);

  const handleSignIn = async () => {
    if (!isLoaded) return;

    const trimmedEmail = emailAddress.trim();

    if (!trimmedEmail || !password) {
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
      // const result = await signIn.create({
      //   identifier: trimmedEmail,
      // });

      // Step 1: Create the sign-in attempt & Submit email and password
      const result = await signIn.password({
        emailAddress: trimmedEmail,
        password,
      });

      // console.log("Clerk sign-in result", {
      //   error: result.error?.message,
      //   status: signIn.status,
      //   secondFactorStrategies: signIn.supportedSecondFactors?.map(
      //     (factor) => factor.strategy,
      //   ),
      // });
      // console.log("signIn obj: ", signIn);
      

      if (result.error) {
        throw new Error(`Hmm... ${result.error.message}`);
      }

      if (signIn.status === "complete") {
        // Activate/finalize the session
        const finalizeResult = await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            // Handle  any pending session task  separately
            if (session?.currentTask) return;

            // Step 4: Navigate after session activation
            router.replace(decorateUrl("/(tabs)") as Href);
          },
        });
        if (finalizeResult.error) {
          throw new Error(finalizeResult.error.message);
        }
        posthogLog.info("sign_in_completed", { flow: "authentication" });
        posthog?.capture("sign_in_completed");
        return;
      }

      // Step 2: Verify with code (OTP)
      if (signIn.status === "needs_client_trust") {
        const hasEmailCode = signIn.supportedSecondFactors.some(
          (factor) => factor.strategy === "email_code",
        );

        if (!hasEmailCode) {
          throw new Error("No supported device verification method is available.");
        }

        const { error } = await signIn.mfa.sendEmailCode();
        if (error) throw new Error(error.message);

        setIsVerifying(true); // Render a code input instead of the password form
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

  const handleVerify = async () => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setFormError("Enter the 6-digit verification code sent to your email.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      const verifyResult = await signIn.mfa.verifyEmailCode({ code: trimmedCode });
      
      if (verifyResult.error) {
        throw new Error(verifyResult.error.message);
      }

      if (signIn.status === "complete") {
        
        // Step 3: Activate/finalize the session
        const finalizeResult = await signIn.finalize();
        if (finalizeResult.error) {
          throw new Error(finalizeResult.error.message);
        }
        
        // Step 4: Navigate after session activation
        router.replace("/(tabs)" as Href);
        posthogLog.info("sign_in_completed", { flow: "authentication" });
        posthog?.capture("sign_in_completed");
        return;
      }

      setFormError("Your account has been found, but we couldn’t start the session yet. Please try after sometimes.");
    } catch (error: any) {
        const message =
        error?.errors?.[0]?.longMessage ||
        error?.message ||
        "We couldn’t sign you in. Please check your details and try again.";
        setFormError(message);
    } finally   {
        setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return null;
  }

   if (isVerifying) {
      return (
        <SafeAreaView className="auth-safe-area">
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
                  <Text className="auth-title">Verify your email</Text>
                  <Text className="auth-subtitle">
                    Enter the secure code we sent to {emailAddress.trim()}.
                  </Text>
                </View>
  
                <View className="auth-card">
                  <View className="auth-form">
                    <View className="auth-field">
                      <Text className="auth-label">Verification code</Text>
                      <TextInput
                        value={code}
                        placeholder="123456"
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        maxLength={6}
                        className={`auth-input ${formError ? "auth-input-error" : ""}`}
                        placeholderTextColor="#6B7280"
                        accessibilityLabel="Verification code"
                      />
                    </View>
  
                    {formError ? <Text className="auth-error">{formError}</Text> : null}
  
                    <TouchableOpacity
                      onPress={handleVerify}
                      disabled={isSubmitting}
                      className={`auth-button ${isSubmitting ? "auth-button-disabled" : ""}`}
                      accessibilityRole="button"
                    >
                      <Text className="auth-button-text">
                        {isSubmitting ? "Verifying..." : "Verify account"}
                      </Text>
                    </TouchableOpacity>
  
                    <TouchableOpacity
                      onPress={() => setIsVerifying(false)}
                      className="auth-secondary-button"
                      accessibilityRole="button"
                    >
                      <Text className="auth-secondary-button-text">Back to sign in</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
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
