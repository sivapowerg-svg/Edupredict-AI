import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck2,
  Sparkles,
  Users,
  AlertTriangle,
  Lightbulb,
  Settings,
  LogOut,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'attendance'
  | 'predictor'
  | 'students'
  | 'at-risk'
  | 'recommendations';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  atRiskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  onLogout,
  atRiskCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Overview & metrics'
    },
    {
      id: 'attendance' as NavTab,
      label: 'Attendance',
      icon: CalendarCheck2,
      badge: null,
      description: 'Daily tracking & roll'
    },
    {
      id: 'predictor' as NavTab,
      label: 'Performance Predictor',
      icon: Sparkles,
      badge: 'AI Powered',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      description: 'Weighted estimation'
    },
    {
      id: 'students' as NavTab,
      label: 'Students',
      icon: Users,
      badge: null,
      description: 'Active cohort roster'
    },
    {
      id: 'at-risk' as NavTab,
      label: 'At-Risk Students',
      icon: AlertTriangle,
      badge: atRiskCount > 0 ? `${atRiskCount}` : null,
      badgeColor: 'bg-rose-100 text-rose-700 font-bold',
      description: 'Intervention queue'
    },
    {
      id: 'recommendations' as NavTab,
      label: 'Recommendations',
      icon: Lightbulb,
      badge: null,
      description: 'Faculty playbooks'
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between select-none h-screen sticky top-0 z-40">
      
      {/* Top Section: Brand & Nav */}
      <div className="flex flex-col h-full overflow-hidden">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                EduPredict <span className="text-indigo-400 font-bold">AI</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium tracking-wide">
                Predict • Prevent • Empower
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`ml-2 text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Model Status Card */}
        <div className="px-3 py-2">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Model Active
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-950" />
            </div>
            <p className="text-[11px] font-medium text-slate-200 mt-1">
              EduPredict Core 3.8
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
              30/30/15/10/15 weighted predictive model configured
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Section: Settings & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-1 bg-slate-950/40">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>System Settings</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};
