import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  X
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleFillDemo = () => {
    setEmail('faculty@edupredict.ai');
    setPassword('faculty123');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your academic email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating institutional credentials
    setTimeout(() => {
      setIsLoading(false);
      // Valid if matching demo or any reasonable faculty email
      if (
        (email.toLowerCase() === 'faculty@edupredict.ai' && password === 'faculty123') ||
        (email.includes('@') && password.length >= 6)
      ) {
        onLoginSuccess(email);
      } else {
        setError('Invalid credentials. Use demo: faculty@edupredict.ai / faculty123');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 font-sans">
      {/* Abstract Tech & Academic Grid Patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Floating Ambient Glowing Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-4">
        
        {/* Left Side: Brand Narrative & Value Propositions */}
        <div className="lg:col-span-7 text-white space-y-6 px-2 sm:px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            <span>EduPredict AI • Enterprise Academic Analytics</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
              Turn Student Data Into <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                Student Success.
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              AI-powered attendance and academic performance analytics that helps educators identify students at risk and take action early.
            </p>
          </div>

          {/* Tagline Pill */}
          <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-400">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Predict
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-blue-300">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Prevent
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Empower
            </span>
          </div>

          {/* Quick Metrics Teaser Cards */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xs text-slate-400 font-medium">Risk Detection</div>
              <div className="text-xl font-bold text-white mt-1">94.2%</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                Early indicator
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xs text-slate-400 font-medium">Model Precision</div>
              <div className="text-xl font-bold text-white mt-1">87%</div>
              <div className="text-[11px] text-indigo-300 mt-0.5">Weighted metric</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xs text-slate-400 font-medium">Dropouts Prevented</div>
              <div className="text-xl font-bold text-white mt-1">-38%</div>
              <div className="text-[11px] text-cyan-300 mt-0.5">Institutional avg</div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="lg:col-span-5">
          <div className="w-full bg-slate-900/85 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/50">
            {/* Header in Card */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">EduPredict AI</h2>
                  <p className="text-xs text-slate-400">Faculty Portal Access</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v2.4 Pro
              </span>
            </div>

            {/* Demo Credentials Quick-Load Banner */}
            <div className="mt-5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-2">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-indigo-300">Demo Login:</span>{' '}
                <span className="text-slate-400 font-mono text-[11px]">faculty@edupredict.ai</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-sm"
              >
                Auto-fill
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="faculty@edupredict.ai"
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Faculty Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Notice */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-slate-400 text-xs">
              Protected by Enterprise FERPA & GDPR Compliant Analytics
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotSubmitted(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Reset Faculty Password</h3>
                <p className="text-xs text-slate-400">Institutional recovery service</p>
              </div>
            </div>

            {forgotSubmitted ? (
              <div className="py-4 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <p className="text-sm text-slate-200">
                  Password reset link sent to <span className="font-semibold text-indigo-300">{forgotEmail}</span>.
                </p>
                <p className="text-xs text-slate-400">
                  Check your university mailbox or use the demo password <span className="text-white font-mono">faculty123</span>.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotSubmitted(false);
                  }}
                  className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail.trim()) setForgotSubmitted(true);
                }}
                className="space-y-4"
              >
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your registered institutional email to receive a single-use credential recovery token.
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="faculty@edupredict.ai"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
