"use client";

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

const generateMonthMatrix = (currentDate) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  const startDayOfWeek = startOfMonth.getDay();
  const totalDays = endOfMonth.getDate();
  const matrix = [];
  let week = [];

  // Fill initial empty cells if the month doesn't start on Sunday
  for (let i = 0; i < startDayOfWeek; i++) {
    week.push(null);
  }

  // Fill in the days of the month
  for (let day = 1; day <= totalDays; day++) {
    week.push(new Date(year, month, day));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    matrix.push(week);
  }
  return matrix;
};

const FullView = ({ currentDate, selectedEvent, setSelectedEvent }) => (
  <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-transparent">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        {currentDate.toLocaleDateString('en-GB', {
          month: 'long',
          year: 'numeric'
        })}
      </h2>
      <div className="grid grid-cols-7 gap-0">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium py-2 border-b border-gray-300 dark:border-gray-600 dark:text-gray-300">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0 mt-2">
        {generateMonthMatrix(currentDate).flat().map((day, i) => {
          if (day) {
            const dayString = day.toISOString().split('T')[0];
            const dayEvents = events.filter(event => event.date === dayString);
            return (
              <div 
                key={i} 
                className={`h-24 border p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800
                  ${day.getDate() === currentDate.getDate() 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200'}
                  dark:border-gray-600
                `}
                onClick={() => setSelectedEvent(dayEvents[0] || null)}
              >
                <div className="text-sm font-semibold">
                  {day.toLocaleDateString('en-GB', { day: 'numeric' })}
                </div>
                {dayEvents.length > 0 && (
                  <div className="mt-1">
                    <span className="text-xs bg-gray-400 text-white px-1 rounded dark:bg-gray-700">
                      {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            );
          } else {
            return <div key={i} className="h-24 border dark:border-gray-600" />;
          }
        })}
      </div>
      {selectedEvent && (
        <div className="mt-6 border-t pt-4 border-gray-300 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{selectedEvent.title}</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Time</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{selectedEvent.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Location</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{selectedEvent.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Participants</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedEvent.participants.map((participant, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-400 text-white rounded-full text-sm">
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
);

export default FullView;
