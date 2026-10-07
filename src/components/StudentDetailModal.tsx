import React from 'react';
import {
  X,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
  CalendarCheck2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { Student } from '../types';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onOpenPredictor: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onOpenPredictor
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 text-slate-900 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Student Banner */}
        <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  student.riskLevel === 'HIGH'
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : student.riskLevel === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {student.riskLevel} RISK
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Roll No: {student.rollNo} • {student.course} (Sem {student.semester})
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{student.department}</p>
          </div>
        </div>

        {/* Academic Telemetry Grid */}
        <div className="py-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Current Academic &amp; Attendance Standing
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Attendance</span>
              <div
                className={`text-xl font-black mt-0.5 ${
                  student.attendance < 75 ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {student.attendance}%
              </div>
              <span className="text-[10px] text-slate-400">Cutoff: 75%</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Internal Marks</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {student.internalMarks}%
              </div>
              <span className="text-[10px] text-slate-400">Exam testing</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Assignments</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {student.assignmentScore}%
              </div>
              <span className="text-[10px] text-slate-400">Lab projects</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Participation</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {student.participation}%
              </div>
              <span className="text-[10px] text-slate-400">Class interaction</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Prev. Semester</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {student.previousScore}%
              </div>
              <span className="text-[10px] text-slate-400">Historical baseline</span>
            </div>

            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Predicted Score</span>
              <div className="text-xl font-black text-indigo-700 mt-0.5">
                {student.predictedScore}%
              </div>
              <span className="text-[10px] text-indigo-600 font-semibold">
                Grade {student.expectedGrade}
              </span>
            </div>
          </div>

          {/* Attendance Shortage Warning */}
          {student.attendance < 75 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                Attendance ({student.attendance}%) is under the statutory requirement of 75%. Student is at risk of exam debarment.
              </span>
            </div>
          )}

          {/* Contact Details */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Communication &amp; Guardian Records
            </h5>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Student Email:
              </span>
              <span className="font-mono text-slate-800">{student.email}</span>
            </div>
            {student.parentEmail && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Guardian Email:
                </span>
                <span className="font-mono text-slate-800">{student.parentEmail}</span>
              </div>
            )}
            {student.phone && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact Phone:
                </span>
                <span className="font-mono text-slate-800">{student.phone}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {student.notes && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Faculty Observation Log:
              </span>
              <p className="text-slate-700 italic">"{student.notes}"</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenPredictor(student);
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Predictor for this Student</span>
          </button>
        </div>

      </div>
    </div>
  );
};
