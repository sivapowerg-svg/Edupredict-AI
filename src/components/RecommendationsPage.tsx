import React, { useState } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  Calendar,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  Download,
  Flame,
  ShieldCheck,
  Award
} from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<string>('attendance-recovery');

  const playbooks = [
    {
      id: 'attendance-recovery',
      title: 'Attendance Shortage Recovery Playbook',
      subtitle: 'For students below the mandatory 75% threshold',
      category: 'Attendance Risk',
      color: 'border-rose-200 bg-rose-50/20 text-rose-700',
      tag: 'Critical Priority',
      steps: [
        {
          step: 1,
          name: 'Calculation of Required Class Trajectory',
          desc: 'Determine the exact mathematical number of future consecutive lecture sessions needed using formula: (0.75 × Total - Attended) / 0.25.'
        },
        {
          step: 2,
          name: 'Mandatory Advisor-Student Compact',
          desc: 'Sign a formal learning agreement outlining expected daily attendance, medical verification protocols, and bi-weekly advisory reviews.'
        },
        {
          step: 3,
          name: 'Micro-Check-In Accountability Buddy',
          desc: 'Pair the student with a high-attendance peer study partner to encourage timely morning lecture arrivals.'
        },
        {
          step: 4,
          name: 'Modular Supplementary Lab Makeup',
          desc: 'Permit attendance credits for completed weekend lab remedial modules to offset missed practical hours.'
        }
      ]
    },
    {
      id: 'remedial-academics',
      title: 'Targeted Remedial Problem-Solving Playbook',
      subtitle: 'For students scoring below 65% in continuous internal assessments',
      category: 'Academic Risk',
      color: 'border-amber-200 bg-amber-50/20 text-amber-700',
      tag: 'High Priority',
      steps: [
        {
          step: 1,
          name: 'Deficit Concept Diagnosis',
          desc: 'Isolate specific curriculum units (e.g., Recursion, Dynamic Programming) where internal examination marks were surrendered.'
        },
        {
          step: 2,
          name: 'Scaffolded Problem Worksheets',
          desc: 'Provide graded practice problems with progressive hints rather than open-ended monolithic tests.'
        },
        {
          step: 3,
          name: 'Teaching Assistant Guided Office Hours',
          desc: 'Enroll student in dedicated 45-minute small-group recitations conducted by graduate TAs.'
        },
        {
          step: 4,
          name: 'Re-Assessment for Mastery Credit',
          desc: 'Allow an alternative makeup test to demonstrate concept mastery and restore grade morale.'
        }
      ]
    },
    {
      id: 'assignment-completion',
      title: 'Assignment Scaffolding & Submission Playbook',
      subtitle: 'For students struggling with deadline adherence and lab work',
      category: 'Workflow Risk',
      color: 'border-blue-200 bg-blue-50/20 text-blue-700',
      tag: 'Medium Priority',
      steps: [
        {
          step: 1,
          name: 'Deconstruction into Modular Milestones',
          desc: 'Break large semester programming projects into 3-phase intermediate checkpoints with rubric feedback.'
        },
        {
          step: 2,
          name: 'Early Automated Submission Checks',
          desc: 'Encourage early pipeline test runs to catch fatal syntax or logic errors 48 hours before cutoff.'
        },
        {
          step: 3,
          name: 'Peer Code Review Circles',
          desc: 'Implement reciprocal review sessions where students test and give feedback on peer repository branches.'
        }
      ]
    },
    {
      id: 'honors-leadership',
      title: 'Honors Track & Peer Mentorship Playbook',
      subtitle: 'For consistent high-performing scholars (>85% Predicted Score)',
      category: 'Excellence Acceleration',
      color: 'border-emerald-200 bg-emerald-50/20 text-emerald-700',
      tag: 'Growth Opportunity',
      steps: [
        {
          step: 1,
          name: 'Undergraduate Research Opportunities (UROP)',
          desc: 'Direct student toward faculty-sponsored research projects or departmental conference paper submissions.'
        },
        {
          step: 2,
          name: 'Peer Tutoring Fellowship',
          desc: 'Assign leadership role guiding junior cohorts, reinforcing deep conceptual articulation.'
        },
        {
          step: 3,
          name: 'Competitive Coding & Hackathon Sponsorship',
          desc: 'Provide departmental sponsorship for national and global collegiate technology challenges.'
        }
      ]
    }
  ];

  const currentPlaybook = playbooks.find((p) => p.id === selectedPlaybook) || playbooks[0];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
            <span>Institutional Pedagogical Playbooks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalized Academic Recommendations &amp; Guidance
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Evidence-backed intervention frameworks designed for faculty advisors and department chairs.
          </p>
        </div>
      </div>

      {/* Playbook Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {playbooks.map((p) => {
          const isSelected = selectedPlaybook === p.id;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedPlaybook(p.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.color}`}>
                  {p.tag}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-3">{p.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{p.subtitle}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>{p.steps.length} Key Stages</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Playbook Deep Dive Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{currentPlaybook.title}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentPlaybook.color}`}>
                {currentPlaybook.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{currentPlaybook.subtitle}</p>
          </div>
        </div>

        {/* Step-by-Step Roadmap */}
        <div className="space-y-4">
          {currentPlaybook.steps.map((st) => (
            <div
              key={st.step}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm shadow-indigo-600/30">
                {st.step}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">{st.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Faculty Advice Note */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-900 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold">Faculty Advisory Protocol:</span> Always document intervention milestones in the student academic file to preserve compliance logs for institutional review boards.
          </p>
        </div>
      </div>

    </div>
  );
};
