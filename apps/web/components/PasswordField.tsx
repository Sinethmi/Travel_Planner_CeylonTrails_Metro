'use client';

import { useState, useMemo } from 'react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';

export interface PasswordRules {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
}

export function evaluatePassword(pw: string): PasswordRules {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /\d/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
}

export function passwordScore(r: PasswordRules): number {
  return [r.length, r.upper, r.lower, r.number, r.special].filter(Boolean).length;
}

export function isPasswordStrong(pw: string): boolean {
  const r = evaluatePassword(pw);
  return r.length && r.upper && r.lower && r.number;
}

export default function PasswordField({
  value,
  onChange,
  showStrength = false,
  placeholder = '••••••••',
  autoComplete = 'current-password',
  label = 'Password',
  required = true,
  minLength = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  showStrength?: boolean;
  placeholder?: string;
  autoComplete?: string;
  label?: string;
  required?: boolean;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  const rules = useMemo(() => evaluatePassword(value), [value]);
  const score = passwordScore(rules);
  const strengthLabel =
    score <= 1 ? 'Very weak' : score === 2 ? 'Weak' : score === 3 ? 'Fair' : score === 4 ? 'Strong' : 'Excellent';
  const strengthColor =
    score <= 1
      ? 'bg-red-500'
      : score === 2
      ? 'bg-orange-500'
      : score === 3
      ? 'bg-yellow-500'
      : score === 4
      ? 'bg-lime-500'
      : 'bg-emerald-500';
  const strengthTextColor =
    score <= 1
      ? 'text-red-600 dark:text-red-400'
      : score === 2
      ? 'text-orange-600 dark:text-orange-400'
      : score === 3
      ? 'text-yellow-600 dark:text-yellow-400'
      : score === 4
      ? 'text-lime-600 dark:text-lime-400'
      : 'text-emerald-600 dark:text-emerald-400';

  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          type={visible ? 'text' : 'password'}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="input pl-10 pr-11"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="mt-3 space-y-2">
          {/* Strength bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`flex-1 transition-colors ${
                    i <= score ? strengthColor : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
            <span className={`text-xs font-medium w-20 text-right ${strengthTextColor}`}>
              {strengthLabel}
            </span>
          </div>

          {/* Rule checklist */}
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <Rule ok={rules.length} text="At least 8 characters" />
            <Rule ok={rules.upper} text="One uppercase (A–Z)" />
            <Rule ok={rules.lower} text="One lowercase (a–z)" />
            <Rule ok={rules.number} text="One number (0–9)" />
            <Rule ok={rules.special} text="One symbol (!@#…)" />
          </ul>
        </div>
      )}
    </div>
  );
}

function Rule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li
      className={`flex items-center gap-1.5 ${
        ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
      }`}
    >
      {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      <span>{text}</span>
    </li>
  );
}
