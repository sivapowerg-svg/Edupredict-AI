import { FactorBreakdown, Grade, PredictionResult, RiskLevel } from '../types';

export interface ScoreInputs {
  attendance: number;
  internalMarks: number;
  assignmentScore: number;
  participation: number;
  previousScore: number;
}

export function calculateGrade(score: number): Grade {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

export function determineRiskLevel(predictedScore: number, attendance: number): RiskLevel {
  // If predicted score is below 65% or attendance is below 70%, High Risk
  if (predictedScore < 65 || attendance < 70) {
    return 'HIGH';
  }
  // If predicted score is below 75% or attendance is below 75%, Medium Risk
  if (predictedScore < 75 || attendance < 75) {
    return 'MEDIUM';
  }
  return 'LOW';
}

export function calculateConfidence(inputs: ScoreInputs): number {
  const values = [
    inputs.attendance,
    inputs.internalMarks,
    inputs.assignmentScore,
    inputs.participation,
    inputs.previousScore
  ];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Lower standard deviation among indicators implies higher confidence in trajectory
  // Normalized between 80% and 94%
  const confidence = Math.max(78, Math.min(95, Math.round(94 - (stdDev * 0.45))));
  return confidence;
}

export function runPrediction(
  inputs: ScoreInputs,
  studentMeta?: { id?: string; name?: string }
): PredictionResult {
  // Clamp inputs between 0 and 100
  const attendance = Math.min(100, Math.max(0, inputs.attendance));
  const internalMarks = Math.min(100, Math.max(0, inputs.internalMarks));
  const assignmentScore = Math.min(100, Math.max(0, inputs.assignmentScore));
  const participation = Math.min(100, Math.max(0, inputs.participation));
  const previousScore = Math.min(100, Math.max(0, inputs.previousScore));

  // Weighted Formula:
  // Attendance — 30%
  // Internal/Exam Marks — 30%
  // Assignments — 15%
  // Participation — 10%
  // Previous Performance — 15%
  const wAttendance = attendance * 0.30;
  const wInternal = internalMarks * 0.30;
  const wAssignments = assignmentScore * 0.15;
  const wParticipation = participation * 0.10;
  const wPrevious = previousScore * 0.15;

  const rawPredicted = wAttendance + wInternal + wAssignments + wParticipation + wPrevious;
  const predictedScore = Math.round(rawPredicted * 10) / 10;

  const expectedGrade = calculateGrade(predictedScore);
  const riskLevel = determineRiskLevel(predictedScore, attendance);
  const confidence = calculateConfidence({ attendance, internalMarks, assignmentScore, participation, previousScore });

  const breakdown: FactorBreakdown[] = [
    {
      factor: 'attendance',
      label: 'Attendance Record',
      weight: 0.30,
      score: attendance,
      weightedContribution: Math.round(wAttendance * 10) / 10,
      status: attendance >= 75 ? 'positive' : attendance >= 65 ? 'neutral' : 'critical'
    },
    {
      factor: 'internalMarks',
      label: 'Internal / Exam Marks',
      weight: 0.30,
      score: internalMarks,
      weightedContribution: Math.round(wInternal * 10) / 10,
      status: internalMarks >= 75 ? 'positive' : internalMarks >= 60 ? 'neutral' : 'critical'
    },
    {
      factor: 'assignmentScore',
      label: 'Assignment Submissions',
      weight: 0.15,
      score: assignmentScore,
      weightedContribution: Math.round(wAssignments * 10) / 10,
      status: assignmentScore >= 75 ? 'positive' : assignmentScore >= 60 ? 'neutral' : 'critical'
    },
    {
      factor: 'participation',
      label: 'Classroom Participation',
      weight: 0.10,
      score: participation,
      weightedContribution: Math.round(wParticipation * 10) / 10,
      status: participation >= 70 ? 'positive' : participation >= 55 ? 'neutral' : 'critical'
    },
    {
      factor: 'previousScore',
      label: 'Previous Academic Record',
      weight: 0.15,
      score: previousScore,
      weightedContribution: Math.round(wPrevious * 10) / 10,
      status: previousScore >= 75 ? 'positive' : previousScore >= 60 ? 'neutral' : 'critical'
    }
  ];

  // Key drivers
  const keyRiskDrivers: string[] = [];
  const keyStrengths: string[] = [];

  if (attendance < 75) {
    keyRiskDrivers.push(`Attendance (${attendance}%) is below institutional minimum threshold of 75%.`);
  } else {
    keyStrengths.push(`Steady attendance (${attendance}%) establishes consistent lecture engagement.`);
  }

  if (internalMarks < 65) {
    keyRiskDrivers.push(`Internal exam score (${internalMarks}%) shows conceptual deficit in current syllabus.`);
  } else if (internalMarks >= 80) {
    keyStrengths.push(`Strong internal testing performance (${internalMarks}%).`);
  }

  if (assignmentScore < 65) {
    keyRiskDrivers.push(`Low assignment completion rate (${assignmentScore}%) impairs continuous evaluation.`);
  } else if (assignmentScore >= 80) {
    keyStrengths.push(`High assignment score (${assignmentScore}%) demonstrates self-paced learning.`);
  }

  if (participation < 60) {
    keyRiskDrivers.push(`Limited active class interaction (${participation}%) suggests detachment or apprehension.`);
  }

  if (previousScore < 65) {
    keyRiskDrivers.push(`Historical semester baseline (${previousScore}%) indicates pre-existing learning gaps.`);
  }

  if (keyRiskDrivers.length === 0) {
    keyRiskDrivers.push('No severe structural risks detected; student is on a stable academic trajectory.');
  }

  // Calculate classes needed to reach 75% attendance assuming 40 total classes held so far
  const totalClassesHeld = 45;
  const attendedClasses = Math.round((attendance / 100) * totalClassesHeld);
  // formula: (attended + x) / (total + x) >= 0.75 => x >= (0.75 * total - attended) / 0.25
  let classesNeededFor75 = 0;
  if (attendance < 75) {
    classesNeededFor75 = Math.max(1, Math.ceil((0.75 * totalClassesHeld - attendedClasses) / 0.25));
  }

  // Actionable recommendations
  const recommendations: PredictionResult['recommendations'] = [];

  if (attendance < 75) {
    recommendations.push({
      title: 'Mandatory Attendance Counseling',
      description: `Student must attend next ${classesNeededFor75} consecutive class sessions to recover attendance to the 75% requirement.`,
      category: 'attendance',
      priority: 'high',
      actionStep: 'Schedule bi-weekly attendance check-in and notify academic advisor.'
    });
  }

  if (internalMarks < 65) {
    recommendations.push({
      title: 'Targeted Remedial Problem-Solving Labs',
      description: 'Assign focused tutorial worksheets covering foundational topics where marks were lost.',
      category: 'academic',
      priority: 'high',
      actionStep: 'Enroll in weekly remedial peer tutoring cohort on Wednesdays.'
    });
  }

  if (assignmentScore < 70) {
    recommendations.push({
      title: 'Assignment Re-submission & Structured Deadlines',
      description: 'Provide scaffolding for complex projects and offer partial re-evaluations to build competence.',
      category: 'academic',
      priority: 'medium',
      actionStep: 'Break next major assignment into 3 modular milestone checkpoints.'
    });
  }

  if (participation < 65) {
    recommendations.push({
      title: 'Flipped Classroom & Think-Pair-Share Integration',
      description: 'Encourage non-intrusive participation via collaborative micro-groups to reduce speaking anxiety.',
      category: 'engagement',
      priority: 'medium',
      actionStep: 'Assign student specific role (e.g., code reviewer) in group discussions.'
    });
  }

  if (riskLevel === 'LOW') {
    recommendations.push({
      title: 'Honors Track & Peer Mentorship Leadership',
      description: 'Student demonstrates exceptional consistency and is suited for advanced seminar projects.',
      category: 'mentorship',
      priority: 'low',
      actionStep: 'Invite student to serve as co-mentor for junior programming study circles.'
    });
  }

  const aiPedagogicalPlan = {
    summary: riskLevel === 'HIGH'
      ? `Student shows compounded vulnerability driven by ${keyRiskDrivers[0] || 'low scores'}. Early multi-channel intervention is advised before mid-term evaluations.`
      : riskLevel === 'MEDIUM'
      ? 'Student displays moderate academic stability but requires targeted reinforcement to prevent sliding into high risk.'
      : 'Student exhibits robust academic hygiene with strong indicators across attendance and continuous testing.',
    immediateAction: riskLevel === 'HIGH'
      ? 'Issue faculty early alert notice and initiate parent-student advisory meeting within 5 working days.'
      : riskLevel === 'MEDIUM'
      ? 'Provide customized study syllabus and monitor lecture presence over the next 2 weeks.'
      : 'Acknowledge academic excellence and encourage pursuit of advanced capstone project.',
    remedialFocusAreas: internalMarks < 70 || attendance < 75
      ? ['Core algorithmic reasoning', 'Continuous lab practice', 'Lecture recap summaries']
      : ['Advanced specialized topics', 'Research publication guidance'],
    monitoringCadence: riskLevel === 'HIGH' ? 'Weekly advisory review' : 'Fortnightly milestone check',
    parentCommunicationAdvice: riskLevel === 'HIGH'
      ? 'Proactive notification recommending home study routine support and attendance monitoring.'
      : 'Standard mid-semester progress review notice.'
  };

  return {
    studentId: studentMeta?.id,
    studentName: studentMeta?.name,
    predictedScore,
    expectedGrade,
    confidence,
    riskLevel,
    inputScores: {
      attendance,
      internalMarks,
      assignmentScore,
      participation,
      previousScore
    },
    breakdown,
    keyRiskDrivers,
    keyStrengths,
    attendanceRecoveryTarget: attendance < 75 ? { classesNeededFor75, totalClassesHeld } : undefined,
    recommendations,
    aiPedagogicalPlan,
    timestamp: new Date().toISOString()
  };
}
