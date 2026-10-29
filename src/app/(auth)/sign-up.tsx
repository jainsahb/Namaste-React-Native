import { useAuth, useSignUp } from "@clerk/expo";
import { Link, router } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUp = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn]);

  const handleSubmit = async () => {
    const trimmedEmail = emailAddress.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setFormError("Please provide an email and a password.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (trimmedPassword.length < 8) {
      setFormError("Use at least 8 characters for your password.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      const result = await signUp.password({
        emailAddress: trimmedEmail,
        password: trimmedPassword,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const sendCodeResult = await signUp.verifications.sendEmailCode();
      if (sendCodeResult.error) {
        throw new Error(sendCodeResult.error.message);
      }

      setIsVerifying(true);
    } catch (error: any) {
      const message =
        error?.message ||
        "We couldn’t create your account. Please try again.";
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
      const verifyResult = await signUp.verifications.verifyEmailCode({
        code: trimmedCode,
      });

      if (verifyResult.error) {
        throw new Error(verifyResult.error.message);
      }

      const finalizeResult = await signUp.finalize();
      if (finalizeResult.error) {
        throw new Error(finalizeResult.error.message);
      }

      if (signUp.status === "complete") {
        router.replace("/(tabs)");
        return;
      }

      setFormError("Your account is ready, but we couldn’t start the session yet. Please sign in.");
    } catch (error: any) {
      const message =
        error?.message ||
        "We couldn’t verify your code. Please check the code and try again.";
      setFormError(message);
    } finally {
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
                    <Text className="auth-secondary-button-text">Back to sign up</Text>
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
              <Text className="auth-title">Create your account</Text>
              <Text className="auth-subtitle">
                Start tracking every membership, renewal, and spend with clarity.
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
                    placeholder="Create a secure password"
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    className={`auth-input ${formError ? "auth-input-error" : ""}`}
                    placeholderTextColor="#6B7280"
                    accessibilityLabel="Password"
                  />
                </View>

                {formError ? <Text className="auth-error">{formError}</Text> : null}

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  className={`auth-button ${isSubmitting ? "auth-button-disabled" : ""}`}
                  accessibilityRole="button"
                >
                  <Text className="auth-button-text">
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in">
                <Text className="auth-link">Sign in</Text>
              </Link>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
