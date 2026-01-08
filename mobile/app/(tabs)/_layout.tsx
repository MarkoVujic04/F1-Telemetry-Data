import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { Archive, Heart, HeartIcon } from 'lucide-react-native';
export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "hsl(142.1 76.2% 36.3%)",
                tabBarStyle: {
                    backgroundColor: "hsl(20 14.3% 4.1%)"
                }
            }}>
            <Tabs.Screen
                name="home"
                options={{
                    headerShown: false,
                    title: "Home",
                    tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: "Favorites",
                    tabBarIcon: ({ color, size, focused }) => (
                        <HeartIcon color={color} size={size} fill={focused ? color : "transparent"} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    headerShown: false,
                    title: "Settings",
                    tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />
                }}
            />
        </Tabs>
    )
}