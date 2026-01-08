import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface SelectorProps {
    label: string;
    selectedValue: string | number;
    onValueChange: (value: string | number) => void;
    items: Array<{ label: string; value: string | number }>;
}

export default function Selector({ label, selectedValue, onValueChange, items }: SelectorProps) {
    return (
        <View className="flex-1">
            <Text className="text-dark-muted-foreground text-xs mb-2 ml-1">
                {label}
            </Text>
            <View className="bg-dark-input rounded-2xl border border-dark-border overflow-hidden">
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    style={{
                        color: 'hsl(60 9.1% 97.8%)',
                    }}
                    dropdownIconColor="hsl(24 5.4% 63.9%)"
                >
                    {items.map((item) => (
                        <Picker.Item
                            key={item.value}
                            label={item.label}
                            value={item.value}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
}
