import SafeScreen from "@/components/SafeScreen";
import { FramesPreset, getFramesPreset, setFramesPreset } from "@/utils/replaysStorage";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const options: { label: string; value: FramesPreset }[] = [
    { label: "10 frames", value: 10 },
    { label: "50 frames", value: 50 },
    { label: "100 frames", value: 100 },
    { label: "200 frames", value: 200 },
    { label: "Whole race", value: "ALL" },
];

export default function Settings() {
    const [preset, setPreset] = useState<FramesPreset>(10);

    useEffect(() => {
        (async () => {
            const saved = await getFramesPreset();
            setPreset(saved);
        })();
    }, []);

    const choose = async (v: FramesPreset) => {
        setPreset(v);
        await setFramesPreset(v);
    };

    return (
        <SafeScreen>
            <Stack.Screen
                options={{
                    title: "Settings",
                    headerShown: true,
                    headerTitleAlign: "center",
                    headerStyle: { backgroundColor: "hsl(20 14.3% 4.1%)" },
                    headerTintColor: "#fff",
                    headerShadowVisible: false,
                }}
            />

            <View className="flex-1 w-full bg-dark-background p-4">
                <View className="mt-6">
                    <Text className="text-white text-xs mb-2">Race Frames</Text>

                    <View className="flex-row flex-wrap gap-3">
                        {options.map((o) => {
                            const selected = preset === o.value;
                            return (
                                <TouchableOpacity
                                    key={String(o.value)}
                                    onPress={() => choose(o.value)}
                                    activeOpacity={0.85}
                                    className={[
                                        "px-4 py-2 rounded-full border",
                                        selected
                                            ? "bg-dark-primary border-dark-primary"
                                            : "bg-dark-card border-dark-border",
                                    ].join(" ")}
                                >
                                    <Text className={selected ? "text-white font-semibold" : "text-dark-foreground"}>
                                        {o.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text className="text-dark-muted-foreground text-xs mt-3">
                        Default is 10 frames. “Whole race” should stream in chunks.
                    </Text>
                </View>
            </View>
        </SafeScreen>
    );

}