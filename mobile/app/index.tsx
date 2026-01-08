import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import { Dimensions, Image, Pressable, Text, TextInput, View } from "react-native";
import { useState } from "react";

const { width, height } = Dimensions.get("window");

const carSize = Math.min(width * 1.3, 520);

export default function LandingScreen() {
    const router = useRouter();
    const [userName, setUserName] = useState("");

    return (
        <View className="flex-1 bg-dark-background px-6">

            <View className="items-center mt-28">
                <TextInput
                    className="text-white text-3xl font-extrabold text-center w-full"
                    placeholder="Enter your name"
                    placeholderTextColor="gray"
                    value={userName}
                    onChangeText={setUserName}
                />
            </View>

            <View className="flex-1 items-center justify-center">

                <Image
                    source={require("../assets/images/aston.png")}
                    resizeMode="contain"
                    style={{ width: carSize, height: carSize }}
                />
            </View>

            <Pressable className="mb-28 rounded-2xl bg-[hsl(142.1_76.2%_36.3%)] py-4 items-center"
                onPress={() => {
                    if (userName.trim()) {
                        router.replace({ pathname: "/(tabs)/home", params: { userName } });
                    }
                }}
            >
                <Text className="text-black text-xl font-extrabold">Get Started</Text>
            </Pressable>
        </View>
    );
}
