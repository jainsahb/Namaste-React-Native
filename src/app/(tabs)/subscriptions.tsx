import { Text, View, StyleSheet } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const subscriptions = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>subscriptions</Text>
      <View>
        
        <Text style={styles.baseText}>I am bold loooooooooooooooong</Text>
        <Text style={styles.innerText}>and red</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseText: {
    fontWeight: "bold",
  },
  innerText: {
    color: "red",
  },
});

export default subscriptions;
