"""POSEIDON — Standalone Vessel Attribution Script
Self-contained multi-factor vessel scoring for spill source attribution.

Run directly:
    python standalone_attribution.py

This script does NOT depend on the POSEIDON backend package. It implements
the full attribution scoring model inline, including all five scoring factors:
Spatial, Temporal, Trajectory (COG correlation), Behavioural, and Vessel Type.
"""

from __future__ import annotations
import math
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd


# ── Default weights ──────────────────────────────────────────────────────────
DEFAULT_WEIGHTS = {
    "spatial": 0.30,
    "temporal": 0.25,
    "trajectory": 0.25,
    "behavioural": 0.10,
    "vessel_type": 0.10,
}


def _clamp01(x: float) -> float:
    return max(0.0, min(1.0, x))


def _classification(score: float) -> str:
    if score >= 75:
        return "HIGH-PROBABILITY INVESTIGATION CANDIDATE (Potential Suspect Vessel)"
    if score >= 45:
        return "MEDIUM-PROBABILITY INVESTIGATION CANDIDATE (Candidate Vessel)"
    return "LOW-PROBABILITY INVESTIGATION CANDIDATE (Low Priority)"


def _priority(score: float) -> str:
    if score >= 75:
        return "HIGH"
    if score >= 45:
        return "MEDIUM"
    return "LOW"


def _parse_time(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)


def haversine_km(lat1, lon1, lat2, lon2):
    """Great-circle distance in kilometers."""
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlmb / 2) ** 2
    return float(2 * r * math.asin(math.sqrt(a)))


# ── Scoring factor functions ─────────────────────────────────────────────────


def _calculate_temporal_compatibility(
    track: list[dict],
    origin_time: str,
    window_hours: float,
) -> tuple[float, dict]:
    """Continuous temporal score based on time-window overlap and proximity.

    Returns (score in [0,1], stats dict).
    """
    if not track:
        return 0.0, {"in_window_fraction": 0.0, "min_temporal_distance_h": float("inf")}

    origin_dt = _parse_time(origin_time)
    window_start = origin_dt - timedelta(hours=window_hours / 2)
    window_end = origin_dt + timedelta(hours=window_hours / 2)

    in_window = 0
    min_dist_h = float("inf")
    for pt in track:
        pt_time = _parse_time(pt["time"])
        if window_start <= pt_time <= window_end:
            in_window += 1
        dist_h = abs((pt_time - origin_dt).total_seconds()) / 3600.0
        if dist_h < min_dist_h:
            min_dist_h = dist_h

    fraction = in_window / len(track)
    time_score = fraction
    if min_dist_h <= 2.0:
        time_score += 0.5
    elif min_dist_h <= window_hours:
        time_score += 0.3
    time_score = _clamp01(time_score)

    stats = {
        "in_window_fraction": round(fraction, 2),
        "min_temporal_distance_h": round(min_dist_h, 2),
        "window_hours": window_hours,
    }
    return time_score, stats


def _calculate_trajectory_compatibility(
    candidate: dict,
    origin: dict,
) -> tuple[float, dict]:
    """Trajectory compatibility via COG correlation and bearing analysis.

    Returns (score in [0,1], stats dict).
    """
    track = candidate.get("track", [])
    origin_lat = float(origin.get("latitude", origin.get("lat", 19.12)))
    origin_lon = float(origin.get("longitude", origin.get("lon", origin.get("lng", 71.85))))

    if not track:
        delta = float(candidate.get("heading_delta_deg", 90.0))
        traj = 0.0 if delta > 140 else _clamp01(1.0 - (delta / 140.0))
        return traj, {"heading_delta_deg": delta, "method": "fallback"}

    if len(track) >= 2:
        first = track[0]
        last = track[-1]
        dlat = math.radians(last["latitude"] - first["latitude"])
        dlon = math.radians(last["longitude"] - first["longitude"])
        track_bearing = (math.degrees(math.atan2(dlon, dlat)) + 360) % 360
    else:
        track_bearing = float(candidate.get("mean_cog", 0.0))

    nearest_lat = candidate.get("latitude", origin_lat)
    nearest_lon = candidate.get("longitude", origin_lon)
    dlat_to_origin = origin_lat - nearest_lat
    dlon_to_origin = origin_lon - nearest_lon
    bearing_to_origin = (math.degrees(math.atan2(dlon_to_origin, dlat_to_origin)) + 360) % 360

    heading_delta = abs(track_bearing - bearing_to_origin)
    heading_delta = min(heading_delta, 360 - heading_delta)

    traj_score = _clamp01(1.0 - (heading_delta / 180.0))
    min_dist = float(candidate.get("min_distance_km", 99.0))
    if min_dist < 10.0:
        traj_score = _clamp01(traj_score + 0.15)
    if min_dist < 5.0 and heading_delta < 45.0:
        traj_score = _clamp01(traj_score + 0.10)

    stats = {
        "track_bearing": round(track_bearing, 1),
        "bearing_to_origin": round(bearing_to_origin, 1),
        "heading_delta_deg": round(float(heading_delta), 1),
        "method": "cog_correlation",
    }
    return traj_score, stats


