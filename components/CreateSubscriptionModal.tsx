import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { getSubscriptionIcon } from "@/lib/brandIcons";

const CATEGORIES = [
    "Entertainment",
    "AI Tools",
    "Developer Tools",
    "Design",
    "Productivity",
    "Cloud",
    "Music",
    "Other",
] as const;

type Category = (typeof CATEGORIES)[number];
type Frequency = "Monthly" | "Yearly";

const CATEGORY_COLORS: Record<Category, string> = {
    Entertainment: "#f5c542",
    "AI Tools": "#b8d4e3",
    "Developer Tools": "#e8def8",
    Design: "#b8e8d0",
    Productivity: "#fcd5ce",
    Cloud: "#cddafd",
    Music: "#d4a5a5",
    Other: "#e0e0e0",
};

interface CreateSubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (subscription: Subscription) => void;
}

const CreateSubscriptionModal = ({
    visible,
    onClose,
    onCreate,
}: CreateSubscriptionModalProps) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [frequency, setFrequency] = useState<Frequency>("Monthly");
    const [category, setCategory] = useState<Category | null>(null);

    const isValid = name.trim().length > 0 && parseFloat(price) > 0;

    const resetForm = () => {
        setName("");
        setPrice("");
        setFrequency("Monthly");
        setCategory(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = () => {
        if (!isValid) return;

        const now = dayjs();
        const renewalDate =
            frequency === "Monthly"
                ? now.add(1, "month")
                : now.add(1, "year");

        const subscription: Subscription = {
            id: `sub-${Date.now()}`,
            name: name.trim(),
            price: parseFloat(price),
            frequency,
            category: category ?? "Other",
            status: "active",
            startDate: now.toISOString(),
            renewalDate: renewalDate.toISOString(),
            icon: getSubscriptionIcon(name),
            billing: frequency,
            color: CATEGORY_COLORS[category ?? "Other"],
        };

        onCreate(subscription);
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <View className="modal-overlay">
                    <Pressable style={{ flex: 1 }} onPress={handleClose} />

                    <View className="modal-container">
                        {/* Header */}
                        <View className="modal-header">
                            <Text className="modal-title">New Subscription</Text>
                            <Pressable
                                className="modal-close"
                                onPress={handleClose}
                            >
                                <Text className="modal-close-text">✕</Text>
                            </Pressable>
                        </View>

                        {/* Body */}
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 40 }}
                        >
                            <View className="modal-body">
                                {/* Name */}
                                <View className="auth-field">
                                    <Text className="auth-label">Name</Text>
                                    <TextInput
                                        className="auth-input"
                                        placeholder="e.g. Netflix, Spotify"
                                        placeholderTextColor="rgba(0,0,0,0.4)"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                    />
                                </View>

                                {/* Price */}
                                <View className="auth-field">
                                    <Text className="auth-label">Price</Text>
                                    <TextInput
                                        className="auth-input"
                                        placeholder="0.00"
                                        placeholderTextColor="rgba(0,0,0,0.4)"
                                        value={price}
                                        onChangeText={setPrice}
                                        keyboardType="decimal-pad"
                                    />
                                </View>

                                {/* Frequency */}
                                <View className="auth-field">
                                    <Text className="auth-label">Frequency</Text>
                                    <View className="picker-row">
                                        <Pressable
                                            className={clsx(
                                                "picker-option",
                                                frequency === "Monthly" &&
                                                    "picker-option-active"
                                            )}
                                            onPress={() =>
                                                setFrequency("Monthly")
                                            }
                                        >
                                            <Text
                                                className={clsx(
                                                    "picker-option-text",
                                                    frequency === "Monthly" &&
                                                        "picker-option-text-active"
                                                )}
                                            >
                                                Monthly
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            className={clsx(
                                                "picker-option",
                                                frequency === "Yearly" &&
                                                    "picker-option-active"
                                            )}
                                            onPress={() =>
                                                setFrequency("Yearly")
                                            }
                                        >
                                            <Text
                                                className={clsx(
                                                    "picker-option-text",
                                                    frequency === "Yearly" &&
                                                        "picker-option-text-active"
                                                )}
                                            >
                                                Yearly
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>

                                {/* Category */}
                                <View className="auth-field">
                                    <Text className="auth-label">Category</Text>
                                    <View className="category-scroll">
                                        {CATEGORIES.map((cat) => (
                                            <Pressable
                                                key={cat}
                                                className={clsx(
                                                    "category-chip",
                                                    category === cat &&
                                                        "category-chip-active"
                                                )}
                                                onPress={() =>
                                                    setCategory(cat)
                                                }
                                            >
                                                <Text
                                                    className={clsx(
                                                        "category-chip-text",
                                                        category === cat &&
                                                            "category-chip-text-active"
                                                    )}
                                                >
                                                    {cat}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>

                                {/* Submit */}
                                <Pressable
                                    className={clsx(
                                        "auth-button",
                                        !isValid && "auth-button-disabled"
                                    )}
                                    onPress={handleSubmit}
                                    disabled={!isValid}
                                >
                                    <Text className="auth-button-text">
                                        Add Subscription
                                    </Text>
                                </Pressable>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CreateSubscriptionModal;
