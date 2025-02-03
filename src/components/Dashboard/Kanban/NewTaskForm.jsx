"use client";

import { Calendar, Tag, Clock, X } from "lucide-react";

export default function NewTaskForm({
  newTask,
  setNewTask,
  selectedPriority,
  setSelectedPriority,
  dueDate,
  setDueDate,
  newTag,
  setNewTag,
  tags,
  addTag,
  removeTag,
  addNewTask,
  setShowNewTask,
}) {
  const priorityConfig = {
    low: { color: "bg-emerald-500", text: "Low" },
    medium: { color: "bg-amber-500", text: "Medium" },
    high: { color: "bg-rose-500", text: "High" }
  };

  return (
    <div className="px-4 md:px-8 py-4 md:py-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700 space-y-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full px-4 py-3 text-lg bg-gray-50 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(priorityConfig).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.text}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex gap-2 items-center flex-col md:flex-row">
            <input
              type="text"
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={addTag}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors w-full md:w-auto"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">
                {tag}
                <X className="w-4 h-4 cursor-pointer hover:text-gray-700" onClick={() => removeTag(tag)} />
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 flex-col md:flex-row">
          <button
            onClick={() => setShowNewTask(false)}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full md:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={addNewTask}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
