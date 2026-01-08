from app.services.driver_data import build_driver_race_data
from app.services.session_loader import load_session
from app.services.frame_resampler import resample_race_to_frames_chunk
from app.services.track_map import build_track_polyline
def top5(frame):
    items = list(frame["drivers"].items())
    items.sort(key=lambda kv: kv[1]["position"])
    return [k for k, _ in items[:5]]

def driver_num_to_abbr(session, drv_num: str) -> str:
    d = session.get_driver(drv_num)
    # Works across versions; if Abbreviation doesn't exist, fallback to number
    return getattr(d, "Abbreviation", drv_num)

if __name__ == "__main__":
    YEAR = 2021
    GP = 7          # round number; later you can change to event name string
    IDENT = "Q"     # try "R" to debug with more continuous movement

    print(f"Loading session: {YEAR=} {GP=} {IDENT=}")
    session = load_session(YEAR, GP, IDENT)

    # Build driver number -> abbreviation mapping
    driver_codes = {num: driver_num_to_abbr(session, num) for num in session.drivers}

    # Build per-driver race data
    driver_data = {}
    for num in session.drivers:
        code = driver_codes[num]
        d = build_driver_race_data(session, num, code)
        if d:
            driver_data[code] = d

    print("drivers processed:", len(driver_data))

    # Optional: track polyline size sanity check
    try:
        track = build_track_polyline(session)
        print("track points:", len(track))
    except Exception as e:
        print("track build failed (not fatal for replay test):", repr(e))

    # Build replay frames (use low FPS first to speed debugging)
    FPS = 2
    frames = resample_race_to_frames_chunk(driver_data, fps=FPS)

    print("fps:", FPS)
    print("frames:", len(frames))

    # Timeline sanity
    if frames:
        print("First frame time:", frames[0]["t"])
        print("Last frame time:", frames[-1]["t"])
        print("Replay duration (s):", frames[-1]["t"] - frames[0]["t"])

    # Leaderboard sanity (should differ over time)
    if frames:
        print("Top5 frame 0:", top5(frames[0]))
        print("Top5 mid:", top5(frames[len(frames)//2]))
        print("Top5 last:", top5(frames[-1]))

    # Movement sanity: pick a driver and print at several points INSIDE their valid window
    code = "VER"
    frames_with_driver = [f for f in frames if code in f["drivers"]]

    if not frames_with_driver:
        print(f"No frames contained driver {code}. Try another code or switch IDENT to 'R'.")
    else:
        print(f"Frames containing {code}:", len(frames_with_driver))

        for frac in [0.0, 0.25, 0.5, 0.75, 1.0]:
            idx = int(frac * (len(frames_with_driver) - 1))
            fr = frames_with_driver[idx]
            d = fr["drivers"][code]
            print(
                f"{code} @ t={fr['t']}: x={d['x']:.3f} y={d['y']:.3f} dist={d['dist']:.3f} pos={d['position']}"
            )

        # Also show a couple sequential frames to see smooth change
        print("Sequential sample (first 5 frames containing driver):")
        for i in range(min(5, len(frames_with_driver))):
            fr = frames_with_driver[i]
            d = fr["drivers"][code]
            print(f"  t={fr['t']}: x={d['x']:.3f} y={d['y']:.3f} dist={d['dist']:.3f}")