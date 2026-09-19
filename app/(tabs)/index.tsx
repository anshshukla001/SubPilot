import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import dayjs from "dayjs";
import { useUser } from "@clerk/expo";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import {
    HOME_BALANCE,
    UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import { posthog } from "@/lib/posthog";
import { useSubscriptions } from "@/context/SubscriptionContext";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";

export default function Index() {
    const { user } = useUser();
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const { subscriptions, addSubscription } = useSubscriptions();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const userName =
        user?.fullName ||
        user?.firstName ||
        user?.username ||
        user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
        "Subpilot User";

    const handleSubscriptionPress = (id: string) => {
        const isExpanded = expandedSubscriptionId !== id;

        setExpandedSubscriptionId(isExpanded ? id : null);
        posthog?.capture("subscription_details_toggled", {
            subscription_id: id,
            is_expanded: isExpanded,
        });
    };

    const handleCreateSubscription = (subscription: Subscription) => {
        addSubscription(subscription);
        posthog?.capture("subscription_created", {
            subscription_name: subscription.name,
            subscription_category: subscription.category ?? "Other",
            subscription_frequency: subscription.frequency ?? "Monthly",
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
            <CreateSubscriptionModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreateSubscription}
            />

            <FlatList
                ListHeaderComponent={() => (
                    <>
                        <View className="home-header">
                            <View className="home-user">
                                {user?.imageUrl ? (
                                    <Image
                                        source={{ uri: user.imageUrl }}
                                        className="home-avatar"
                                    />
                                ) : (
                                    <Image
                                        source={images.avatar}
                                        className="home-avatar"
                                    />
                                )}
                                <Text className="home-user-name">
                                    {userName}
                                </Text>
                            </View>

                            <Pressable
                                onPress={() => {
                                    setShowCreateModal(true);
                                    posthog?.capture("add_subscription_started", {
                                        entry_point: "home_header",
                                    });
                                }}
                            >
                                <Image source={icons.add} className="home-add-icon" />
                            </Pressable>
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
                data={subscriptions}
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
