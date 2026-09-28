# POSEIDON — End-User Walkthrough & Presentation Script

> **Platform:** POSEIDON (Marine Oil Spill Detection & Attribution Intelligence System)  
> **Audience:** End Users, Coast Guard Responders, Environmental Analysts, Maritime Authorities, and Hackathon/Demo Reviewers  
> **Tone:** Professional, engaging, clear, and authoritative.

---

## 📋 Table of Contents
1. [The 60-Second Elevator Pitch (Quick Summary)](#1-the-60-second-elevator-pitch)
2. [Key Concepts in Simple English](#2-key-concepts-in-simple-english)
3. [Full Video / Live Presentation Script (With Visual Cues)](#3-full-video--live-presentation-script)
   - Scene 1: Welcome & The Problem
   - Scene 2: Satellite Detection (Finding the Slick)
   - Scene 3: AI Analysis & False Alarm Filter
   - Scene 4: Spill Age Estimation (When did it happen?)
   - Scene 5: Lagrangian Drift Hindcasting (Where did it drift from?)
   - Scene 6: AIS Vessel Reconstruction (Who was there?)
   - Scene 7: Attribution & The "Smoking Gun"
   - Scene 8: 48-Hour Forecast & Shoreline Risk
   - Scene 9: Forensic Evidence Dossier & Action
4. [Tour of the Interface (How to Navigate the App)](#4-tour-of-the-interface)
5. [Frequently Asked Questions (FAQ) for End Users](#5-frequently-asked-questions)

---

## 1. The 60-Second Elevator Pitch

> *"Every year, thousands of ships illegally dump oily bilge water in our oceans under cover of darkness or bad weather, leaving behind massive environmental damage with zero accountability. It’s the ultimate hit-and-run crime.*
> 
> ***POSEIDON** changes that. Inspired by NASA's Earth observation systems, POSEIDON combines European Space Agency **Sentinel-1 radar satellites**, deep learning AI, ocean physics, and global vessel tracking (AIS).
> 
> When an oil slick is detected, POSEIDON doesn’t just show where it is. It calculates **when** it was spilled, runs ocean currents in **reverse** to pinpoint the exact release location, cross-references all ship traffic in that corridor, and identifies the **culprit vessel** with forensic confidence scores and court-ready evidence."*

---

## 2. Key Concepts in Simple English

If you are explaining POSEIDON to someone with no maritime or satellite background, use these three simple analogies:

| Technical Term | What It Actually Means | Everyday Analogy |
| :--- | :--- | :--- |
| **SAR Satellite (Radar)** | Synthetic Aperture Radar sees through clouds and darkness by bouncing radio waves off the water surface. | Like a submarine's sonar, but from space. Oil calms water ripples, making the slick show up as a crisp dark patch. |
| **Look-Alike Filter** | Distinguishes real petroleum oil from natural phenomena like algae blooms, calm water, or underwater currents. | Like a spam filter that ensures emergency teams don't waste fuel chasing natural seaweed or wind shadows. |
| **Lagrangian Hindcasting** | Running ocean currents and surface winds in reverse. | Like rewinding security camera footage by calculating which way the water was flowing hours earlier. |
| **AIS Spatio-Temporal Correlation** | Checking ship GPS beacons (transponders) that passed through the origin zone during the release time. | Like checking mobile phone tower logs to see which cars were at an intersection at the moment of an accident. |
| **Kinematic Anomaly** | Suspicious ship behavior: slowing down, sharp zigzagging, or turning off beacons. | Like a getaway driver slowing down to throw something out the window and killing their headlights. |

---

## 3. Full Video / Live Presentation Script

*Use this script when recording a product demonstration video, giving a live walkthrough on Zoom, or presenting on stage. It tells you exactly **what to click**, **what to show**, and **what to say**.*

---

### Scene 1: Welcome & The Problem (0:00 – 0:35)

- **[VISUAL]**: Start on the global map with dark ocean theme and flowing blue current streamlines.
- **[ACTION]**: Ensure the map is centered on the Gulf of Mexico incident (`PSDN-2026-00142`).

> **[SPOKEN]**:  
> "Welcome to **POSEIDON** — an end-to-end intelligence platform built to solve one of the maritime world’s greatest challenges: undetected illegal oil dumping.
> 
> When oil spills occur in the open ocean, responders typically have three urgent questions:  
> **Where is it? Where did it come from? And who is responsible?**  
> 
> Let’s walk through a real-world scenario in the Gulf of Mexico to see how POSEIDON answers all three in minutes."

---

### Scene 2: Satellite Detection (0:35 – 1:10)

- **[VISUAL]**: Click on **Live Map** or click **"RUN DEMO"** in the top navigation bar.
- **[ACTION]**: Zoom in on the highlighted oil slick polygon in the Mississippi Canyon block.
- **[POINTER]**: Point to the dark satellite radar overlay and the slick geometry.

> **[SPOKEN]**:  
> "Our journey starts 700 kilometers above the Earth. European Space Agency **Sentinel-1 radar satellites** pass over the Gulf. 
> 
> Because radar penetrates clouds and works in total darkness, it spots this anomalous patch: an 18.6-square-kilometer slick dampening surface capillary waves.
> 
> On the left-hand panel, POSEIDON logs this as incident **PSDN-2026-00142**, flagging an immediate **94% detection confidence**."

---

### Scene 3: AI Analysis & False Alarm Rejection (1:10 – 1:45)

- **[VISUAL]**: Switch to the **Evidence** tab on the right panel, or let the demo reach Scene 2.
- **[ACTION]**: Drag the satellite opacity comparison slider back and forth between raw SAR radar backscatter and the segmented AI mask.

> **[SPOKEN]**:  
> "Not all dark ocean patches are petroleum. Natural algae blooms, wind shadows, and internal waves frequently trigger costly false alarms.
> 
> POSEIDON runs raw satellite data through a deep **Attention U-Net neural network**. It analyzes pixel contrast, boundary sharpness, and texture, validating that this is mineral crude oil with an Intersection-over-Union score of 0.91, instantly rejecting false positives."

---

### Scene 4: Spill Age Estimation — When Did It Happen? (1:45 – 2:20)

- **[VISUAL]**: Click the **Detection** tab on the right panel.
- **[ACTION]**: Highlight the **Spill Age Timeline (8 to 14 Hours)** and the calculated **Target Release Window**.

> **[SPOKEN]**:  
> "Next, we need to know: *When did this oil enter the water?*  
> 
> POSEIDON uses thermodynamic weathering models — factoring in water temperature, evaporation, film thickness, and emulsification — to determine that this slick is between **8 and 14 hours old**, with a mean age of 11 hours.
> 
> This provides our vital temporal anchor: the oil was dumped between **20:00 and 02:00 UTC**."

---

### Scene 5: Drift Reconstruction — Where Did It Come From? (2:20 – 3:00)

- **[VISUAL]**: Switch to **Forecast** mode or watch Scene 4 & 5 of the Demo HUD.
- **[ACTION]**: Show the backward dotted trajectory and the pulsing orange **Probable Origin Ellipse**. Toggle on the ocean current particle streamlines.

> **[SPOKEN]**:  
> "Oil slicks don't stay still; they are swept by ocean currents and winds. The location where the satellite spotted the slick is *not* where it was dumped.
> 
> POSEIDON couples real-time **HYCOM ocean currents** and **NOAA wind models** in a reverse Lagrangian drift simulation. We literally rewind the ocean 12 hours.
> 
> The simulation converges onto this 4.2-square-kilometer high-probability discharge zone, located 14 kilometers southwest of the current slick position."

---

### Scene 6: AIS Traffic Correlation — Who Was There? (3:00 – 3:40)

- **[VISUAL]**: Switch to the **Attribution** tab on the right panel.
- **[ACTION]**: Show the AIS ship tracks lighting up along the shipping channel.

> **[SPOKEN]**:  
> "Now comes the attribution phase. POSEIDON automatically queries global **AIS transponder data** for all commercial vessels operating within a 30-kilometer corridor during that exact 6-hour release window.
> 
> Twelve vessels were in the area, but only three intersected our reverse-drift corridor. POSEIDON filters out the innocent ships and ranks the candidates based on spatial proximity, trajectory alignment, and voyage telemetry."

---

### Scene 7: The 'Smoking Gun' Attribution (3:40 – 4:25)

- **[VISUAL]**: Click on **MV OCEAN STAR (IMO 9481923)** in the candidate list.
- **[ACTION]**: Expand the **'Why this vessel?'** evidence breakdown card and click **'Inspect Vessel Specs'** to open the modal.

> **[SPOKEN]**:  
> "Look at Candidate #1: the bulk carrier **MV OCEAN STAR**, flagged at **87% attribution probability**.
> 
> Why this vessel? POSEIDON highlights three critical anomalies:
> 1. **Zero-Distance Spatial Match:** The vessel passed within just 420 meters of the calculated discharge centroid.
> 2. **Suspicious Speed Drop:** The ship abruptly slowed from 14.1 knots down to 8.2 knots — a textbook pattern for deliberate bilge pumping.
> 3. **The Transponder Blackout:** Right at the discharge point, the vessel experienced an **18-minute AIS blackout** before suddenly accelerating again.
> 
> We now have both the physical path and the behavioral anomaly."

---

### Scene 8: 48-Hour Forward Forecast & Shoreline Risk (4:25 – 5:00)

- **[VISUAL]**: Click the **Forecast** tab on the right panel.
- **[ACTION]**: Switch the horizon slider between **6h, 12h, 24h, and 48h**. Show the expanding forecast cone.

> **[SPOKEN]**:  
> "While investigators handle attribution, emergency response teams need to know where the spill is heading *next*.
> 
> POSEIDON’s ensemble forecasting projects the slick forward over the next 48 hours. It simulates spreading, weathering, and shoreline risk.
> 
> The model projects the slick will drift northeast, coming within 19 kilometers of the sensitive Chandeleur barrier islands, giving coast guards crucial lead time to deploy containment booms."

---

### Scene 9: Forensic Evidence Dossier & Action (5:00 – 5:40)

- **[VISUAL]**: Switch to the **Evidence** tab or click **'Export Evidence Dossier'**.
- **[ACTION]**: Show the 9-point verified chain of custody checklist and the alert assignment modal.

> **[SPOKEN]**:  
> "Finally, POSEIDON compiles every piece of data — satellite passes, neural network masks, metocean vectors, and ship speed logs — into an **audit-ready Forensic Evidence Dossier**.
> 
> With one click, incident commanders can dispatch the US Coast Guard Strike Team and export formal reports for international maritime courts and flag-state authorities.
> 
> In less than five minutes, we went from an anonymous black blob on a satellite picture to an identified ship, a documented crime, and an active coastal defense plan."

---

## 4. Tour of the Interface

When showing someone around the screen for the first time, use this quick spatial guide:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. TOP NAVIGATION BAR (Modes, Role Switcher, Replay, Run Demo, Copilot)│
├──────────────┬──────────────────────────────────────────┬──────────────┤
│ 2. LEFT      │ 3. CENTER MAP VIEW                       │ 4. RIGHT     │
│    PANEL     │    - WebGL Oceanographic Canvas          │    PANEL     │
│              │    - Dynamic Current & Wind Particles    │              │
│  Incident    │    - Slicks, Hindcasts & Ship Tracks     │ Intelligence │
│  Explorer    │    - Basemap Switcher & Layer Controls   │ Tabs:        │
│  (8 Global   │    - Guided Demo HUD Banner              │ - Detection  │
│   Incidents) │                                          │ - Attribution│
│              │                                          │ - Forecast   │
│              │                                          │ - Evidence   │
├──────────────┴──────────────────────────────────────────┴──────────────┤
│ 5. BOTTOM TIMELINE BAR (Scrubber, 1x-8x Speed, Play/Pause, 48h Lookback)│
└────────────────────────────────────────────────────────────────────────┘
```

1. **Top Navigation Bar:**
   - **Mode Selector:** Switch between *Overview*, *Live Map*, *History & Analytics*, *Attribution*, *Forecast*, *Evidence*, and *Public Info*.
   - **Role Switcher:** Toggle operational personas between **Analyst (Dr. Ananya Sharma)**, **Incident Commander (Cmdr. Vikram Malhotra)**, **System Admin (Sunita Reddy)**, and **Public Viewer (Aarav Mehta)** (which masks sensitive ship names for legal privacy).
   - **Run Demo Button:** An automated 9-step guided walkthrough with auto-camera zoom, layer switching, and scene narratives.
   - **Maritime AI Copilot:** An intelligent assistant that answers queries like *"Show vessels with AIS gaps near Mississippi Canyon"*.
   - **Alerts Center:** Real-time push alerts and task assignments for strike teams.

2. **Left Panel (Incident Explorer):**
   - Browse 8 real-world maritime scenarios worldwide (Gulf of Mexico, North Sea, Arabian Sea, Strait of Malacca, Mediterranean, etc.).
   - Filter by severity, confidence, or age.

3. **Center Map (WebGL MapLibre Console):**
   - High-contrast CARTO Dark Matter ocean map.
   - 60 FPS animated vector particle streamlines showing live currents and wind fields.
   - Interactive polygons, reverse drift breadcrumbs, and candidate ship routes.

4. **Right Panel (Intelligence Suite):**
   - **Detection:** Area ($km^2$), film thickness, SAR contrast ($dB$), and spill release window.
   - **Attribution:** Multi-factor candidate scoring, AIS blackout logs, and vessel specifications.
   - **Forecast:** 6h/12h/24h/48h drift predictions and coastal vulnerability warnings.
   - **Evidence:** Interactive satellite vs. AI segmentation slider, technical model metrics, and dossier export.

5. **Bottom Playback Timeline:**
   - Scrub through time to observe how the slick moved and which vessels crossed paths with it hour-by-hour.

---

## 5. Frequently Asked Questions (FAQ) for End Users

### Q1: How does POSEIDON see oil spills at night or through heavy cloud cover?
**Answer:** POSEIDON uses **SAR (Synthetic Aperture Radar)** satellites like ESA’s Sentinel-1. Unlike optical cameras, radar transmits active microwave pulses that easily penetrate clouds, rain, and darkness, reflecting off the ocean surface. Oil dampens surface ripples, making slicks show up clearly as dark patches.

### Q2: How can you be sure a ship caused a spill if nobody saw it dump the oil?
**Answer:** POSEIDON combines three independent scientific layers:
1. **Physical Drift Hindcasting:** Calculates where the water was hours earlier using ocean currents and winds.
2. **Spill Aging Physics:** Determines the spill age based on evaporation and chemical weathering.
3. **AIS Telemetry & Kinematics:** Checks which ships were at that exact spot at that exact hour, while looking for suspicious behaviors like sudden speed drops or turned-off transponders.

### Q3: What is the purpose of the 'Public Info' mode?
**Answer:** Maritime investigations must respect international legal protocols. Under public mode, ship identities and unproven allegations are masked to prevent premature defamation, while giving citizens and journalists transparent situational awareness of environmental risks and beach safety advisories.

### Q4: Can POSEIDON work anywhere in the world?
**Answer:** Yes. POSEIDON is designed to ingest global Sentinel-1 SAR tiles, global HYCOM / NOAA GFS metocean grids, and global terrestrial/satellite AIS feeds, covering major shipping corridors from the Malacca Strait to the North Sea.
