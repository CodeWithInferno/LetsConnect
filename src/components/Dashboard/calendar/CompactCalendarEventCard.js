"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const CompactCalendarEventCard = ({ event, onSelect }) => {
  // Convert the time fields to Date objects.
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
      className="border rounded-lg p-2 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect && onSelect(event)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-base">{event.title}</h3>
          <p className="text-xs text-muted-foreground">{timeString}</p>
        </div>
        <div className="flex -space-x-2">
          {event.participants &&
            event.participants.slice(0, 2).map((participant, i) => (
              <Avatar key={i} className="w-6 h-6 border-2 border-background">
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
    </div>
  );
};

export default CompactCalendarEventCard;
