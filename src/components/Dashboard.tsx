import React, { useState } from 'react';
import {
  Users,
  CalendarCheck2,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  Filter,
  Info,
  ShieldAlert,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Student } from '../types';
import { SCATTER_PLOT_DATA, TIMELINE_OVERVIEW_DATA, ScatterPoint } from '../data/mockData';

interface DashboardProps {
  students: Student[];
  onNavigateToPredictor: (student?: Student) => void;
  onNavigateToAttendance: () => void;
  onNavigateToAtRisk: () => void;
  onViewStudentDetails: (student: Student) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  onNavigateToPredictor,
  onNavigateToAttendance,
  onNavigateToAtRisk,
  onViewStudentDetails
}) => {
  // Filter for Student Performance Overview Line Chart
  const [timelineFilter, setTimelineFilter] = useState<'thisMonth' | 'last3Months' | 'currentSemester'>('thisMonth');

  // Hover state for interactive scatter plot
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Top at-risk students for "Students Requiring Attention"
  const atRiskStudents = students
    .filter((s) => s.riskLevel === 'HIGH' || s.riskLevel === 'MEDIUM')
    .sort((a, b) => a.predictedScore - b.predictedScore)
    .slice(0, 5);

  const activeTimelineData = TIMELINE_OVERVIEW_DATA[timelineFilter];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* 1. Dashboard Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Students */}
        <div className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">248</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Active students enrolled</div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>5 Departments</span>
            <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
              Synced <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Average Attendance */}
        <div className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Average Attendance
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">82.6%</div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <span>↑ 3.2% this month</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Threshold: 75.0%</span>
            <span className="text-emerald-600 font-medium">Safe Margin</span>
          </div>
        </div>

        {/* Average Performance */}
        <div className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Average Performance
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">76.4%</div>
            <div className="text-xs text-indigo-600 font-semibold flex items-center gap-1 mt-1">
              <span>↑ 5.8% this semester</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Weighted Mean</span>
            <span className="text-indigo-600 font-medium">Grade B+</span>
          </div>
        </div>

        {/* At-Risk Students */}
        <div className="group bg-white rounded-2xl p-5 border border-rose-200/90 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-white via-white to-rose-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> At-Risk Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-rose-600 tracking-tight">27</div>
            <div className="text-xs text-rose-600 font-semibold mt-1">Requires attention</div>
          </div>
          <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Critical: 8 students</span>
            <button
              onClick={onNavigateToAtRisk}
              className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              Intervene <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </section>

      {/* 2. Primary Analytics Grid: Performance Line Chart & Attendance vs Performance Scatter Plot */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Student Performance Overview Line Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Student Performance Overview
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cohort longitudinal trends across continuous assessment markers
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
              <button
                onClick={() => setTimelineFilter('thisMonth')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timelineFilter === 'thisMonth'
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                This month
              </button>
              <button
                onClick={() => setTimelineFilter('last3Months')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timelineFilter === 'last3Months'
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Last 3 months
              </button>
              <button
                onClick={() => setTimelineFilter('currentSemester')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timelineFilter === 'currentSemester'
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Current semester
              </button>
            </div>
          </div>

          {/* Chart Legends */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 pt-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
              Average Marks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              Attendance
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              Assignments
            </span>
          </div>

          {/* SVG Multi-Line Chart */}
          <div className="w-full h-64 mt-4 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 220">
              {/* Horizontal grid lines */}
              {[40, 60, 80, 100].map((val, idx) => {
                const y = 200 - ((val - 40) / 60) * 170;
                return (
                  <g key={val}>
                    <line
                      x1="40"
                      y1={y}
                      x2="480"
                      y2={y}
                      stroke="#f1f5f9"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text x="32" y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Dynamic Path Generators for Active Data */}
              {(() => {
                const count = activeTimelineData.length;
                const getCoords = (key: 'avgMarks' | 'attendance' | 'assignments') => {
                  return activeTimelineData.map((d, i) => {
                    const x = 50 + (i / (count - 1)) * 410;
                    const val = d[key];
                    const y = 200 - ((val - 40) / 60) * 170;
                    return { x, y, val, period: d.period };
                  });
                };

                const marksCoords = getCoords('avgMarks');
                const attCoords = getCoords('attendance');
                const assignCoords = getCoords('assignments');

                const makePath = (coords: { x: number; y: number }[]) =>
                  coords.reduce((acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`), '');

                return (
                  <>
                    {/* Attendance Path */}
                    <path
                      d={makePath(attCoords)}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {attCoords.map((pt, i) => (
                      <circle
                        key={`att-${i}`}
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        className="fill-white stroke-emerald-500 stroke-2 hover:r-6 transition-all"
                      />
                    ))}

                    {/* Assignments Path */}
                    <path
                      d={makePath(assignCoords)}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {assignCoords.map((pt, i) => (
                      <circle
                        key={`asg-${i}`}
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        className="fill-white stroke-amber-500 stroke-2 hover:r-6 transition-all"
                      />
                    ))}

                    {/* Average Marks Path */}
                    <path
                      d={makePath(marksCoords)}
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {marksCoords.map((pt, i) => (
                      <circle
                        key={`mrk-${i}`}
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        className="fill-white stroke-indigo-600 stroke-2 hover:r-6 transition-all"
                      />
                    ))}

                    {/* X-axis labels */}
                    {marksCoords.map((pt, i) => (
                      <text
                        key={`lbl-${i}`}
                        x={pt.x}
                        y="218"
                        textAnchor="middle"
                        className="text-[11px] fill-slate-500 font-medium"
                      >
                        {pt.period}
                      </text>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Cohort Average: 76.4%</span>
            <span className="text-indigo-600 font-medium">Predictive projection indicates 79.2% end-term average</span>
          </div>
        </div>

        {/* Right Column: Attendance vs Academic Performance Interactive Scatter Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Attendance vs Performance
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Interactive Scatter Plot
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Correlation between lecture attendance and academic marks
              </p>
            </div>

            {/* Risk Indicators Legend */}
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Risk
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Med Risk
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High Risk
              </span>
            </div>
          </div>

          {/* Interactive Scatter Plot Canvas */}
          <div className="relative w-full h-64 mt-4">
            <svg
              className="w-full h-full"
              viewBox="0 0 500 220"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Threshold Zones */}
              {/* High risk zone below 70% attendance or below 65% performance */}
              <rect
                x="40"
                y="110"
                width="160"
                height="90"
                fill="#fef2f2"
                opacity="0.6"
                rx="4"
              />
              <text x="50" y="130" className="text-[10px] fill-rose-500 font-bold uppercase tracking-wider">
                Critical Zone
              </text>

              {/* 75% Attendance Institutional Line */}
              {(() => {
                const x75 = 40 + ((75 - 40) / 60) * 440;
                return (
                  <g>
                    <line
                      x1={x75}
                      y1="20"
                      x2={x75}
                      y2="200"
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    <text
                      x={x75 + 4}
                      y="32"
                      className="text-[9px] fill-rose-600 font-semibold"
                    >
                      75% Min. Threshold
                    </text>
                  </g>
                );
              })()}

              {/* Axes & Grid */}
              {[40, 60, 80, 100].map((val) => {
                const y = 200 - ((val - 40) / 60) * 180;
                return (
                  <g key={`y-${val}`}>
                    <line x1="40" y1={y} x2="480" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x="32" y={y + 4} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">
                      {val}%
                    </text>
                  </g>
                );
              })}

              {[40, 60, 80, 100].map((val) => {
                const x = 40 + ((val - 40) / 60) * 440;
                return (
                  <g key={`x-${val}`}>
                    <line x1={x} y1="20" x2={x} y2="200" stroke="#f1f5f9" strokeWidth="1" />
                    <text x={x} y="216" textAnchor="middle" className="text-[9px] fill-slate-400 font-mono">
                      {val}% Att.
                    </text>
                  </g>
                );
              })}

              {/* Student Points */}
              {SCATTER_PLOT_DATA.map((pt) => {
                const cx = 40 + ((pt.attendance - 40) / 60) * 440;
                const cy = 200 - ((pt.performance - 40) / 60) * 180;

                const color =
                  pt.riskLevel === 'HIGH'
                    ? '#ef4444'
                    : pt.riskLevel === 'MEDIUM'
                    ? '#f59e0b'
                    : '#10b981';

                const isHovered = hoveredPoint?.id === pt.id;

                return (
                  <g
                    key={pt.id}
                    className="cursor-pointer transition-transform duration-150"
                    onMouseEnter={(e) => {
                      setHoveredPoint(pt);
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipPos({ x: rect.left, y: rect.top });
                    }}
                    onClick={() => {
                      const matched = students.find((s) => s.id === pt.id) || {
                        id: pt.id,
                        name: pt.name,
                        rollNo: pt.rollNo,
                        attendance: pt.attendance,
                        internalMarks: pt.performance,
                        assignmentScore: pt.performance,
                        participation: 65,
                        previousScore: pt.performance,
                        riskLevel: pt.riskLevel,
                        predictedScore: pt.performance,
                        expectedGrade: 'C',
                        department: 'Computer Science & Engineering',
                        course: 'B.Tech CSE',
                        semester: 5,
                        subject: 'Data Structures & Algorithms',
                        attendanceStatus: 'PRESENT'
                      } as Student;
                      onNavigateToPredictor(matched);
                    }}
                  >
                    {/* Pulsing ring for high risk */}
                    {pt.riskLevel === 'HIGH' && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="8"
                        fill="#fee2e2"
                        className="animate-ping opacity-40 pointer-events-none"
                      />
                    )}

                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 8 : 6}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="shadow-sm transition-all"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div
                className="absolute z-20 pointer-events-none bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-slate-700 text-xs w-52 -translate-y-full -translate-x-1/2 left-1/2 top-1/2"
                style={{
                  left: `${Math.min(
                    85,
                    Math.max(15, ((hoveredPoint.attendance - 40) / 60) * 100)
                  )}%`,
                  top: `${Math.max(
                    15,
                    200 - ((hoveredPoint.performance - 40) / 60) * 100
                  )}px`
                }}
              >
                <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      hoveredPoint.riskLevel === 'HIGH'
                        ? 'bg-rose-500'
                        : hoveredPoint.riskLevel === 'MEDIUM'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <div className="font-bold text-white truncate">{hoveredPoint.name}</div>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Attendance:</span>
                    <span className="font-semibold text-white">{hoveredPoint.attendance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Marks:</span>
                    <span className="font-semibold text-white">{hoveredPoint.performance}%</span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-slate-400">Risk Level:</span>
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        hoveredPoint.riskLevel === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300'
                          : hoveredPoint.riskLevel === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {hoveredPoint.riskLevel} RISK
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-indigo-400 text-center font-medium">
                  Click point to predict &amp; advise →
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>X-Axis: Attendance % | Y-Axis: Performance %</span>
            <span className="text-slate-600 font-medium">Correlation Coefficient: r = +0.78</span>
          </div>
        </div>

      </section>

      {/* 3. Section 8: AT-RISK STUDENTS — Students Requiring Attention */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Students Requiring Attention
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                Top Priority Interventions
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified by weighted risk scoring algorithm combining low attendance and internal deficits
            </p>
          </div>

          <button
            onClick={onNavigateToAtRisk}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All 27 At-Risk</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table of At-Risk Students */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Average Marks</th>
                <th className="py-3 px-4">Predicted Score</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {atRiskStudents.map((st) => (
                <tr
                  key={st.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Student */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {st.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {st.rollNo} • {st.department.replace('Computer Science & Engineering', 'CSE')}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Attendance */}
                  <td className="py-3 px-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs ${
                          st.attendance < 65
                            ? 'text-rose-600'
                            : st.attendance < 75
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {st.attendance}%
                      </span>
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            st.attendance < 65
                              ? 'bg-rose-500'
                              : st.attendance < 75
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${st.attendance}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Average Marks */}
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {st.internalMarks}%
                  </td>

                  {/* Predicted Score */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">
                      {st.predictedScore}%
                    </span>
                    <span className="ml-1 text-[10px] text-slate-500">
                      (Grade {st.expectedGrade})
                    </span>
                  </td>

                  {/* Risk */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        st.riskLevel === 'HIGH'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          st.riskLevel === 'HIGH' ? 'bg-rose-600' : 'bg-amber-600'
                        }`}
                      />
                      {st.riskLevel === 'HIGH' ? 'High Risk' : 'Medium Risk'}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewStudentDetails(st)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => onNavigateToPredictor(st)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm shadow-indigo-600/20"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Predict</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Quick Action Banner: Run AI Risk Scan */}
      <section className="rounded-2xl p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-950/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shrink-0 border border-white/20">
            <Sparkles className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Simulate or Test Any Student Academic Trajectory
            </h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              Adjust attendance, internal marks, and previous performance with the explainable weighted model.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToPredictor()}
          className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-2"
        >
          <span>Open AI Performance Predictor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
