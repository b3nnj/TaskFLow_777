/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Bookmark, 
  Award, 
  Layers, 
  Users, 
  Notebook, 
  X,
  FileSpreadsheet
} from "lucide-react";
import { Subject } from "../types";

interface SubjectsViewProps {
  subjects: Subject[];
  onAddSubject: (newSubject: Subject) => void;
  onDeleteSubject: (id: string) => void;
}

export default function SubjectsView({
  subjects,
  onAddSubject,
  onDeleteSubject,
}: SubjectsViewProps) {
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  
  // Custom subject creation fields
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [instructor, setInstructor] = useState("");
  const [credits, setCredits] = useState(3);
  const [grade, setGrade] = useState("A");
  const [syllabusNotes, setSyllabusNotes] = useState("");

  // Grade point mapping for dynamic Weighted GPA Calculations
  const gradePoints: { [g: string]: number } = {
    "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "F": 0.0
  };

  const calculateWeightedGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(sub => {
      if (sub.grade && gradePoints[sub.grade] !== undefined) {
        totalPoints += gradePoints[sub.grade] * sub.credits;
        totalCredits += sub.credits;
      }
    });

    if (totalCredits === 0) return 0.0;
    return parseFloat((totalPoints / totalCredits).toFixed(2));
  };

  const calculateTotalCredits = () => {
    return subjects.reduce((sum, s) => sum + s.credits, 0);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !instructor) return;

    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      name,
      code,
      color: "#002045", // Default Scholar Blue
      credits,
      instructor,
      grade,
      syllabusNotes
    };

    onAddSubject(newSubject);
    setShowAddSubjectModal(false);

    // Reset Form
    setName("");
    setCode("");
    setInstructor("");
    setSyllabusNotes("");
    setCredits(3);
    setGrade("A");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-primary dark:text-primary-fixed-dim">Academic Courses & Curriculum</h2>
          <p className="text-sm text-on-surface-variant">Review credit weights, grade point averages, and curriculum syllabuses.</p>
        </div>

        <button
          onClick={() => setShowAddSubjectModal(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-opacity-95 shadow-xs shrink-0 self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Enroll New Subject
        </button>
      </div>

      {/* Overview Stats section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Courses */}
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-primary-fixed text-on-primary-fixed rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Enrolled Subjects</p>
            <p className="font-serif text-2xl font-bold text-primary dark:text-primary-fixed-dim mt-0.5">{subjects.length}</p>
          </div>
        </div>

        {/* Total Credits */}
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Semester Credits</p>
            <p className="font-serif text-2xl font-bold text-primary dark:text-primary-fixed-dim mt-0.5">{calculateTotalCredits()} Credits</p>
          </div>
        </div>

        {/* GPA Tracker */}
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-tertiary-fixed text-on-tertiary-fixed rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Weighted GPA Indicator</p>
            <p className="font-serif text-2xl font-bold text-primary mt-0.5">{calculateWeightedGPA()} / 4.0</p>
          </div>
        </div>
      </div>

      {/* Main Subjects Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-primary/25 transition-all group"
          >
            <div>
              {/* Card Title & Code */}
              <div className="flex justify-between items-start gap-2 border-b border-outline-variant/60 pb-3 mb-4">
                <div>
                  <span className="font-mono text-xs text-on-surface-variant font-medium bg-surface-container-low px-2 py-0.5 rounded">
                    {sub.code}
                  </span>
                  <h3 className="font-serif text-[18px] font-bold text-primary mt-1.5">{sub.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-secondary-container text-on-secondary-container font-sans font-bold px-2.5 py-0.5 rounded-full">
                    {sub.credits} Credits
                  </span>
                  {sub.grade && (
                    <span className="text-xs bg-primary-fixed text-on-primary-fixed font-sans font-extrabold px-2.5 py-0.5 rounded-full" title="Current Grade">
                      {sub.grade}
                    </span>
                  )}
                </div>
              </div>

              {/* Syllabus and Instructors */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Users className="w-4 h-4 text-outline" />
                  <span>Instructor: <strong className="text-on-surface font-semibold">{sub.instructor}</strong></span>
                </div>
                
                {sub.syllabusNotes && (
                  <div className="bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/50 relative overflow-hidden">
                    <span className="absolute top-2.5 right-3">
                      <Notebook className="w-4.5 h-4.5 text-on-surface-variant/35" />
                    </span>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Curriculum Abstract</p>
                    <p className="text-[11px] text-on-surface-variant/90 leading-relaxed font-sans">{sub.syllabusNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Trash option */}
            <div className="mt-5 pt-3.5 border-t border-outline-variant/60 flex justify-end">
              <button
                onClick={() => onDeleteSubject(sub.id)}
                className="text-on-surface-variant hover:text-error p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                title="De-enroll Course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Subject Modal Form */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-outline-variant">
              <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-secondary" /> Register Course Program
              </h3>
              <button 
                onClick={() => setShowAddSubjectModal(false)}
                className="p-1 rounded hover:bg-surface-container-high cursor-pointer text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Course Title</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Econometric Forecasting"
                  className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Course Code</label>
                  <input
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. ECON-802"
                    className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Credits Weight</label>
                  <select
                    value={credits}
                    onChange={(e) => setCredits(parseInt(e.target.value))}
                    className="w-full p-2 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold"
                  >
                    <option value={1}>1 Credit</option>
                    <option value={2}>2 Credits</option>
                    <option value={3}>3 Credits</option>
                    <option value={4}>4 Credits</option>
                    <option value={5}>5 Credits</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Lead Instructor</label>
                  <input
                    required
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="e.g. Dr. Silas Vane"
                    className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Interim Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full p-2 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold"
                  >
                    <option value="A">A (Excellent / 4.0)</option>
                    <option value="A-">A- (3.7)</option>
                    <option value="B+">B+ (3.3)</option>
                    <option value="B">B (3.0)</option>
                    <option value="B-">B- (2.7)</option>
                    <option value="C+">C+ (2.3)</option>
                    <option value="C">C (Average / 2.0)</option>
                    <option value="F">F (Fail / 0.0)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Syllabus Abstract / Overview</label>
                <textarea
                  value={syllabusNotes}
                  onChange={(e) => setSyllabusNotes(e.target.value)}
                  placeholder="Provide research guidelines, weekly themes, exam parameters..."
                  rows={3}
                  className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none resize-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 text-xs text-on-surface-variant font-semibold hover:bg-surface-container-high rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white font-semibold text-xs rounded-xl hover:bg-opacity-90 cursor-pointer shadow-xs"
                >
                  Confirm Enrolment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
