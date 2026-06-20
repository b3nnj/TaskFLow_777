/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, CheckSquare, Calendar, BookOpen, Settings, HelpCircle, Plus } from "lucide-react";
import { StudentProfile } from "../types";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  profile: StudentProfile;
  onAddTaskClick: () => void;
}

export default function Sidebar({ currentTab, setTab, profile, onAddTaskClick }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "subjects", label: "Subjects", icon: BookOpen },
  ];

  const adminItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
  ];

  return (
    <aside 
      id="app-sidebar"
      className="h-screen w-64 fixed left-0 top-0 flex flex-col border-r border-outline-variant bg-surface-container-lowest z-50 transition-all duration-300"
    >
      <div className="flex flex-col h-full py-6 px-4 gap-8">
        <div className="px-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-slate-950 font-sans shadow-md shadow-sky-500/20 shrink-0">E</div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase font-sans">
              Edu<span className="text-sky-400">Flow</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">
              PLANNER
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all duration-200 outline-none
                  ${isActive 
                    ? "bg-primary-fixed text-on-primary-fixed font-semibold shadow-xs transform scale-[0.98]" 
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-on-surface-variant/80"}`} />
                <span className="font-sans text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1.5 border-t border-outline-variant pt-5">
          <button
            id="sidebar-add-task-btn"
            onClick={onAddTaskClick}
            className="mb-4 w-full bg-primary text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all active:scale-[0.98] outline-none shadow-xs group cursor-pointer"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-sans text-sm">Add Task</span>
          </button>

          {adminItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all duration-200 outline-none
                  ${isActive 
                    ? "bg-primary-fixed text-on-primary-fixed font-semibold shadow-xs transform scale-[0.98]" 
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-on-surface-variant/80"}`} />
                <span className="font-sans text-sm">{item.label}</span>
              </button>
            );
          })}

          <div className="flex items-center gap-3.5 px-4 py-4 mt-3 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-outline-variant/70 transition-all">
            <img
              referrerPolicy="no-referrer"
              alt="Student profile avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-fixed shrink-0 transition-transform hover:scale-105"
              src={profile.avatarUrl}
              onError={(e) => {
                // Fallback avatar if error
                (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuCvdJpGiQ4FQ_7u6bgVWHTQ7WlRJQ-NJuy8Dt8Na1xdzHAJhxhon9V8gBdA92Sk1zuwbbqV3QC-H_KHtq_R36OW1FH9-Yc1Vit-YrKtgXXAtc6dLl5qwWBQlxYu-7D6rL-JJ_XRV1iyVFuDG_7o4lIheF46RpCrKZkswYz3dHiGfBzVczZFH4GxFuxmW9rMNzNbb6CysCvncQxJpxHDsMdsXaZHwV-JZHxPvjjLlYZUc0BogmvMpeEj4PLyQ9u0oaUGk4R0GiZ1vDE";
              }}
            />
            <div className="overflow-hidden">
              <p className="font-sans text-sm font-semibold text-on-surface truncate">{profile.name}</p>
              <p className="text-[11px] font-medium text-on-surface-variant truncate">{profile.degreeProgram}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
