def build_track_polyline(session):
    lap = session.laps.pick_fastest()
    tel = lap.get_telemetry()
    tel = tel[tel["X"].notna() & tel["Y"].notna()]
    return [{"x": float(x), "y": float(y)} for x, y in zip(tel["X"], tel["Y"])]

def compute_bounds(points):
    xs = [p["x"] for p in points]
    ys = [p["y"] for p in points]
    return {"minX": min(xs), "maxX": max(xs), "minY": min(ys), "maxY": max(ys)}