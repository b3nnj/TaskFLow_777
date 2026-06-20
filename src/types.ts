/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string; // Tailwind color name or hex
  credits: number;
  instructor: string;
  grade?: string;
  syllabusNotes?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: "Assignment" | "Exam" | "Project" | "Reading" | "Thesis";
  status: "todo" | "in_progress" | "completed";
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  subjectName: string;
  priority: "low" | "medium" | "high";
  progressPercentage?: number; // for projects or thesis
}

export interface ClassSchedule {
  id: string;
  name: string;
  time: string; // e.g. "09:00 AM"
  type: "In Person" | "Virtual" | "Hybrid";
  location: string;
  instructor: string;
  dayOfWeek: string; // "Monday", "Tuesday", etc.
  completed: boolean;
}

export interface DailyActivity {
  studyHours: number;
  researchHours: number;
}

export interface StudentProfile {
  name: string;
  degreeProgram: string;
  semester: string;
  avatarUrl: string;
  dailyGoalHours: number;
}
