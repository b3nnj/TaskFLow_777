/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, Bookmark, Target, Laptop, HelpCircle, GraduationCap, CheckCircle } from "lucide-react";
import { StudentProfile } from "../types";

interface SettingsProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
}

export default function SettingsView({ profile, onUpdateProfile }: SettingsProps) {
  const [name, setName] = useState(profile.name);
  const [degreeProgram, setDegreeProgram] = useState(profile.degreeProgram);
  const [semester, setSemester] = useState(profile.semester);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [dailyGoalHours, setDailyGoalHours] = useState(profile.dailyGoalHours);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const scholarAvatars = [
    { name: "Researcher Classic", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvdJpGiQ4FQ_7u6bgVWHTQ7WlRJQ-NJuy8Dt8Na1xdzHAJhxhon9V8gBdA92Sk1zuwbbqV3QC-H_KHtq_R36OW1FH9-Yc1Vit-YrKtgXXAtc6dLl5qwWBQlxYu-7D6rL-JJ_XRV1iyVFuDG_7o4lIheF46RpCrKZkswYz3dHiGfBzVczZFH4GxFuxmW9rMNzNbb6CysCvncQxJpxHDsMdsXaZHwV-JZHxPvjjLlYZUc0BogmvMpeEj4PLyQ9u0oaUGk4R0GiZ1vDE" },
    { name: "Scholarly Lady", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDddjE6zB1XUTeE-EXJO7_PaJxeKllZkmqnVINUvug2DJzLsVMWiEOt6Z-ifVA1q5pEE10Vr1jMdWiPMyAbO-8eWPYyB8IVy-ha2U7-LT9a2pD1nABeA-IPZXATeO5rdIC9szCKQnUM_AgNf61jiKJzWgrEldzcJDRJ7OuVtLXwLqB5jirsmuuGViQNmLj5Ysckgk5sqjgM4HJQK31xpkZbFKeyCG9HXBhUVh3a9gOxrV87dGWaXunYZ8MVkSl-XuH0WDMBamH8r8Y" },
    { name: "Scholar Minimalist", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" },
    { name: "Socrates Slate", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      degreeProgram,
      semester,
      avatarUrl,
      dailyGoalHours
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-primary dark:text-primary-fixed-dim">Profile Settings & Goals</h2>
        <p className="text-sm text-on-surface-variant">Update program attributes, adjust daily study timelines, and configure system presets.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs">
        {saveSuccess && (
          <div className="mb-5 p-3.5 bg-secondary-container text-on-secondary-container rounded-xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Success! Scholar coordinates saved and propagated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main profile edits */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/60 pb-2">
              <User className="w-5 h-5 text-secondary" /> Student Coordinates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Scholar Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Degree / Sub-program</label>
                <input
                  required
                  type="text"
                  value={degreeProgram}
                  onChange={(e) => setDegreeProgram(e.target.value)}
                  className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none focus:border-primary text-on-surface"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Current Semester</label>
                <input
                  required
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Daily Goal hours</label>
                <input
                  required
                  type="number"
                  min={1}
                  max={24}
                  value={dailyGoalHours}
                  onChange={(e) => setDailyGoalHours(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none focus:border-primary text-on-surface"
                />
              </div>
            </div>
          </div>

          {/* Preset avatar select option */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/60 pb-2">
              <GraduationCap className="w-5 h-5 text-secondary" /> Scholar Avatar Portrayal
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {scholarAvatars.map((item, idx) => {
                const isSelected = avatarUrl === item.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(item.url)}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all cursor-pointer bg-surface-container-low
                      ${isSelected 
                        ? "border-primary bg-primary-fixed/20 ring-1 ring-primary/45" 
                        : "border-outline-variant hover:border-primary/50"
                      }
                    `}
                  >
                    <img
                      referrerPolicy="no-referrer"
                      src={item.url}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border border-outline-variant shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = scholarAvatars[0].url;
                      }}
                    />
                    <span className="text-[9.5px] font-bold text-on-surface-variant leading-tight truncate w-full">{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom URL Field */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Custom Image URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/scholar_photo.jpg"
                className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none focus:border-primary text-on-surface font-mono"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-outline-variant/60 flex justify-end gap-2.5">
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-opacity-90 shadow-xs cursor-pointer"
            >
              Save Intellectual Coordinates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
