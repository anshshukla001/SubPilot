import "../global.css";
import { Stack, useRouter, useSegments, Href } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
    throw new Error(
        "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env file. Please check your environment variables."
    );
}

function InitialLayout() {
    const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthLoaded) return;

        const firstSegment = (segments as string[])[0];
        const inAuthGroup = firstSegment === "(auth)";
        const isSSOCallback = firstSegment === "sso-callback";

        if (isSSOCallback) {
            if (isSignedIn) {
                router.replace("/(tabs)" as Href);
            }
            return;
        }

        if (!isSignedIn && !inAuthGroup) {
            router.replace("/(auth)/sign-in" as Href);
        } else if (isSignedIn && inAuthGroup) {
            router.replace("/(tabs)" as Href);
        }
    }, [isSignedIn, isAuthLoaded, segments, router]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="sso-callback" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
        "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
        "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
        "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
        "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
        "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <InitialLayout />
        </ClerkProvider>
    );
}
