"""POSEIDON — Standalone Hindcast Script
Self-contained backward drift integration for oil spill origin estimation.

Run directly:
    python standalone_hindcast.py

This script does NOT depend on the POSEIDON backend package. It implements
the full backward Euler drift model inline so it can be run anywhere with
numpy + pandas.
"""

from __future__ import annotations
import math
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd


# ── Physical constants (aligned with backend/services/environmental.py) ──────────
EARTH_RADIUS_M = 6_371_000.0
DEFAULT_CORIOLIS_DEG = 15.0
LEEWAY_WIND_SPEED_THRESHOLD_LOW = 5.0
LEEWAY_WIND_SPEED_THRESHOLD_HIGH = 12.0
LEEWAY_FACTOR_LOW_WIND = 0.02
LEEWAY_FACTOR_HIGH_WIND = 0.04


# ── Core physics functions ───────────────────────────────────────────────────


def adaptive_windage_factor(wind_speed_ms: float) -> float:
    """Piecewise-linear wind leeway factor (Brekhovskiy et al., 2008 model)."""
    if wind_speed_ms < 1.0:
        return 0.0
    if wind_speed_ms <= LEEWAY_WIND_SPEED_THRESHOLD_LOW:
        return LEEWAY_FACTOR_LOW_WIND
    if wind_speed_ms >= LEEWAY_WIND_SPEED_THRESHOLD_HIGH:
        return LEEWAY_FACTOR_HIGH_WIND
    t = (wind_speed_ms - LEEWAY_WIND_SPEED_THRESHOLD_LOW) / (
        LEEWAY_WIND_SPEED_THRESHOLD_HIGH - LEEWAY_WIND_SPEED_THRESHOLD_LOW
    )
    return LEEWAY_FACTOR_LOW_WIND + t * (LEEWAY_FACTOR_HIGH_WIND - LEEWAY_FACTOR_LOW_WIND)


def rotate_vector(u: float, v: float, angle_deg: float) -> tuple[float, float]:
    """Clockwise 2-D rotation of (u, v) by *angle_deg*."""
    rad = math.radians(angle_deg)
    cos_a, sin_a = math.cos(rad), math.sin(rad)
    return u * cos_a + v * sin_a, -u * sin_a + v * cos_a


def step_position(lat: float, lon: float, u: float, v: float, hours: float) -> tuple[float, float]:
    """Single position step on the spherical Earth."""
    d_north = v * hours * 3600.0
    d_east = u * hours * 3600.0
    dlat = math.degrees(d_north / EARTH_RADIUS_M)
    dlon = math.degrees(d_east / (EARTH_RADIUS_M * math.cos(math.radians(lat))))
    return lat + dlat, lon + dlon


def effective_drift(
    forcing: dict,
    coriolis_deg: float = DEFAULT_CORIOLIS_DEG,
) -> tuple[float, float]:
    """Combined surface drift: current + adaptive wind leeway."""
    uw, vw = forcing["wind_u"], forcing["wind_v"]
    uc, vc = forcing["current_u"], forcing["current_v"]

    wind_speed = math.hypot(uw, vw)
    alpha = adaptive_windage_factor(wind_speed)
    u_l, v_l = rotate_vector(uw * alpha, vw * alpha, coriolis_deg)
    return uc + u_l, vc + v_l


# ── Synthetic environmental data ─────────────────────────────────────────────


def generate_synthetic_forcing(
    seed: int = 42,
    t0: str = "2026-03-14T00:00:00Z",
    hours: int = 12,
    dt_min: int = 30,
) -> pd.DataFrame:
    """Creates a synthetic ocean/wind dataset on a regular time grid."""
    rng = np.random.default_rng(seed)
    t_start = pd.Timestamp(t0)
    n = int(hours * 60 / dt_min) + 1
    rows = []
    for i in range(n):
        ts = t_start + timedelta(minutes=i * dt_min)
        rows.append({
            "timestamp": ts.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "latitude": 19.10,
            "longitude": 71.82,
            "wind_u": round(float(rng.normal(5.0, 0.8)), 4),
            "wind_v": round(float(rng.normal(-0.3, 0.6)), 4),
            "current_u": round(float(rng.normal(0.28, 0.04)), 4),
            "current_v": round(float(rng.normal(0.06, 0.04)), 4),
        })
    return pd.DataFrame(rows)


def interpolate_forcing(df: pd.DataFrame, when: datetime) -> dict:
    """Linear interpolation of wind/current components at time *when*."""
    ts = pd.Timestamp(when)
    t_col = pd.to_datetime(df["timestamp"])

    if ts <= t_col.iloc[0]:
        idx = 0
    elif ts >= t_col.iloc[-1]:
        idx = len(df) - 2
    else:
        idx = int(np.searchsorted(t_col.astype('int64').values, ts.value)) - 1
        idx = max(0, min(idx, len(df) - 2))

    t1, t2 = t_col.iloc[idx], t_col.iloc[idx + 1]
    dt = (t2 - t1).total_seconds()
    w = 0.0 if dt <= 0 else max(0.0, min(1.0, (ts - t1).total_seconds() / dt))

    r1, r2 = df.iloc[idx], df.iloc[idx + 1]
    return {
        "wind_u": float((1 - w) * r1["wind_u"] + w * r2["wind_u"]),
        "wind_v": float((1 - w) * r1["wind_v"] + w * r2["wind_v"]),
        "current_u": float((1 - w) * r1["current_u"] + w * r2["current_u"]),
        "current_v": float((1 - w) * r1["current_v"] + w * r2["current_v"]),
    }


