import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";

import CustomHeader from "../components/custom-header";
import { useColorScheme } from "../hooks/use-color-scheme";


export const unstable_settings = {
    anchor: "",
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: true, // Ensure the header is shown
                        header: () => <CustomHeader />, // Use the custom component
                    }}
                />
            </Stack>
        </ThemeProvider>
    );
}
