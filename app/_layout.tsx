import "../global.css";
import {
    Stack,
    useGlobalSearchParams,
    usePathname,
    useRouter,
    useSegments,
    Href,
} from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "@/lib/posthog";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
    throw new Error(
        "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env file. Please check your environment variables."
    );
}

function InitialLayout() {
    const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const segments = useSegments();
    const pathname = usePathname();
    const params = useGlobalSearchParams();
    const previousPathname = useRef<string | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        if (previousPathname.current === pathname) return;

        posthog?.screen(pathname, {
            previous_screen: previousPathname.current ?? null,
            has_route_params: Object.keys(params).length > 0,
        });
        previousPathname.current = pathname;
    }, [pathname, params]);

    useEffect(() => {
        if (!isSignedIn || !user?.id) return;

        posthog?.identify(user.id, {
            ...(user.primaryEmailAddress?.emailAddress
                ? { email: user.primaryEmailAddress.emailAddress }
                : {}),
            ...(user.fullName ? { name: user.fullName } : {}),
        });
    }, [isSignedIn, user?.id, user?.primaryEmailAddress?.emailAddress, user?.fullName]);

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

    const app = (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <InitialLayout />
        </ClerkProvider>
    );

    if (!posthog) return app;

    return (
        <PostHogProvider
            client={posthog}
            autocapture={{ captureScreens: false, captureTouches: true }}
        >
            {app}
        </PostHogProvider>
    );
}
