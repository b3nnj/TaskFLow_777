/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  FileCheck, 
  Video, 
  Plus, 
  Trash2, 
  CheckSquare, 
  User, 
  Clock, 
  X,
  ShieldAlert
} from "lucide-react";
import { ClassSchedule } from "../types";

interface ScheduleViewProps {
  classes: ClassSchedule[];
  onAddClass: (newClass: ClassSchedule) => void;
  onToggleClassCompleted: (id: string) => void;
  onDeleteClass: (id: string) => void;
}

export default function ScheduleView({
  classes,
  onAddClass,
  onToggleClassCompleted,
  onDeleteClass,
}: ScheduleViewProps) {
  const [activeDay, setActiveDay] = useState<string>("Monday");
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  
  // Custom Class creation fields
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [ampm, setAmpm] = useState("AM");
  const [type, setType] = useState<"In Person" | "Virtual">("In Person");
  const [location, setLocation] = useState("");
  const [instructor, setInstructor] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");

  const daysOfWeekList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !time || !location || !instructor) return;

    const formattedTime = `${time} ${ampm}`;
    const newClass: ClassSchedule = {
      id: `cls-${Date.now()}`,
      name,
      time: formattedTime,
      type,
      location,
      instructor,
      dayOfWeek,
      completed: false
    };

    onAddClass(newClass);
    setShowAddClassModal(false);

    // Reset Form
    setName("");
    setTime("");
    setLocation("");
    setInstructor("");
  };

  const getDayClasses = (day: string) => {
    return classes.filter(c => c.dayOfWeek.toLowerCase() === day.toLowerCase());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-primary dark:text-primary-fixed-dim">Weekly Academic Timetable</h2>
          <p className="text-sm text-on-surface-variant">Log lectures, synchronize calendar seminars, and plan classroom locations.</p>
        </div>

        <button
          onClick={() => setShowAddClassModal(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-opacity-95 shadow-xs shrink-0 self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Academic Class
        </button>
      </div>

      {/* Grid: Day selector and Class displays */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left selector sidebar (Span 3) */}
        <div className="col-span-12 md:col-span-3 bg-surface-container-low border border-outline-variant rounded-2xl p-3 flex md:flex-col gap-1.5 overflow-x-auto">
          {daysOfWeekList.map((day) => {
            const count = getDayClasses(day).length;
            const isSelected = activeDay === day;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`w-full text-left flex items-center justify-between px-3.5 py-3 rounded-xl font-medium transition-all duration-200 outline-none shrink-0 md:min-w-0 min-w-[124px] cursor-pointer
                  ${isSelected
                    ? "bg-primary text-white shadow-xs"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                  }
                `}
              >
                <span className="text-xs font-semibold">{day}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? "bg-white/25 text-white" : "bg-surface-container-highest text-on-surface-variant"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Timetable Details (Span 9) */}
        <div className="col-span-12 md:col-span-9 space-y-4">
          <div className="flex justify-between items-center bg-transparent border-b border-outline-variant/60 pb-2">
            <h3 className="font-serif text-lg font-bold text-primary dark:text-primary-fixed-dim">
              Courses Scheduled on {activeDay}
            </h3>
            <span className="text-xs text-on-surface-variant font-semibold">
              {getDayClasses(activeDay).filter(c => c.completed).length} of {getDayClasses(activeDay).length} Completed
            </span>
          </div>

          {getDayClasses(activeDay).length === 0 ? (
            <div className="bg-surface-container-lowest border border-dashed border-outline rounded-2xl p-12 text-center">
              <Calendar className="w-12 h-12 text-outline mx-auto mb-4" />
              <p className="font-sans text-sm font-semibold text-on-surface">No courses listed for {activeDay}</p>
              <p className="text-xs text-on-surface-variant mt-1">Enjoy a study workshop or log custom academic classes.</p>
              <button
                onClick={() => setShowAddClassModal(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary-fixed text-on-primary-fixed text-xs font-semibold rounded-xl"
              >
                <Plus className="w-4 h-4" /> Log {activeDay} Course
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {getDayClasses(activeDay).map((cls) => (
                <div
                  key={cls.id}
                  className={`border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all bg-surface-container-lowest
                    ${cls.completed 
                      ? "opacity-60 border-outline-variant/50 hover:opacity-85" 
                      : "border-outline-variant hover:border-primary/20 shadow-xs"
                    }
                  `}
                >
                  {/* Left Metadata block */}
                  <div className="flex items-start gap-4">
                    {/* Time Indicator Badge */}
                    <div className={`p-4 rounded-xl flex flex-col items-center min-w-[72px] text-center ${
                      cls.completed 
                        ? "bg-surface-container text-on-surface-variant" 
                        : cls.type === "Virtual"
                          ? "bg-tertiary-fixed text-on-tertiary-fixed"
                          : "bg-primary-fixed text-on-primary-fixed"
                    }`}>
                      <Clock className="w-4 h-4 text-outline mb-1" />
                      <span className="font-serif text-sm font-extrabold leading-tight">{cls.time}</span>
                    </div>

                    {/* Class metadata description */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`font-serif text-md font-bold text-on-surface ${cls.completed ? "line-through text-on-surface-variant" : ""}`}>
                          {cls.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full font-serif text-[10px] font-bold ${
                          cls.type === "Virtual" 
                            ? "bg-amber-100 dark:bg-amber-500/25 text-amber-800 dark:text-amber-400" 
                            : "bg-secondary-container text-on-secondary-container"
                        }`}>
                          {cls.type}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{cls.instructor}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {cls.type === "Virtual" ? (
                            <a 
                              href={cls.location} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-primary hover:underline font-semibold"
                            >
                              Join Zoom Meeting
                            </a>
                          ) : (
                            <span>{cls.location}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onToggleClassCompleted(cls.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                        cls.completed
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      {cls.completed ? "Attended" : "Attend Class"}
                    </button>
                    <button
                      onClick={() => onDeleteClass(cls.id)}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                      title="Delete Class Slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Add Class Form Modal Overlay */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-outline-variant">
              <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" /> Add Timetable Class
              </h3>
              <button 
                onClick={() => setShowAddClassModal(false)}
                className="p-1 rounded hover:bg-surface-container-high cursor-pointer text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Class/Course Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Advanced Econometrics"
                  className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Weekly Day</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full p-2 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold"
                  >
                    {daysOfWeekList.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Course Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "In Person" | "Virtual")}
                    className="w-full p-2 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold"
                  >
                    <option value="In Person">🏫 In Person</option>
                    <option value="Virtual">💻 Virtual (Zoom)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 items-end">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Time (HH:MM)</label>
                  <input
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 09:00"
                    className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <select
                    value={ampm}
                    onChange={(e) => setAmpm(e.target.value)}
                    className="w-full p-2 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                  {type === "Virtual" ? "Video Link URL (Zoom)" : "Building Room Info / Location"}
                </label>
                <input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={type === "Virtual" ? "https://zoom.us/j/12345" : "e.g. Building 4, Room 202"}
                  className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Dr. Professor / Instructor</label>
                <input
                  required
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="e.g. Dr. Silas Vane"
                  className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 text-xs text-on-surface-variant font-semibold hover:bg-surface-container-high rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white font-semibold text-xs rounded-xl hover:bg-opacity-90 cursor-pointer shadow-xs"
                >
                  Register Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
