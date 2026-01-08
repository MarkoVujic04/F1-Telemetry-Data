import { Stack } from "expo-router";
import "../global.css";
import { FavoritesProvider } from "@/hooks/FavoritesContext";

export default function RootLayout() {
    const isSignedIn: boolean = true;
    return (
        <FavoritesProvider>
            <Stack
                screenOptions={{
                    headerShown: true,
                    title: "",
                    headerTitleAlign: "center",
                    headerTintColor: "#fff",
                    headerStyle: { backgroundColor: "hsl(20 14.3% 4.1%)" },
                    headerShadowVisible: false,
                }}
            >
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </FavoritesProvider>
    );
}
