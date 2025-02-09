"use client";

import React from "react";

const CompactView = ({
  currentDate,
  events,
  setCurrentDate,
  selectedEvent,
  setSelectedEvent,
}) => {
  // 1) Filter events for the *current* day only (by UTC date).
// In CompactView component, change filteredEvents to use local dates
const filteredEvents = events.filter((event) => {
  const eventDate = new Date(event.startTime);
  return (
    eventDate.getFullYear() === currentDate.getFullYear() &&
    eventDate.getMonth() === currentDate.getMonth() &&
    eventDate.getDate() === currentDate.getDate()
  );
});
  

  // 2) Create an array from 1..endOfMonth for the left sidebar mini-calendar
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  return (
    <>
      {/* Left Sidebar - Date Navigator */}
      <div className="w-64 border-r p-4">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            // Create a new date for each day in the current month
            const tempDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              dayNum
            );
            const isSelectedDay = dayNum === currentDate.getDate();

            return (
              <div
                key={dayNum}
                onClick={() => setCurrentDate(tempDate)}
                className={`h-10 flex items-center justify-center rounded-full cursor-pointer 
                  ${isSelectedDay ? "bg-primary text-primary-foreground" : ""}
                  hover:bg-accent
                `}
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
                const timeString = `${startTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${endTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`;

                return (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedEvent(dayEvents.length > 0 ? dayEvents[0] : null)}
                    >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {timeString}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {event.location || "No location"}
                        </p>
                      </div>
                      {/* If you have participants, you can show avatars */}
                      <div className="flex -space-x-2">
                        {event.participants &&
                          event.participants.slice(0, 3).map((p, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-accent border-2 border-background flex items-center justify-center text-white"
                            >
                              {p.user?.name
                                ? p.user.name.charAt(0).toUpperCase()
                                : "?"}
                            </div>
                          ))}
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
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">
                {selectedEvent.location || "No location"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Participants</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedEvent.participants &&
                  selectedEvent.participants.map((p, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                    >
                      {p.user?.name || "Unknown"}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompactView;
