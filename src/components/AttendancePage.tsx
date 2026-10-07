import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Users,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Download,
  CheckCheck,
  Edit2,
  ChevronDown,
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import { Student } from '../types';
import { ATTENDANCE_TREND_DATA, ATTENDANCE_DISTRIBUTION } from '../data/mockData';

interface AttendancePageProps {
  students: Student[];
  onUpdateAttendance: (studentId: string, status: 'PRESENT' | 'ABSENT') => void;
  onUpdateAttendancePercentage: (studentId: string, newPercentage: number) => void;
  onMarkAllPresent: () => void;
  onSelectStudent: (student: Student) => void;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({
  students,
  onUpdateAttendance,
  onUpdateAttendancePercentage,
  onMarkAllPresent,
  onSelectStudent
}) => {
  // Filter and Control States
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [course, setCourse] = useState('B.Tech CSE');
  const [semester, setSemester] = useState('5');
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [selectedDate, setSelectedDate] = useState('2026-10-06');

  // Search & Filter in Table
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PRESENT' | 'ABSENT' | 'BELOW_75'>('ALL');

  // Editing Percentage Modal or Inline
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(75);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Student List
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'PRESENT') return s.attendanceStatus === 'PRESENT';
      if (statusFilter === 'ABSENT') return s.attendanceStatus === 'ABSENT';
      if (statusFilter === 'BELOW_75') return s.attendance < 75;
      return true;
    });
  }, [students, searchQuery, statusFilter]);

  // Analytics Calculations
  const totalCount = students.length;
  const avgAttendance = Math.round((students.reduce((acc, s) => acc + s.attendance, 0) / totalCount) * 10) / 10;
  const above75Count = students.filter((s) => s.attendance >= 75).length;
  const below75Count = students.filter((s) => s.attendance < 75).length;
  const lowestStudent = [...students].sort((a, b) => a.attendance - b.attendance)[0];

  const handleSaveEdit = (studentId: string) => {
    onUpdateAttendancePercentage(studentId, editValue);
    setEditingStudentId(null);
    showToast('Student attendance record updated.');
  };

  const handleExportCSV = () => {
    const headers = 'Name,Roll No,Department,Semester,Subject,Attendance %,Status,Date\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.name}","${s.rollNo}","${s.department}",${s.semester},"${subject}",${s.attendance}%,"${s.attendanceStatus}","${selectedDate}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate}.csv`;
    a.click();
    showToast('Attendance report exported as CSV.');
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Attendance Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track attendance and identify students who may need support.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              onMarkAllPresent();
              showToast('All roster students marked Present for today.');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>
        </div>
      </div>

      {/* Section 10: ATTENDANCE ANALYTICS SUMMARY CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Average Attendance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Average Attendance</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{avgAttendance}%</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              Institutional Baseline: 75%
            </div>
          </div>
        </div>

        {/* Students Above 75% */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Students Above 75%</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-600">{above75Count}</div>
            <div className="text-xs text-slate-500 mt-1">
              {Math.round((above75Count / totalCount) * 100)}% of cohort in safe standing
            </div>
          </div>
        </div>

        {/* Students Below 75% */}
        <div className="bg-white rounded-2xl p-5 border border-rose-200/90 shadow-xs bg-rose-50/20">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-600">
            <span>Students Below 75%</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-rose-600">{below75Count}</div>
            <div className="text-xs text-rose-600 font-semibold mt-1">
              Require early attendance warning
            </div>
          </div>
        </div>

        {/* Lowest Attendance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Lowest Attendance</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">
              {lowestStudent?.attendance || 48}%
            </div>
            <div className="text-xs text-slate-500 mt-1 truncate">
              {lowestStudent?.name} ({lowestStudent?.rollNo})
            </div>
          </div>
        </div>

      </section>

      {/* Attendance Trend & Distribution Visualizations */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Attendance Trend Line Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Attendance Trend</h3>
              <p className="text-xs text-slate-500">Lecture presence monitored over the last 30 days</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Mean: 82.6%
            </span>
          </div>

          <div className="w-full h-52 mt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
              {/* Threshold 75% guide */}
              {(() => {
                const y75 = 160 - ((75 - 70) / 25) * 140;
                return (
                  <g>
                    <line x1="40" y1={y75} x2="480" y2={y75} stroke="#f43f5e" strokeDasharray="3 3" strokeWidth="1.5" />
                    <text x="485" y={y75 + 3} className="text-[9px] fill-rose-600 font-bold">
                      75% Min
                    </text>
                  </g>
                );
              })()}

              {/* Grid lines */}
              {[70, 75, 80, 85, 90].map((v) => {
                const y = 160 - ((v - 70) / 25) * 140;
                return (
                  <g key={v}>
                    <line x1="40" y1={y} x2="480" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x="32" y={y + 4} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">
                      {v}%
                    </text>
                  </g>
                );
              })}

              {/* Trend points */}
              {(() => {
                const count = ATTENDANCE_TREND_DATA.length;
                const coords = ATTENDANCE_TREND_DATA.map((d, i) => {
                  const x = 50 + (i / (count - 1)) * 410;
                  const y = 160 - ((d.attendance - 70) / 25) * 140;
                  return { x, y, ...d };
                });

                const pathD = coords.reduce(
                  (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
                  ''
                );

                return (
                  <>
                    <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                    {coords.map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r="4.5" className="fill-white stroke-indigo-600 stroke-2" />
                        <text x={pt.x} y="174" textAnchor="middle" className="text-[10px] fill-slate-400 font-medium">
                          {pt.date}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Attendance Distribution Doughnut/Bars */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Attendance Distribution</h3>
              <p className="text-xs text-slate-500">Cohort split across statutory thresholds</p>
            </div>
            <span className="text-xs font-mono text-slate-400">N=248</span>
          </div>

          <div className="space-y-3.5 mt-5">
            {ATTENDANCE_DISTRIBUTION.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </span>
                  <span className="font-mono text-slate-500 font-semibold">
                    {item.count} students ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              15 students are under 60% attendance; university debarment alert initiated.
            </span>
          </div>
        </div>

      </section>

      {/* Top Filter Controls: Department, Course, Semester, Subject, Date */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" /> Class &amp; Session Selectors
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Department */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Select Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Computer Science & Engineering">Computer Science &amp; Eng.</option>
              <option value="Artificial Intelligence & ML">AI &amp; Machine Learning</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Select Course
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="B.Tech CSE">B.Tech CSE</option>
              <option value="M.Tech CSE">M.Tech CSE</option>
              <option value="B.Tech AI">B.Tech AI</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Select Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1">Semester 1</option>
              <option value="3">Semester 3</option>
              <option value="5">Semester 5 (Active)</option>
              <option value="7">Semester 7</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Select Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Data Structures & Algorithms">Data Structures &amp; Algorithms</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Database Systems">Database Systems</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Computer Networks">Computer Networks</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

        </div>
      </section>

      {/* Student Attendance Table Section */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* Table Top Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Field */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or roll..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Filter:</span>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setStatusFilter('PRESENT')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === 'PRESENT'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Present
            </button>
            <button
              onClick={() => setStatusFilter('ABSENT')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === 'ABSENT'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Absent
            </button>
            <button
              onClick={() => setStatusFilter('BELOW_75')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === 'BELOW_75'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Below 75%
            </button>
          </div>

        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-center">Present / Absent</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      st.attendance < 75 ? 'bg-rose-50/15' : ''
                    }`}
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
                          <div className="font-bold text-slate-900">{st.name}</div>
                          <div className="text-[11px] text-slate-400">{st.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Roll Number */}
                    <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                      {st.rollNo}
                    </td>

                    {/* Subject */}
                    <td className="py-3 px-4 text-slate-600">
                      {subject}
                    </td>

                    {/* Present / Absent Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 gap-1">
                        <button
                          onClick={() => {
                            onUpdateAttendance(st.id, 'PRESENT');
                            showToast(`${st.name} marked Present.`);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            st.attendanceStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>
                        <button
                          onClick={() => {
                            onUpdateAttendance(st.id, 'ABSENT');
                            showToast(`${st.name} marked Absent.`);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            st.attendanceStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>
                      </div>
                    </td>

                    {/* Attendance % with Edit trigger */}
                    <td className="py-3 px-4 font-semibold">
                      {editingStudentId === st.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editValue}
                            onChange={(e) => setEditValue(Number(e.target.value))}
                            className="w-16 px-2 py-1 bg-white border border-indigo-400 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveEdit(st.id)}
                            className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                            title="Save percentage"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingStudentId(null)}
                            className="p-1 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 cursor-pointer"
                            title="Cancel"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              st.attendance < 70
                                ? 'text-rose-600'
                                : st.attendance < 75
                                ? 'text-amber-600'
                                : 'text-slate-900'
                            }`}
                          >
                            {st.attendance}%
                          </span>
                          <button
                            onClick={() => {
                              setEditingStudentId(st.id);
                              setEditValue(st.attendance);
                            }}
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded transition-colors cursor-pointer"
                            title="Edit attendance percentage"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {st.attendance >= 75 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Regular
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Shortage (&lt;75%)
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectStudent(st)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Predict Risk</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </section>

    </div>
  );
};
