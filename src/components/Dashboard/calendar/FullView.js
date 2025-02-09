"use client";
import React from "react";

// Generate a matrix of weeks (rows) for a given month
function generateMonthMatrix(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  const startDayOfWeek = startOfMonth.getDay();
  const totalDays = endOfMonth.getDate();

  const matrix = [];
  let week = [];

  // Fill empty cells before day 1
  for (let i = 0; i < startDayOfWeek; i++) {
    week.push(null);
  }

  // Fill actual days of the month
  for (let day = 1; day <= totalDays; day++) {
    week.push(new Date(year, month, day));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }

  // Fill leftover cells in the last row
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    matrix.push(week);
  }

  return matrix;
}

/**
 * FullView
 * 
 * Displays a monthly grid, each cell showing that date's events.
 * Clicking an event sets it as the selectedEvent (rendered below the calendar).
 */
export default function FullView({
  currentDate,
  selectedEvent,
  setSelectedEvent,
  events = [],
}) {
  // We'll create a monthly matrix of date cells
  const monthMatrix = generateMonthMatrix(currentDate);

  return (
    <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-transparent">
      <div className="max-w-5xl mx-auto">
        {/* Header: e.g. "February 2025" */}
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          {currentDate.toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        {/* Days of week row */}
        <div className="grid grid-cols-7 gap-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-medium py-2 border-b border-gray-300 dark:border-gray-600 dark:text-gray-300"
            >
              {day}
            </div>
          ))}
        </div>

        {/* The monthly grid (rows x columns) */}
        <div className="grid grid-cols-7 gap-0 mt-2">
          {monthMatrix.flat().map((day, i) => {
            if (!day) {
              // Empty cell (before month start or after month end)
              return <div key={i} className="h-24 border dark:border-gray-600" />;
            }

            // Compare day to each event
            const dayString = day.toISOString().split("T")[0];
            // In FullView component, change the dayEvents filter to use local dates
            const dayEvents = events.filter((evt) => {
              if (!evt.startTime) return false;
              const evtDate = new Date(evt.startTime);
              return (
                evtDate.getFullYear() === day.getFullYear() &&
                evtDate.getMonth() === day.getMonth() &&
                evtDate.getDate() === day.getDate()
              );
            });

            // Check if this cell is "today"
// In FullView's grid cell rendering, update the isToday check
          const today = new Date();
          const isToday =
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear();

            // Check if this cell matches currentDate
            const isSelected =
              day.getDate() === currentDate.getDate() &&
              day.getMonth() === currentDate.getMonth() &&
              day.getFullYear() === currentDate.getFullYear();

            return (
              <div
                key={i}
                className={`h-28 border p-2 dark:border-gray-600
                  ${isSelected ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-900 dark:text-gray-200"}
                  ${isToday && !isSelected ? "border-2 border-blue-400" : ""}
                `}
              >
                {/* The day number */}
                <div className="text-sm font-semibold mb-1">
                  {day.getDate()}
                </div>

                {/* List the event titles (limit to 3 to avoid overflow) */}
                {dayEvents.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    className="text-xs mb-1 bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded px-1 py-0.5 cursor-pointer truncate"
                    onClick={() => setSelectedEvent(evt)}
                  >
                    {evt.title}
                  </div>
                ))}

                {/* If there's more than 3, show a small label */}
                {dayEvents.length > 3 && (
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    + {dayEvents.length - 3} more...
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* If user has clicked an event, show its details below */}
        {selectedEvent && (
          <div className="mt-6 border-t pt-4 border-gray-300 dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              {selectedEvent.title}
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Time
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {new Date(selectedEvent.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(selectedEvent.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Location
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {selectedEvent.location || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Assigned To
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {selectedEvent.assignedTo
                    ? selectedEvent.assignedTo.name
                    : "Nobody"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Organizer
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {selectedEvent.organizer
                    ? selectedEvent.organizer.name
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
