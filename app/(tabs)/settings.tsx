import { useClerk, useUser } from "@clerk/expo";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";
import { images } from "@/constants/images";

export default function SettingsScreen() {
    const { user } = useUser();
    const { signOut } = useClerk();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const userEmail = user?.primaryEmailAddress?.emailAddress || "No email";
    const userName = user?.fullName || user?.firstName || "Subpilot User";

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
            <View className="mb-6">
                <Text className="text-3xl font-sans-bold text-primary">Settings</Text>
            </View>

            {/* Profile card */}
            <View className="rounded-3xl border border-border bg-card p-5">
                <View className="flex-row items-center gap-4">
                    {user?.imageUrl ? (
                        <Image
                            source={{ uri: user.imageUrl }}
                            className="size-16 rounded-full"
                        />
                    ) : (
                        <Image source={images.avatar} className="size-16 rounded-full" />
                    )}
                    <View className="flex-1">
                        <Text className="text-xl font-sans-bold text-primary">{userName}</Text>
                        <Text className="text-sm font-sans-medium text-muted-foreground">{userEmail}</Text>
                    </View>
                </View>
            </View>

            {/* Account section */}
            <View className="mt-6 rounded-3xl border border-border bg-card p-5">
                <Text className="mb-4 text-xs font-sans-bold uppercase tracking-[1px] text-muted-foreground">
                    Account
                </Text>

                <TouchableOpacity
                    className="items-center rounded-2xl bg-destructive/10 py-4"
                    onPress={handleSignOut}
                    activeOpacity={0.8}
                >
                    <Text className="text-base font-sans-bold text-destructive">Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
