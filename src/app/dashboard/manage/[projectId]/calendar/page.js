// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import Layout from "@/components/Dashboard/Layout";
// import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import CompactView from "@/components/Dashboard/calendar/CompactView";
// import FullView from "@/components/Dashboard/calendar/FullView";
// import AddEvent from "@/components/Dashboard/calendar/AddEvent";

// const HeaderBar = ({ currentDate, onPrev, onNext, setIsAddEventOpen }) => (
//   <div className="flex items-center justify-between p-4 border-b">
//     <div className="flex items-center gap-2">
//       <Button variant="ghost" size="icon" onClick={onPrev}>
//         <ChevronLeft className="h-5 w-5" />
//       </Button>
//       <Button variant="ghost" size="icon" onClick={onNext}>
//         <ChevronRight className="h-5 w-5" />
//       </Button>
//       <span className="ml-4 text-lg font-semibold">
//         {currentDate.toLocaleDateString("en-US", {
//           weekday: "long",
//           month: "long",
//           day: "numeric",
//         })}
//       </span>
//     </div>
//     <div className="flex items-center gap-4">
//       <div className="relative">
//         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//         <Input placeholder="Search events" className="pl-10 w-[300px]" />
//       </div>
//       <Button variant="default" onClick={() => setIsAddEventOpen(true)}>
//         <Plus className="mr-2 h-4 w-4" />
//         New Event
//       </Button>
//     </div>
//   </div>
// );

// export default function CalendarPage() {
//   const { projectId } = useParams(); 
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [calendarView, setCalendarView] = useState("compact"); 
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [isAddEventOpen, setIsAddEventOpen] = useState(false);

//   // Fetched events
//   const [events, setEvents] = useState([]);
//   const [loadingEvents, setLoadingEvents] = useState(true);
//   const [eventsError, setEventsError] = useState(null);

//   const GET_CALENDAR_EVENTS_QUERY = `
//     query GetCalendarEvents($projectId: ID!) {
//       calendarEvents(projectId: $projectId) {
//         id
//         title
//         startTime
//         endTime
//         location
//         recurrence
//         reminderMinutesBefore
//         priority
//         deadline
//         organizer {
//           id
//           name
//           email
//         }
//         assignedTo {
//           id
//           name
//           email
//           profile_picture
//         }
//         participants {
//           user {
//             id
//             name
//             email
//             profile_picture
//           }
//         }
//       }
//     }
//   `;

//   useEffect(() => {
//     if (!projectId) return;

//     const fetchEvents = async () => {
//       try {
//         const res = await fetch("/api/graphql", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             query: GET_CALENDAR_EVENTS_QUERY,
//             variables: { projectId },
//           }),
//         });
//         const data = await res.json();
//         if (data.errors) {
//           setEventsError(data.errors);
//         } else {
//           setEvents(data.data.calendarEvents || []);
//         }
//       } catch (err) {
//         setEventsError(err);
//       } finally {
//         setLoadingEvents(false);
//       }
//     };

//     fetchEvents();
//   }, [projectId]);

//   // Handlers to navigate months
//   const handlePrev = () => {
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
//     );
//   };

//   const handleNext = () => {
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
//     );
//   };

//   if (loadingEvents) {
//     return (
//       <Layout>
//         <p className="p-4">Loading events...</p>
//       </Layout>
//     );
//   }
//   if (eventsError) {
//     return (
//       <Layout>
//         <p className="p-4">Error loading events.</p>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="h-screen flex flex-col">
//         {/* Calendar Header */}
//         <HeaderBar
//           currentDate={currentDate}
//           onPrev={handlePrev}
//           onNext={handleNext}
//           setIsAddEventOpen={setIsAddEventOpen}
//         />

//         {/* Toggle for Calendar View */}
//         <div className="p-4 border-b flex items-center gap-4">
//           <span className="font-semibold">Calendar View:</span>
//           <Button
//             variant={calendarView === "compact" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setCalendarView("compact")}
//           >
//             Compact
//           </Button>
//           <Button
//             variant={calendarView === "full" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setCalendarView("full")}
//           >
//             Full
//           </Button>
//         </div>

//         {/* Render the selected view and pass the fetched events */}
//         <div className="flex-1 flex overflow-hidden">
//           {calendarView === "compact" ? (
//             <CompactView
//               currentDate={currentDate}
//               selectedEvent={selectedEvent}
//               setSelectedEvent={setSelectedEvent}
//               setCurrentDate={setCurrentDate}
//               events={events} 
//             />
//           ) : (
//             <FullView
//               currentDate={currentDate}
//               selectedEvent={selectedEvent}
//               setSelectedEvent={setSelectedEvent}
//               events={events}
//             />
//           )}
//         </div>

//         {/* Modal to add new event */}
//         <AddEvent
//           isOpen={isAddEventOpen}
//           onClose={() => setIsAddEventOpen(false)}
//         />
//       </div>
//     </Layout>
//   );
// }
