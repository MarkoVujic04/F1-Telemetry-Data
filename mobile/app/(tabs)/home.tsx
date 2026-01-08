import React, { useMemo, useState } from "react";
import { FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import SafeScreen from "@/components/SafeScreen"
import CircuitCard from "@/components/CircuitCard";
import Selector from "@/components/Selector";
import { circuits } from "@/utils/circuits";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Album } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Home() {
    const [selectedYear, setSelectedYear] = useState<number>(2024);
    const [selectedSession, setSelectedSession] = useState<string>("Race");
    const [query, setQuery] = useState("");
    const sessionId = selectedSession === "Race" ? "R" : "Q";
    const router = useRouter();
    const { userName } = useLocalSearchParams();

    const years = [
        { label: "2024", value: 2024 },
        { label: "2023", value: 2023 },
        { label: "2022", value: 2022 },
        { label: "2021", value: 2021 },
        { label: "2020", value: 2020 },
        { label: "2019", value: 2019 },
        { label: "2018", value: 2018 },
    ];

    const sessionTypes = [
        { label: "Race", value: "Race" },
        { label: "Qualifier", value: "Qualifier" },
    ];

    const filtered = useMemo(() => {
        const quer = query.trim().toLowerCase();
        if (!quer) {
            return circuits;
        }

        return circuits.filter((t) => {
            const name = t.name.toLocaleLowerCase();
            return name.includes(quer);
        });
    }, [query])

    return (
        <SafeScreen>
            <ScrollView className="bg-dark-background p-4">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                        <View className="w-16 h-16 bg-dark-muted-foreground rounded-full" />

                        <View>
                            <Text className="text-dark-secondary-foreground text-xs">
                                Welcome Back
                            </Text>
                            <Text className="text-dark-secondary-foreground text-md">
                                {userName || "User"}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="bg-dark-input w-full h-14 flex-row items-center px-4 rounded-full mt-4">
                    <FontAwesome5 name="search" size={20} color="hsl(142.1 76.2% 36.3%)" />
                    <TextInput
                        className="flex-1 ml-4 text-dark-muted-foreground"
                        placeholder="Search for Grand Prix..."
                        placeholderTextColor={"hsl(24 5.4% 63.9%)"}
                        value={query}
                        onChangeText={setQuery}
                    />
                </View>

                <View className="flex-row gap-3 mt-4">
                    <Selector
                        label="Year"
                        selectedValue={selectedYear}
                        onValueChange={(value) => setSelectedYear(value as number)}
                        items={years}
                    />
                    <Selector
                        label="Session Type"
                        selectedValue={selectedSession}
                        onValueChange={(value) => setSelectedSession(value as string)}
                        items={sessionTypes}
                    />
                </View>

                <View className="mt-6 gap-4">
                    {filtered.map((circuit) => (
                        <CircuitCard
                            key={circuit.name}
                            name={circuit.name}
                            image={circuit.image}
                            onPress={() => {
                                const sessionId = selectedSession === "Race" ? "R" : "Q";

                                router.push({
                                    pathname: "/replay",
                                    params: {
                                        year: String(selectedYear),
                                        circuitName: circuit.name,
                                        session: sessionId,
                                    },
                                });
                            }}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeScreen>
    )
}