# ── Main scoring function ────────────────────────────────────────────────────


def score_vessels(
    candidates: list[dict],
    origin: dict,
    origin_time: str,
    weights: Optional[dict] = None,
) -> dict:
    """Scores candidate vessels using explainable multi-factor weighting.

    Aligned with POSEIDON backend/services/vessel_scoring.py
    """
    w = dict(DEFAULT_WEIGHTS)
    if weights:
        w.update(weights)

    if not candidates:
        return {
            "ok": True,
            "ranked": [],
            "status": "Warning",
            "warning": "No candidate vessels for analytical ranking.",
            "analytical_weights": w,
        }

    ranked = []
    for v in candidates:
        dist = float(v.get("min_distance_km", 99.0))

        # 1. Spatial Compatibility
        spatial = _clamp01(1.0 - (dist / 35.0))
        spatial_pct = round(100.0 * spatial, 1)

        # 2. Temporal Compatibility
        track = v.get("track", [])
        window_hours = float(v.get("origin_window_hours", 4.5))
        temporal_score, temporal_stats = _calculate_temporal_compatibility(track, origin_time, window_hours)
        temporal_pct = round(100.0 * temporal_score, 1)

        # 3. Trajectory Compatibility
        traj_score, traj_stats = _calculate_trajectory_compatibility(v, origin)
        traj_pct = round(100.0 * traj_score, 1)

        # 4. Behavioural Compatibility
        min_sog = float(v.get("min_sog", v.get("sog", 10.0)))
        mean_sog = float(v.get("mean_sog", 0.0))
        if min_sog < 2.0:
            behavioural = 0.95
        elif min_sog < 4.0:
            behavioural = 0.75
        else:
            behavioural = 0.55
        if mean_sog < 5.0:
            behavioural = _clamp01(behavioural + 0.10)
        behavioural_pct = round(100.0 * behavioural, 1)

        # 5. Vessel Type Relevance
        vtype = str(v.get("vessel_type", v.get("type", ""))).lower()
        if "tanker" in vtype:
            type_score = 1.0
        elif "cargo" in vtype:
            type_score = 0.85
        elif "fishing" in vtype:
            type_score = 0.75
        elif "tug" in vtype:
            type_score = 0.60
        else:
            type_score = 0.45
        type_pct = round(100.0 * type_score, 1)

        # Composite
        composite = (
            w["spatial"] * spatial +
            w["temporal"] * temporal_score +
            w["trajectory"] * traj_score +
            w["behavioural"] * behavioural +
            w["vessel_type"] * type_score
        )
        overall_score = round(100.0 * composite, 1)

        classification = _classification(overall_score)
        priority = _priority(overall_score)

        evidence = [
            f"Spatial compatibility: {spatial_pct}% (Closest approach: {dist:.1f} km from origin).",
            f"Temporal compatibility: {temporal_pct}% ({temporal_stats['in_window_fraction']} of track in window, "
            f"nearest within {temporal_stats['min_temporal_distance_h']}h).",
            f"Trajectory compatibility: {traj_pct}% (Track bearing {traj_stats.get('track_bearing', 'N/A')}° vs "
            f"bearing to origin {traj_stats.get('bearing_to_origin', 'N/A')}°; delta {traj_stats.get('heading_delta_deg', 'N/A')}°).",
            f"Behavioural compatibility: {behavioural_pct}% (Min speed {min_sog:.1f} kn, mean {mean_sog:.1f} kn).",
            f"Vessel type relevance: {type_pct}% ({v.get('vessel_type', 'unknown').capitalize()}).",
        ]

        counter_evidence = []
        if dist > 15.0:
            counter_evidence.append(f"Vessel remained {dist:.1f} km from estimated origin.")
        if min_sog > 8.0 and mean_sog > 8.0:
            counter_evidence.append(f"Maintained steady transit speed ({mean_sog:.1f} kn).")
        if temporal_stats["min_temporal_distance_h"] > 4.0:
            counter_evidence.append("No AIS activity within 4 hours of estimated release time.")

        ranked.append({
            **v,
            "score": overall_score,
            "overall_score": overall_score,
            "priority": priority,
            "classification": classification,
            "scores": {
                "spatial": spatial_pct,
                "temporal": temporal_pct,
                "trajectory": traj_pct,
                "behavioural": behavioural_pct,
                "vessel_type": type_pct,
                "overall": overall_score,
            },
            "score_breakdown": {
                "spatial": {"score": spatial, "weight": w["spatial"]},
                "temporal": {"score": temporal_score, "weight": w["temporal"]},
                "trajectory": {"score": traj_score, "weight": w["trajectory"]},
                "behavioural": {"score": behavioural, "weight": w["behavioural"]},
                "vessel_type": {"score": type_score, "weight": w["vessel_type"]},
            },
            "evidence": evidence,
            "counter_evidence": counter_evidence,
        })

    ranked.sort(key=lambda r: r["score"], reverse=True)
    for idx, r in enumerate(ranked, start=1):
        r["rank"] = idx
        r["ranking"] = idx

    return {
        "ok": True,
        "ranked": ranked,
        "status": "Completed",
        "analytical_weights": w,
        "disclaimer": (
            "Attribution scores are objective analytical likelihood rankings for "
            "investigative prioritization. They do NOT establish legal liability."
        ),
    }


