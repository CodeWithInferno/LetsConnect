"use client";

import { PlusCircle } from "lucide-react";

export default function KanbanHeader({ setShowNewTask }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 py-4 md:py-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="mb-4 md:mb-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Project Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track and manage your project tasks
        </p>
      </div>
      <button
        onClick={() => setShowNewTask(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto"
      >
        <PlusCircle className="w-5 h-5" />
        Add Task
      </button>
    </div>
  );
}
