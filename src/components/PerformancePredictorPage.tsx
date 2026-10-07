import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Award,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  BookOpen,
  UserCheck,
  Calendar,
  Layers,
  HelpCircle,
  Download,
  Share2,
  BrainCircuit,
  MessageSquare,
  Flame,
  Check
} from 'lucide-react';
import { Student, PredictionResult } from '../types';
import { runPrediction, ScoreInputs } from '../utils/prediction';

interface PerformancePredictorPageProps {
  students: Student[];
  initialSelectedStudent?: Student | null;
  onSavePredictionToStudent?: (studentId: string, result: PredictionResult) => void;
}

export const PerformancePredictorPage: React.FC<PerformancePredictorPageProps> = ({
  students,
  initialSelectedStudent,
  onSavePredictionToStudent
}) => {
  // Selected student state
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialSelectedStudent?.id || students[0]?.id || ''
  );

  // Input states (0-100)
  const [attendance, setAttendance] = useState<number>(72);
  const [internalMarks, setInternalMarks] = useState<number>(68);
  const [assignmentScore, setAssignmentScore] = useState<number>(75);
  const [participation, setParticipation] = useState<number>(64);
  const [previousScore, setPreviousScore] = useState<number>(70);

  // Prediction execution state
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'ai-plan' | 'formula'>('breakdown');
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  // Sync inputs when student selection changes
  useEffect(() => {
    if (initialSelectedStudent) {
      setSelectedStudentId(initialSelectedStudent.id);
      loadStudentScores(initialSelectedStudent);
    } else if (selectedStudentId) {
      const student = students.find((s) => s.id === selectedStudentId);
      if (student) {
        loadStudentScores(student);
      }
    }
  }, [initialSelectedStudent, selectedStudentId]);

  const loadStudentScores = (st: Student) => {
    setAttendance(st.attendance);
    setInternalMarks(st.internalMarks);
    setAssignmentScore(st.assignmentScore);
    setParticipation(st.participation);
    setPreviousScore(st.previousScore);
    // Automatically trigger initial prediction for chosen student
    const result = runPrediction({
      attendance: st.attendance,
      internalMarks: st.internalMarks,
      assignmentScore: st.assignmentScore,
      participation: st.participation,
      previousScore: st.previousScore
    }, { id: st.id, name: st.name });
    setPredictionResult(result);
  };

  const handleSelectStudentChange = (id: string) => {
    setSelectedStudentId(id);
    const st = students.find((s) => s.id === id);
    if (st) {
      loadStudentScores(st);
    }
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    setSavedBanner(false);

    // Simulate 750ms analysis animation
    setTimeout(async () => {
      const selectedStudent = students.find((s) => s.id === selectedStudentId);
      const inputs: ScoreInputs = {
        attendance,
        internalMarks,
        assignmentScore,
        participation,
        previousScore
      };

      const result = runPrediction(inputs, {
        id: selectedStudent?.id,
        name: selectedStudent?.name || 'Custom Evaluation'
      });

      setPredictionResult(result);
      setIsPredicting(false);

      if (onSavePredictionToStudent && selectedStudent) {
        onSavePredictionToStudent(selectedStudent.id, result);
        setSavedBanner(true);
        setTimeout(() => setSavedBanner(false), 4000);
      }

      // Fetch or enrich with server-side AI recommendation
      try {
        setAiLoading(true);
        const res = await fetch('/api/ai-recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: selectedStudent?.name || 'Student',
            rollNo: selectedStudent?.rollNo || 'N/A',
            attendance,
            internalMarks,
            assignmentScore,
            participation,
            previousScore,
            predictedScore: result.predictedScore,
            riskLevel: result.riskLevel,
            expectedGrade: result.expectedGrade
          })
        });

        if (res.ok) {
          const aiData = await res.json();
          setPredictionResult((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              aiPedagogicalPlan: {
                summary: aiData.summary || prev.aiPedagogicalPlan?.summary || '',
                immediateAction: aiData.immediateAction || prev.aiPedagogicalPlan?.immediateAction || '',
                remedialFocusAreas: aiData.remedialFocusAreas || prev.aiPedagogicalPlan?.remedialFocusAreas || [],
                monitoringCadence: aiData.monitoringCadence || prev.aiPedagogicalPlan?.monitoringCadence || '',
                parentCommunicationAdvice: aiData.parentCommunicationAdvice || prev.aiPedagogicalPlan?.parentCommunicationAdvice || ''
              }
            };
          });
        }
      } catch (err) {
        console.warn('AI endpoint unavailable, using built-in recommendation engine:', err);
      } finally {
        setAiLoading(false);
      }
    }, 750);
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
            <span>EduPredict Core Inference Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Performance Predictor
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Use student academic data to estimate future performance and identify potential academic risk.
          </p>
        </div>

        {/* Student Selector Card */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
            Select Student:
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => handleSelectStudentChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-56"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.rollNo}) - {st.riskLevel} Risk
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Student Profile Teaser */}
      {selectedStudent && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={selectedStudent.avatar}
              alt={selectedStudent.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-400/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedStudent.name}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedStudent.riskLevel === 'HIGH'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : selectedStudent.riskLevel === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {selectedStudent.riskLevel} RISK
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                {selectedStudent.rollNo} • {selectedStudent.department} • Semester {selectedStudent.semester}
              </p>
              {selectedStudent.notes && (
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  Note: {selectedStudent.notes}
                </p>
              )}
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6 text-xs text-slate-400">
            <div>Current Attendance: <span className="font-bold text-white">{selectedStudent.attendance}%</span></div>
            <div>Current Internal Avg: <span className="font-bold text-white">{selectedStudent.internalMarks}%</span></div>
            <div className="text-[10px] text-indigo-300 mt-1">Ready for parameter tuning &amp; simulation</div>
          </div>
        </div>
      )}

      {/* Section 12: STUDENT INPUT DATA CARDS (0 to 100 values) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Student Metric Parameters
            </h2>
            <p className="text-xs text-slate-500">
              Adjust variables to test "what-if" scenarios or update with current term marks
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg font-bold">
            Total Weight: 100%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* 1. Attendance (30%) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Attendance</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                Weight 30%
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span
                className={`text-2xl font-extrabold ${
                  attendance < 75 ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {attendance}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {attendance < 75 ? 'Shortage (<75%)' : 'Eligible'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={attendance}
              onChange={(e) => setAttendance(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">Direct input:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={attendance}
                onChange={(e) => setAttendance(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-center text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          {/* 2. Internal Marks (30%) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Internal Marks</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                Weight 30%
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span
                className={`text-2xl font-extrabold ${
                  internalMarks < 60 ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {internalMarks}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Exams &amp; Quizzes</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={internalMarks}
              onChange={(e) => setInternalMarks(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">Direct input:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={internalMarks}
                onChange={(e) => setInternalMarks(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-center text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          {/* 3. Assignment Score (15%) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Assignment Score</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                Weight 15%
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-extrabold text-slate-900">{assignmentScore}%</span>
              <span className="text-[10px] text-slate-500 font-medium">Labs &amp; HW</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={assignmentScore}
              onChange={(e) => setAssignmentScore(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">Direct input:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={assignmentScore}
                onChange={(e) => setAssignmentScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-center text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          {/* 4. Participation (10%) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Participation</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                Weight 10%
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-extrabold text-slate-900">{participation}%</span>
              <span className="text-[10px] text-slate-500 font-medium">Discussions</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={participation}
              onChange={(e) => setParticipation(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">Direct input:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={participation}
                onChange={(e) => setParticipation(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-center text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          {/* 5. Previous Performance (15%) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Prev. Semester</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                Weight 15%
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-extrabold text-slate-900">{previousScore}%</span>
              <span className="text-[10px] text-slate-500 font-medium">Historical GPA</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={previousScore}
              onChange={(e) => setPreviousScore(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">Direct input:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={previousScore}
                onChange={(e) => setPreviousScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-center text-xs font-bold text-slate-800"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Section 13: PREDICT PERFORMANCE BUTTON */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
        <button
          onClick={handlePredict}
          disabled={isPredicting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-75 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {isPredicting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing student performance…</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>✨ Predict Performance</span>
            </>
          )}
        </button>

        {savedBanner && (
          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Prediction synced to student profile</span>
          </div>
        )}
      </div>

      {/* Section 14: AI PREDICTION OUTPUT & EXPLAINABILITY CONSOLE */}
      {predictionResult && (
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-8 animate-in fade-in duration-500">
          
          {/* Top Outcome Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
            
            {/* 1. Predicted Score */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Predicted Score
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
                <span>{predictionResult.predictedScore}%</span>
              </div>
              <p className="text-[11px] text-indigo-600 font-semibold mt-1">
                Weighted Cumulative Projection
              </p>
            </div>

            {/* 2. Expected Grade */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Expected Grade
              </span>
              <div className="text-3xl font-black text-indigo-600 mt-1 flex items-baseline gap-2">
                <span>{predictionResult.expectedGrade}</span>
                <span className="text-xs font-bold text-slate-500">
                  {predictionResult.expectedGrade === 'A+' ? '(Exemplary)' :
                   predictionResult.expectedGrade === 'A' ? '(Distinction)' :
                   predictionResult.expectedGrade === 'B' ? '(Satisfactory)' :
                   predictionResult.expectedGrade === 'C' ? '(Average)' :
                   predictionResult.expectedGrade === 'D' ? '(Marginal Pass)' : '(Fail Risk)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Institution Grading Standard
              </p>
            </div>

            {/* 3. Confidence */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Confidence
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
                <span>{predictionResult.confidence}%</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Cross-Indicator Variance Index
              </p>
            </div>

            {/* 4. Risk Level */}
            <div
              className={`rounded-2xl p-4 border ${
                predictionResult.riskLevel === 'HIGH'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : predictionResult.riskLevel === 'MEDIUM'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Risk Classification
              </span>
              <div className="text-2xl font-black mt-1 flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    predictionResult.riskLevel === 'HIGH'
                      ? 'bg-rose-600 animate-pulse'
                      : predictionResult.riskLevel === 'MEDIUM'
                      ? 'bg-amber-600'
                      : 'bg-emerald-600'
                  }`}
                />
                <span>{predictionResult.riskLevel} RISK</span>
              </div>
              <p className="text-[11px] font-semibold mt-1">
                {predictionResult.riskLevel === 'HIGH'
                  ? 'Urgent faculty intervention required'
                  : predictionResult.riskLevel === 'MEDIUM'
                  ? 'Continuous monitoring recommended'
                  : 'Consistent academic standing'}
              </p>
            </div>

          </div>

          {/* Attendance Recovery Target Badge (if <75%) */}
          {predictionResult.attendanceRecoveryTarget && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                    Statutory Attendance Recovery Target
                  </h4>
                  <p className="text-xs text-rose-700 mt-0.5">
                    To reach institutional 75% cutoff, student must attend next{' '}
                    <span className="font-extrabold underline">
                      {predictionResult.attendanceRecoveryTarget.classesNeededFor75} consecutive classes
                    </span>{' '}
                    without absence.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold bg-white text-rose-700 px-3 py-1.5 rounded-xl border border-rose-300 self-start sm:self-auto shrink-0 shadow-xs">
                Deficit: {75 - predictionResult.inputScores.attendance}%
              </span>
            </div>
          )}

          {/* Multi-Tab Detail Section */}
          <div className="space-y-4">
            
            {/* Tab navigation */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <button
                onClick={() => setActiveTab('breakdown')}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  activeTab === 'breakdown'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Weighted Model Formula Breakdown
              </button>
              <button
                onClick={() => setActiveTab('ai-plan')}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                  activeTab === 'ai-plan'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Recommendations &amp; Interventions</span>
              </button>
              <button
                onClick={() => setActiveTab('formula')}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  activeTab === 'formula'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Explainability Math
              </button>
            </div>

            {/* Tab 1: Breakdown Table */}
            {activeTab === 'breakdown' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-2.5 px-3">Factor Component</th>
                        <th className="py-2.5 px-3">Model Weight</th>
                        <th className="py-2.5 px-3">Raw Score</th>
                        <th className="py-2.5 px-3">Weighted Contribution</th>
                        <th className="py-2.5 px-3">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {predictionResult.breakdown.map((item) => (
                        <tr key={item.factor} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-semibold text-slate-800">
                            {item.label}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-500">
                            {(item.weight * 100).toFixed(0)}%
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800">
                            {item.score}%
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-indigo-600">
                            +{item.weightedContribution.toFixed(1)} pts
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.status === 'positive'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'neutral'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {item.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50/70 font-extrabold text-slate-900 border-t-2 border-slate-200">
                        <td className="py-3 px-3">Calculated Prediction Total</td>
                        <td className="py-3 px-3">100%</td>
                        <td className="py-3 px-3">—</td>
                        <td className="py-3 px-3 text-indigo-700 text-sm">
                          {predictionResult.predictedScore}%
                        </td>
                        <td className="py-3 px-3 text-indigo-600">
                          Grade {predictionResult.expectedGrade}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Risk Drivers & Strengths list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80">
                    <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Key Risk Drivers
                    </h5>
                    <ul className="space-y-1.5 text-xs text-rose-800">
                      {predictionResult.keyRiskDrivers.map((driver, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                    <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Academic Strengths &amp; Catalysts
                    </h5>
                    <ul className="space-y-1.5 text-xs text-emerald-800">
                      {predictionResult.keyStrengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: AI Plan & Actionable Faculty Guidance */}
            {activeTab === 'ai-plan' && (
              <div className="space-y-5 animate-in fade-in">
                
                {aiLoading && (
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 text-xs flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span>Querying Gemini 3.8 Flash for customized pedagogical action plan...</span>
                  </div>
                )}

                {predictionResult.aiPedagogicalPlan && (
                  <div className="p-5 rounded-2xl bg-indigo-950 text-white space-y-4">
                    <div className="flex items-center justify-between border-b border-indigo-900 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-sm font-bold text-white">
                          AI Pedagogical Advisory Plan
                        </h4>
                      </div>
                      <span className="text-[10px] text-indigo-300 font-mono">
                        Cadence: {predictionResult.aiPedagogicalPlan.monitoringCadence}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      {predictionResult.aiPedagogicalPlan.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-indigo-900/50 border border-indigo-800">
                        <span className="text-[10px] font-bold uppercase text-indigo-300">
                          Immediate 48h Action:
                        </span>
                        <p className="text-xs text-white mt-1 font-medium">
                          {predictionResult.aiPedagogicalPlan.immediateAction}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-indigo-900/50 border border-indigo-800">
                        <span className="text-[10px] font-bold uppercase text-indigo-300">
                          Guardian Communication:
                        </span>
                        <p className="text-xs text-white mt-1 font-medium">
                          {predictionResult.aiPedagogicalPlan.parentCommunicationAdvice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendation cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predictionResult.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            rec.priority === 'high'
                              ? 'bg-rose-100 text-rose-700'
                              : rec.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {rec.priority} Priority
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Category: {rec.category}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-slate-900">{rec.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {rec.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                        <span>Action Step:</span>
                        <span className="text-slate-800 font-normal">{rec.actionStep}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Tab 3: Explainability Math */}
            {activeTab === 'formula' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-4 animate-in fade-in">
                <h4 className="font-bold text-sm text-slate-900">
                  Mathematical Formulation &amp; Weights
                </h4>
                <div className="p-4 rounded-xl bg-white border border-slate-200 font-mono text-slate-800 text-[13px] leading-relaxed">
                  Predicted Score = (Attendance × 0.30) + (Internal Marks × 0.30) + (Assignments × 0.15) + (Participation × 0.10) + (Previous × 0.15)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">
                      Attendance (30%) &amp; Internal Exams (30%)
                    </span>
                    These represent the twin foundations of course mastery. Deficits here disproportionately increase risk of academic failure.
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">
                      Continuous Work (15% + 10%) &amp; Baseline (15%)
                    </span>
                    Assignment rigor and active interaction evaluate daily engagement, while historical score captures baseline learning momentum.
                  </div>
                </div>
              </div>
            )}

          </div>

        </section>
      )}

    </div>
  );
};
