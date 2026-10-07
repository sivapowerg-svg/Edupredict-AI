import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  User,
  Settings as SettingsIcon,
  LogOut,
  X
} from 'lucide-react';
import { NotificationItem } from '../types';

interface HeaderProps {
  facultyName?: string;
  notifications: NotificationItem[];
  onOpenSettings: () => void;
  onLogout: () => void;
  onSelectStudentFromNotification?: (studentId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  facultyName = 'Dr. Sarah Jenkins',
  notifications,
  onOpenSettings,
  onLogout,
  onSelectStudentFromNotification
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<NotificationItem[]>(notifications);

  const unreadCount = localNotifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (item.studentId && onSelectStudentFromNotification) {
      onSelectStudentFromNotification(item.studentId);
      setShowNotifications(false);
    }
  };

  // Format today's date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Left: Greeting & Mission */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Good Morning, Faculty <span className="inline-block animate-bounce">👋</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Fall 2026 Term
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor student engagement and identify academic risks early.
          </p>
        </div>

        {/* Right: Date, Notifications, Faculty Profile */}
        <div className="flex items-center gap-2 sm:gap-4 self-end md:self-auto">
          
          {/* Date Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>{formattedDate}</span>
          </div>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notifications Flyout */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 py-1">
                  {localNotifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No notifications right now
                    </div>
                  ) : (
                    localNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                          !notif.read ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {notif.type === 'alert' && (
                            <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {notif.type === 'warning' && (
                            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {notif.type === 'success' && (
                            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {notif.type === 'info' && (
                            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                              <Info className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-slate-400 ml-2 whitespace-nowrap">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Faculty Profile"
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-indigo-500/30"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-none">
                  {facultyName}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Dept. of CSE & AI
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{facultyName}</p>
                  <p className="text-[11px] text-slate-500">faculty@edupredict.ai</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenSettings();
                    }}
                    className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-400" />
                    <span>Faculty Preferences & Model Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
