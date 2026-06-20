/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import TasksView from "./components/TasksView";
import ScheduleView from "./components/ScheduleView";
import SubjectsView from "./components/SubjectsView";
import SettingsView from "./components/SettingsView";
import HelpView from "./components/HelpView";
import AddTaskModal from "./components/AddTaskModal";

import { Task, ClassSchedule, Subject, StudentProfile, DailyActivity } from "./types";
import { 
  initialStudentProfile, 
  initialTasks, 
  initialClasses, 
  initialSubjects, 
  initialWeeklyActivity 
} from "./data";

export default function App() {
  // --- Persistent States from LocalStorage ---
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem("eduflow_profile");
    return saved ? JSON.parse(saved) : initialStudentProfile;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("eduflow_tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [classes, setClasses] = useState<ClassSchedule[]>(() => {
    const saved = localStorage.getItem("eduflow_classes");
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem("eduflow_subjects");
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [weeklyActivity, setWeeklyActivity] = useState<{ [day: string]: DailyActivity }>(() => {
    const saved = localStorage.getItem("eduflow_weekly_activity");
    return saved ? JSON.parse(saved) : initialWeeklyActivity;
  });

  // --- Layout Preferences ---
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState<string>(" "); // starts blank space or empty
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Synchronize localStorage vectors
  useEffect(() => {
    localStorage.setItem("eduflow_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("eduflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("eduflow_classes", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem("eduflow_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("eduflow_weekly_activity", JSON.stringify(weeklyActivity));
  }, [weeklyActivity]);

  // Clean empty-query whitespace
  useEffect(() => {
    if (searchQuery === " ") {
      setSearchQuery("");
    }
  }, [searchQuery]);

  // --- Keyboard Shortcuts Acceleration listeners ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Hotkey combinations using Alt key
      if (e.altKey) {
        const lowerKey = e.key.toLowerCase();
        if (lowerKey === "d") {
          e.preventDefault();
          setCurrentTab("dashboard");
        } else if (lowerKey === "t") {
          e.preventDefault();
          setCurrentTab("tasks");
        } else if (lowerKey === "s") {
          e.preventDefault();
          setCurrentTab("schedule");
        } else if (lowerKey === "b") {
          e.preventDefault();
          setCurrentTab("subjects");
        } else if (lowerKey === "a") {
          e.preventDefault();
          setTaskToEdit(null);
          setIsAddTaskOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- Handlers section ---

  // Task Handlers
  const handleSaveTask = (savedTask: Task) => {
    setTasks(prev => {
      const exists = prev.some(t => t.id === savedTask.id);
      if (exists) {
        return prev.map(t => t.id === savedTask.id ? savedTask : t);
      } else {
        return [savedTask, ...prev];
      }
    });
    setTaskToEdit(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: "completed",
          progressPercentage: 100
        };
      }
      return t;
    }));
  };

  const handleToggleTaskStatus = (id: string, newStatus: Task["status"]) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: newStatus,
          progressPercentage: newStatus === "completed" ? 100 : t.progressPercentage === 100 ? 50 : t.progressPercentage
        };
      }
      return t;
    }));
  };

  const handleEditTaskTrigger = (task: Task) => {
    setTaskToEdit(task);
    setIsAddTaskOpen(true);
  };

  // Schedule Handlers
  const handleAddClass = (newClass: ClassSchedule) => {
    setClasses(prev => [...prev, newClass]);
  };

  const handleToggleClassCompleted = (id: string) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const handleDeleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // Subjects Handlers
  const handleAddSubject = (newSubject: Subject) => {
    setSubjects(prev => [...prev, newSubject]);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // Profile update Handler
  const handleUpdateProfile = (updated: StudentProfile) => {
    setProfile(updated);
  };

  // Search suggestions clicks redirection
  const handleSearchTaskSelect = (task: Task) => {
    setCurrentTab("tasks");
    // Switch search filters if needed or search query remains for tasks
  };

  const handleSearchClassSelect = (cls: ClassSchedule) => {
    setCurrentTab("schedule");
  };

  // Switch Active view
  const renderActiveView = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <DashboardView
            profile={profile}
            tasks={tasks}
            classes={classes}
            subjects={subjects}
            weeklyActivity={weeklyActivity}
            setWeeklyActivity={setWeeklyActivity}
            onCompleteTask={handleCompleteTask}
            onToggleClassCompleted={handleToggleClassCompleted}
            onViewSchedule={() => setCurrentTab("schedule")}
          />
        );
      case "tasks":
        return (
          <TasksView
            tasks={tasks}
            subjects={subjects}
            searchQuery={searchQuery}
            onAddTaskClick={() => {
              setTaskToEdit(null);
              setIsAddTaskOpen(true);
            }}
            onEditTask={handleEditTaskTrigger}
            onToggleTaskStatus={handleToggleTaskStatus}
            onDeleteTask={handleDeleteTask}
          />
        );
      case "schedule":
        return (
          <ScheduleView
            classes={classes}
            onAddClass={handleAddClass}
            onToggleClassCompleted={handleToggleClassCompleted}
            onDeleteClass={handleDeleteClass}
          />
        );
      case "subjects":
        return (
          <SubjectsView
            subjects={subjects}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        );
      case "settings":
        return (
          <SettingsView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case "help":
        return <HelpView />;
      default:
        return <HelpView />;
    }
  };

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed transition-colors duration-300">
      
      {/* Sidebar navigation panel */}
      <Sidebar
        currentTab={currentTab}
        setTab={setCurrentTab}
        profile={profile}
        onAddTaskClick={() => {
          setTaskToEdit(null);
          setIsAddTaskOpen(true);
        }}
      />

      {/* Main Layout Container */}
      <div className="flex flex-col min-h-screen">
        {/* Dynamic header row */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          profile={profile}
          tasks={tasks}
          classes={classes}
          onTaskSelect={handleSearchTaskSelect}
          onClassSelect={handleSearchClassSelect}
        />

        {/* Content canvas */}
        <main className="ml-64 p-8 max-w-7xl mx-auto w-[calc(100%-16rem)] flex-1 pb-16">
          {renderActiveView()}
        </main>
      </div>

      {/* Add Task / Edit Task Global Modal form overlay */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => {
          setIsAddTaskOpen(false);
          setTaskToEdit(null);
        }}
        subjects={subjects}
        onSaveTask={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
