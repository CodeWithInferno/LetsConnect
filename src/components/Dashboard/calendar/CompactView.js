"use client";

import React from "react";
import CompactCalendarEventCard from "./CompactCalendarEventCard";

const CompactView = ({
  currentDate,
  events,
  setCurrentDate,
  selectedEvent,
  setSelectedEvent,
}) => {
  // Normalize `currentDate` to UTC (ignore time)
  const currentDateUTC = new Date(
    Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    )
  );

  // Filter events occurring on the selected date
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.startTime);
    const eventDateUTC = new Date(
      Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate())
    );

    return eventDateUTC.getTime() === currentDateUTC.getTime();
  });

  console.log("Current Date (UTC):", currentDateUTC);
  console.log("Filtered Events:", filteredEvents);

  // Get the total number of days in the month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  return (
    <div className="flex">
      {/* Left Sidebar - Date Navigator */}
      <div className="w-64 border-r p-4">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const tempDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
            const isSelectedDay = dayNum === currentDate.getDate();

            return (
              <div
                key={dayNum}
                onClick={() => {
                  console.log("Setting Current Date to:", tempDate);
                  setCurrentDate(tempDate);
                }}
                className={`h-10 flex items-center justify-center rounded-full cursor-pointer 
                  ${isSelectedDay ? "bg-primary text-primary-foreground" : ""}
                  hover:bg-accent`}
              >
                {dayNum}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Calendar / Events View */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">
            Schedule for {currentDate.toDateString()}
          </h2>

          {filteredEvents.length === 0 ? (
            <p>No events scheduled for this date.</p>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const startTime = new Date(event.startTime);
                const endTime = new Date(event.endTime);
                const timeString = `${startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - 
                  ${endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

                return (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{timeString}</p>
                        <p className="text-sm text-muted-foreground">{event.location || "No location"}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Event Details */}
      {selectedEvent && (
        <div className="w-96 border-l p-6">
          <h3 className="text-lg font-semibold mb-4">{selectedEvent.title}</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">
                {new Date(selectedEvent.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - 
                {new Date(selectedEvent.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{selectedEvent.location || "No location"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactView;