# ── Demo candidate vessels ───────────────────────────────────────────────────


def generate_demo_vessels():
    """Creates a small synthetic vessel pool for demonstration."""
    suspect = {
        "mmsi": 419000111,
        "name": "MT SYNTHETIC STAR",
        "vessel_type": "tanker",
        "latitude": 19.115,
        "longitude": 71.805,
        "min_distance_km": 1.2,
        "sog": 0.8,
        "mean_sog": 2.1,
        "min_sog": 0.3,
        "heading_delta_deg": 22.0,
        "mean_cog": 285.0,
        "origin_window_hours": 5.0,
        "max_ais_gap_hours": 0.5,
        "track": [
            {"time": "2026-03-14T01:30:00Z", "latitude": 19.15, "longitude": 71.83, "sog": 5.2, "cog": 260.0},
            {"time": "2026-03-14T03:30:00Z", "latitude": 19.135, "longitude": 71.815, "sog": 3.1, "cog": 278.0},
            {"time": "2026-03-14T05:30:00Z", "latitude": 19.122, "longitude": 71.808, "sog": 1.4, "cog": 285.0},
            {"time": "2026-03-14T06:30:00Z", "latitude": 19.115, "longitude": 71.805, "sog": 0.5, "cog": 290.0},
            {"time": "2026-03-14T07:30:00Z", "latitude": 19.115, "longitude": 71.805, "sog": 0.3, "cog": 295.0},
        ],
    }

    innocent_1 = {
        "mmsi": 419000234,
        "name": "MV OCEAN NAVIGATOR",
        "vessel_type": "cargo",
        "latitude": 19.25,
        "longitude": 71.65,
        "min_distance_km": 18.5,
        "sog": 12.0,
        "mean_sog": 14.2,
        "min_sog": 8.5,
        "heading_delta_deg": 145.0,
        "mean_cog": 45.0,
        "origin_window_hours": 5.0,
        "max_ais_gap_hours": 0.0,
        "track": [
            {"time": "2026-03-14T02:00:00Z", "latitude": 19.23, "longitude": 71.63, "sog": 13.5, "cog": 45.0},
            {"time": "2026-03-14T04:00:00Z", "latitude": 19.24, "longitude": 71.64, "sog": 12.8, "cog": 46.0},
            {"time": "2026-03-14T06:00:00Z", "latitude": 19.25, "longitude": 71.65, "sog": 14.2, "cog": 45.0},
            {"time": "2026-03-14T08:00:00Z", "latitude": 19.26, "longitude": 71.66, "sog": 13.1, "cog": 46.0},
        ],
    }

    innocent_2 = {
        "mmsi": 419000378,
        "name": "FV SEA BREEZE",
        "vessel_type": "fishing",
        "latitude": 19.30,
        "longitude": 71.95,
        "min_distance_km": 22.0,
        "sog": 4.5,
        "mean_sog": 5.2,
        "min_sog": 2.0,
        "heading_delta_deg": 168.0,
        "mean_cog": 180.0,
        "origin_window_hours": 5.0,
        "max_ais_gap_hours": 2.5,
        "track": [
            {"time": "2026-03-14T02:00:00Z", "latitude": 19.31, "longitude": 71.93, "sog": 3.2, "cog": 175.0},
            {"time": "2026-03-14T04:00:00Z", "latitude": 19.30, "longitude": 71.94, "sog": 4.8, "cog": 180.0},
            {"time": "2026-03-14T06:00:00Z", "latitude": 19.30, "longitude": 71.95, "sog": 5.5, "cog": 182.0},
        ],
    }

    return [suspect, innocent_1, innocent_2]


