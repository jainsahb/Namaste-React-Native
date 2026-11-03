import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSubscriptions = HOME_SUBSCRIPTIONS.filter((subscription) => subscription.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
  subscription.category?.toLowerCase().includes(searchQuery.toLowerCase()) || subscription.plan?.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-5 pt-5">
            <Text className="text-3xl font-bold text-dark mb-5">Subscriptions</Text>
            <TextInput
              className="bg-white border rounded-xl px-4 p-4 mb-4 text-dark"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Search "Canva"`}
              placeholderTextColor="#666"
            />
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{gap: 12, paddingHorizontal: 12, paddingBottom: 30}}
      />
    </SafeAreaView>
  );
};

export default subscriptions;
