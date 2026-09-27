export type UserRole = 'public' | 'analyst' | 'operations' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  organization: string;
  team: string;
  clearanceLevel: 'PUBLIC' | 'OPERATIONAL_ANALYST' | 'INCIDENT_COMMANDER' | 'SYSTEM_ADMIN';
  avatarInitials: string;
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type AlertType =
  | 'DETECTION'
  | 'AREA_GROWTH'
  | 'ATTRIBUTION_REVIEW'
  | 'SHORELINE_PROXIMITY'
  | 'TRAJECTORY_SHIFT'
  | 'DATA_SOURCE_STALE'
  | 'RESPONSE_ACK';

export type AlertStatus = 'New' | 'Acknowledged' | 'In Progress' | 'Resolved';

export interface OperationalAlert {
  id: string; // e.g. "ALT-2026-0842"
  severity: AlertSeverity;
  type: AlertType;
  incidentId: string;
  incidentName: string;
  region: string;
  timestamp: string; // ISO or UTC string
  description: string;
  status: AlertStatus;
  assignedTeam: string;
  assignedUser?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
  read: boolean;
}

export type ResponseWorkflowStage =
  | 'Detection'
  | 'Alert'
  | 'Assigned'
  | 'Acknowledged'
  | 'Investigating'
  | 'Responding'
  | 'Resolved';

export interface IncidentAssignment {
  incidentId: string;
  assignedTeam: string;
  assignedResponder: string;
  assignedBy: string;
  assignedAt: string;
  escalationLevel: 'MONITORING' | 'ADVISORY' | 'CRITICAL RESPONSE';
  workflowStage: ResponseWorkflowStage;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  responseNotes: {
    id: string;
    author: string;
    role: UserRole;
    timestamp: string;
    content: string;
  }[];
}

export interface AuditLogEntry {
  id: string; // e.g. "AUD-94021"
  timestamp: string;
  actor: {
    name: string;
    role: UserRole;
    team: string;
  };
  action: string; // e.g. "Acknowledged Alert", "Assigned Incident", "Escalated Severity"
  incidentId?: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

export interface AlertRuleConfig {
  id: string;
  name: string;
  category: 'Spill Area' | 'Confidence' | 'Shoreline Distance' | 'Vessel Attribution';
  thresholdValue: number;
  unit: string;
  severity: AlertSeverity;
  autoAssignTeam: string;
  enabled: boolean;
}
