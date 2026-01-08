import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import SafeScreen from "@/components/SafeScreen";
import { useFavorites } from "@/hooks/FavoritesContext";
import CircuitCard from "@/components/CircuitCard";
import { router, Stack } from "expo-router";
import { circuits } from "@/utils/circuits";
import { Heart } from "lucide-react-native";

export default function FavoritesScreen() {
    const { favorites, isLoading } = useFavorites();

    const enriched = useMemo(() => {
        const byName = new Map(circuits.map((c) => [c.name, c]));
        return favorites
            .slice()
            .sort((a, b) => b.addedAt - a.addedAt)
            .map((f) => ({
                ...f,
                image: byName.get(f.circuitName)?.image,
            }));
    }, [favorites]);

    return (
        <SafeScreen>
            <Stack.Screen
                options={{
                    title: "Favorites",
                    headerShown: true,
                    headerTitleAlign: "center",
                    headerStyle: { backgroundColor: "hsl(20 14.3% 4.1%)" },
                    headerTintColor: "#fff",
                    headerShadowVisible: false,
                }}
            />
            <ScrollView className="bg-dark-background p-4">
                <Text className="text-dark-muted-foreground text-xs mt-1">
                    {isLoading ? "Loading…" : `${favorites.length} saved`}
                </Text>

                {(!isLoading && favorites.length === 0) && (
                    <View className="mt-10 items-center">
                        <Heart size={64} color="hsl(142.1 76.2% 36.3%)" />
                        <Text className="text-dark-foreground font-semibold mt-4">No Favorites Yet</Text>
                        <Text className="text-dark-muted-foreground text-xs mt-1 text-center">
                            Open a replay and tap the favicon to save it here.
                        </Text>
                    </View>
                )}

                <View className="mt-6 gap-4">
                    {enriched.map((f) => (
                        <CircuitCard
                            key={f.id}
                            name={`${f.circuitName} • ${f.year} • ${f.session === "R" ? "Race" : "Qualifying"}`}
                            image={f.image}
                            onPress={() =>
                                router.push({
                                    pathname: "/replay",
                                    params: {
                                        year: String(f.year),
                                        circuitName: f.circuitName,
                                        session: f.session,
                                    },
                                })
                            }
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeScreen>
    );
}
