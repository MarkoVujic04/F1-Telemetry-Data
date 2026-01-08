import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Canvas, Path, Circle, Skia } from "@shopify/react-native-skia";
import { router, Stack, useLocalSearchParams } from "expo-router";
import FavoriteButton from "@/components/FavoriteIcon";
import { TrackPoint, Bounds } from "@/types/replay";
import { useReplayData } from "@/hooks/useReplayData";

const API_BASE = "http://192.168.0.3:8000";

function worldToScreen(
    p: TrackPoint,
    bounds: Bounds,
    width: number,
    height: number,
    padding = 20
) {
    const worldW = bounds.maxX - bounds.minX;
    const worldH = bounds.maxY - bounds.minY;

    const scale = Math.min(
        (width - padding * 2) / worldW,
        (height - padding * 2) / worldH
    );

    const sx = (p.x - bounds.minX) * scale + padding;
    const sy = (bounds.maxY - p.y) * scale + padding;

    return { x: sx, y: sy, scale };
}

export default function ReplayTestScreen() {
    const [frameIdx, setFrameIdx] = useState<number>(0);
    const params = useLocalSearchParams<{
        year: string;
        circuitName: string;
        session: string;
    }>();
    const year = Number(params.year);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const W = Dimensions.get("window").width;
    const H = Dimensions.get("window").height;

    const { track, bounds, frames, fps, colors, isLoading, error } = useReplayData({
        API_BASE,
        year,
        circuitName: params.circuitName,
        session: params.session,
    });

    useEffect(() => {
        if (!frames || frames.length === 0) return;

        if (timerRef.current) clearInterval(timerRef.current);

        if (!isPlaying) return;

        // @ts-ignore
        timerRef.current = setInterval(() => {
            setFrameIdx((prev) => {
                const next = prev + 1;
                return next >= frames.length ? prev : next;
            });
        }, 1000 / fps);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [frames, fps, isPlaying]);

    const skiaPath = useMemo(() => {
        if (!track || !bounds) return null;

        const path = Skia.Path.Make();
        const first = worldToScreen(track[0], bounds, W, H, 20);
        path.moveTo(first.x, first.y);

        for (let i = 1; i < track.length; i++) {
            const sp = worldToScreen(track[i], bounds, W, H, 20);
            path.lineTo(sp.x, sp.y);
        }
        path.close();
        return path;
    }, [track, bounds, W, H]);

    const currentFrame = frames?.[frameIdx];

    const top10 = useMemo(() => {
        if (!currentFrame) return [];
        return Object.entries(currentFrame.drivers)
            .sort((a, b) => a[1].position - b[1].position)
            .slice(0, 10)
            .map(([code, d]) => ({ code, pos: d.position }));
    }, [currentFrame]);

    if (!track || !bounds || !frames) {
        return (
            <View className="flex-1 items-center justify-center bg-[#111]">
                <ActivityIndicator />
                <Text style={{ marginTop: 8 }}>Loading replay…</Text>
                <Text style={{ marginTop: 8, opacity: 0.7 }}>API: {API_BASE}</Text>
            </View>
        );
    }

    const goBack = () => {
        setIsPlaying(false);
        setFrameIdx((prev) => Math.max(0, prev - 1));
    };

    const goNext = () => {
        setIsPlaying(false);
        setFrameIdx((prev) => Math.min((frames?.length ?? 1) - 1, prev + 1));
    };

    const togglePlay = () => {
        setIsPlaying((p) => !p);
    };

    return (
        <View className="flex-1 bg-[#111]">
            <Stack.Screen
                options={{
                    title: "",
                    headerShown: true,
                    headerTintColor: "#fff",
                    headerStyle: { backgroundColor: "hsl(20 14.3% 4.1%)" },
                    headerRight: () => (
                        <FavoriteButton
                            year={year}
                            circuitName={params.circuitName}
                            session={params.session}
                        />
                    ),
                }}
            />
            <View className="bg-dark-background">
                <Canvas style={{ width: W, height: H * 0.55 }}>
                    {skiaPath && <Path path={skiaPath} style="stroke" strokeWidth={3} color="white" />}

                    {currentFrame &&
                        Object.entries(currentFrame.drivers).map(([code, d]) => {
                            const sp = worldToScreen({ x: d.x, y: d.y }, bounds, W, H * 0.65, 20);
                            const c = colors[code] ?? "red";
                            return <Circle key={code} cx={sp.x} cy={sp.y} r={5} color={c} />;
                        })}
                </Canvas>
            </View>

            <View className="flex-1 px-4 pt-3 pb-4">
                <Text className="text-white text-lg font-semibold">Leaderboard</Text>

                <Text className="text-white/70 mt-1">
                    t={currentFrame?.t.toFixed(1)}s • frame {frameIdx}/{frames.length - 1}
                </Text>

                <View className="mt-2 h-24 flex-row flex-wrap gap-3 overflow-hidden">
                    {top10.map((row) => (
                        <View key={row.code} className="flex-row items-center">
                            <View
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: colors[row.code] ?? "white",
                                    marginRight: 6,
                                }}
                            />
                            <Text className="text-white text-base font-medium">
                                {row.pos}. {row.code}
                            </Text>
                        </View>
                    ))}
                </View>

                <View className="mt-3 flex-row gap-3">
                    <TouchableOpacity
                        onPress={goBack}
                        activeOpacity={0.85}
                        className="flex-1 h-11 rounded-xl border border-white/10 bg-white/5 items-center justify-center"
                    >
                        <Text className="text-white font-semibold">Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={togglePlay}
                        activeOpacity={0.85}
                        className="flex-1 h-11 rounded-xl items-center justify-center"
                        style={{ backgroundColor: "hsl(142.1 76.2% 36.3%)" }}
                    >
                        <Text className="text-white font-extrabold">
                            {isPlaying ? "Pause" : "Play"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={goNext}
                        activeOpacity={0.85}
                        className="flex-1 h-11 rounded-xl border border-white/10 bg-white/5 items-center justify-center"
                    >
                        <Text className="text-white font-semibold">Next</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-3">
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: "/gear",
                                params: {
                                    year: String(year),
                                    circuitName: params.circuitName,
                                    session: params.session,
                                },
                            })
                        }
                        activeOpacity={0.85}
                        className="h-11 rounded-xl border border-white/10 bg-white/5 items-center justify-center"
                    >
                        <Text className="text-white font-semibold">
                            Gear Shifts (Fastest Lap)
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}