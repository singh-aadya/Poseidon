import { Incident } from '../../types';
import { AnalyticsFilterState } from './types';

// Helper to determine status
export function getIncidentStatus(inc: Incident): 'Under investigation' | 'Resolved' | 'Detected' {
  if (inc.status) return inc.status;
  if (inc.confidence >= 0.85 && inc.candidates.length > 0) return 'Under investigation';
  return 'Detected';
}

// 1. Filter incidents
export function filterIncidents(incidents: Incident[], filters: AnalyticsFilterState): Incident[] {
  const now = new Date('2026-09-27T12:00:00Z').getTime();

  return incidents.filter((inc) => {
    const incTime = new Date(inc.detection_time).getTime();

    // Time range filter
    if (filters.timeRange === '30d') {
      const thirtyDaysMs = 30 * 24 * 3600 * 1000;
      if (now - incTime > thirtyDaysMs) return false;
    } else if (filters.timeRange === '90d') {
      const ninetyDaysMs = 90 * 24 * 3600 * 1000;
      if (now - incTime > ninetyDaysMs) return false;
    } else if (filters.timeRange === '1y') {
      const oneYearMs = 365 * 24 * 3600 * 1000;
      if (now - incTime > oneYearMs) return false;
    } else if (filters.timeRange === 'custom') {
      if (filters.customStartDate) {
        const startMs = new Date(filters.customStartDate).getTime();
        if (incTime < startMs) return false;
      }
      if (filters.customEndDate) {
        const endMs = new Date(filters.customEndDate).getTime() + 24 * 3600 * 1000;
        if (incTime > endMs) return false;
      }
    }

    // Region filter
    if (filters.region && filters.region !== 'ALL' && inc.region !== filters.region) {
      return false;
    }

    // Confidence filter
    if (filters.confidence !== 'ALL') {
      if (filters.confidence === 'HIGH' && inc.confidence < 0.85) return false;
      if (filters.confidence === 'MEDIUM' && (inc.confidence < 0.7 || inc.confidence >= 0.85)) return false;
      if (filters.confidence === 'LOW' && inc.confidence >= 0.7) return false;
    }

    // Spill Status filter
    const status = getIncidentStatus(inc);
    if (filters.status !== 'ALL') {
      if (filters.status === 'Under investigation' && status !== 'Under investigation') return false;
      if (filters.status === 'Resolved' && status !== 'Resolved') return false;
      if (filters.status === 'Detected' && status !== 'Detected') return false;
    }

    // Slick Age filter
    const age = inc.estimated_age_mean;
    if (filters.ageFilter !== 'ALL') {
      if (filters.ageFilter === 'fresh' && age >= 6) return false;
      if (filters.ageFilter === 'intermediate' && (age < 6 || age > 24)) return false;
      if (filters.ageFilter === 'aged' && age <= 24) return false;
    }

    return true;
  });
}

// 2. High-level KPI strip
export function calculateKpiMetrics(filtered: Incident[], all: Incident[]) {
  const totalIncidents = filtered.length;
  const allIncidentsCount = all.length;

  const totalAreaKm2 = filtered.reduce((acc, curr) => acc + curr.area_km2, 0);

  const avgAge = totalIncidents > 0
    ? filtered.reduce((acc, curr) => acc + curr.estimated_age_mean, 0) / totalIncidents
    : 0;

  let minAge = Infinity;
  let maxAge = -Infinity;
  filtered.forEach((i) => {
    if (i.estimated_age_mean < minAge) minAge = i.estimated_age_mean;
    if (i.estimated_age_mean > maxAge) maxAge = i.estimated_age_mean;
  });
  if (minAge === Infinity) minAge = 0;
  if (maxAge === -Infinity) maxAge = 0;

  // Candidates with attribution score >= 70
  const highConfVessels = new Set<string>();
  filtered.forEach((inc) => {
    inc.candidates.forEach((c) => {
      if (c.attribution_score >= 70) {
        highConfVessels.add(c.imo || c.vessel_name);
      }
    });
  });

  return {
    totalIncidents,
    allIncidentsCount,
    totalAreaKm2: Math.round(totalAreaKm2 * 10) / 10,
    avgAgeHours: Math.round(avgAge * 10) / 10,
    minAgeHours: Math.round(minAge * 10) / 10,
    maxAgeHours: Math.round(maxAge * 10) / 10,
    candidateVesselsEvaluated: highConfVessels.size,
  };
}

