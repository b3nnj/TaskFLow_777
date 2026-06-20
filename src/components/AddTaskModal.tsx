/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Calendar, ClipboardList, Clock, Bookmark, HelpCircle } from "lucide-react";
import { Task, Subject } from "../types";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onSaveTask: (task: Task) => void;
  taskToEdit?: Task | null;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  subjects,
  onSaveTask,
  taskToEdit,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<Task["type"]>("Assignment");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [dueDate, setDueDate] = useState("2026-10-24"); // Default Oct 24Tomorrow
  const [dueTimeHour, setDueTimeHour] = useState("11:59");
  const [dueTimeAmpm, setDueTimeAmpm] = useState("PM");
  const [subjectName, setSubjectName] = useState("");
  const [progress, setProgress] = useState(0);

  // Load task values if editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setType(taskToEdit.type);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
      setSubjectName(taskToEdit.subjectName);
      setProgress(taskToEdit.progressPercentage || 0);

      // Extract time parts
      if (taskToEdit.dueTime) {
        const parts = taskToEdit.dueTime.split(" ");
        setDueTimeHour(parts[0] || "11:59");
        setDueTimeAmpm(parts[1] || "PM");
      }
    } else {
      // Clear forms for new tasks
      setTitle("");
      setDescription("");
      setType("Assignment");
      setPriority("medium");
      setDueDate("2026-10-24");
      setDueTimeHour("11:59");
      setDueTimeAmpm("PM");
      setSubjectName(subjects[0]?.name || "General");
      setProgress(0);
    }
  }, [taskToEdit, isOpen, subjects]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const formattedTime = `${dueTimeHour} ${dueTimeAmpm}`;
    const savedTask: Task = {
      id: taskToEdit?.id || `tsk-${Date.now()}`,
      title,
      description,
      type,
      status: taskToEdit?.status || "todo",
      dueDate,
      dueTime: formattedTime,
      subjectName: subjectName || "General",
      priority,
      progressPercentage: progress
    };

    onSaveTask(savedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
      {/* Background clicking dismisses */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xl animate-scale-up z-10">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4 border-b border-outline-variant">
          <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-secondary" /> 
            {taskToEdit ? "Modify Academic Task" : "Register Academic Milestone"}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-surface-container-high transition-colors cursor-pointer text-on-surface-variant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Task Title <span className="text-error">*</span></label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Thesis Abstract Draft"
              className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none focus:border-primary text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Description / Guidelines</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Submit thesis parameters including methodology, dataset summaries, and references..."
              rows={3}
              className="w-full p-2.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold outline-none resize-none focus:border-primary text-on-surface"
            />
          </div>

          {/* Type / Priority */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Task Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Task["type"])}
                className="w-full p-2 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface"
              >
                <option value="Assignment">Assignment</option>
                <option value="Exam">Exam</option>
                <option value="Project">Project</option>
                <option value="Reading">Reading</option>
                <option value="Thesis">Thesis Abstract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Priority Node</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task["priority"])}
                className="w-full p-2 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>
          </div>

          {/* Subjects selection */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Link to Subject Course</label>
            <select
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full p-2 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.name}>{sub.code} - {sub.name}</option>
              ))}
              <option value="General Academic">General Academic</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-1.5 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface"
              />
            </div>

            <div className="grid grid-cols-3 gap-1.5 items-end">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Hour (HH:MM)</label>
                <input
                  required
                  value={dueTimeHour}
                  onChange={(e) => setDueTimeHour(e.target.value)}
                  placeholder="11:59"
                  className="w-full p-2 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface text-center"
                />
              </div>
              <div>
                <select
                  value={dueTimeAmpm}
                  onChange={(e) => setDueTimeAmpm(e.target.value)}
                  className="w-full p-2 border border-outline rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Milestone Progress Slider */}
          <div className="space-y-1 bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/50">
            <div className="flex justify-between items-center text-xs text-on-surface-variant">
              <span className="font-bold flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 text-secondary" /> Milestone Progress
              </span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              className="w-full accent-primary h-1 rounded bg-surface-container-high cursor-pointer"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-on-surface-variant font-semibold hover:bg-surface-container-high rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-white font-semibold text-xs rounded-xl hover:bg-opacity-95 shadow-xs cursor-pointer"
            >
              {taskToEdit ? "Update Milestone" : "Register Milestone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
