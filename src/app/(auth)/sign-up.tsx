import { useAuth, useSignUp } from "@clerk/expo";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaView as RNSafeAreaView,
  SafeAreaProvider,
} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SignUp = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async () => {
    const { error } = await signUp.password({ emailAddress, password });
    if (error) {
      throw new Error(`Unable to Create your account ${error.message}`);
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      throw new Error(`Unable to Create your account ${sendError.message}`);
      return;
    }
    setIsVerifying(true);
  };

  const handleVerify = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      // error need to be handled
      throw new Error(`Unable to Verify your credentials ${error.message}`);
    }

    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) {
      // error need to be handled
      throw new Error(`Unable to Verify your credentials ${finalizeError}`);
    }
  };

  if (!isLoaded) {
    return null;
  }
  if (isSignedIn) {
    return (
      <View style={styles.container}>
        <Link href="/(auth)/sign-up">
          <Text>You're signed in</Text>
        </Link>
        <Link href="/(tabs)" className="mt-4 rounded bg-primary text-white p-4">
          Go to Home
        </Link>
      </View>
    );
  }

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          onChangeText={setCode}
          keyboardType="numeric"
        />
        <Button title="Verify" onPress={handleVerify} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background p-5">
        <Text>Sign-Up</Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <TextInput
                value={emailAddress}
                autoCapitalize="none"
                placeholder="Email"
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                style={styles.input}
              />
              <TextInput
                value={password}
                autoCapitalize="none"
                placeholder="Password"
                onChangeText={setPassword}
                secureTextEntry={true}
                style={styles.input}
              />
              <View style={styles.btnContainer}>
                <Button title="Submit" onPress={handleSubmit} />
              </View>
              <Link
                className="mt-4 rounded bg-primary text-white p-4"
                href="/(auth)/sign-up"
              >
                Sign In
              </Link>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
    // <View>
    //   <Text>SignUp</Text>
    //   <Link href="/(auth)/sign-up">Sign In</Link>
    //   <Link href="/(tabs)" className="mt-4 rounded bg-primary text-white p-4">Go to Home</Link>
    // </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     gap: 12,
//     justifyContent: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },
  header: {
    fontFamily: "sans-semibold",
    fontSize: 36,
    marginBottom: 48,
  },
  input: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 1,
  },
  btnContainer: {
    backgroundColor: "white",
    gap: 15,
    marginTop: 12,
  },
});

export default SignUp;