# ── Hindcast integration ─────────────────────────────────────────────────────


def run_hindcast(
    obs_lat: float,
    obs_lon: float,
    obs_time_iso: str,
    df: pd.DataFrame,
    hours_back: float = 12.0,
    step_hours: float = 0.5,
) -> dict:
    """Backward Euler integration from observation point to probable origin.

    Integrates *hours_back* backwards in time, at each step reversing the
    effective drift velocity.
    """
    t0 = pd.Timestamp(obs_time_iso).tz_convert("UTC").to_pydatetime()
    cur_lat, cur_lon = obs_lat, obs_lon

    trajectory = [{
        "hours_back": 0,
        "time": t0.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "lat": round(cur_lat, 6),
        "lon": round(cur_lon, 6),
        "kind": "observation",
    }]

    steps = int(hours_back / step_hours)
    cumulative_east_m = 0.0
    cumulative_north_m = 0.0
    wind_east_m = 0.0
    wind_north_m = 0.0

    for i in range(steps):
        t = t0 - timedelta(hours=step_hours * (i + 1))
        forcing = interpolate_forcing(df, t)
        u, v = effective_drift(forcing)

        # Accumulate physical contributions
        wind_alpha = adaptive_windage_factor(math.hypot(forcing["wind_u"], forcing["wind_v"]))
        wind_east_m += wind_alpha * forcing["wind_u"] * step_hours * 3600.0
        wind_north_m += wind_alpha * forcing["wind_v"] * step_hours * 3600.0
        cumulative_east_m += forcing["current_u"] * step_hours * 3600.0
        cumulative_north_m += forcing["current_v"] * step_hours * 3600.0

        # Backward integration: reverse velocity direction
        cur_lat, cur_lon = step_position(cur_lat, cur_lon, -u, -v, step_hours)

        trajectory.append({
            "hours_back": round((i + 1) * step_hours, 1),
            "time": t.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "lat": round(cur_lat, 6),
            "lon": round(cur_lon, 6),
            "kind": "hindcast",
        })

    return {
        "ok": True,
        "model": "backward_euler_drift_integration",
        "observation": {"lat": obs_lat, "lon": obs_lon, "time": obs_time_iso},
        "probable_origin": {
            "lat": trajectory[-1]["lat"],
            "lon": trajectory[-1]["lon"],
            "time": trajectory[-1]["time"],
            "hours_back": trajectory[-1]["hours_back"],
        },
        "trajectory": trajectory,
        "contributions": {
            "wind_leeway_km": [round(wind_east_m / 1000.0, 2), round(wind_north_m / 1000.0, 2)],
            "current_km": [round(cumulative_east_m / 1000.0, 2), round(cumulative_north_m / 1000.0, 2)],
        },
    }


def main():
    print("=" * 70)
    print("POSEIDON — Standalone Hindcast (Backward Drift Integration)")
    print("=" * 70)

    # 1. Generate synthetic environmental forcing
    df = generate_synthetic_forcing(seed=42, hours=12)
    print(f"\n1. Synthetic Environmental Forcing ({len(df)} records)")
    print(f"   Time range: {df['timestamp'].iloc[0]} -> {df['timestamp'].iloc[-1]}")
    print(f"   Sample wind:    u={df['wind_u'].iloc[0]:.2f} m/s, v={df['wind_v'].iloc[0]:.2f} m/s")
    print(f"   Sample current: u={df['current_u'].iloc[0]:.2f} m/s, v={df['current_v'].iloc[0]:.2f} m/s")

    # 2. Run hindcast from an observation point
    obs_lat, obs_lon = 19.15, 71.80
    obs_time = "2026-03-14T06:30:00Z"
    print(f"\n2. Hindcast Parameters:")
    print(f"   Observation: lat={obs_lat}, lon={obs_lon}, t={obs_time}")
    print(f"   Integrating backward 12 hours (0.5h steps) ...")

    result = run_hindcast(obs_lat, obs_lon, obs_time, df, hours_back=12, step_hours=0.5)

    print(f"\n3. Hindcast Trajectory (selected points):")
    print(f"   {'Hrs Back':>8}  {'Time':<25} {'Lat':>10}  {'Lon':>10}")
    print(f"   {'-'*8}  {'-'*25} {'-'*10}  {'-'*10}")
    for p in result["trajectory"][::4]:  # every 2 hours
        print(f"   {p['hours_back']:>8.1f}  {p['time']:<25} {p['lat']:>10.5f}  {p['lon']:>10.5f}")

    origin = result["probable_origin"]
    print(f"\n4. Probable Origin:")
    print(f"   Latitude:  {origin['lat']:.5f}°")
    print(f"   Longitude: {origin['lon']:.5f}°")
    print(f"   Time:      {origin['time']}")
    dist = math.hypot(origin['lat'] - obs_lat, origin['lon'] - obs_lon) * 111.0
    print(f"   Distance from obs: {dist:.2f} km (approx)")

    print(f"\n5. Drift Contributions (cumulative, meters):")
    cont = result["contributions"]
    print(f"   Wind leeway:  east={cont['wind_leeway_km'][0]:.2f} km, north={cont['wind_leeway_km'][1]:.2f} km")
    print(f"   Current:      east={cont['current_km'][0]:.2f} km, north={cont['current_km'][1]:.2f} km")

    print(f"\n" + "=" * 70)
    print("Hindcast complete.")
    print("=" * 70)


if __name__ == "__main__":
    main()
