import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface CircuitCardProps {
    name: string;
    image: any;
    onPress?: () => void;
}

export default function CircuitCard({ name, image, onPress }: CircuitCardProps) {
    return (
        <Pressable
            onPress={onPress}
            className="bg-dark-secondary rounded-3xl overflow-hidden mb-4 border border-dark-border"
            android_ripple={{ color: "rgba(255,255,255,0.08)" }}
            style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
        >
            <View className="relative">
                <Image source={image} className="w-full h-52" resizeMode="cover" />
                <View className="absolute bottom-0 left-0 right-0 bg-black/40 p-4">
                    <Text className="text-white text-xl font-bold tracking-wide">{name}</Text>
                </View>
            </View>
        </Pressable>
    );
}
