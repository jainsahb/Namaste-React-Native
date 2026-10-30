import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.emailAddresses[0]?.emailAddress ||
    "User";
  const email = user?.emailAddresses[0]?.emailAddress;

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <StatusBar
        animated={true}
        barStyle="dark-content"
        showHideTransition="slide"
      />
      <Text className="text-3xl font-sans-bold text-primary mb-6">
        Settings
      </Text>

      {/* User Profile Section  */}
      <View className="mt-4 border border-border rounded-3xl bg-card p-5 gap-2 mb-5">
        <Text className="text-base font-sans-semibold text-primary mb-3">
          Profile Details
        </Text>
        <View className="gap-2">
          <View className="flex-row justify-between item-center py-2">
            <Text className="text-muted-foreground">Name</Text>
            <Text>{displayName}</Text>
          </View>

          <View className="flex-row justify-between item-center py-2">
            <Text className="text-muted-foreground">Email</Text>
            <Text>{email}</Text>
          </View>
        </View>
      </View>

      {/* Account Section  */}
      <View className="mt-2 border border-border rounded-3xl bg-card p-5 gap-2 mb-5">
        <Text className="text-base font-sans-semibold text-primary mb-3">
          Account
        </Text>
        <View className="gap-2">
          <View className="flex-row justify-between item-center py-2">
            <Text className="text-muted-foreground">Account ID</Text>
            <Text>{user?.id?.substring(0, 20)}...</Text>
          </View>

          <View className="flex-row justify-between item-center py-2">
            <Text className="text-muted-foreground">Joined</Text>
            <Text>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Sign-out button  */}
      <View>
        <Pressable
          className="auth-button bg-destructive"
          onPress={handleSignOut}
        >
          <Text>Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default settings;