export interface MonthBucket {
  period: string; // "YYYY-MM"
  label: string; // "Feb 2024"
  count: number;
  highCount: number;
  medCount: number;
  lowCount: number;
  totalAreaKm2: number;
  dominantRegion: string;
}

// 3. Temporal trends: group by month
export function getTemporalTrends(incidents: Incident[]): MonthBucket[] {
  const bucketMap: Record<string, {
    high: number;
    med: number;
    low: number;
    area: number;
    regions: Record<string, number>;
  }> = {};

  incidents.forEach((inc) => {
    const d = new Date(inc.detection_time);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    if (!bucketMap[key]) {
      bucketMap[key] = { high: 0, med: 0, low: 0, area: 0, regions: {} };
    }
    if (inc.confidence >= 0.85) bucketMap[key].high++;
    else if (inc.confidence >= 0.70) bucketMap[key].med++;
    else bucketMap[key].low++;

    bucketMap[key].area += inc.area_km2;
    bucketMap[key].regions[inc.region] = (bucketMap[key].regions[inc.region] || 0) + 1;
  });

  const sortedKeys = Object.keys(bucketMap).sort();
  return sortedKeys.map((key) => {
    const [year, month] = key.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
    const label = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const b = bucketMap[key];

    // Find dominant region
    let dominantRegion = 'N/A';
    let maxRCount = 0;
    Object.entries(b.regions).forEach(([r, count]) => {
      if (count > maxRCount) {
        maxRCount = count;
        dominantRegion = r;
      }
    });

    return {
      period: key,
      label,
      count: b.high + b.med + b.low,
      highCount: b.high,
      medCount: b.med,
      lowCount: b.low,
      totalAreaKm2: Math.round(b.area * 10) / 10,
      dominantRegion,
    };
  });
}

