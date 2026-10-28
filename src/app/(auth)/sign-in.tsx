import { Link } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SignIn = () => {
  const statusBarStyle = "dark-content"; // ["default", "dark-content", "light-content"] (**"auto" not supported by react-native)
  const statusBarTransition = "slide"; // ["fade", "slide", "none"]


  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <StatusBar
        animated={true}
        barStyle={statusBarStyle}
        showHideTransition={statusBarTransition}
      />
      {/* <View>
        <Text>SignIn</Text>
        <Link href="/(auth)/sign-up">Create Account</Link>
        <Link href="/(tabs)" className="mt-4 rounded bg-primary text-white p-4">
          Go to Home
        </Link>
      </View> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.5}
                style={styles.header}
              >
                Welcome to Recurly,
              </Text>
            </View>
            <TextInput
              placeholder="Email"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              style={styles.textInput}
            />
            <TextInput
              placeholder="Password"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.textInput}
            />
            <View style={styles.btnContainer}>
              <Button title="Sign-in" color="#2196F3" onPress={() => null} />
              <Button
                title="Create Account"
                color="#007AFF"
                onPress={() => null}
              />
            </View>
            <Link
              href="/(tabs)"
              className="mt-4 rounded bg-primary text-white p-4"
            >
              Go to Home
            </Link>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
  textInput: {
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

export default SignIn;
