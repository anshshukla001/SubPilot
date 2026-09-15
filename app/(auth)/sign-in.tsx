import { useAuth, useSignIn } from "@clerk/expo";
import { useSSO } from "@clerk/expo/experimental";
import { useRouter, Href } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";

// Warm up the browser for OAuth on Android
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
    const { isLoaded: isAuthLoaded } = useAuth();
    const { signIn } = useSignIn();
    const { startSSOFlow } = useSSO();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

    const validate = (): boolean => {
        const newErrors: typeof errors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            newErrors.email = "Enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignIn = async () => {
        if (!signIn || isLoading) return;
        if (!validate()) return;

        setIsLoading(true);
        setErrors({});

        try {
            if (signIn.id) {
                await signIn.reset();
            }

            const { error: passwordError } = await signIn.password({
                emailAddress: email.trim(),
                password,
            });

            if (passwordError) {
                const message = passwordError.message || "Invalid email or password.";
                setErrors({ general: message });
                return;
            }

            if (signIn.status === "complete" || signIn.createdSessionId) {
                const { error: finalizeError } = await signIn.finalize();
                if (finalizeError) {
                    setErrors({ general: finalizeError.message || "Could not finalize sign in." });
                }
            } else {
                setErrors({ general: `Sign in status: ${signIn.status}. Please check your credentials.` });
            }
        } catch (err: unknown) {
            const clerkError = err as { message?: string; errors?: { message?: string }[] };
            const message =
                clerkError.errors?.[0]?.message ||
                clerkError.message ||
                "Something went wrong. Please try again.";
            setErrors({ general: message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = useCallback(async () => {
        if (isGoogleLoading) return;

        setIsGoogleLoading(true);
        setErrors({});

        try {
            await startSSOFlow({
                strategy: "oauth_google",
            });
        } catch (err: unknown) {
            const clerkError = err as { message?: string; errors?: { message?: string }[] };
            const message =
                clerkError.errors?.[0]?.message ||
                clerkError.message ||
                "Could not sign in with Google. Please try again.";
            setErrors({ general: message });
        } finally {
            setIsGoogleLoading(false);
        }
    }, [isGoogleLoading, startSSOFlow]);

    if (!isAuthLoaded) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    className="auth-scroll"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View className="auth-content">
                        {/* Brand block */}
                        <View className="auth-brand-block">
                            <View className="auth-logo-wrap">
                                <View className="auth-logo-mark">
                                    <Image
                                        source={icons.logo}
                                        className="size-8"
                                        resizeMode="contain"
                                        tintColor={colors.background}
                                    />
                                </View>
                                <View>
                                    <Text className="auth-wordmark">Subpilot</Text>
                                    <Text className="auth-wordmark-sub">Smart Billing</Text>
                                </View>
                            </View>

                            <Text className="auth-title">Welcome back</Text>
                            <Text className="auth-subtitle">
                                Sign in to continue managing your subscriptions
                            </Text>
                        </View>

                        {/* Auth card */}
                        <View className="auth-card">
                            {/* General error */}
                            {errors.general ? (
                                <View className="mb-4 rounded-xl bg-destructive/10 p-3">
                                    <Text className="auth-error">{errors.general}</Text>
                                </View>
                            ) : null}

                            <View className="auth-form">
                                {/* Email field */}
                                <View className="auth-field">
                                    <Text className="auth-label">Email</Text>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            errors.email ? styles.inputError : undefined,
                                        ]}
                                        placeholder="Enter your email"
                                        placeholderTextColor={colors.mutedForeground}
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                                        }}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        autoComplete="email"
                                        textContentType="emailAddress"
                                        returnKeyType="next"
                                        editable={!isLoading}
                                    />
                                    {errors.email ? (
                                        <Text className="auth-error">{errors.email}</Text>
                                    ) : null}
                                </View>

                                {/* Password field */}
                                <View className="auth-field">
                                    <Text className="auth-label">Password</Text>
                                    <View className="relative">
                                        <TextInput
                                            style={[
                                                styles.input,
                                                errors.password ? styles.inputError : undefined,
                                            ]}
                                            placeholder="Enter your password"
                                            placeholderTextColor={colors.mutedForeground}
                                            value={password}
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                if (errors.password)
                                                    setErrors((prev) => ({ ...prev, password: undefined }));
                                            }}
                                            secureTextEntry={!showPassword}
                                            autoCapitalize="none"
                                            autoComplete="password"
                                            textContentType="password"
                                            returnKeyType="done"
                                            onSubmitEditing={handleSignIn}
                                            editable={!isLoading}
                                        />
                                        <TouchableOpacity
                                            className="auth-password-toggle"
                                            onPress={() => setShowPassword(!showPassword)}
                                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        >
                                            <Text className="auth-password-toggle-text">
                                                {showPassword ? "Hide" : "Show"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {errors.password ? (
                                        <Text className="auth-error">{errors.password}</Text>
                                    ) : null}
                                </View>

                                {/* Sign in button */}
                                <TouchableOpacity
                                    className={`auth-button ${isLoading ? "auth-button-disabled" : ""}`}
                                    onPress={handleSignIn}
                                    activeOpacity={0.8}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color={colors.primary} />
                                    ) : (
                                        <Text className="auth-button-text">Sign in</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Divider */}
                            <View className="auth-divider-row">
                                <View className="auth-divider-line" />
                                <Text className="auth-divider-text">or</Text>
                                <View className="auth-divider-line" />
                            </View>

                            {/* Google sign in */}
                            <TouchableOpacity
                                className="auth-google-button"
                                onPress={handleGoogleSignIn}
                                activeOpacity={0.8}
                                disabled={isGoogleLoading}
                            >
                                {isGoogleLoading ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : (
                                    <>
                                        <Image
                                            source={{ uri: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" }}
                                            className="auth-google-icon"
                                            resizeMode="contain"
                                        />
                                        <Text className="auth-google-text">Continue with Google</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            {/* Link to sign up */}
                            <View className="auth-link-row">
                                <Text className="auth-link-copy">New to Subpilot?</Text>
                                <TouchableOpacity onPress={() => router.push("/(auth)/sign-up" as Href)}>
                                    <Text className="auth-link">Create an account</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        fontFamily: "sans-medium",
        color: colors.primary,
    },
    inputError: {
        borderColor: colors.destructive,
    },
});
