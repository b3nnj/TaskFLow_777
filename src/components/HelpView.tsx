/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Command, Keyboard, Lightbulb, GraduationCap, ShieldAlert } from "lucide-react";

export default function HelpView() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the Daily Focus Goal percentage calculate?",
      a: "The percentage represents your total logged hours (Study + Research) relative to your 'Daily Study Goal Hours' (configured in Settings). You can dynamically log hours using the '+ Log Focus Hours' button on the dashboard card to visualize immediate updates."
    },
    {
      q: "How does the academic planner compute GPA?",
      a: "GPAs are calculated using a credit-weighted vector: sum(gradePoints × courseCredits) / sum(courseCredits). In your Subjects list, logging letter grades (A = 4.0, A- = 3.7, B+ = 3.3, etc.) automatically updates this weighted estimation live."
    },
    {
      q: "Can I manage courses and tasks for multiple semesters?",
      a: "Yes! By modifying your profile coordinates in the Settings tab, you can personalize the active catalog semester, corresponding program titles, and adjust classes."
    },
    {
      q: "Is there local persistence for my modified records?",
      a: "Absolutely! The academic planner automatically persists all additions, deletions, toggles, profile adjustments, and study logs directly inside your browser's local state. Your schedule remains saved between browser reloads."
    }
  ];

  const shortcuts = [
    { keys: ["Alt", "D"], desc: "Switch to Dashboard" },
    { keys: ["Alt", "T"], desc: "Switch to Tasks Board" },
    { keys: ["Alt", "S"], desc: "Switch to Schedule" },
    { keys: ["Alt", "B"], desc: "Switch to Subjects Portfolio" },
    { keys: ["Alt", "A"], desc: "Open Add Task Modal" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-primary dark:text-primary-fixed-dim">Academic Planner Reference Deck</h2>
        <p className="text-sm text-on-surface-variant">FAQ collections, keyboard acceleration maps, and intellectual discipline guidelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FAQs list (Span 2) */}
        <div className="col-span-1 md:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/60 pb-2">
            <HelpCircle className="w-5 h-5 text-secondary" /> Frequently Asked Questions
          </h3>

          <div className="divide-y divide-outline-variant/50">
            {faqs.map((faq, idx) => {
              const isOpen = openFAQ === idx;
              return (
                <div key={idx} className="py-3">
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : idx)}
                    className="w-full text-left flex justify-between items-center text-xs font-bold text-on-surface hover:text-primary cursor-pointer outline-none"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
                  </button>
                  {isOpen && (
                    <p className="text-[11px] text-on-surface-variant/90 leading-relaxed font-sans mt-2 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40 animate-fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Shortcuts list (Span 1) */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/60 pb-2">
              <Keyboard className="w-5 h-5 text-secondary" /> Hotkeys
            </h3>

            <div className="space-y-3">
              {shortcuts.map((sc, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">{sc.desc}</span>
                  <div className="flex gap-1">
                    {sc.keys.map((k, kIdx) => (
                      <kbd key={kIdx} className="bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant font-mono text-[10px] font-bold">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-primary/5 rounded-xl p-3 border border-primary/10 flex items-start gap-2 max-w-xs">
            <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              <strong>Study advice:</strong> Take 5-minute cognitive rest blocks for every 25 minutes of high-intensity study nodes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
