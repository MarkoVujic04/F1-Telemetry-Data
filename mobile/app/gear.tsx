import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, Dimensions } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Canvas, Path, Circle, Skia } from "@shopify/react-native-skia";
import { GearPoint } from "@/types/gears";
import { TrackPoint, Bounds } from "@/types/replay";


const API_BASE = "http://192.168.0.3:8000";

function worldToScreen(p: TrackPoint, bounds: Bounds, width: number, height: number, padding = 20) {
  const worldW = bounds.maxX - bounds.minX || 1;
  const worldH = bounds.maxY - bounds.minY || 1;

  const scale = Math.min((width - padding * 2) / worldW, (height - padding * 2) / worldH);

  const sx = (p.x - bounds.minX) * scale + padding;
  const sy = (bounds.maxY - p.y) * scale + padding; 

  return { x: sx, y: sy };
}

const gearColors: Record<number, string> = {
  1: "#93c5fd",
  2: "#60a5fa",
  3: "#34d399",
  4: "#22c55e",
  5: "#facc15",
  6: "#fb923c",
  7: "#f87171",
  8: "#ef4444",
};

export default function GearScreen() {
  const params = useLocalSearchParams<{ year: string; circuitName: string; session: string }>();
  const year = Number(params.year);

  const [track, setTrack] = useState<TrackPoint[] | null>(null);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [gearPoints, setGearPoints] = useState<GearPoint[] | null>(null);
  const [meta, setMeta] = useState<{ driver?: string; lap_time?: string } | null>(null);

  const W = Dimensions.get("window").width;
  const H = Dimensions.get("window").height;
  const canvasH = Math.floor(H * 0.7);

  useEffect(() => {
    (async () => {
      try {
        const gp = encodeURIComponent(params.circuitName);
        const url = `${API_BASE}/replay/${year}/${gp}/${params.session}/gear?step=2`;
        const res = await fetch(url);
        const json = await res.json();

        setTrack(json.track);
        setBounds(json.bounds);
        setGearPoints(json.gear_points);
        setMeta({ driver: json.driver, lap_time: json.lap_time });
      } catch (e) {
        console.error("Gear fetch failed", e);
      }
    })();
  }, [params.circuitName, params.session, params.year]);

  const skiaPath = useMemo(() => {
    if (!track || !bounds || track.length < 2) return null;
    const p = Skia.Path.Make();
    const p0 = worldToScreen(track[0], bounds, W, canvasH, 20);
    p.moveTo(p0.x, p0.y);
    for (let i = 1; i < track.length; i++) {
      const sp = worldToScreen(track[i], bounds, W, canvasH, 20);
      p.lineTo(sp.x, sp.y);
    }
    return p;
  }, [track, bounds, W, canvasH]);

  if (!track || !bounds || !gearPoints) {
    return (
      <View className="flex-1 bg-[#111] items-center justify-center">
        <ActivityIndicator />
        <Text className="text-white/80 mt-2">Loading gear shifts…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#111]">
      <Stack.Screen
        options={{
          title: "Gear Shifts",
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "hsl(20 14.3% 4.1%)" },
          headerShadowVisible: false,
        }}
      />

      <View className="px-4 pt-3">
        <Text className="text-white text-base font-semibold">
          Fastest lap gear map {meta?.driver ? `• ${meta.driver}` : ""}
        </Text>
        {meta?.lap_time && <Text className="text-white/70 mt-1">Lap time: {meta.lap_time}</Text>}
      </View>

      <Canvas style={{ width: W, height: canvasH }}>
        {skiaPath && <Path path={skiaPath} style="stroke" strokeWidth={3} color="white" />}

        {gearPoints.map((gp, idx) => {
          const sp = worldToScreen({ x: gp.x, y: gp.y }, bounds, W, canvasH, 20);
          const c = gearColors[gp.gear] ?? "#fff";
          return <Circle key={idx} cx={sp.x} cy={sp.y} r={2.8} color={c} />;
        })}
      </Canvas>

      <View className="px-4 pb-6">
        <Text className="text-white/80 font-semibold mb-2">Gear Numbers</Text>
        <View className="flex-row flex-wrap gap-3">
          {Object.keys(gearColors).map((k) => {
            const gear = Number(k);
            return (
              <View key={k} className="flex-row items-center">
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: gearColors[gear], marginRight: 6 }} />
                <Text className="text-white">G{gear}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
