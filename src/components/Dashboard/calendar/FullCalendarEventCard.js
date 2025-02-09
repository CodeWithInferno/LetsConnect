"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const FullCalendarEventCard = ({ event, onSelect }) => {
  // Convert the ISO timestamp (or numeric string) to a Date.
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
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect && onSelect(event)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg">{event.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{timeString}</p>
          <p className="text-sm text-muted-foreground">{event.location}</p>
        </div>
        <div className="flex -space-x-2">
          {event.participants &&
            event.participants.slice(0, 3).map((participant, i) => (
              <Avatar key={i} className="w-8 h-8 border-2 border-background">
                {participant.user?.profile_picture ? (
                  <AvatarImage
                    src={participant.user.profile_picture}
                    alt={participant.user.name}
                  />
                ) : (
                  <AvatarFallback>
                    {participant.user?.name
                      ? participant.user.name.charAt(0).toUpperCase()
                      : "?"}
                  </AvatarFallback>
                )}
              </Avatar>
            ))}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Organizer: {event.organizer?.name}
        </p>
        {event.assignedTo && (
          <p className="text-sm text-muted-foreground">
            Assigned To: {event.assignedTo.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default FullCalendarEventCard;
