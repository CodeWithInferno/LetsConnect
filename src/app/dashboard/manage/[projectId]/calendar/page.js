"use client";

import { useState } from 'react';
import Layout from '@/components/Dashboard/Layout';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CompactView from '@/components/Dashboard/calendar/CompactView';
import FullView from '@/components/Dashboard/calendar/FullView';

const HeaderBar = ({ currentDate, onPrev, onNext }) => (
  <div className="flex items-center justify-between p-4 border-b">
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={onPrev}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onNext}>
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
        <Input placeholder="Search events" className="pl-10 w-[300px]" />
      </div>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        New Event
      </Button>
    </div>
  </div>
);

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('compact'); // 'compact' or 'full'
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Handlers to navigate months
  const handlePrev = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNext = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <Layout>
      <div className="h-screen flex flex-col">
        <HeaderBar currentDate={currentDate} onPrev={handlePrev} onNext={handleNext} />
        {/* Toggle for Calendar View */}
        <div className="p-4 border-b flex items-center gap-4">
          <span className="font-semibold">Calendar View:</span>
          <Button
            variant={calendarView === 'compact' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCalendarView('compact')}
          >
            Compact
          </Button>
          <Button
            variant={calendarView === 'full' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCalendarView('full')}
          >
            Full
          </Button>
        </div>
        {/* Render the selected view */}
        <div className="flex-1 flex overflow-hidden">
          {calendarView === 'compact' ? (
            <CompactView
              currentDate={currentDate}
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
              setCurrentDate={setCurrentDate}
            />
          ) : (
            <FullView
              currentDate={currentDate}
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
