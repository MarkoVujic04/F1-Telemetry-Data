import AsyncStorage from "@react-native-async-storage/async-storage";

export type FramesPreset = 10 | 50 | 100 | 200 | "ALL";

const KEY = "@replay_frames_preset";

export async function getFramesPreset(): Promise<FramesPreset> {
  const v = await AsyncStorage.getItem(KEY);
  if (!v) return 10;
  try {
    const parsed = JSON.parse(v);
    return parsed;
  } catch {
    return 10;
  }
}

export async function setFramesPreset(preset: FramesPreset) {
  await AsyncStorage.setItem(KEY, JSON.stringify(preset));
}
