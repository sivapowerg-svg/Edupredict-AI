import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Eye,
  GraduationCap,
  Download,
  AlertTriangle,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { Student } from '../types';

interface StudentsPageProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onViewStudentDetails: (student: Student) => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({
  students,
  onSelectStudent,
  onViewStudentDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'attendance' | 'predicted' | 'risk'>('risk');

  const filtered = useMemo(() => {
    return students
      .filter((s) => {
        const matchesQuery =
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesQuery) return false;

        if (riskFilter !== 'ALL' && s.riskLevel !== riskFilter) return false;
        if (departmentFilter !== 'ALL' && !s.department.includes(departmentFilter)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'attendance') return a.attendance - b.attendance;
        if (sortBy === 'predicted') return a.predictedScore - b.predictedScore;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        // By risk priority
        const order = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return order[a.riskLevel] - order[b.riskLevel];
      });
  }, [students, searchQuery, riskFilter, departmentFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Roster &amp; Cohort Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse complete student directory, monitor trajectory, and execute early interventions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            {students.length} Enrolled in Active Term
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or roll number..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Risk Level */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">🔴 High Risk</option>
            <option value="MEDIUM">🟠 Medium Risk</option>
            <option value="LOW">🟢 Low Risk</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="risk">Sort by Risk Priority</option>
            <option value="attendance">Sort by Attendance (Asc)</option>
            <option value="predicted">Sort by Predicted Score (Asc)</option>
            <option value="name">Sort by Name (A-Z)</option>
          </select>
        </div>

      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4">Internal Marks</th>
                <th className="py-3.5 px-4">Predicted Score</th>
                <th className="py-3.5 px-4">Expected Grade</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
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

                  {/* Roll No */}
                  <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                    {st.rollNo}
                  </td>

                  {/* Attendance */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          st.attendance < 75 ? 'text-rose-600' : 'text-slate-800'
                        }`}
                      >
                        {st.attendance}%
                      </span>
                      <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            st.attendance < 75 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${st.attendance}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Internal Marks */}
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {st.internalMarks}%
                  </td>

                  {/* Predicted Score */}
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {st.predictedScore}%
                  </td>

                  {/* Expected Grade */}
                  <td className="py-3 px-4">
                    <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                      {st.expectedGrade}
                    </span>
                  </td>

                  {/* Risk Level */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        st.riskLevel === 'HIGH'
                          ? 'bg-rose-100 text-rose-700'
                          : st.riskLevel === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          st.riskLevel === 'HIGH'
                            ? 'bg-rose-600'
                            : st.riskLevel === 'MEDIUM'
                            ? 'bg-amber-600'
                            : 'bg-emerald-600'
                        }`}
                      />
                      {st.riskLevel}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewStudentDetails(st)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="View profile & metrics"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSelectStudent(st)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
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
      </div>

    </div>
  );
};
