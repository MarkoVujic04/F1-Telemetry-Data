import numpy as np
def resample_race_to_frames_chunk(driver_data: dict, fps: int, start: float, duration: float):
    dt = 1 / fps
    global_t_min = min(d["t_min"] for d in driver_data.values())
    global_t_max = max(d["t_max"] for d in driver_data.values())

    timeline = np.arange(global_t_min, global_t_max, dt) - global_t_min

    chunk_start = max(start, 0.0)
    chunk_end = min(start + duration, float(timeline[-1]) if len(timeline) else 0.0)
    if chunk_end <= chunk_start:
        return [], float(timeline[-1]) if len(timeline) else 0.0

    resampled = {}
    for code, d in driver_data.items():
        t_rel = d["t"] - global_t_min
        t_unique, idx = np.unique(t_rel, return_index=True)
        if len(t_unique) < 2:
            continue

        resampled[code] = {
            "t_min": float(t_unique[0]),
            "t_max": float(t_unique[-1]),
            "x": np.interp(timeline, t_unique, d["x"][idx]),
            "y": np.interp(timeline, t_unique, d["y"][idx]),
            "dist": np.interp(timeline, t_unique, d["dist"][idx]),
            "lap": np.interp(timeline, t_unique, d["lap"][idx]),
        }

    i0 = int(np.searchsorted(timeline, chunk_start, side="left"))
    i1 = int(np.searchsorted(timeline, chunk_end, side="left"))

    frames = []
    for i in range(i0, i1):
        t = float(timeline[i])
        snapshot = []

        for code, r in resampled.items():
            if t < r["t_min"] or t > r["t_max"]:
                continue

            snapshot.append({
                "code": code,
                "x": float(r["x"][i]),
                "y": float(r["y"][i]),
                "dist": float(r["dist"][i]),
                "lap": int(round(r["lap"][i])),
            })

        snapshot.sort(key=lambda row: row["dist"], reverse=True)

        drivers_out = {}
        for pos, car in enumerate(snapshot, start=1):
            drivers_out[car["code"]] = {
                "x": car["x"],
                "y": car["y"],
                "dist": car["dist"],
                "lap": car["lap"],
                "position": pos,
            }

        frames.append({"t": float(round(t, 3)), "drivers": drivers_out})

    total_duration = float(timeline[-1]) if len(timeline) else 0.0
    return frames, total_duration