def main():
    print("=" * 70)
    print("POSEIDON — Standalone Vessel Attribution Scoring")
    print("=" * 70)

    candidates = generate_demo_vessels()
    origin = {"latitude": 19.12, "longitude": 71.80}
    origin_time = "2026-03-14T06:30:00Z"

    print(f"\n1. Scoring {len(candidates)} candidate vessels:")
    print(f"   Origin: lat={origin['latitude']}, lon={origin['longitude']}, t={origin_time}")
    print(f"   Scoring factors: Spatial (30%), Temporal (25%), Trajectory (25%), "
          f"Behavioural (10%), Vessel Type (10%)")

    result = score_vessels(candidates, origin, origin_time)

    print(f"\n2. Ranked Results:")
    print(f"   {'Rank':>4}  {'MMSI':>10}  {'Name':<25} {'Score':>6}  {'Priority':<28}")
    print(f"   {'-'*4}  {'-'*10}  {'-'*25} {'-'*6}  {'-'*28}")
    for v in result["ranked"]:
        print(f"   {v['rank']:>4}  {v['mmsi']:>10}  {v['name']:<25} {v['score']:>6.1f}  {v['classification']:<28}")

    print(f"\n3. Detailed Score Breakdown (Top vessel):")
    top = result["ranked"][0]
    print(f"   Vessel: {top['name']} (MMSI {top['mmsi']})")
    for factor, vals in top["score_breakdown"].items():
        pct = round(vals["score"] * 100, 1)
        w = vals["weight"]
        print(f"   {factor:>15s}: {pct:>5.1f}% (weight={w:.0%}, contribution={pct*w:.1f} pts)")
    print(f"   {'Total':>18s}: {top['score']:>5.1f} / 100")

    print(f"\n4. Evidence (Top vessel):")
    for e in top["evidence"]:
        print(f"   • {e}")

    if top.get("counter_evidence"):
        print(f"\n5. Counter-Evidence:")
        for e in top["counter_evidence"]:
            print(f"   ⚠ {e}")

    print(f"\n" + "=" * 70)
    print("Attribution complete.")
    print("=" * 70)


if __name__ == "__main__":
    main()
