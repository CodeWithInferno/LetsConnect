"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";

export function EditableField({ label, value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    setIsEditing(false);
    onSave(inputValue);
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>

        {isEditing ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        ) : (
          // Add double-click to switch to editing
          <p
            onDoubleClick={() => setIsEditing(true)}
            className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer"
          >
            {value}
          </p>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="text-green-600">
            <Check className="w-5 h-5" />
          </button>
          <button onClick={() => setIsEditing(false)} className="text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        // Pencil icon to trigger editing
        <button
          onClick={() => setIsEditing(true)}
          className="text-gray-500 hover:text-gray-800"
        >
          <Pencil className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
