export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type Grade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  avatar: string;
  department: string;
  course: string;
  semester: number;
  subject: string;
  attendance: number; // percentage 0-100
  internalMarks: number; // percentage 0-100
  assignmentScore: number; // percentage 0-100
  participation: number; // percentage 0-100
  previousScore: number; // percentage 0-100
  attendanceStatus: 'PRESENT' | 'ABSENT';
  riskLevel: RiskLevel;
  predictedScore: number;
  expectedGrade: Grade;
  phone?: string;
  parentEmail?: string;
  notes?: string;
  lastUpdated?: string;
}

export interface FactorBreakdown {
  factor: string;
  label: string;
  weight: number; // 0.30, 0.15 etc.
  score: number; // 0-100
  weightedContribution: number; // score * weight
  status: 'positive' | 'neutral' | 'critical';
}

export interface PredictionResult {
  studentId?: string;
  studentName?: string;
  predictedScore: number;
  expectedGrade: Grade;
  confidence: number;
  riskLevel: RiskLevel;
  inputScores: {
    attendance: number;
    internalMarks: number;
    assignmentScore: number;
    participation: number;
    previousScore: number;
  };
  breakdown: FactorBreakdown[];
  keyRiskDrivers: string[];
  keyStrengths: string[];
  attendanceRecoveryTarget?: {
    classesNeededFor75: number;
    totalClassesHeld: number;
  };
  recommendations: {
    title: string;
    description: string;
    category: 'attendance' | 'academic' | 'engagement' | 'mentorship';
    priority: 'high' | 'medium' | 'low';
    actionStep: string;
  }[];
  aiPedagogicalPlan?: {
    summary: string;
    immediateAction: string;
    remedialFocusAreas: string[];
    monitoringCadence: string;
    parentCommunicationAdvice: string;
  };
  timestamp: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  department: string;
  course: string;
  semester: number;
  subject: string;
  presentCount: number;
  totalCount: number;
  percentage: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  time: string;
  read: boolean;
  studentId?: string;
}
