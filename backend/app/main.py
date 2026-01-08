from fastapi import FastAPI, Query
from app.core.fastf1_cache import enable_cache
from app.services.session_loader import load_session
from app.services.track_map import build_track_polyline, compute_bounds
from app.services.driver_data import build_driver_race_data, build_driver_data
from app.services.frame_resampler import resample_race_to_frames_chunk
from app.services.driver_data import get_driver_color_hex
enable_cache()
app = FastAPI()

@app.get("/replay/{year}/{gp}/{session_id}/track")
def get_track(year: int, gp: str, session_id: str):
    session = load_session(year, gp, session_id)
    track = build_track_polyline(session)
    return {
        "track": track,
        "bounds": compute_bounds(track),
    }


@app.get("/replay/{year}/{gp}/{session_id}/frames")
def get_frames(
        year: int,
        gp: str,
        session_id: str,
        fps: int = Query(10, ge=1, le=30),
        start: float = Query(0.0, ge=0.0),
        duration: float = Query(60.0, gt=0.0, le=600.0),
):
    session = load_session(year, gp, session_id)
    driver_data = build_driver_data(session)

    frames, total_duration = resample_race_to_frames_chunk(
        driver_data=driver_data, fps=fps, start=start, duration=duration
    )

    return {
        "fps": fps,
        "start": start,
        "duration": duration,
        "total_duration": total_duration,
        "frames": frames,
    }

@app.get("/replay/{year}/{gp}/{session_id}/colors")
def get_colors(year: int, gp: str, session_id: str):
    session = load_session(year, gp, session_id)
    return {"colors": get_driver_color_hex(session)}

from fastapi import Query

@app.get("/replay/{year}/{gp}/{session_id}/gear")
def get_gear_on_track(
    year: int,
    gp: str,
    session_id: str,
    step: int = Query(2, ge=1, le=10)
):
    session = load_session(year, gp, session_id)

    lap = session.laps.pick_fastest()
    tel = lap.get_telemetry()

    tel = tel[tel["X"].notna() & tel["Y"].notna() & tel["nGear"].notna()]
    if tel.empty:
        return {"error": "No telemetry with X/Y/nGear for this session."}

    tel = tel.iloc[::step].copy()

    gear_points = [
        {"x": float(x), "y": float(y), "gear": int(g)}
        for x, y, g in zip(tel["X"], tel["Y"], tel["nGear"])
    ]

    track = build_track_polyline(session)
    bounds = compute_bounds(track)

    drv = lap["Driver"]
    laptime = str(lap["LapTime"]) if lap["LapTime"] is not None else None

    return {
        "driver": drv,
        "lap_time": laptime,
        "step": step,
        "bounds": bounds,
        "track": track,
        "gear_points": gear_points,
    }
