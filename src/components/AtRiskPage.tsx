import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  Mail,
  Calendar,
  CheckCircle2,
  Sparkles,
  Phone,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  MessageSquare,
  X
} from 'lucide-react';
import { Student } from '../types';

interface AtRiskPageProps {
  students: Student[];
  onSelectStudentForPrediction: (student: Student) => void;
  onViewStudentDetails: (student: Student) => void;
}

export const AtRiskPage: React.FC<AtRiskPageProps> = ({
  students,
  onSelectStudentForPrediction,
  onViewStudentDetails
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CRITICAL' | 'ATTENDANCE_DEFICIT' | 'ACADEMIC_DEFICIT'>('ALL');
  const [contactModalStudent, setContactModalStudent] = useState<Student | null>(null);
  const [noticeSent, setNoticeSent] = useState(false);

  const atRiskList = students.filter(
    (s) => s.riskLevel === 'HIGH' || s.riskLevel === 'MEDIUM' || s.attendance < 75
  );

  const filtered = atRiskList.filter((s) => {
    if (selectedCategory === 'CRITICAL') return s.riskLevel === 'HIGH';
    if (selectedCategory === 'ATTENDANCE_DEFICIT') return s.attendance < 75;
    if (selectedCategory === 'ACADEMIC_DEFICIT') return s.internalMarks < 65;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-2">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Active Intervention Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            At-Risk Student Identification &amp; Care
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Proactively connect with students exhibiting attendance deficits or internal exam vulnerability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-2xl border border-rose-200 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              {atRiskList.length}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Total Flagged</div>
              <div className="text-[10px] text-rose-600 font-semibold">Priority Action Queue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Flagged ({atRiskList.length})
        </button>
        <button
          onClick={() => setSelectedCategory('CRITICAL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
            selectedCategory === 'CRITICAL'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>Critical High Risk ({atRiskList.filter((s) => s.riskLevel === 'HIGH').length})</span>
        </button>
        <button
          onClick={() => setSelectedCategory('ATTENDANCE_DEFICIT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            selectedCategory === 'ATTENDANCE_DEFICIT'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Attendance Below 75% ({atRiskList.filter((s) => s.attendance < 75).length})
        </button>
        <button
          onClick={() => setSelectedCategory('ACADEMIC_DEFICIT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            selectedCategory === 'ACADEMIC_DEFICIT'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Internal Exam Deficit &lt;65% ({atRiskList.filter((s) => s.internalMarks < 65).length})
        </button>
      </div>

      {/* Grid of At-Risk Student Intervention Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((st) => (
          <div
            key={st.id}
            className="bg-white rounded-2xl border border-slate-200/90 hover:border-rose-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{st.name}</h3>
                    <p className="text-xs font-mono text-slate-500">{st.rollNo}</p>
                    <p className="text-[10px] text-slate-400">{st.department.replace('Computer Science & Engineering', 'CSE')}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    st.riskLevel === 'HIGH'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}
                >
                  {st.riskLevel} RISK
                </span>
              </div>

              {/* Metrics strip */}
              <div className="grid grid-cols-3 gap-2 py-3.5 my-3.5 border-y border-slate-100 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Attendance</div>
                  <div
                    className={`text-sm font-extrabold mt-0.5 ${
                      st.attendance < 75 ? 'text-rose-600' : 'text-slate-800'
                    }`}
                  >
                    {st.attendance}%
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Internal</div>
                  <div className="text-sm font-extrabold text-slate-800 mt-0.5">
                    {st.internalMarks}%
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Predicted</div>
                  <div className="text-sm font-extrabold text-indigo-600 mt-0.5">
                    {st.predictedScore}%
                  </div>
                </div>
              </div>

              {/* Vulnerability insight */}
              <div className="text-xs text-slate-600 space-y-1">
                {st.attendance < 75 && (
                  <p className="text-rose-600 font-semibold flex items-center gap-1 text-[11px]">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    Attendance deficit: {75 - st.attendance}% below cutoff
                  </p>
                )}
                {st.notes && (
                  <p className="text-slate-500 text-[11px] italic bg-slate-50 p-2 rounded-lg">
                    "{st.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setContactModalStudent(st);
                  setNoticeSent(false);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Notify</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onViewStudentDetails(st)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Details
                </button>
                <button
                  onClick={() => onSelectStudentForPrediction(st)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Predict</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Parent / Student Contact Modal */}
      {contactModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setContactModalStudent(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Send Institutional Early Warning Notice
                </h3>
                <p className="text-xs text-slate-500">
                  For {contactModalStudent.name} ({contactModalStudent.rollNo})
                </p>
              </div>
            </div>

            {noticeSent ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-slate-900">
                  Advisory Notification Successfully Dispatched
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Copy sent to student email (<span className="font-mono text-slate-700">{contactModalStudent.email}</span>) and parent advisor (<span className="font-mono text-slate-700">{contactModalStudent.parentEmail || 'guardian@home.com'}</span>).
                </p>
                <button
                  onClick={() => setContactModalStudent(null)}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="py-4 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Template:
                  </label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium">
                    <option>Mandatory Attendance Debarment Warning (&lt;75%)</option>
                    <option>Academic Remedial Tutoring Invitation</option>
                    <option>Faculty-Student 1-on-1 Consultation Request</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-slate-600 font-mono text-[11px] leading-relaxed">
                  <p>Dear Student and Guardian,</p>
                  <p>
                    This is an official academic notice from the Department of Computer Science &amp; Engineering regarding {contactModalStudent.name}'s attendance ({contactModalStudent.attendance}%) and mid-term standing ({contactModalStudent.internalMarks}%).
                  </p>
                  <p>
                    Please schedule a review session with Dr. Sarah Jenkins within 5 academic working days.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setContactModalStudent(null)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setNoticeSent(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xs cursor-pointer"
                  >
                    Send Official Alert
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
