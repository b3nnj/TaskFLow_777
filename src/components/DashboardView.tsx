/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Link as LinkIcon, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Plus, 
  AlertTriangle, 
  CheckCircle,
  Play,
  CheckCircle2,
  Bookmark
} from "lucide-react";
import { Task, ClassSchedule, Subject, StudentProfile, DailyActivity } from "../types";

interface DashboardViewProps {
  profile: StudentProfile;
  tasks: Task[];
  classes: ClassSchedule[];
  subjects: Subject[];
  weeklyActivity: { [day: string]: DailyActivity };
  setWeeklyActivity: React.Dispatch<React.SetStateAction<{ [day: string]: DailyActivity }>>;
  onCompleteTask: (id: string) => void;
  onToggleClassCompleted: (id: string) => void;
  onViewSchedule: () => void;
}

export default function DashboardView({
  profile,
  tasks,
  classes,
  subjects,
  weeklyActivity,
  setWeeklyActivity,
  onCompleteTask,
  onToggleClassCompleted,
  onViewSchedule,
}: DashboardViewProps) {
  const [activeDay, setActiveDay] = useState<string>("Monday");
  const [selectedDayChart, setSelectedDayChart] = useState<string>("Fri");
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [logType, setLogType] = useState<"study" | "research">("study");
  const [logHoursAmount, setLogHoursAmount] = useState<number>(0.5);

  // Dynamic Greeting based on time
  const getGreeting = () => {
    const hours = new Date().getHours();
    const shortName = profile.name.split(" ")[0] || "Alex";
    if (hours < 12) return `Good morning, ${shortName}.`;
    if (hours < 18) return `Hello, ${shortName}.`;
    return `Good evening, ${shortName}.`;
  };

  // Get active day classes
  const activeDayClasses = classes.filter(
    (c) => c.dayOfWeek.toLowerCase() === activeDay.toLowerCase()
  );

  // Deadlines count to display (due soon tasks, uncompleted)
  const pendingDeadlines = tasks.filter((t) => t.status !== "completed");
  const urgentDeadlines = pendingDeadlines.filter(t => t.priority === "high");

  // Daily productivity percentage calculation (Friday is the target day shown in the mockup)
  // Let's use the selected day's logged hours in the Goal ring
  const activeChartDayData = weeklyActivity[selectedDayChart] || { studyHours: 0, researchHours: 0 };
  const loggedTodayHours = activeChartDayData.studyHours + activeChartDayData.researchHours;
  const targetDailyGoal = profile.dailyGoalHours;
  const completionPercentage = Math.min(100, Math.round((loggedTodayHours / targetDailyGoal) * 100));

  // Circle SVG math
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius; // 263.89
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    setWeeklyActivity(prev => {
      const current = prev[selectedDayChart] || { studyHours: 0, researchHours: 0 };
      const updated = { ...current };
      if (logType === "study") {
        updated.studyHours = parseFloat((updated.studyHours + logHoursAmount).toFixed(1));
      } else {
        updated.researchHours = parseFloat((updated.researchHours + logHoursAmount).toFixed(1));
      }
      return { ...prev, [selectedDayChart]: updated };
    });
    setShowLogHoursModal(false);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Greeting and Quick Info */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary dark:text-primary-fixed-dim leading-tight">
            {getGreeting()}
          </h2>
          <p className="font-sans text-lg text-on-surface-variant font-normal mt-2">
            You have <span className="font-semibold text-primary/95 dark:text-white">{activeDayClasses.length} class{activeDayClasses.length !== 1 && "es"}</span> and{" "}
            <span className="font-semibold text-error">{pendingDeadlines.filter(t => t.priority === "high").length} high-priority deadline{pendingDeadlines.filter(t => t.priority === "high").length !== 1 && "s"}</span> today.
          </p>
        </div>

        {/* Dynamic Day Selector */}
        <div className="relative inline-flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-2 hover:border-primary/40 transition-all self-start">
          <CalendarIcon className="w-4.5 h-4.5 text-secondary shrink-0" />
          <select
            value={activeDay}
            onChange={(e) => setActiveDay(e.target.value)}
            className="bg-transparent text-xs font-semibold text-on-surface font-sans uppercase tracking-wider outline-none border-none pr-6 cursor-pointer"
          >
            <option value="Monday">Monday (Oct 23)</option>
            <option value="Tuesday">Tuesday (Oct 24)</option>
            <option value="Wednesday">Wednesday (Oct 25)</option>
            <option value="Thursday">Thursday (Oct 26)</option>
            <option value="Friday">Friday (Oct 27)</option>
            <option value="Saturday">Saturday (Oct 28)</option>
            <option value="Sunday">Sunday (Oct 29)</option>
          </select>
        </div>
      </section>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Daily Goal card (Span 4) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs transition-all hover:shadow-md">
          <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-4 self-start">Performance</p>
          <div className="relative w-48 h-48 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                className="text-surface-container stroke-current"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                strokeWidth={strokeWidth}
              />
              {/* Foreground Progressive circle */}
              <circle
                className="text-primary stroke-current transition-all duration-500 ease-out"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-3xl font-bold text-primary dark:text-primary-fixed-dim">
                {completionPercentage}%
              </span>
              <span className="font-sans text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Goal Met
              </span>
            </div>
          </div>

          <h3 className="font-serif text-xl font-bold text-primary dark:text-primary-fixed-dim">
            Daily Focus Goal ({selectedDayChart})
          </h3>
          <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed max-w-xs">
            Log time working on research or classes. Currently at <span className="font-semibold text-on-surface">{loggedTodayHours}h</span> of{" "}
            <span className="font-semibold text-on-surface">{targetDailyGoal}h</span> goal.
          </p>

          <button
            onClick={() => setShowLogHoursModal(true)}
            className="mt-4 px-4.5 py-2.5 bg-primary-fixed text-on-primary-fixed hover:bg-opacity-90 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all outline-none"
          >
            <Plus className="w-4 h-4" /> Log Focus Hours
          </button>
        </div>

        {/* Weekly Productivity Bar Chart (Span 8) */}
        <div id="weekly-productivity-card" className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-xs hover:shadow-md transition-all">
          <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-3">Academic Metrics</p>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-8">
            <div>
              <h3 className="font-serif text-lg font-bold text-on-surface">Weekly Productivity</h3>
              <p className="text-[11px] text-on-surface-variant font-medium">Click columns to manage corresponding day's details</p>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 font-sans text-xs text-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim"></span> Study
              </span>
              <span className="flex items-center gap-1.5 font-sans text-xs text-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim"></span> Research
              </span>
            </div>
          </div>

          {/* Interactive Bar Columns */}
          <div className="flex items-end justify-between h-48 gap-3 sm:gap-4 px-2">
            {Object.keys(weeklyActivity).map((day) => {
              const data = weeklyActivity[day];
              const totalHours = data.studyHours + data.researchHours;
              const isSelected = selectedDayChart === day;

              // Scale heights relative to maximum probable goal (6 hours max for neat graph fitting)
              const maxScale = 5;
              const studyHeightPct = Math.min(90, (data.studyHours / maxScale) * 100);
              const researchHeightPct = Math.min(90, (data.researchHours / maxScale) * 100);

              return (
                <div 
                  key={day} 
                  onClick={() => setSelectedDayChart(day)}
                  className="flex-1 flex flex-col items-center gap-3 cursor-pointer group"
                >
                  <div className="w-full flex flex-col-reverse gap-1 h-32 relative bg-surface-container-low rounded-t-lg overflow-hidden border border-transparent hover:border-outline-variant/50 transition-all">
                    {/* Active study log segment */}
                    <div 
                      style={{ height: `${studyHeightPct}%` }}
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        isSelected 
                          ? "bg-primary" 
                          : "bg-primary-fixed-dim group-hover:bg-primary-fixed"
                      }`}
                    ></div>
                    {/* Active research log segment */}
                    <div 
                      style={{ height: `${researchHeightPct}%` }}
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        isSelected 
                          ? "bg-secondary mb-0.5" 
                          : "bg-secondary-fixed-dim mb-0.5 group-hover:bg-secondary-container"
                      }`}
                    ></div>

                    {/* Pop-on Hours hover tooltip */}
                    <div className="absolute inset-x-0 bottom-full mb-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="bg-primary text-white text-[10px] py-0.5 px-1.5 rounded-md font-sans font-bold shadow-xs">
                        {totalHours}h
                      </span>
                    </div>
                  </div>
                  <span className={`font-sans text-xs ${
                    isSelected ? "text-primary font-bold" : "text-on-surface-variant"
                  }`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today at a Glance timetable (Span 7) */}
        <div id="today-glance-section" className="col-span-12 lg:col-span-7 flex flex-col gap-4">
          <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase -mb-1">Calendar & Seminars</p>
          <div className="flex justify-between items-center bg-transparent">
            <h3 className="font-serif text-lg font-bold text-primary dark:text-primary-fixed-dim">
              Today at a Glance ({activeDay})
            </h3>
            <button
              onClick={onViewSchedule}
              className="text-primary hover:text-opacity-80 font-sans text-xs font-semibold hover:underline cursor-pointer"
            >
              Full Schedule View →
            </button>
          </div>

          <div className="space-y-4">
            {activeDayClasses.length === 0 ? (
              <div className="bg-surface-container bg-opacity-20 border border-dashed border-outline rounded-2xl p-8 text-center">
                <CalendarIcon className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
                <p className="font-sans text-xs font-semibold text-on-surface-variant">No classes scheduled for {activeDay}</p>
                <p className="text-[11px] text-on-surface-variant/70 mt-1">Add classes in the Schedule tab to customize your timetable.</p>
              </div>
            ) : (
              activeDayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className={`border rounded-2xl p-4.5 flex items-start gap-4 transition-all group relative bg-surface-container-lowest
                    ${cls.completed 
                      ? "opacity-60 border-outline-variant/40 hover:opacity-85" 
                      : "border-outline-variant hover:border-primary/20 hover:shadow-xs"
                    }
                  `}
                >
                  {/* Digital Clock Badge */}
                  <div className={`p-3 rounded-xl flex flex-col items-center min-w-[68px] ${
                    cls.completed 
                      ? "bg-surface-container text-on-surface-variant" 
                      : cls.type === "Virtual"
                        ? "bg-tertiary-fixed text-on-tertiary-fixed"
                        : "bg-primary-fixed text-on-primary-fixed"
                  }`}>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider">{cls.time.split(" ")[0]}</span>
                    <span className="font-serif text-lg font-bold leading-none mt-0.5">{cls.time.split(" ")[1]}</span>
                  </div>

                  {/* Main Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-serif text-[17px] font-bold text-on-surface truncate ${cls.completed ? "line-through text-on-surface-variant/80" : ""}`}>
                        {cls.name}
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full font-sans text-[10px] font-bold shrink-0 ${
                        cls.type === "Virtual" 
                          ? "bg-surface-container-high text-on-surface-variant" 
                          : "bg-secondary-container text-on-secondary-container"
                      }`}>
                        {cls.type}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant mt-1.5 truncate">
                      {cls.location.startsWith("http") ? "Zoom Link Attached" : cls.location} • {cls.instructor}
                    </p>
                  </div>

                  {/* Class Interaction buttons */}
                  <div className="flex items-center gap-1.5 self-center">
                    {cls.location.startsWith("http") && (
                      <a
                        href={cls.location}
                        target="_blank"
                        rel="noreferrer"
                        title="Join Virtual Room"
                        className="p-2 bg-surface-container-low hover:bg-surface-container-high rounded-full hover:text-primary transition-colors cursor-pointer"
                      >
                        <LinkIcon className="w-4 h-4 text-tertiary" />
                      </a>
                    )}
                    <button
                      onClick={() => onToggleClassCompleted(cls.id)}
                      title={cls.completed ? "Mark as unattended" : "Mark as attended"}
                      className="p-1.5 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className={`w-5 h-5 ${cls.completed ? "text-secondary fill-secondary/15" : "text-on-surface-variant/50 hover:text-primary"}`} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Deadlines (Span 5) */}
        <div id="upcoming-deadlines-section" className="col-span-12 lg:col-span-4 bg-tertiary-container text-white p-6.5 rounded-2xl flex flex-col gap-5 shadow-xs border border-outline-variant bento-card">
          <p className="text-[10px] font-bold text-sky-400 tracking-widest uppercase -mb-2">Alerts & Directives</p>
          <div className="flex justify-between items-center border-b border-outline-variant pb-4">
            <h3 className="font-serif text-[18px] font-bold text-tertiary-fixed">Upcoming Deadlines</h3>
            <span className="p-1 bg-tertiary-container text-tertiary-fixed rounded-lg">
              <AlertTriangle className="w-4.5 h-4.5" />
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {tasks.filter((t) => t.status !== "completed").slice(0, 3).map((task) => {
              // Custom Due Indicator text or date
              const isTomorrow = task.dueDate === "2026-10-24"; // Mock Tomorrow matches mockup OCT 24
              const dateObj = new Date(task.dueDate);
              const dateStr = isTomorrow 
                ? "Tomorrow" 
                : dateObj.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

              return (
                <div
                  key={task.id}
                  onClick={() => onCompleteTask(task.id)}
                  title="Click to mark completed!"
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-tertiary-container hover:bg-opacity-80 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-tertiary/60 border border-on-tertiary-fixed-variant group-hover:scale-105 transition-transform shrink-0">
                    <Bookmark className="w-4.5 h-4.5 text-tertiary-fixed" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-1.5">
                      <h4 className="font-sans text-xs font-bold text-tertiary-fixed truncate group-hover:underline">
                        {task.title}
                      </h4>
                      <span className={`text-[10px] font-extrabold shrink-0 ${isTomorrow ? "text-error" : "text-white/80"}`}>
                        {dateStr}
                      </span>
                    </div>
                    <p className="text-[9px] text-white/70 font-sans tracking-wide mt-1 uppercase">
                      Due {task.dueTime} • {task.subjectName}
                    </p>
                    <div className="w-full h-1 bg-tertiary/55 rounded-full mt-2 overflow-hidden">
                      <div 
                        style={{ width: `${task.progressPercentage || 10}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          isTomorrow ? "bg-error" : "bg-tertiary-fixed"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}

            {tasks.filter((t) => t.status !== "completed").length === 0 && (
              <div className="text-center py-6">
                <CheckCircle className="w-8 h-8 text-secondary fill-secondary-container/20 mx-auto mb-2" />
                <p className="text-xs text-white/90 font-semibold">Triumph! No uncompleted deadlines</p>
                <p className="text-[10px] text-white/60 mt-1">Enjoy your scholarly research breaks.</p>
              </div>
            )}
          </div>

          {/* Academic Pen Promo Asset illustration from user mockup */}
          <div className="mt-auto border-t border-white/15 pt-5 group overflow-hidden rounded-xl">
            <div className="relative overflow-hidden rounded-xl">
              <img
                referrerPolicy="no-referrer"
                alt="Scholarly vintage academic pen and manuscripts"
                className="w-full h-32 object-cover rounded-xl opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmTgNDQCjLo2T3iGZeVZh2XIHxhGw_vQ0e2IQ6lfQEkDtYf2W9et_9YWRSuhq0nMsGcwWr6xE3-ZmS-haMRdMn3GQEM7iv3UrmppNKYkwGwDv7tiUwGNbP9WtWHypMJtb3q7Hrw93PDNGQ7_1xtu3McBNDms-UjPROsIx1M1lFADjlRtYrfIQfYWM2IrYz9lhGY_Pnll1mME2T_5zyBaL8hJT76-jZA95bELjZSLnRWBouEHkQFmuXitVLeQoAWkEaI7wZQLukopE"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tertiary via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-2.5 left-3.5 right-3.5">
                <p className="font-serif text-[11px] text-tertiary-fixed font-bold leading-tight">Focus & Scholarship Invariants</p>
                <p className="text-[9px] text-white/70 font-sans mt-0.5">Maintain rigor, structural validation, and clear logic paths.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Log Hours Dialogue Modal Overlay */}
      {showLogHoursModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xl animate-scale-up">
            <h3 className="font-serif text-lg font-bold text-primary mb-1">
              Log Daily Focus Hours
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Log progress for <span className="font-bold">{selectedDayChart}</span> directly to adjust the daily completion ring.
            </p>

            <form onSubmit={handleLogHours} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Focus Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLogType("study")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold font-sans transition-all cursor-pointer ${
                      logType === "study"
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-container-low text-on-surface border-outline-variant"
                    }`}
                  >
                    🚀 Study Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogType("research")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold font-sans transition-all cursor-pointer ${
                      logType === "research"
                        ? "bg-secondary text-white border-secondary"
                        : "bg-surface-container-low text-on-surface border-outline-variant"
                    }`}
                  >
                    🧪 Research Hours
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Duration (Hours)</label>
                <select
                  value={logHoursAmount}
                  onChange={(e) => setLogHoursAmount(parseFloat(e.target.value))}
                  className="w-full border border-outline rounded-xl p-2 bg-surface-container-low text-xs font-semibold"
                >
                  <option value={0.5}>0.5 Hours (30 mins)</option>
                  <option value={1.0}>1.0 Hours (60 mins)</option>
                  <option value={1.5}>1.5 Hours</option>
                  <option value={2.0}>2.0 Hours</option>
                  <option value={3.0}>3.0 Hours</option>
                  <option value={4.0}>4.0 Hours</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setShowLogHoursModal(false)}
                  className="px-3.5 py-1.5 text-xs text-on-surface-variant font-semibold hover:bg-surface-container-high rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-white font-semibold text-xs rounded-xl hover:bg-opacity-90"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
