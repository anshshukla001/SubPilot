import { useAuth, useSignUp } from "@clerk/expo";
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

export default function SignUpScreen() {
    const { isLoaded: isAuthLoaded } = useAuth();
    const { signUp } = useSignUp();
    const { startSSOFlow } = useSSO();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        code?: string;
        general?: string;
    }>({});

    const validateSignUp = (): boolean => {
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

    const handleSignUp = async () => {
        if (!signUp || isLoading) return;
        if (!validateSignUp()) return;

        setIsLoading(true);
        setErrors({});

        try {
            // If an earlier session exists, reset it
            if (signUp.id) {
                await signUp.reset();
            }

            const { error: passwordError } = await signUp.password({
                emailAddress: email.trim(),
                password,
            });

            if (passwordError) {
                setErrors({ general: passwordError.message || "Could not start sign up." });
                return;
            }

            const { error: sendError } = await signUp.verifications.sendEmailCode();
            if (sendError) {
                setErrors({ general: sendError.message || "Could not send verification code." });
                return;
            }

            setPendingVerification(true);
        } catch (err: unknown) {
            const clerkError = err as { message?: string; errors?: { message?: string }[] };
            const message =
                clerkError.errors?.[0]?.message ||
                clerkError.message ||
                "Could not create account. Please try again.";
            setErrors({ general: message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!signUp || isLoading) return;

        if (!code.trim()) {
            setErrors({ code: "Verification code is required" });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const { error: verifyError } = await signUp.verifications.verifyEmailCode({
                code: code.trim(),
            });

            if (verifyError) {
                setErrors({ code: verifyError.message || "Invalid verification code." });
                return;
            }

            // Check if sign-up is complete and ready to finalize
            if (signUp.status === "complete" || signUp.createdSessionId) {
                const { error: finalizeError } = await signUp.finalize();
                if (finalizeError) {
                    setErrors({ general: finalizeError.message || "Could not finalize registration." });
                }
            } else {
                console.warn(
                    "Sign-up incomplete after code verification:",
                    "status =",
                    signUp.status,
                    "missing fields =",
                    signUp.missingFields,
                    "unverified fields =",
                    signUp.unverifiedFields
                );
                const missing = signUp.missingFields?.join(", ");
                setErrors({
                    general: missing
                        ? `Additional information required by Clerk: ${missing}. Please update in your Clerk dashboard.`
                        : `Sign up incomplete (status: ${signUp.status}). Please try again.`,
                });
            }
        } catch (err: unknown) {
            const clerkError = err as { message?: string; errors?: { message?: string }[] };
            const message =
                clerkError.errors?.[0]?.message ||
                clerkError.message ||
                "Invalid verification code. Please check and try again.";
            setErrors({ code: message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!signUp || isResending) return;

        setIsResending(true);
        setErrors({});

        try {
            const { error } = await signUp.verifications.sendEmailCode();
            if (error) {
                setErrors({ general: error.message || "Could not resend code." });
            }
        } catch (err: unknown) {
            const clerkError = err as { message?: string; errors?: { message?: string }[] };
            const message =
                clerkError.errors?.[0]?.message ||
                clerkError.message ||
                "Could not resend code. Please try again.";
            setErrors({ general: message });
        } finally {
            setIsResending(false);
        }
    };

    const handleGoogleSignUp = useCallback(async () => {
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
                "Could not sign up with Google. Please try again.";
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

                            <Text className="auth-title">
                                {pendingVerification ? "Verify your email" : "Create account"}
                            </Text>
                            <Text className="auth-subtitle">
                                {pendingVerification ? (
                                    <>
                                        We sent a verification code to{"\n"}
                                        <Text className="auth-verify-email">{email}</Text>
                                    </>
                                ) : (
                                    "Start tracking and controlling all your subscriptions in one place"
                                )}
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

                            {pendingVerification ? (
                                /* Verification Code Form */
                                <View className="auth-form">
                                    <View className="auth-field">
                                        <Text className="auth-label">6-Digit Code</Text>
                                        <TextInput
                                            style={[
                                                styles.codeInput,
                                                errors.code ? styles.inputError : undefined,
                                            ]}
                                            placeholder="------"
                                            placeholderTextColor={colors.mutedForeground}
                                            value={code}
                                            onChangeText={(text) => {
                                                setCode(text.replace(/[^0-9]/g, ""));
                                                if (errors.code) setErrors((prev) => ({ ...prev, code: undefined }));
                                            }}
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            autoFocus
                                            returnKeyType="done"
                                            onSubmitEditing={handleVerify}
                                            editable={!isLoading}
                                        />
                                        {errors.code ? (
                                            <Text className="auth-error">{errors.code}</Text>
                                        ) : null}
                                    </View>

                                    <TouchableOpacity
                                        className={`auth-button ${isLoading ? "auth-button-disabled" : ""}`}
                                        onPress={handleVerify}
                                        activeOpacity={0.8}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator size="small" color={colors.primary} />
                                        ) : (
                                            <Text className="auth-button-text">Verify & Continue</Text>
                                        )}
                                    </TouchableOpacity>

                                    <View className="auth-resend-row">
                                        <Text className="auth-resend-text">{"Didn't receive the code?"}</Text>
                                        <TouchableOpacity onPress={handleResendCode} disabled={isResending}>
                                            <Text className="auth-resend-link">
                                                {isResending ? "Sending..." : "Resend"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        className="mt-2 items-center"
                                        onPress={async () => {
                                            if (signUp?.id) {
                                                await signUp.reset();
                                            }
                                            setPendingVerification(false);
                                            setCode("");
                                            setErrors({});
                                        }}
                                    >
                                        <Text className="text-sm font-sans-medium text-muted-foreground">
                                            ← Use a different email
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                /* Sign Up Form */
                                <>
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
                                                    if (errors.email)
                                                        setErrors((prev) => ({ ...prev, email: undefined }));
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
                                                    placeholder="Create a password (min. 8 char)"
                                                    placeholderTextColor={colors.mutedForeground}
                                                    value={password}
                                                    onChangeText={(text) => {
                                                        setPassword(text);
                                                        if (errors.password)
                                                            setErrors((prev) => ({ ...prev, password: undefined }));
                                                    }}
                                                    secureTextEntry={!showPassword}
                                                    autoCapitalize="none"
                                                    autoComplete="new-password"
                                                    textContentType="newPassword"
                                                    returnKeyType="done"
                                                    onSubmitEditing={handleSignUp}
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

                                        {/* Sign up button */}
                                        <TouchableOpacity
                                            className={`auth-button ${isLoading ? "auth-button-disabled" : ""}`}
                                            onPress={handleSignUp}
                                            activeOpacity={0.8}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator size="small" color={colors.primary} />
                                            ) : (
                                                <Text className="auth-button-text">Create account</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>

                                    {/* Divider */}
                                    <View className="auth-divider-row">
                                        <View className="auth-divider-line" />
                                        <Text className="auth-divider-text">or</Text>
                                        <View className="auth-divider-line" />
                                    </View>

                                    {/* Google sign up */}
                                    <TouchableOpacity
                                        className="auth-google-button"
                                        onPress={handleGoogleSignUp}
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

                                    {/* Link to sign in */}
                                    <View className="auth-link-row">
                                        <Text className="auth-link-copy">Already have an account?</Text>
                                        <TouchableOpacity onPress={() => router.push("/(auth)/sign-in" as Href)}>
                                            <Text className="auth-link">Sign in</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
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
    codeInput: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingVertical: 16,
        textAlign: "center",
        fontSize: 24,
        fontFamily: "sans-bold",
        letterSpacing: 12,
        color: colors.primary,
    },
    inputError: {
        borderColor: colors.destructive,
    },
});