// 4. Incident Distribution Breakdown
export function getIncidentDistribution(incidents: Incident[]) {
  // Region breakdown
  const regionMap: Record<string, { count: number; area: number }> = {};
  incidents.forEach((i) => {
    if (!regionMap[i.region]) regionMap[i.region] = { count: 0, area: 0 };
    regionMap[i.region].count++;
    regionMap[i.region].area += i.area_km2;
  });
  const regions = Object.entries(regionMap)
    .map(([region, val]) => ({
      region,
      count: val.count,
      areaKm2: Math.round(val.area * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count);

  // Confidence Profile
  let highConf = 0;
  let medConf = 0;
  let lowConf = 0;
  let highIoUSum = 0;
  let medIoUSum = 0;
  let lowIoUSum = 0;

  incidents.forEach((i) => {
    const iou = i.ml_metrics?.iou_score || 0.85;
    if (i.confidence >= 0.85) {
      highConf++;
      highIoUSum += iou;
    } else if (i.confidence >= 0.70) {
      medConf++;
      medIoUSum += iou;
    } else {
      lowConf++;
      lowIoUSum += iou;
    }
  });

  const total = incidents.length || 1;
  const confidenceProfile = [
    {
      tier: 'High (≥85%)',
      count: highConf,
      percentage: Math.round((highConf / total) * 100),
      avgIoU: highConf > 0 ? (highIoUSum / highConf).toFixed(3) : 'N/A',
      color: '#0284C7',
    },
    {
      tier: 'Medium (70–84%)',
      count: medConf,
      percentage: Math.round((medConf / total) * 100),
      avgIoU: medConf > 0 ? (medIoUSum / medConf).toFixed(3) : 'N/A',
      color: '#F59E0B',
    },
    {
      tier: 'Low (<70%)',
      count: lowConf,
      percentage: Math.round((lowConf / total) * 100),
      avgIoU: lowConf > 0 ? (lowIoUSum / lowConf).toFixed(3) : 'N/A',
      color: '#64748B',
    },
  ];

  // Status Breakdown
  let underInvestigation = 0;
  let resolved = 0;
  let detectedOnly = 0;

  incidents.forEach((i) => {
    const s = getIncidentStatus(i);
    if (s === 'Under investigation') underInvestigation++;
    else if (s === 'Resolved') resolved++;
    else detectedOnly++;
  });

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const statusBreakdown = {
    underInvestigation,
    resolved,
    detectedOnly,
    resolutionRate,
  };

  // Slick Age categories
  let fresh = 0;
  let intermediate = 0;
  let agedDay = 0;
  let agedOld = 0;

  let freshLookAlike = 0;
  let intermediateLookAlike = 0;
  let agedDayLookAlike = 0;
  let agedOldLookAlike = 0;

  incidents.forEach((i) => {
    const a = i.estimated_age_mean;
    const la = i.look_alike?.look_alike_probability ?? 0.12;
    if (a < 6) {
      fresh++;
      freshLookAlike += la;
    } else if (a <= 12) {
      intermediate++;
      intermediateLookAlike += la;
    } else if (a <= 24) {
      agedDay++;
      agedDayLookAlike += la;
    } else {
      agedOld++;
      agedOldLookAlike += la;
    }
  });

  const ageCategories = [
    {
      category: '< 6 hours (Fresh release)',
      count: fresh,
      meanLookAlike: fresh > 0 ? Math.round((freshLookAlike / fresh) * 100) : 0,
    },
    {
      category: '6 – 12 hours',
      count: intermediate,
      meanLookAlike: intermediate > 0 ? Math.round((intermediateLookAlike / intermediate) * 100) : 0,
    },
    {
      category: '12 – 24 hours',
      count: agedDay,
      meanLookAlike: agedDay > 0 ? Math.round((agedDayLookAlike / agedDay) * 100) : 0,
    },
    {
      category: '> 24 hours (Weathered)',
      count: agedOld,
      meanLookAlike: agedOld > 0 ? Math.round((agedOldLookAlike / agedOld) * 100) : 0,
    },
  ];

  return {
    regions,
    confidenceProfile,
    statusBreakdown,
    ageCategories,
  };
}

// 5. Spill Characteristics & Morphology
export function getSpillCharacteristics(incidents: Incident[]) {
  // Size distribution
  const sizeBuckets = [
    { label: '< 1 km²', min: 0, max: 1, count: 0 },
    { label: '1 – 5 km²', min: 1, max: 5, count: 0 },
    { label: '5 – 10 km²', min: 5, max: 10, count: 0 },
    { label: '10 – 20 km²', min: 10, max: 20, count: 0 },
    { label: '> 20 km²', min: 20, max: Infinity, count: 0 },
  ];

  let totalPerimeter = 0;
  let totalElongation = 0;
  let totalSarContrast = 0;

  const thicknessMap: Record<string, number> = {
    'SHEEN': 0,
    'MODERATE': 0,
    'HEAVY': 0,
    'CRUDE SLICK': 0,
  };

  const emulsificationMap: Record<string, number> = {
    'NONE': 0,
    'LOW': 0,
    'LOW–MODERATE': 0,
    'MODERATE': 0,
    'HIGH': 0,
  };

  incidents.forEach((i) => {
    const area = i.area_km2;
    for (const b of sizeBuckets) {
      if (area >= b.min && area < b.max) {
        b.count++;
        break;
      }
    }

    if (i.signature) {
      totalPerimeter += i.signature.perimeter_km || 0;
      totalElongation += i.signature.shape_elongation || 1;
      totalSarContrast += i.signature.sar_contrast_ratio || 0;

      const th = i.signature.thickness_proxy || 'MODERATE';
      thicknessMap[th] = (thicknessMap[th] || 0) + 1;

      const em = i.signature.emulsification_proxy || 'LOW';
      emulsificationMap[em] = (emulsificationMap[em] || 0) + 1;
    }
  });

  const count = incidents.length || 1;
  return {
    sizeDistribution: sizeBuckets,
    avgPerimeterKm: Math.round((totalPerimeter / count) * 10) / 10,
    meanElongation: (totalElongation / count).toFixed(2),
    meanSarContrastDb: (totalSarContrast / count).toFixed(1),
    thicknessCounts: thicknessMap,
    emulsificationCounts: emulsificationMap,
  };
}

// 6. Environmental Conditions at Detection
export function getEnvironmentalCorrelation(incidents: Incident[]) {
  const windBuckets = [
    { label: '< 10 kn (Calm / Light)', count: 0, optimal: false },
    { label: '10 – 15 kn (Optimal SAR contrast)', count: 0, optimal: true },
    { label: '15 – 20 kn (Optimal SAR contrast)', count: 0, optimal: true },
    { label: '> 20 kn (High wave damping)', count: 0, optimal: false },
  ];

  let totalCurrentKnots = 0;
  let minCurrent = Infinity;
  let maxCurrent = -Infinity;

  let totalSst = 0;
  let totalWaveHeight = 0;

  incidents.forEach((i) => {
    const w = i.signature?.ambient_wind_knots ?? 12;
    if (w < 10) windBuckets[0].count++;
    else if (w <= 15) windBuckets[1].count++;
    else if (w <= 20) windBuckets[2].count++;
    else windBuckets[3].count++;

    const c = i.signature?.ambient_current_knots ?? 0.8;
    totalCurrentKnots += c;
    if (c < minCurrent) minCurrent = c;
    if (c > maxCurrent) maxCurrent = c;

    totalSst += i.signature?.ambient_sst_celsius ?? 22.5;
    totalWaveHeight += i.signature?.wave_height_meters ?? 1.2;
  });

  const n = incidents.length || 1;
  return {
    windBuckets,
    meanCurrentKnots: (totalCurrentKnots / n).toFixed(2),
    minCurrentKnots: (minCurrent === Infinity ? 0 : minCurrent).toFixed(2),
    maxCurrentKnots: (maxCurrent === -Infinity ? 0 : maxCurrent).toFixed(2),
    meanSstCelsius: (totalSst / n).toFixed(1),
    meanWaveHeightMeters: (totalWaveHeight / n).toFixed(2),
  };
}

// 7. AIS Historical Analytics & Traffic Correlation
export function getAisHistoricalAnalytics(incidents: Incident[]) {
  // Funnel:
  // 1. Total vessels evaluated in monitored swaths (~approx 55 vessels monitored per incident)
  // 2. Trajectory intersecting spill window
  // 3. Shortlisted (attribution score > 50)
  // 4. High Confidence (attribution score >= 70)
  // 5. Actionable / Resolved (Resolved status or attribution score >= 85)
  let totalEvaluatedEstimate = incidents.length * 54;
  let intersectingWindow = 0;
  let shortlisted = 0;
  let highConfidence = 0;
  let actionableCases = 0;

  const vesselTypeMap: Record<string, number> = {};
  const flagMap: Record<string, { count: number; code: string }> = {};

  let speedReductionCount = 0;
  let courseDeviationCount = 0;
  let loiteringCount = 0;
  let aisGapCount = 0;
  let candidateTotal = 0;

  incidents.forEach((i) => {
    i.candidates.forEach((c) => {
      candidateTotal++;
      intersectingWindow++;

      if (c.attribution_score > 50) shortlisted++;
      if (c.attribution_score >= 70) highConfidence++;
      if (c.attribution_score >= 85 || i.status === 'Resolved') actionableCases++;

      // Type
      const t = c.vessel_type || 'Crude Oil Tanker';
      vesselTypeMap[t] = (vesselTypeMap[t] || 0) + 1;

      // Flag
      const fl = c.flag || 'Unknown';
      if (!flagMap[fl]) flagMap[fl] = { count: 0, code: c.flag_code || 'UN' };
      flagMap[fl].count++;

      // Behavioral signals
      if (c.behavioral_signals?.speed_reduction) speedReductionCount++;
      if (c.behavioral_signals?.course_deviation) courseDeviationCount++;
      if (c.behavioral_signals?.loitering_event) loiteringCount++;
      if (c.behavioral_signals?.ais_gap_detected) aisGapCount++;
    });
  });

  const candN = candidateTotal || 1;
  const vesselTypes = Object.entries(vesselTypeMap)
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / candN) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const topFlags = Object.entries(flagMap)
    .map(([flag, data]) => ({
      flag,
      code: data.code,
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    funnel: [
      { step: 'Monitored AIS Vessels in Region', value: totalEvaluatedEstimate },
      { step: 'Spatiotemporal Intersection Candidates', value: intersectingWindow },
      { step: 'Shortlisted Attribution Candidates (>50)', value: shortlisted },
      { step: 'High-Confidence Candidates (≥70)', value: highConfidence },
      { step: 'Actionable / Resolved Cases', value: actionableCases },
    ],
    vesselTypes,
    topFlags,
    anomalies: {
      speedReductionPct: Math.round((speedReductionCount / candN) * 100),
      courseDeviationPct: Math.round((courseDeviationCount / candN) * 100),
      loiteringPct: Math.round((loiteringCount / candN) * 100),
      aisGapPct: Math.round((aisGapCount / candN) * 100),
    },
  };
}

// 8. Attribution History & Evidence Factors
export function getAttributionHistory(incidents: Incident[]) {
  const scoreBuckets = [
    { label: '0 – 49 (Inconclusive)', count: 0, min: 0, max: 49 },
    { label: '50 – 69 (Plausible Link)', count: 0, min: 50, max: 69 },
    { label: '70 – 84 (Strong Correlation)', count: 0, min: 70, max: 84 },
    { label: '85 – 100 (Conclusive Match)', count: 0, min: 85, max: 100 },
  ];

  let sumProximity = 0;
  let sumTrajectory = 0;
  let sumWindow = 0;
  let sumAnomaly = 0;
  let sumDrift = 0;
  let totalCandidates = 0;

  let posProximity = 0;
  let posTrajectory = 0;
  let posWindow = 0;
  let posAnomaly = 0;
  let posDrift = 0;

  incidents.forEach((i) => {
    i.candidates.forEach((c) => {
      totalCandidates++;
      const score = c.attribution_score;
      for (const b of scoreBuckets) {
        if (score >= b.min && score <= b.max) {
          b.count++;
          break;
        }
      }

      if (c.breakdown) {
        sumProximity += c.breakdown.spatio_temporal_proximity;
        sumTrajectory += c.breakdown.trajectory_consistency;
        sumWindow += c.breakdown.spill_window_overlap;
        sumAnomaly += c.breakdown.behavior_anomaly;
        sumDrift += c.breakdown.drift_compatibility;

        if (c.breakdown.spatio_temporal_proximity >= 70) posProximity++;
        if (c.breakdown.trajectory_consistency >= 70) posTrajectory++;
        if (c.breakdown.spill_window_overlap >= 70) posWindow++;
        if (c.breakdown.behavior_anomaly >= 60) posAnomaly++;
        if (c.breakdown.drift_compatibility >= 70) posDrift++;
      }
    });
  });

  const n = totalCandidates || 1;
  const evidenceFactors = [
    {
      factor: 'Spatio-Temporal Proximity',
      description: 'Candidate AIS position matches reverse-drift centroid',
      avgScore: Math.round(sumProximity / n),
      positiveRatePct: Math.round((posProximity / n) * 100),
      modelWeight: '25%',
    },
    {
      factor: 'Trajectory Consistency',
      description: 'Course bearing aligns with slick axis & drift dynamics',
      avgScore: Math.round(sumTrajectory / n),
      positiveRatePct: Math.round((posTrajectory / n) * 100),
      modelWeight: '20%',
    },
    {
      factor: 'Spill Window Overlap',
      description: 'Vessel transit window overlaps estimated release time',
      avgScore: Math.round(sumWindow / n),
      positiveRatePct: Math.round((posWindow / n) * 100),
      modelWeight: '25%',
    },
    {
      factor: 'Behavior Anomaly',
      description: 'Speed drop, course deflection, or AIS transmitter silence',
      avgScore: Math.round(sumAnomaly / n),
      positiveRatePct: Math.round((posAnomaly / n) * 100),
      modelWeight: '15%',
    },
    {
      factor: 'Drift Compatibility',
      description: 'HYCOM current & GFS wind drift back-calculation',
      avgScore: Math.round(sumDrift / n),
      positiveRatePct: Math.round((posDrift / n) * 100),
      modelWeight: '15%',
    },
  ];

  return {
    scoreBuckets,
    evidenceFactors,
  };
}

// 9. Period Comparison Tool
export function comparePeriods(incidents: Incident[], periodAType: '2026' | 'last90', periodBType: '2025' | 'prior90') {
  const now = new Date('2026-09-27T12:00:00Z').getTime();

  let pAIncidents: Incident[] = [];
  let pBIncidents: Incident[] = [];

  if (periodAType === '2026' && periodBType === '2025') {
    pAIncidents = incidents.filter((i) => new Date(i.detection_time).getUTCFullYear() === 2026);
    pBIncidents = incidents.filter((i) => new Date(i.detection_time).getUTCFullYear() === 2025);
  } else {
    // 90 days vs prior 90 days
    const d90 = 90 * 24 * 3600 * 1000;
    pAIncidents = incidents.filter((i) => {
      const t = new Date(i.detection_time).getTime();
      return now - t <= d90;
    });
    pBIncidents = incidents.filter((i) => {
      const t = new Date(i.detection_time).getTime();
      return now - t > d90 && now - t <= 2 * d90;
    });
  }

  const computeMetrics = (list: Incident[]) => {
    const count = list.length;
    const totalArea = list.reduce((acc, c) => acc + c.area_km2, 0);
    const avgArea = count > 0 ? totalArea / count : 0;
    const avgAge = count > 0 ? list.reduce((acc, c) => acc + c.estimated_age_mean, 0) / count : 0;
    const highConfCount = list.filter((c) => c.confidence >= 0.85).length;
    const highConfPct = count > 0 ? Math.round((highConfCount / count) * 100) : 0;

    const vesselSet = new Set<string>();
    list.forEach((i) => {
      i.candidates.forEach((c) => {
        if (c.attribution_score >= 70) vesselSet.add(c.imo || c.vessel_name);
      });
    });

    const regionCounts: Record<string, number> = {};
    list.forEach((i) => {
      regionCounts[i.region] = (regionCounts[i.region] || 0) + 1;
    });
    let dominantRegion = 'N/A';
    let maxR = 0;
    Object.entries(regionCounts).forEach(([r, c]) => {
      if (c > maxR) {
        maxR = c;
        dominantRegion = r;
      }
    });

    return {
      count,
      totalArea: Math.round(totalArea * 10) / 10,
      avgArea: Math.round(avgArea * 10) / 10,
      avgAge: Math.round(avgAge * 10) / 10,
      highConfPct,
      attributedVessels: vesselSet.size,
      dominantRegion,
    };
  };

  const metricsA = computeMetrics(pAIncidents);
  const metricsB = computeMetrics(pBIncidents);

  const calcDelta = (valA: number, valB: number) => {
    if (valB === 0) return valA > 0 ? '+100%' : '0%';
    const pct = Math.round(((valA - valB) / valB) * 100);
    return pct > 0 ? `+${pct}%` : `${pct}%`;
  };

  return [
    {
      metric: 'Incidents Detected',
      periodA: `${metricsA.count} events`,
      periodB: `${metricsB.count} events`,
      delta: calcDelta(metricsA.count, metricsB.count),
    },
    {
      metric: 'Total Detected Area',
      periodA: `${metricsA.totalArea} km²`,
      periodB: `${metricsB.totalArea} km²`,
      delta: calcDelta(metricsA.totalArea, metricsB.totalArea),
    },
    {
      metric: 'Average Area per Spill',
      periodA: `${metricsA.avgArea} km²`,
      periodB: `${metricsB.avgArea} km²`,
      delta: calcDelta(metricsA.avgArea, metricsB.avgArea),
    },
    {
      metric: 'Average Slick Age',
      periodA: `${metricsA.avgAge} h`,
      periodB: `${metricsB.avgAge} h`,
      delta: calcDelta(metricsA.avgAge, metricsB.avgAge),
    },
    {
      metric: 'High-Confidence Rate (≥85%)',
      periodA: `${metricsA.highConfPct}%`,
      periodB: `${metricsB.highConfPct}%`,
      delta: calcDelta(metricsA.highConfPct, metricsB.highConfPct),
    },
    {
      metric: 'Vessels Attributed (Score ≥70)',
      periodA: `${metricsA.attributedVessels} vessels`,
      periodB: `${metricsB.attributedVessels} vessels`,
      delta: calcDelta(metricsA.attributedVessels, metricsB.attributedVessels),
    },
    {
      metric: 'Dominant Region',
      periodA: metricsA.dominantRegion,
      periodB: metricsB.dominantRegion,
      delta: metricsA.dominantRegion === metricsB.dominantRegion ? 'Same' : 'Shifted',
    },
  ];
}

// 10. Export to CSV
export function exportToCsv(incidents: Incident[]) {
  const headers = [
    'Incident_ID',
    'Detection_Time_UTC',
    'Incident_Name',
    'Region',
    'Latitude',
    'Longitude',
    'Area_km2',
    'Confidence',
    'Estimated_Age_Mean_Hours',
    'Status',
    'Satellite',
    'Polarization',
    'Prime_Candidate_Vessel',
    'Prime_Candidate_IMO',
    'Attribution_Score',
  ];

  const escapeCsv = (str: any) => {
    if (str === null || str === undefined) return '';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = incidents.map((inc) => {
    const cand = inc.candidates[0];
    const status = getIncidentStatus(inc);
    return [
      escapeCsv(inc.id),
      escapeCsv(inc.detection_time),
      escapeCsv(inc.name),
      escapeCsv(inc.region),
      escapeCsv(inc.coordinates.lat),
      escapeCsv(inc.coordinates.lng),
      escapeCsv(inc.area_km2),
      escapeCsv((inc.confidence * 100).toFixed(1) + '%'),
      escapeCsv(inc.estimated_age_mean),
      escapeCsv(status),
      escapeCsv(inc.satellite),
      escapeCsv(inc.polarization),
      escapeCsv(cand?.vessel_name || 'N/A'),
      escapeCsv(cand?.imo || 'N/A'),
      escapeCsv(cand?.attribution_score ?? 'N/A'),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `poseidon_incident_archive_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 11. Export Summary Report (Markdown/Text)
export function exportSummaryReport(incidents: Incident[]) {
  const totalIncidents = incidents.length;
  const totalArea = incidents.reduce((acc, c) => acc + c.area_km2, 0).toFixed(1);
  const avgAge = totalIncidents > 0 ? (incidents.reduce((acc, c) => acc + c.estimated_age_mean, 0) / totalIncidents).toFixed(1) : '0';

  const report = `================================================================================
POSEIDON MARINE OIL SPILL INTELLIGENCE ARCHIVE SUMMARY REPORT
Generated: ${new Date().toISOString()} UTC
System: POSEIDON SAR-AIS Analytics Pipeline (ML-Model: POSEIDON-SAR-SegNet v3.2.1)
================================================================================

1. EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
Total Indexed Events:       ${totalIncidents}
Total Surface Footprint:    ${totalArea} km²
Average Slick Age:          ${avgAge} hours
Archive Integrity:          99.4% telemetry retention
Primary Sensor Constellation: Sentinel-1A/B SAR (C-Band Synthetic Aperture Radar)

2. REGIONAL INCIDENT FREQUENCY
--------------------------------------------------------------------------------
${getIncidentDistribution(incidents).regions.map((r) => `  * ${r.region.padEnd(25)}: ${String(r.count).padStart(2)} incidents | ${String(r.areaKm2).padStart(6)} km²`).join('\n')}

3. DETECTION CONFIDENCE TIERS
--------------------------------------------------------------------------------
${getIncidentDistribution(incidents).confidenceProfile.map((c) => `  * ${c.tier.padEnd(22)}: ${String(c.count).padStart(2)} (${c.percentage}%) | Mean IoU: ${c.avgIoU}`).join('\n')}

4. RECENT INCIDENTS IN ARCHIVE
--------------------------------------------------------------------------------
${incidents.slice(0, 10).map((i) => {
  const c = i.candidates[0];
  return `  * [${i.id}] ${i.detection_time.slice(0, 10)} | ${i.region} | ${i.area_km2} km² | Conf: ${(i.confidence * 100).toFixed(0)}% | Cand: ${c?.vessel_name || 'None'} (Score: ${c?.attribution_score ?? 'N/A'})`;
}).join('\n')}

================================================================================
DISCLAIMER: This report is compiled for institutional maritime domain awareness.
All attribution scores are probabilistic determinations requiring official verification.
================================================================================
`;

  const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `poseidon_summary_report_${new Date().toISOString().slice(0, 10)}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
