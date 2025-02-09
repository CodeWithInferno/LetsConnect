"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Updated mutation string with priority and deadline fields included.
const CREATE_CALENDAR_EVENT_MUTATION = `
mutation CreateCalendarEvent(
  $title: String!
  $description: String
  $startTime: String!
  $endTime: String!
  $location: String
  $recurrence: String
  $reminderMinutesBefore: Int
  $projectId: ID
  $assignedTo: ID
  $priority: String
  $deadline: String
) {
  createCalendarEvent(
    title: $title,
    description: $description,
    startTime: $startTime,
    endTime: $endTime,
    location: $location,
    recurrence: $recurrence,
    reminderMinutesBefore: $reminderMinutesBefore,
    projectId: $projectId,
    assignedTo: $assignedTo,
    priority: $priority,
    deadline: $deadline
  ) {
    id
    title
    startTime
    endTime
    location
    recurrence
    reminderMinutesBefore
    priority
    deadline
    organizer {
      id
      name
      email
    }
    assignedTo {
      id
      name
      email
    }
    createdAt
    updatedAt
  }
}
`;

const AddEvent = ({ isOpen, onClose }) => {
  // Retrieve the dynamic projectId from the URL
  const { projectId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [reminder, setReminder] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare variables for the mutation.
    const variables = {
      title,
      description,
      startTime,
      endTime,
      location,
      recurrence,
      reminderMinutesBefore: reminder ? parseInt(reminder) : null,
      // Use the projectId from useParams instead of null.
      projectId: projectId || null,
      assignedTo: assignedTo || null,
      priority: priority || null,
      deadline: deadline || null,
    };

    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: CREATE_CALENDAR_EVENT_MUTATION,
          variables,
        }),
      });
      const result = await res.json();
      if (result.errors && result.errors.length > 0) {
        console.error("GraphQL errors:", result.errors);
      } else {
        console.log("New Event Created:", result.data.createCalendarEvent);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }

    // Reset the form fields and close the modal.
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setRecurrence("");
    setReminder("");
    setAssignedTo("");
    setPriority("");
    setDeadline("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-white">
            Add New Event
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Fill in the details below to create a new calendar event.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event Title"
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event Description"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Start Time
              </label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                End Time
              </label>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Event Location"
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Recurrence
            </label>
            <Input
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
              placeholder="e.g. FREQ=DAILY;INTERVAL=1"
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Reminder (minutes before)
            </label>
            <Input
              type="number"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              placeholder="e.g. 15"
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Assigned To
            </label>
            <Input
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="User ID of assigned member"
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Deadline
            </label>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Deadline"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Event</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEvent;
