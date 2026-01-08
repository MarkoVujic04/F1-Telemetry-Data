import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Album, Bookmark, Heart, HeartIcon } from "lucide-react-native";
import { useFavorites } from "@/hooks/FavoritesContext";

type Props = {
  year: number;
  circuitName: string;
  session: string;
  size?: number;
};

export default function FavoriteButton({ year, circuitName, session, size = 28 }: Props) {
  const { toggleFavorite, isFavorited } = useFavorites();
  const [busy, setBusy] = useState(false);

  const saved = isFavorited(year, circuitName, session);

  const color = saved ? "hsl(142.1 76.2% 36.3%)" : "#ffffff"; 

  const onPress = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await toggleFavorite(year, circuitName, session);
    } finally {
      setBusy(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      className="w-12 h-12 rounded-full bg-black/40 items-center justify-center border border-white/10"
      activeOpacity={0.85}
    >
      {busy ? (
        <ActivityIndicator color={color} />
      ) : (
        <HeartIcon size={size} color={color} fill={saved ? color : "transparent"} />
      )}
    </TouchableOpacity>
  );
}
