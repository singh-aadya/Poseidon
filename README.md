# POSEIDON — Marine Oil Spill Detection & Attribution Intelligence Platform

> **Detect suspicious marine oil slicks from satellite imagery, estimate spill age and characteristics, reconstruct nearby vessel activity, forecast spill drift, and rank probable source vessels.**

Inspired by the interaction and visual design of the **NASA FIRMS (Fire Information for Resource Management System)**, POSEIDON is a dark-theme, map-first, production-quality Progressive Web App (PWA) tailored for satellite analysts, maritime intelligence centers, coast guards, and environmental monitoring agencies.

---

## 🌊 Core Capabilities

1. **Map-First Spatial Intelligence (MapLibre GL JS)**
   - High-contrast oceanographic console with seamless WebGL rendering.
   - Dynamic URL state encoding coordinates, zoom, and selected incident (`/#/map/@-90.45,27.85,9.6z;incident=PSDN-2026-00142`).
   - Basemap switcher: Dark Oceanographic (CARTO Dark Matter), Satellite Bathymetry (Esri World Imagery), Nautical Hydrographic (Esri Ocean).
   - Dynamic 60fps canvas particle streamlines simulating ocean currents (blue) and surface winds (white).

2. **Organic Slick Characterization & Spill Signatures**
   - High-resolution polygon geometries with confidence-weighted boundary styling.
   - Spill signature analytical matrix: Area ($km^2$), Perimeter ($km$), Relative Film Thickness (Sheen / Moderate / Heavy / Crude), Emulsification proxy, SAR Backscatter Contrast Ratio ($dB$), and Drift Kinematics.

3. **First-Class Spill Age Estimation**
   - Prominent horizontal weathering timeline (0h–24h) with mean age markers.
   - **Estimated Spill Release Window** ($T_{start} \to T_{end}$) providing the temporal anchor required for backward vessel reconstruction.

4. **SAR Look-Alike False Alarm Filter**
   - Probabilistic distinction between anthropogenic petroleum and common SAR look-alikes (biogenic films, low-wind calm water zones, internal solitary waves).
   - Multi-factor verification checklist (Shape, Texture, Environmental, Temporal consistency).

5. **Lagrangian Hindcast & Breadcrumb Trails**
   - Reverse particle drift trajectory estimating the slick position at $T-12h, T-9h, T-6h, T-3h,$ and $NOW$.

6. **AIS Spatio-Temporal Reconstruction & Vessel Attribution**
   - Automated query of historical AIS tracks intersecting the estimated release window and backward origin corridor.
   - Ranked candidate vessels with transparent multi-factor attribution confidence breakdown:
     - Spatio-temporal proximity
     - Trajectory consistency
     - Spill-window overlap
     - Behavioral anomalies (speed reduction, course deviation, loitering events)
     - Drift compatibility
     - AIS continuity & transmission gaps (e.g. 18-minute outage)
   - Expandable "Why this vessel?" evidence explanation.
   - Full vessel profile inspection modal with IMO/MMSI, registry specs, and coordinate log table.
   - *Scientific attribution disclaimer adhering to international maritime investigative protocols.*

7. **Ensemble Forward Drift Forecasting**
   - 6-hour, 12-hour, 24-hour, and 48-hour forward projection horizons.
   - Probabilistic spreading uncertainty cones and shoreline proximity risk assessments.
   - Metocean forcing coupling HYCOM surface currents and NOAA GFS surface windage (leeway rule).

8. **Forensic Evidence Dossier**
   - Satellite comparison viewer: Sentinel-1 SAR backscatter vs Deep U-Net segmentation mask with interactive opacity slider.
   - Technical ML inference metrics: Architecture (Attention U-Net / ResNeXt-101), Confidence ($94.2\%$), IoU ($0.912$), Dice coefficient ($0.948$).
   - One-click **Export Evidence Dossier** formatted for formal maritime inquiry and reporting.

9. **NASA FIRMS Playback Timeline**
   - Scrubbable bottom timeline bar with Play/Pause, step controls, variable speed ($1\times, 2\times, 4\times, 8\times$), and lookback presets ($6h, 12h, 24h, 48h, 7d$).

10. **Interactive Guided Demo Walkthrough**
    - One-click **"RUN DEMO"** mode guiding reviewers step-by-step through the 8 stages of a complete investigation.

11. **PWA & Offline Readiness**
    - `manifest.json`, Service Worker caching shell assets, and standalone display support.

---

## 🗺️ Global Incidents Dataset

The platform includes 8 realistic, globally distributed maritime incident scenarios:
- **PSDN-2026-00142**: Gulf of Mexico (*Featured Demo Investigation*) — $18.6\text{ km}^2$, 94% Confidence, Age 8–14h
- **PSDN-2026-00139**: North Atlantic Grand Banks — $7.3\text{ km}^2$, 81% Confidence, Age 18–24h
- **PSDN-2026-00131**: Arabian Sea / Gulf of Oman — $31.2\text{ km}^2$, 91% Confidence, Age 12–18h
- **PSDN-2026-00125**: Mediterranean Sea — $4.8\text{ km}^2$, 63% Confidence (High look-alike risk)
- **PSDN-2026-00118**: Strait of Malacca — $14.1\text{ km}^2$, 88% Confidence, Age 6–10h
- **PSDN-2026-00109**: South China Sea — $9.5\text{ km}^2$, 76% Confidence, Age 14–20h
- **PSDN-2026-00104**: Persian Gulf — $22.4\text{ km}^2$, 93% Confidence, Age 4–8h
- **PSDN-2026-00098**: North Sea (Ekofisk Sector) — $11.2\text{ km}^2$, 85% Confidence, Age 16–22h

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Dark Geospatial Intelligence Theme)
- **Mapping**: MapLibre GL JS (WebGL-accelerated vector and raster geospatial engine)
- **State Management**: Zustand
- **Icons**: Lucide React
- **PWA**: Web App Manifest & Service Worker Cache API

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build production bundle
npm run build

# 4. Preview production build
npm run preview
```
