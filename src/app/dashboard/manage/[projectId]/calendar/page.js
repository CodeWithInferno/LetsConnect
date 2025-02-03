"use client";

import { useState } from 'react';
import Layout from '@/components/Dashboard/Layout';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Updated dummy data with dates
const events = [
  { 
    id: 1, 
    title: 'Project Kickoff Meeting', 
    date: '2024-03-25',
    time: '2:00 PM - 3:30 PM',
    participants: ['John D.', 'Sarah M.', 'Mike R.'],
    location: 'Conference Room A'
  },
  { 
    id: 2, 
    title: 'Client Presentation Review', 
    date: '2024-03-26',
    time: '10:00 AM - 11:00 AM',
    participants: ['Emily T.', 'David K.'],
    location: 'Zoom Meeting'
  },
  { 
    id: 3, 
    title: 'Team Lunch', 
    date: '2024-03-27',
    time: '12:00 PM - 1:00 PM',
    participants: ['All Team Members'],
    location: 'Main Cafeteria'
  },
];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'week'
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Email-like layout structure
  return (
    <Layout>
      <div className="h-screen flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
            <span className="ml-4 text-lg font-semibold">
              {currentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events"
                className="pl-10 w-[300px]"
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Date Navigator */}
          <div className="w-64 border-r p-4">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-10 flex items-center justify-center rounded-full cursor-pointer
                    ${i + 1 === currentDate.getDate() ? 'bg-primary text-primary-foreground' : ''}
                    hover:bg-accent`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Main Calendar/Email View */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto">
              {/* Timeline Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Schedule</h2>
                <div className="flex gap-2">
                  <Button variant={viewMode === 'day' ? 'default' : 'outline'} size="sm">
                    Day
                  </Button>
                  <Button variant={viewMode === 'week' ? 'default' : 'outline'} size="sm">
                    Week
                  </Button>
                </div>
              </div>

              {/* Events List */}
              <div className="space-y-4">
                {events.map(event => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{event.time}</p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                      <div className="flex -space-x-2">
                        {event.participants.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-accent border-2 border-background"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Event Details */}
          {selectedEvent && (
            <div className="w-96 border-l p-6">
              <h3 className="text-lg font-semibold mb-4">{selectedEvent.title}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedEvent.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedEvent.participants.map((participant, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;