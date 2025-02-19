"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import FullCalendarEventCard from "./FullCalendarEventCard";


function generateMonthMatrix(currentDate) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const daysInMonth = lastDay.getDate()
  const startingDay = firstDay.getDay()

  const matrix = []
  let week = new Array(7).fill(null)
  let dayCounter = 1

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startingDay) {
        continue
      }
      if (dayCounter > daysInMonth) {
        break
      }
      week[j] = new Date(year, month, dayCounter)
      dayCounter++
    }
    matrix.push(week)
    if (dayCounter > daysInMonth) {
      break
    }
    week = new Array(7).fill(null)
  }

  return matrix
}

export default function FullView({ currentDate, selectedEvent, setSelectedEvent, events = [] }) {
  const [displayDate, setDisplayDate] = useState(currentDate)
  const monthMatrix = generateMonthMatrix(displayDate)

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1))
  }

  const getEventStyle = (event) => {
    const colors = [
      "bg-red-200 text-red-800",
      "bg-blue-200 text-blue-800",
      "bg-green-200 text-green-800",
      "bg-yellow-200 text-yellow-800",
      "bg-purple-200 text-purple-800",
    ]
    return colors[event.id % colors.length]
  }

  return (
    <div className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header: Month and Year with navigation */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {displayDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {/* Days of week row */}
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          {monthMatrix.map((week, weekIndex) => (
  <div key={weekIndex} className="grid grid-cols-7 border-t border-gray-200 dark:border-gray-700">
    {week.map((day, dayIndex) => {
      if (!day) return <div key={dayIndex} className="h-24 bg-gray-50 dark:bg-gray-800" />;

      // ✅ Define `dayEvents` inside the loop
      const dayEvents = events.filter((evt) => {
        const evtDate = new Date(evt.startTime);
        return evtDate.toDateString() === day.toDateString();
      });

      const isToday = day.toDateString() === new Date().toDateString();

      return (
        <div
          key={dayIndex}
          className={`h-24 p-1 border-r border-gray-200 dark:border-gray-700 ${
            isToday ? "bg-blue-50 dark:bg-blue-900" : ""
          }`}
        >
          <div
            className={`text-right text-xs mb-1 ${
              isToday ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {day.getDate()}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((evt) => (
              <FullCalendarEventCard
                key={evt.id}
                event={evt}
                onSelect={setSelectedEvent}
              />
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {dayEvents.length - 3} more...
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
))}

        </div>

        {/* Selected event details */}
        {selectedEvent && (
          <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{selectedEvent.title}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Time</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {new Date(selectedEvent.startTime).toLocaleString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Location</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{selectedEvent.location || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Assigned To</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {selectedEvent.assignedTo?.name || "Nobody"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Organizer</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {selectedEvent.organizer?.name || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

