import { FlatList, Image, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo, useState } from "react";
import { colors } from "@/constants/theme";
import { icons } from "@/constants/icons";
import { useSubscriptions } from "@/context/SubscriptionContext";
import SubscriptionCard from "@/components/SubscriptionCard";

export default function Subscriptions() {
    const { subscriptions } = useSubscriptions();
    const [search, setSearch] = useState("");
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

    const filteredSubscriptions = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return subscriptions;

        return subscriptions.filter(
            (sub) =>
                sub.name.toLowerCase().includes(query) ||
                sub.category?.toLowerCase().includes(query) ||
                sub.plan?.toLowerCase().includes(query) ||
                sub.billing?.toLowerCase().includes(query) ||
                sub.frequency?.toLowerCase().includes(query)
        );
    }, [search, subscriptions]);

    const handleSubscriptionPress = (id: string) => {
        setExpandedSubscriptionId((prev) => (prev === id ? null : id));
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
            <Text className="subs-screen-title">Subscriptions</Text>

            <View className="subs-search-wrap">
                <Image
                    source={icons.wallet}
                    className="subs-search-icon"
                    resizeMode="contain"
                />
                <TextInput
                    className="subs-search-input"
                    placeholder="Search subscriptions..."
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            <Text className="subs-count">
                {filteredSubscriptions.length}{" "}
                {filteredSubscriptions.length === 1
                    ? "subscription"
                    : "subscriptions"}
            </Text>

            <FlatList
                data={filteredSubscriptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() => handleSubscriptionPress(item.id)}
                    />
                )}
                extraData={expandedSubscriptionId}
                ItemSeparatorComponent={() => <View className="h-4" />}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                ListEmptyComponent={
                    <View className="subs-empty">
                        <Text className="subs-empty-text">
                            No subscriptions match &quot;{search}&quot;
                        </Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 120 }}
            />
        </SafeAreaView>
    );
}
