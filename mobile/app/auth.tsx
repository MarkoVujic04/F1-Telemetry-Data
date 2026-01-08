import {Button, Text, TouchableOpacity, View} from "react-native";
import {Image} from "react-native";

export default function Index() {
    return (
        <View className="flex-1 justify-center items-center">
            <Image
                source={require("../assets/images/cheetah-mascot.png")}
                className="size-96"
                resizeMode="contain"
            />
            <View className="gap-2 max-w-xs">
                <TouchableOpacity
                    className="px-6 py-4 rounded-full items-center border">
                    <Text className="font-medium">Email and Password</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="border px-6 py-4 rounded-full items-center bg-primary">
                    <Text className="font-medium">Continue With Google</Text>
                </TouchableOpacity>
            </View>
            <Text className="text-center text-sm max-w-xs font-medium mt-5">By Signing Up You Agree To Our Privacy
                Policy, Terms and Cookie Use</Text>
        </View>
    );
}