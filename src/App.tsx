/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Login } from './components/Login';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AttendancePage } from './components/AttendancePage';
import { PerformancePredictorPage } from './components/PerformancePredictorPage';
import { StudentsPage } from './components/StudentsPage';
import { AtRiskPage } from './components/AtRiskPage';
import { RecommendationsPage } from './components/RecommendationsPage';
import { StudentDetailModal } from './components/StudentDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { INITIAL_STUDENTS, NOTIFICATIONS_DATA } from './data/mockData';
import { Student, PredictionResult, NotificationItem } from './types';
import { determineRiskLevel, calculateGrade } from './utils/prediction';

export default function App() {
  // Application starts at LOGIN PAGE as strictly required by prompt
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [facultyEmail, setFacultyEmail] = useState<string>('faculty@edupredict.ai');

  // Navigation state
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Shared reactive state
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS_DATA);
  const [selectedStudentForPredictor, setSelectedStudentForPredictor] = useState<Student | null>(null);
  const [detailModalStudent, setDetailModalStudent] = useState<Student | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Authentication Handlers
  const handleLoginSuccess = (email: string) => {
    setFacultyEmail(email);
    setIsLoggedIn(true);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentTab('dashboard');
  };

  // Student Attendance updates
  const handleUpdateAttendance = (studentId: string, status: 'PRESENT' | 'ABSENT') => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        // Minor incremental shift on attendance
        const delta = status === 'PRESENT' ? 0.5 : -1.0;
        const newAtt = Math.min(100, Math.max(0, Math.round((s.attendance + delta) * 10) / 10));
        const newRisk = determineRiskLevel(s.predictedScore, newAtt);
        return {
          ...s,
          attendanceStatus: status,
          attendance: newAtt,
          riskLevel: newRisk
        };
      })
    );
  };

  const handleUpdateAttendancePercentage = (studentId: string, newPercentage: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const validPercentage = Math.min(100, Math.max(0, newPercentage));
        const newRisk = determineRiskLevel(s.predictedScore, validPercentage);
        return {
          ...s,
          attendance: validPercentage,
          riskLevel: newRisk
        };
      })
    );
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        attendanceStatus: 'PRESENT'
      }))
    );
  };

  // Sync prediction result into student records
  const handleSavePredictionToStudent = (studentId: string, result: PredictionResult) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          predictedScore: result.predictedScore,
          expectedGrade: result.expectedGrade,
          riskLevel: result.riskLevel,
          attendance: result.inputScores.attendance,
          internalMarks: result.inputScores.internalMarks,
          assignmentScore: result.inputScores.assignmentScore,
          participation: result.inputScores.participation,
          previousScore: result.inputScores.previousScore
        };
      })
    );
  };

  // Navigation helpers
  const handleNavigateToPredictor = (student?: Student) => {
    if (student) {
      setSelectedStudentForPredictor(student);
    }
    setCurrentTab('predictor');
  };

  const handleSelectStudentFromNotification = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setDetailModalStudent(student);
    }
  };

  const atRiskCount = students.filter(
    (s) => s.riskLevel === 'HIGH' || s.riskLevel === 'MEDIUM' || s.attendance < 75
  ).length;

  // 1. If not logged in, render the premium Login Page
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Render Main Application Workspace with Sidebar and Header
  return (
    <div className="min-h-screen bg-slate-50 flex flex-row font-sans text-slate-900">
      
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        atRiskCount={atRiskCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        
        {/* Top Header */}
        <Header
          facultyName="Dr. Sarah Jenkins"
          notifications={notifications}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
          onSelectStudentFromNotification={handleSelectStudentFromNotification}
        />

        {/* View Switcher based on currentTab */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              students={students}
              onNavigateToPredictor={handleNavigateToPredictor}
              onNavigateToAttendance={() => setCurrentTab('attendance')}
              onNavigateToAtRisk={() => setCurrentTab('at-risk')}
              onViewStudentDetails={(st) => setDetailModalStudent(st)}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendancePage
              students={students}
              onUpdateAttendance={handleUpdateAttendance}
              onUpdateAttendancePercentage={handleUpdateAttendancePercentage}
              onMarkAllPresent={handleMarkAllPresent}
              onSelectStudent={handleNavigateToPredictor}
            />
          )}

          {currentTab === 'predictor' && (
            <PerformancePredictorPage
              students={students}
              initialSelectedStudent={selectedStudentForPredictor}
              onSavePredictionToStudent={handleSavePredictionToStudent}
            />
          )}

          {currentTab === 'students' && (
            <StudentsPage
              students={students}
              onSelectStudent={handleNavigateToPredictor}
              onViewStudentDetails={(st) => setDetailModalStudent(st)}
            />
          )}

          {currentTab === 'at-risk' && (
            <AtRiskPage
              students={students}
              onSelectStudentForPrediction={handleNavigateToPredictor}
              onViewStudentDetails={(st) => setDetailModalStudent(st)}
            />
          )}

          {currentTab === 'recommendations' && <RecommendationsPage />}
        </main>
      </div>

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={detailModalStudent}
        onClose={() => setDetailModalStudent(null)}
        onOpenPredictor={handleNavigateToPredictor}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
}
