import { TrackPoint, Bounds, Frame, ReplayParams } from "@/types/replay";
import { getFramesPreset } from "@/utils/replaysStorage";
import { useState, useMemo, useEffect } from "react";

export function useReplayData({ API_BASE, year, circuitName, session }: ReplayParams) {
  const [track, setTrack] = useState<TrackPoint[] | null>(null);
  const [bounds, setBounds] = useState<Bounds | null>(null);

  const [frames, setFrames] = useState<Frame[] | null>(null);
  const [fps, setFps] = useState<number>(10);

  const [colors, setColors] = useState<Record<string, string>>({});

  const [loadingTrack, setLoadingTrack] = useState(false);
  const [loadingFrames, setLoadingFrames] = useState(false);
  const [loadingColors, setLoadingColors] = useState(false);

  const [errorTrack, setErrorTrack] = useState<string | null>(null);
  const [errorFrames, setErrorFrames] = useState<string | null>(null);
  const [errorColors, setErrorColors] = useState<string | null>(null);

  const encodedCircuitName = useMemo(() => encodeURIComponent(circuitName), [circuitName]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!year || !circuitName || !session) return;
        setLoadingTrack(true);
        setErrorTrack(null);

        const res = await fetch(
          `${API_BASE}/replay/${year}/${encodedCircuitName}/${session}/track`
        );
        if (!res.ok) throw new Error(`Track failed: ${res.status}`);
        const json = await res.json();

        if (!cancelled) {
          setTrack(json.track);
          setBounds(json.bounds);
        }
      } catch (e: any) {
        if (!cancelled) setErrorTrack(e?.message ?? "Failed to fetch track");
      } finally {
        if (!cancelled) setLoadingTrack(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [API_BASE, year, encodedCircuitName, session]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!year || !circuitName || !session) return;
        setLoadingFrames(true);
        setErrorFrames(null);

        const preset = await getFramesPreset(); 
        const wantedFps = 10;

        const duration =
          preset === "ALL"
            ? 20 
            : Math.max(1, Math.round((preset as number) / wantedFps));

        const res = await fetch(
          `${API_BASE}/replay/${year}/${encodedCircuitName}/${session}/frames?fps=${wantedFps}&start=0&duration=${duration}`
        );
        if (!res.ok) throw new Error(`Frames failed: ${res.status}`);
        const json = await res.json();

        if (!cancelled) {
          setFps(json.fps ?? wantedFps);
          setFrames(json.frames ?? []);
        }
      } catch (e: any) {
        if (!cancelled) setErrorFrames(e?.message ?? "Failed to fetch frames");
      } finally {
        if (!cancelled) setLoadingFrames(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [API_BASE, year, encodedCircuitName, session]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!year || !circuitName || !session) return;
        setLoadingColors(true);
        setErrorColors(null);

        const res = await fetch(
          `${API_BASE}/replay/${year}/${encodedCircuitName}/${session}/colors`
        );
        if (!res.ok) throw new Error(`Colors failed: ${res.status}`);
        const json = await res.json();

        if (!cancelled) {
          setColors(json.colors ?? {});
        }
      } catch (e: any) {
        if (!cancelled) setErrorColors(e?.message ?? "Failed to fetch colors");
      } finally {
        if (!cancelled) setLoadingColors(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [API_BASE, year, encodedCircuitName, session]);

  const isLoading = loadingTrack || loadingFrames || loadingColors;
  const error = errorTrack || errorFrames || errorColors;

  return {
    track,
    bounds,
    frames,
    fps,
    colors,

    loadingTrack,
    loadingFrames,
    loadingColors,
    errorTrack,
    errorFrames,
    errorColors,

    isLoading,
    error,
  };
}