"""POSEIDON — Standalone Forecast Script
Self-contained forward Euler ensemble drift forecast with uncertainty quantification.

Run directly:
    python standalone_forecast.py

This script does NOT depend on the POSEIDON backend package. It implements
the full forward ensemble drift model inline, including convex-hull computation
of the ensemble spread.
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


# ── Physics functions ──────────────────────────────────────────────────────────


def adaptive_windage_factor(wind_speed_ms: float) -> float:
    """Calculates the wind leeway factor based on a realistic adaptive model."""
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
    """Rotates 2D vector (u: East, v: North) clockwise by angle_deg."""
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
    coriolis_deg: float = DEFAULT_CORIOLIS_DEG
) -> tuple[float, float]:
    """Combined surface drift: current + adaptive wind leeway."""
    uw, vw = forcing["wind_u"], forcing["wind_v"]
    uc, vc = forcing["current_u"], forcing["current_v"]

    wind_speed = math.hypot(uw, vw)
    alpha = adaptive_windage_factor(wind_speed)
    u_leeway, v_leeway = rotate_vector(uw * alpha, vw * alpha, coriolis_deg)
    return uc + u_leeway, vc + v_leeway


# ── Forcing data helpers ─────────────────────────────────────────────────────


def generate_synthetic_forcing(seed=42, t0="2026-03-14T00:00:00Z", hours=48, dt_min=30):
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


# ── Ensemble perturbation ───────────────────────────────────────────────────


def generate_perturbations(n_members, spatial_km=1.0, current_scale=0.1, wind_scale=0.1, seed=42):
    rng = np.random.default_rng(seed)
    members = []
    for _ in range(n_members):
        lat_offset = math.degrees(rng.normal(0, spatial_km * 1000.0 / EARTH_RADIUS_M))
        lon_offset = math.degrees(rng.normal(0, spatial_km * 1000.0 / (EARTH_RADIUS_M * math.cos(math.radians(19.0)))))
        members.append({
            "lat_offset_deg": float(lat_offset),
            "lon_offset_deg": float(lon_offset),
            "current_scale": float(rng.uniform(1.0 - current_scale, 1.0 + current_scale)),
            "wind_scale": float(rng.uniform(1.0 - wind_scale, 1.0 + wind_scale)),
        })
    return members


def convex_hull(points: list[tuple[float, float]]) -> list[tuple[float, float]]:
    points = sorted(set(points))
    if len(points) <= 2:
        return points

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower = []
    for p in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)

    upper = []
    for p in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)

    return lower[:-1] + upper[:-1]


# ── Forward ensemble forecast ────────────────────────────────────────────────


def run_forecast_ensemble(
    origin_lat: float,
    origin_lon: float,
    start_time_iso: str,
    df: pd.DataFrame,
    horizons=[6, 12, 24],
    n_members=15,
    spatial_perturb_km=1.0,
    current_perturb=0.10,
    wind_perturb=0.10,
    seed=42,
):
    t0 = pd.Timestamp(start_time_iso).tz_convert("UTC")
    perturbations = generate_perturbations(
        n_members, spatial_perturb_km, current_perturb, wind_perturb, seed
    )

    # ── Nominal trajectory ───────────────────────────────────────────────────
    nominal = [
        {"hours": 0, "lat": origin_lat, "lon": origin_lon, "time": t0.strftime("%Y-%m-%dT%H:%M:%SZ")}
    ]
    cur_lat, cur_lon = origin_lat, origin_lon
    prev_h = 0.0

    for h in sorted(horizons):
        dt = h - prev_h
        t = t0 + timedelta(hours=h)
        forcing = interpolate_forcing(df, t)
        u, v = effective_drift(forcing)
        cur_lat, cur_lon = step_position(cur_lat, cur_lon, u, v, dt)
        nominal.append({
            "hours": h,
            "lat": round(cur_lat, 6),
            "lon": round(cur_lon, 6),
            "time": t.strftime("%Y-%m-%dT%H:%M:%SZ"),
        })
        prev_h = h

    # ── Ensemble members ─────────────────────────────────────────────────────
    ensemble_trajectories = []
    for p in perturbations:
        cur_lat = origin_lat + p["lat_offset_deg"]
        cur_lon = origin_lon + p["lon_offset_deg"]
        traj = [
            {"hours": 0, "lat": cur_lat, "lon": cur_lon, "time": t0.strftime("%Y-%m-%dT%H:%M:%SZ")}
        ]
        prev_h = 0.0

        for h in sorted(horizons):
            dt = h - prev_h
            t = t0 + timedelta(hours=h)
            forcing = interpolate_forcing(df, t.to_pydatetime())
            u_perturbed = forcing["current_u"] * p["current_scale"]
            v_perturbed = forcing["current_v"] * p["current_scale"]
            uw_perturbed = forcing["wind_u"] * p["wind_scale"]
            vw_perturbed = forcing["wind_v"] * p["wind_scale"]

            # Use effective_drift with perturbed values
            # We pass a pseudo-forcing dict to reuse the logic
            du, dv = effective_drift({
                "wind_u": uw_perturbed, "wind_v": vw_perturbed,
                "current_u": u_perturbed, "current_v": v_perturbed
            })

            cur_lat, cur_lon = step_position(cur_lat, cur_lon, du, dv, dt)
            traj.append({
                "hours": h,
                "lat": round(cur_lat, 6),
                "lon": round(cur_lon, 6),
                "time": t.strftime("%Y-%m-%dT%H:%M:%SZ"),
            })
            prev_h = h
        ensemble_trajectories.append(traj)

    # ── Convex hull of final positions ───────────────────────────────────────
    final_points = [(t[-1]["lat"], t[-1]["lon"]) for t in ensemble_trajectories]
    hull = convex_hull(final_points)
    hull_ring = [[round(lon, 6), round(lat, 6)] for lat, lon in hull]
    if hull_ring and hull_ring[0] != hull_ring[-1]:
        hull_ring.append(hull_ring[0])

    # ── Mean trajectory ──────────────────────────────────────────────────────
    h_list = [0] + sorted(horizons)
    mean_traj = []
    for idx, h in enumerate(h_list):
        lats = [t[idx]["lat"] for t in ensemble_trajectories]
        lons = [t[idx]["lon"] for t in ensemble_trajectories]
        mean_traj.append({
            "hours": h,
            "lat": round(float(np.mean(lats)), 6),
            "lon": round(float(np.mean(lons)), 6),
        })

    return {
        "ok": True,
        "model": "forward_euler_ensemble_drift_forecast",
        "nominal": nominal,
        "ensemble_trajectories": ensemble_trajectories,
        "mean_trajectory": mean_traj,
        "convex_hull": hull_ring,
        "final_positions": final_points,
        "ensemble_size": n_members,
        "horizons_hours": horizons,
    }


def main():
    print("=" * 70)
    print("POSEIDON — Standalone Ensemble Forecast (Forward Drift)")
    print("=" * 70)

    df = generate_synthetic_forcing(seed=42, hours=48)
    print(f"\n1. Synthetic Environmental Forcing ({len(df)} records, 48h)")

    origin_lat, origin_lon = 19.08, 71.92
    start_time = "2026-03-14T06:30:00Z"
    print(f"\n2. Forecast Origin: lat={origin_lat}, lon={origin_lon}, t={start_time}")

    result = run_forecast_ensemble(
        origin_lat, origin_lon, start_time, df,
        horizons=[6, 12, 24], n_members=15, seed=42
    )

    print(f"\n3. Nominal Forward Trajectory:")
    for p in result["nominal"]:
        print(f"   +{p['hours']:>2}h | lat={p['lat']:.5f}, lon={p['lon']:.5f}")

    print(f"\n4. Ensemble Statistics (15 members):")
    final_lats = [p[0] for p in result["final_positions"]]
    final_lons = [p[1] for p in result["final_positions"]]

    print(f"   Final position distribution at +24h:")
    print(f"     Mean:   lat={np.mean(final_lats):.5f}, lon={np.mean(final_lons):.5f}")
    print(f"     Std:    lat={np.std(final_lats):.5f}, lon={np.std(final_lons):.5f}")
    print(f"     Min:    lat={min(final_lats):.5f}, lon={min(final_lons):.5f}")
    print(f"     Max:    lat={max(final_lats):.5f}, lon={max(final_lons):.5f}")

    print(f"\n5. Convex Hull of Ensemble ({len(result['convex_hull'])} vertices):")
    for v in result["convex_hull"][:5]:
        print(f"   lon={v[0]:.5f}, lat={v[1]:.5f}")
    if len(result["convex_hull"]) > 5:
        print(f"   ... and {len(result['convex_hull']) - 5} more vertices")

    print(f"\n6. Mean Ensemble Trajectory:")
    for p in result["mean_trajectory"]:
        print(f"   +{p['hours']:>2}h | lat={p['lat']:.5f}, lon={p['lon']:.5f}")

    print(f"\n" + "=" * 70)
    print("Forecast complete. Ensemble drift cloud quantifies model uncertainty.")
    print("=" * 70)


if __name__ == "__main__":
    main()
