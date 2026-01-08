import numpy as np

def driver_num_to_abbr(session, drv_num: str) -> str:
    d = session.get_driver(drv_num)
    return getattr(d, "Abbreviation", drv_num)

def build_driver_data(session):
    driver_codes = {num: driver_num_to_abbr(session, num) for num in session.drivers}
    driver_data = {}
    for num in session.drivers:
        code = driver_codes[num]
        d = build_driver_race_data(session, num, code)
        if d:
            driver_data[code] = d
    return driver_data

def build_driver_race_data(session, drv_num: str, drv_code: str):
    laps_driver = session.laps.pick_drivers(drv_num)
    if laps_driver.empty:
        return None

    t_all, x_all, y_all, dist_all, lap_all = [], [], [], [], []
    total_dist_so_far = 0.0

    for _, lap in laps_driver.iterlaps():
        tel = lap.get_telemetry()
        if tel is None or tel.empty:
            continue

        t = tel["SessionTime"].dt.total_seconds().to_numpy()
        x = tel["X"].to_numpy()
        y = tel["Y"].to_numpy()
        d = tel["Distance"].to_numpy()

        race_dist = total_dist_so_far + d

        if len(d) > 0:
            total_dist_so_far = float(race_dist[-1])

        t_all.append(t)
        x_all.append(x)
        y_all.append(y)
        dist_all.append(race_dist)
        lap_all.append(np.full_like(t, int(lap.LapNumber)))

    if not t_all:
        return None

    t_all = np.concatenate(t_all)
    x_all = np.concatenate(x_all)
    y_all = np.concatenate(y_all)
    dist_all = np.concatenate(dist_all)
    lap_all = np.concatenate(lap_all)

    order = np.argsort(t_all)
    return {
        "code": drv_code,
        "t": t_all[order],
        "x": x_all[order],
        "y": y_all[order],
        "dist": dist_all[order],
        "lap": lap_all[order],
        "t_min": float(t_all[order][0]),
        "t_max": float(t_all[order][-1]),
    }

import fastf1.plotting

def get_driver_color_hex(session) -> dict:
    mapping = fastf1.plotting.get_driver_color_mapping(session)

    out = {}
    for code, color in mapping.items():
        if not color.startswith("#"):
            color = f"#{color}"
        out[code] = color.lower()
    return out