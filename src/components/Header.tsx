/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { StudentProfile, Task, ClassSchedule } from "../types";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  profile: StudentProfile;
  tasks: Task[];
  classes: ClassSchedule[];
  onTaskSelect: (task: Task) => void;
  onClassSelect: (cls: ClassSchedule) => void;
}

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  profile, 
  tasks, 
  classes, 
  onTaskSelect, 
  onClassSelect 
}: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Initialize theme from document class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      root.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  // Build notifications
  const urgentTasks = tasks.filter(t => t.status !== "completed" && t.priority === "high");
  const upcomingClasses = classes.filter(c => !c.completed);

  // Filter mini database for instant search suggestions on input focus
  const searchHitsTasks = searchQuery.trim() 
    ? tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())) 
    : [];
  const searchHitsClasses = searchQuery.trim() 
    ? classes.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())) 
    : [];

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant transition-colors duration-300">
      <div className="flex justify-between items-center h-16 px-8 ml-64 w-[calc(100%-16rem)]">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-outline group-focus-within:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </span>
            <input
              id="topbar-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className="block w-full pl-11 pr-4 py-2 border border-outline rounded-xl bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans text-sm text-on-surface outline-none placeholder-on-surface-variant/70"
              placeholder="Search resources, tasks, or notes..."
              type="text"
            />
          </div>

          {/* Quick Search Floating Results */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-12 left-0 right-0 max-h-72 overflow-y-auto bg-surface-container-lowest border border-outline-variant shadow-lg rounded-xl p-3 z-50">
              <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-2 mb-2">
                Quick Search Hits
              </p>
              {searchHitsTasks.length === 0 && searchHitsClasses.length === 0 ? (
                <p className="text-xs text-on-surface-variant px-2 py-1">No results match "{searchQuery}"</p>
              ) : (
                <div className="space-y-2">
                  {searchHitsTasks.map(task => (
                    <button
                      key={task.id}
                      onMouseDown={() => onTaskSelect(task)}
                      className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold text-on-surface truncate">{task.title}</p>
                        <p className="text-[10px] text-on-surface-variant">Task • {task.subjectName}</p>
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        task.status === "completed" ? "bg-secondary-container text-on-secondary-container" : "bg-primary-fixed text-on-primary-fixed"
                      }`}>
                        {task.status}
                      </span>
                    </button>
                  ))}
                  {searchHitsClasses.map(cls => (
                    <button
                      key={cls.id}
                      onMouseDown={() => onClassSelect(cls)}
                      className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold text-on-surface truncate">{cls.name}</p>
                        <p className="text-[10px] text-on-surface-variant">Class • {cls.time} • {cls.dayOfWeek}</p>
                      </div>
                      <span className="text-[9px] font-bold uppercase bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full">
                        {cls.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Interactions */}
        <div className="flex items-center gap-5">
          {/* Notifications Button */}
          <div className="relative">
            <button 
              id="topbar-notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-high transition-colors outline-none cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {urgentTasks.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-11 w-80 bg-surface-container-lowest border border-outline-variant shadow-lg rounded-xl p-4 z-50">
                <div className="flex justify-between items-center pb-2.5 mb-2.5 border-b border-outline-variant">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Alerts & Directives</h4>
                  <span className="text-[11px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-semibold">
                    {urgentTasks.length} Urgent
                  </span>
                </div>
                {urgentTasks.length === 0 ? (
                  <p className="text-xs text-on-surface-variant py-2">No urgent tasks due soon. Good job!</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {urgentTasks.slice(0, 3).map(task => (
                      <div key={task.id} className="p-2 bg-surface-container-low rounded-lg border-l-4 border-error">
                        <p className="text-xs font-semibold text-on-surface">{task.title}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">Due {task.dueDate} • {task.subjectName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dark Mode Button */}
          <button 
            id="topbar-theme-toggle"
            onClick={toggleDarkMode}
            className="p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-high transition-colors outline-none cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="h-8 w-[1px] bg-outline-variant mx-1"></div>

          {/* Student Profile Overview */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs font-semibold text-on-surface hidden md:inline">{profile.semester}</span>
            <img
              referrerPolicy="no-referrer"
              alt="Student Profile Avatar Circle"
              className="w-8 h-8 rounded-full border border-outline-variant object-cover ring-2 ring-primary-fixed/20 shrink-0"
              src={profile.avatarUrl}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuCvdJpGiQ4FQ_7u6bgVWHTQ7WlRJQ-NJuy8Dt8Na1xdzHAJhxhon9V8gBdA92Sk1zuwbbqV3QC-H_KHtq_R36OW1FH9-Yc1Vit-YrKtgXXAtc6dLl5qwWBQlxYu-7D6rL-JJ_XRV1iyVFuDG_7o4lIheF46RpCrKZkswYz3dHiGfBzVczZFH4GxFuxmW9rMNzNbb6CysCvncQxJpxHDsMdsXaZHwV-JZHxPvjjLlYZUc0BogmvMpeEj4PLyQ9u0oaUGk4R0GiZ1vDE";
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
