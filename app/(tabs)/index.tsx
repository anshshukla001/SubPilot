import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import dayjs from "dayjs";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import {
    HOME_USER,
    HOME_BALANCE,
    UPCOMING_SUBSCRIPTIONS,
    HOME_SUBSCRIPTIONS,
} from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import { posthog } from "@/lib/posthog";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";

export default function Index() {
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

    const handleSubscriptionPress = (id: string) => {
        const isExpanded = expandedSubscriptionId !== id;

        setExpandedSubscriptionId(isExpanded ? id : null);
        posthog?.capture("subscription_details_toggled", {
            subscription_id: id,
            is_expanded: isExpanded,
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
            <FlatList
                ListHeaderComponent={() => (
                    <>
                        <View className="home-header">
                            <View className="home-user">
                                <Image
                                    source={images.avatar}
                                    className="home-avatar"
                                />
                                <Text className="home-user-name">
                                    {HOME_USER.name}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => posthog?.capture("add_subscription_started", {
                                    entry_point: "home_header",
                                })}
                            >
                                <Image source={icons.add} className="home-add-icon" />
                            </TouchableOpacity>
                        </View>

                        <View className="home-balance-card">
                            <Text className="home-balance-label">Balance</Text>

                            <View className="home-balance-row">
                                <Text className="home-balance-amount">
                                    {formatCurrency(HOME_BALANCE.amount)}
                                </Text>
                                <Text className="home-balance-date">
                                    {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                                </Text>
                            </View>
                        </View>

                        <View className="mb-5">
                            <ListHeading title="Upcoming" />

                            <FlatList
                                data={UPCOMING_SUBSCRIPTIONS}
                                renderItem={({ item }) => (
                                    <UpcomingSubscriptionCard {...item} />
                                )}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                ListEmptyComponent={
                                    <Text className="home-empty-state">
                                        No upcoming renewals yet.
                                    </Text>
                                }
                            />
                        </View>

                        <ListHeading title="All Subscriptions" />
                    </>
                )}
                data={HOME_SUBSCRIPTIONS}
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
                ListEmptyComponent={
                    <Text className="home-empty-state">No subscriptions yet.</Text>
                }
                contentContainerStyle={{ paddingBottom: 120 }}
            />
        </SafeAreaView>
    );
}
