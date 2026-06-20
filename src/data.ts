/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, Task, ClassSchedule, StudentProfile, DailyActivity } from "./types";

export const initialStudentProfile: StudentProfile = {
  name: "Alex Thorne",
  degreeProgram: "Master's of Research",
  semester: "Autumn Semester",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvdJpGiQ4FQ_7u6bgVWHTQ7WlRJQ-NJuy8Dt8Na1xdzHAJhxhon9V8gBdA92Sk1zuwbbqV3QC-H_KHtq_R36OW1FH9-Yc1Vit-YrKtgXXAtc6dLl5qwWBQlxYu-7D6rL-JJ_XRV1iyVFuDG_7o4lIheF46RpCrKZkswYz3dHiGfBzVczZFH4GxFuxmW9rMNzNbb6CysCvncQxJpxHDsMdsXaZHwV-JZHxPvjjLlYZUc0BogmvMpeEj4PLyQ9u0oaUGk4R0GiZ1vDE",
  dailyGoalHours: 4,
};

export const initialSubjects: Subject[] = [
  {
    id: "sub-1",
    name: "Advanced Econometrics",
    code: "ECON-702",
    color: "#002045",
    credits: 4,
    instructor: "Dr. Silas Vane",
    grade: "A",
    syllabusNotes: "Focuses on time-series analysis, dynamic econometric modeling, and high-frequency financial data estimation and visualization.",
  },
  {
    id: "sub-2",
    name: "Research Methods",
    code: "RES-810",
    color: "#0a6c44",
    credits: 3,
    instructor: "Prof. Eleanor Vance",
    grade: "A-",
    syllabusNotes: "A systematic formulation of abstract and thesis structural guidelines, referencing criteria, literature review syntheses, and peer-to-peer critique.",
  },
  {
    id: "sub-3",
    name: "Academic Writing",
    code: "WRIT-601",
    color: "#63b3ed",
    credits: 2,
    instructor: "Dr. Clara Oswald",
    grade: "B+",
    syllabusNotes: "Prepares research draft manuscripts for formal journal peer review. Emphasizes coherent argumentation flow and precise syntax modeling.",
  },
  {
    id: "sub-4",
    name: "Econometrics",
    code: "ECON-601",
    color: "#003957",
    credits: 4,
    instructor: "Dr. Silas Vane",
    grade: "A",
    syllabusNotes: "Covers standard regression modeling, statistical packages like R and STATA, multivariate hypothesis testing, and heteroskedasticity corrections.",
  }
];

export const initialClasses: ClassSchedule[] = [
  {
    id: "cls-1",
    name: "Advanced Econometrics",
    time: "09:00 AM",
    type: "In Person",
    location: "Building 4, Room 202",
    instructor: "Dr. Silas Vane",
    dayOfWeek: "Monday",
    completed: false,
  },
  {
    id: "cls-2",
    name: "Research Seminar",
    time: "01:30 PM",
    type: "Virtual",
    location: "https://zoom.us/j/example-seminar-link",
    instructor: "Graduate Student Panel",
    dayOfWeek: "Monday",
    completed: false,
  },
  {
    id: "cls-3",
    name: "Peer Review Workshop",
    time: "04:00 PM",
    type: "In Person",
    location: "Library Commons",
    instructor: "Student-led Session",
    dayOfWeek: "Monday",
    completed: true,
  },
  {
    id: "cls-4",
    name: "Thesis Structural Guidance",
    time: "10:00 AM",
    type: "Virtual",
    location: "https://zoom.us/j/example-thesis-guidance",
    instructor: "Prof. Eleanor Vance",
    dayOfWeek: "Wednesday",
    completed: false,
  },
  {
    id: "cls-5",
    name: "Academic Writing Sprint",
    time: "02:00 PM",
    type: "In Person",
    location: "Building 2, Lobby B",
    instructor: "Dr. Clara Oswald",
    dayOfWeek: "Thursday",
    completed: false,
  }
];

export const initialTasks: Task[] = [
  {
    id: "tsk-1",
    title: "Thesis Abstract",
    description: "Submit final revised copy of the thesis abstract summarizing structural methodologies and research questions.",
    type: "Thesis",
    status: "todo",
    dueDate: "2026-10-24",
    dueTime: "11:59 PM",
    subjectName: "Research Methods",
    priority: "high",
    progressPercentage: 90,
  },
  {
    id: "tsk-2",
    title: "Data Analysis Project",
    description: "Apply dynamic forecasting vectors to modern microeconomic cohorts. Submit both R code scripts and summary write-up.",
    type: "Project",
    status: "todo",
    dueDate: "2026-10-28",
    dueTime: "05:00 PM",
    subjectName: "Advanced Econometrics",
    priority: "high",
    progressPercentage: 35,
  },
  {
    id: "tsk-3",
    title: "Weekly Journal Entry",
    description: "Log reflective summary regarding thesis critiques and peer editing workshop outcomes and observations.",
    type: "Reading",
    status: "todo",
    dueDate: "2026-11-01",
    dueTime: "09:00 AM",
    subjectName: "Academic Writing",
    priority: "medium",
    progressPercentage: 10,
  },
  {
    id: "tsk-4",
    title: "Econometrics Reading Assignment",
    description: "Read chapters 4 through 6 of Wooldridge regarding heteroskedasticity and instrumental variable modeling.",
    type: "Reading",
    status: "completed",
    dueDate: "2026-10-22",
    dueTime: "12:00 PM",
    subjectName: "Advanced Econometrics",
    priority: "low",
    progressPercentage: 100,
  },
  {
    id: "tsk-5",
    title: "Formulate Research Questionnaire",
    description: "Draft structural questionnaires and sample constraints for empirical thesis validation chapters.",
    type: "Thesis",
    status: "in_progress",
    dueDate: "2026-11-15",
    dueTime: "11:59 PM",
    subjectName: "Research Methods",
    priority: "high",
    progressPercentage: 60,
  }
];

export const initialWeeklyActivity: { [day: string]: DailyActivity } = {
  Mon: { studyHours: 2.5, researchHours: 1.0 }, // Total 3.5 hrs
  Tue: { studyHours: 1.8, researchHours: 1.4 }, // Total 3.2 hrs
  Wed: { studyHours: 3.2, researchHours: 0.4 }, // Total 3.6 hrs
  Thu: { studyHours: 1.2, researchHours: 1.6 }, // Total 2.8 hrs
  Fri: { studyHours: 2.8, researchHours: 0.6 }, // Total 3.4 hrs
  Sat: { studyHours: 0.4, researchHours: 0.0 }, // Total 0.4 hrs
  Sun: { studyHours: 0.6, researchHours: 0.0 }, // Total 0.6 hrs
};
