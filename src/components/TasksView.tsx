/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Kanban, 
  List, 
  Plus, 
  Filter, 
  Check, 
  Trash2, 
  ChevronRight, 
  ArrowRightLeft, 
  Clock, 
  BookOpen, 
  FileCheck,
  Edit2
} from "lucide-react";
import { Task, Subject } from "../types";

interface TasksViewProps {
  tasks: Task[];
  subjects: Subject[];
  searchQuery: string;
  onAddTaskClick: () => void;
  onEditTask: (task: Task) => void;
  onToggleTaskStatus: (id: string, newStatus: Task["status"]) => void;
  onDeleteTask: (id: string) => void;
}

export default function TasksView({
  tasks,
  subjects,
  searchQuery,
  onAddTaskClick,
  onEditTask,
  onToggleTaskStatus,
  onDeleteTask,
}: TasksViewProps) {
  const [viewMode, setViewMode] = useState<"list" | "board">("board");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter tasks based on all filters + search query
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = subjectFilter === "all" || task.subjectName === subjectFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesType = typeFilter === "all" || task.type === typeFilter;

    return matchesSearch && matchesSubject && matchesPriority && matchesType;
  });

  const getPriorityBadgeClass = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50";
      case "medium": return "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50";
      case "low": return "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/50";
    }
  };

  const getColumnTasks = (status: Task["status"]) => {
    return filteredTasks.filter((t) => t.status === status);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-primary dark:text-primary-fixed-dim">Task Board & Milestones</h2>
          <p className="text-sm text-on-surface-variant">Manage, schedule, and execute your academic task pipeline.</p>
        </div>

        {/* View Layout Controls & Add Button */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="flex bg-surface-container rounded-xl p-1 border border-outline-variant">
            <button
              onClick={() => setViewMode("board")}
              className={`p-1.5 rounded-lg transition-all outline-none cursor-pointer ${
                viewMode === "board" 
                  ? "bg-surface-container-lowest text-primary font-semibold shadow-xs" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all outline-none cursor-pointer ${
                viewMode === "list" 
                  ? "bg-surface-container-lowest text-primary font-semibold shadow-xs" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
              title="Table List View"
            >
              <List className="w-4.5 h-4.5" />
            </button>
          </div>

          <button
            onClick={onAddTaskClick}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-opacity-90 transition-all outline-none cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Structured Filters Controls */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-bold uppercase tracking-wider">
          <Filter className="w-4 h-4 text-primary" /> Filters:
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-on-surface-variant">Class:</span>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="text-xs font-semibold bg-surface-container-lowest border border-outline-variant rounded-lg p-1.5 text-on-surface outline-none focus:ring-1 focus:ring-primary/20"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.name}>{sub.name}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-on-surface-variant">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs font-semibold bg-surface-container-lowest border border-outline-variant rounded-lg p-1.5 text-on-surface outline-none focus:ring-1 focus:ring-primary/20"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-on-surface-variant">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-semibold bg-surface-container-lowest border border-outline-variant rounded-lg p-1.5 text-on-surface outline-none focus:ring-1 focus:ring-primary/20"
          >
            <option value="all">All Types</option>
            <option value="Thesis">Thesis</option>
            <option value="Project">Project</option>
            <option value="Exam">Exam</option>
            <option value="Assignment">Assignment</option>
            <option value="Reading">Reading</option>
          </select>
        </div>

        {/* Reset Filters button */}
        {(subjectFilter !== "all" || priorityFilter !== "all" || typeFilter !== "all" || searchQuery !== "") && (
          <button
            onClick={() => {
              setSubjectFilter("all");
              setPriorityFilter("all");
              setTypeFilter("all");
            }}
            className="ml-auto text-xs text-primary font-bold hover:underline cursor-pointer"
          >
            Clear Active Filters
          </button>
        )}
      </div>

      {/* Task Content Area */}
      {filteredTasks.length === 0 ? (
        <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl p-12 text-center">
          <FileCheck className="w-12 h-12 text-outline mx-auto mb-4" />
          <h3 className="font-serif text-lg font-bold text-on-surface">No tasks matched</h3>
          <p className="text-sm text-on-surface-variant mt-1.5">Try altering your dropdown filters or typing a different search query.</p>
          <button
            onClick={onAddTaskClick}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary-fixed text-on-primary-fixed text-xs font-semibold rounded-xl hover:bg-opacity-95"
          >
            <Plus className="w-4 h-4" /> Create a New Task Node
          </button>
        </div>
      ) : viewMode === "board" ? (
        
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* TODO COLUMN */}
          <div className="rounded-2xl bg-surface-container-low border border-outline-variant p-4 space-y-4">
            <div className="flex justify-between items-center bg-transparent border-b border-outline-variant pb-2 px-1">
              <h4 className="font-serif font-bold text-md text-primary flex items-center gap-2">
                📋 Todo
              </h4>
              <span className="text-xs bg-primary-fixed text-on-primary-fixed font-sans font-bold px-2.1 py-0.5 rounded-full">
                {getColumnTasks("todo").length}
              </span>
            </div>
            <div className="space-y-3 max-h-[64vh] overflow-y-auto pr-1">
              {getColumnTasks("todo").map((task) => (
                <KanbanCard 
                  key={task.id} 
                  task={task} 
                  nextStatus="in_progress" 
                  priorityClass={getPriorityBadgeClass(task.priority)} 
                  onPromote={onToggleTaskStatus}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              ))}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="rounded-2xl bg-surface-container-low border border-outline-variant p-4 space-y-4">
            <div className="flex justify-between items-center bg-transparent border-b border-outline-variant pb-2 px-1">
              <h4 className="font-serif font-bold text-md text-amber-700 dark:text-amber-400 flex items-center gap-2">
                ⏳ In Progress
              </h4>
              <span className="text-xs bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-sans font-bold px-2.1 py-0.5 rounded-full">
                {getColumnTasks("in_progress").length}
              </span>
            </div>
            <div className="space-y-3 max-h-[64vh] overflow-y-auto pr-1">
              {getColumnTasks("in_progress").map((task) => (
                <KanbanCard 
                  key={task.id} 
                  task={task} 
                  nextStatus="completed" 
                  priorityClass={getPriorityBadgeClass(task.priority)} 
                  onPromote={onToggleTaskStatus}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              ))}
            </div>
          </div>

          {/* COMPLETED COLUMN */}
          <div className="rounded-2xl bg-surface-container-low border border-outline-variant p-4 space-y-4">
            <div className="flex justify-between items-center bg-transparent border-b border-outline-variant pb-2 px-1">
              <h4 className="font-serif font-bold text-md text-secondary flex items-center gap-2">
                ✅ Completed
              </h4>
              <span className="text-xs bg-secondary-container text-on-secondary-container font-sans font-bold px-2.1 py-0.5 rounded-full">
                {getColumnTasks("completed").length}
              </span>
            </div>
            <div className="space-y-3 max-h-[64vh] overflow-y-auto pr-1">
              {getColumnTasks("completed").map((task) => (
                <KanbanCard 
                  key={task.id} 
                  task={task} 
                  priorityClass={getPriorityBadgeClass(task.priority)} 
                  onPromote={onToggleTaskStatus}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              ))}
            </div>
          </div>

        </div>
      ) : (
        
        /* TABLE LIST VIEW */
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3.5 px-5">Title & Topic</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Progress</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {filteredTasks.map((task) => (
                  <tr 
                    key={task.id} 
                    className={`hover:bg-surface-container-low/50 transition-colors ${
                      task.status === "completed" ? "opacity-60" : ""
                    }`}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.status === "completed"}
                          onChange={() => onToggleTaskStatus(task.id, task.status === "completed" ? "todo" : "completed")}
                          className="w-4 h-4 rounded text-primary focus:ring-primary border-outline cursor-pointer"
                        />
                        <div>
                          <p className={`text-xs font-semibold text-on-surface ${task.status === "completed" ? "line-through text-on-surface-variant" : ""}`}>
                            {task.title}
                          </p>
                          <p className="text-[10px] text-on-surface-variant truncate max-w-xs mt-0.5">{task.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-on-surface">{task.subjectName}</td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] font-bold bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant uppercase">
                        {task.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{task.dueDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-surface-container h-1 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${task.progressPercentage || 0}%` }}
                            className="bg-primary h-full"
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant">
                          {task.progressPercentage || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center items-center gap-1.5 bg-transparent">
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                          title="Edit Task Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-red-50 transition-colors"
                          title="Delete Milestone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* Kanban Isolated Card Component */
interface KanbanCardProps {
  key?: string;
  task: Task;
  nextStatus?: Task["status"];
  priorityClass: string;
  onPromote: (id: string, next: Task["status"]) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

function KanbanCard({ task, nextStatus, priorityClass, onPromote, onDelete, onEdit }: KanbanCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4.5 hover:border-primary/20 hover:shadow-xs transition-all relative group">
      <div className="flex justify-between items-start gap-2 mb-2">
        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${priorityClass}`}>
          {task.priority}
        </span>
        <span className="text-[9px] font-bold bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant uppercase">
          {task.type}
        </span>
      </div>

      <h5 className={`font-serif text-sm font-bold text-on-surface ${task.status === "completed" ? "line-through text-on-surface-variant/70" : ""}`}>
        {task.title}
      </h5>

      <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1.5 leading-relaxed">
        {task.description}
      </p>

      {/* Progress slider if present */}
      {task.status !== "completed" && task.progressPercentage !== undefined && (
        <div className="mt-3.5 space-y-1">
          <div className="flex justify-between text-[10px] text-on-surface-variant/80">
            <span>Milestone Progress</span>
            <span className="font-bold">{task.progressPercentage}%</span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
            <div 
              style={{ width: `${task.progressPercentage}%` }}
              className="bg-primary h-full rounded-full"
            ></div>
          </div>
        </div>
      )}

      {/* Footer Meta */}
      <div className="mt-4 pt-3 border-t border-outline-variant/60 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-on-surface-variant">
          <Clock className="w-3.5 h-3.5 text-outline" />
          <span>{task.dueDate}</span>
        </div>
        
        {/* Floating actions menu */}
        <div className="flex items-center gap-1 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 rounded-md text-on-surface-variant hover:text-error transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {nextStatus && (
            <button
              onClick={() => onPromote(task.id, nextStatus)}
              className="p-1 rounded-md bg-primary-fixed text-on-primary-fixed hover:-translate-y-0.5 transition-transform"
              title={`Move to ${nextStatus}`}
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          {task.status === "completed" && (
            <button
              onClick={() => onPromote(task.id, "todo")}
              className="p-1 rounded-md bg-surface-container text-on-surface-variant hover:-translate-y-0.5 transition-transform"
              title="Reset to Todo"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
