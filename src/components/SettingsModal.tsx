import React, { useState } from 'react';
import {
  X,
  Settings,
  ShieldCheck,
  Bell,
  Sliders,
  CheckCircle2,
  Save,
  HelpCircle,
  Database
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [attendanceCutoff, setAttendanceCutoff] = useState(75);
  const [highRiskThreshold, setHighRiskThreshold] = useState(65);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Institutional Settings &amp; Model Parameters
            </h3>
            <p className="text-xs text-slate-500">
              Configure attendance cutoffs and predictive risk thresholds
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="py-5 space-y-5 text-xs">
          
          {/* Thresholds */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              Institutional Thresholds
            </h4>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Minimum Attendance Cutoff (%):</span>
                <span className="text-indigo-600 font-bold">{attendanceCutoff}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="85"
                value={attendanceCutoff}
                onChange={(e) => setAttendanceCutoff(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Students dropping below this threshold receive automatic statutory notices.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>High Risk Prediction Score Cutoff (%):</span>
                <span className="text-rose-600 font-bold">{highRiskThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="75"
                value={highRiskThreshold}
                onChange={(e) => setHighRiskThreshold(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Predicted cumulative scores under this level are flagged as High Risk.
              </p>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px] flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-indigo-600" />
              Faculty Alerts
            </h4>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-700 font-semibold">Immediate email alert when student drops &lt; 75%</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded accent-indigo-600 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-700 font-semibold">Weekly executive cohort summary digest</span>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="rounded accent-indigo-600 w-4 h-4"
              />
            </label>
          </div>

          {/* Privacy & Compliance */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>FERPA &amp; Institutional Governance Compliant</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Student predictions are computed server-side without external commercial training exposure.
            </p>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
