import { ActivityIndicator, View } from "react-native";
import { colors } from "@/constants/theme";

export default function SSOCallback() {
    return (
        <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color={colors.accent} />
        </View>
    );
}
