import { Stack } from "expo-router";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "expo-router/react-navigation";
import "react-native-reanimated";

import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomHeader from "../components/custom-header";
import { useColorScheme } from "../hooks/use-color-scheme";


export const unstable_settings = {
    anchor: "",
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <SafeAreaProvider>
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
        </SafeAreaProvider>
    );
}
