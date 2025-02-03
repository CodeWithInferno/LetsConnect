// "use client";

// import { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import Layout from "@/components/Dashboard/Layout";
// import { PlusCircle, MoreHorizontal, Calendar, Tag, AlertCircle, Clock, X } from "lucide-react";

// const initialColumns = {
//   backlog: {
//     name: "Backlog",
//     color: "#6366F1",
//     tasks: [
//       { 
//         id: "1", 
//         content: "Research user requirements",
//         priority: "low",
//         dueDate: "2024-02-15",
//         tags: ["research"]
//       }
//     ],
//   },
//   todo: {
//     name: "To Do",
//     color: "#EC4899",
//     tasks: [
//       { 
//         id: "2", 
//         content: "Design user interface mockups",
//         priority: "high",
//         dueDate: "2024-02-10",
//         tags: ["design", "ui"]
//       }
//     ],
//   },
//   inProgress: {
//     name: "In Progress",
//     color: "#14B8A6",
//     tasks: [
//       { 
//         id: "3", 
//         content: "Implement authentication system",
//         priority: "medium",
//         dueDate: "2024-02-12",
//         tags: ["backend"]
//       }
//     ],
//   },
//   review: {
//     name: "Review",
//     color: "#F59E0B",
//     tasks: [],
//   },
//   done: {
//     name: "Done",
//     color: "#84CC16",
//     tasks: [],
//   }
// };

// const priorityConfig = {
//   low: { color: "bg-emerald-500", text: "Low" },
//   medium: { color: "bg-amber-500", text: "Medium" },
//   high: { color: "bg-rose-500", text: "High" }
// };

// export default function KanbanPage() {
//   const [columns, setColumns] = useState(initialColumns);
//   const [newTask, setNewTask] = useState("");
//   const [selectedPriority, setSelectedPriority] = useState("medium");
//   const [dueDate, setDueDate] = useState("");
//   const [newTag, setNewTag] = useState("");
//   const [tags, setTags] = useState([]);
//   const [showNewTask, setShowNewTask] = useState(false);

//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const { source, destination } = result;

//     if (source.droppableId === destination.droppableId) {
//       const column = columns[source.droppableId];
//       const copiedTasks = [...column.tasks];
//       const [movedTask] = copiedTasks.splice(source.index, 1);
//       copiedTasks.splice(destination.index, 0, movedTask);

//       setColumns({
//         ...columns,
//         [source.droppableId]: { ...column, tasks: copiedTasks },
//       });
//     } else {
//       const sourceColumn = columns[source.droppableId];
//       const destColumn = columns[destination.droppableId];
//       const sourceTasks = [...sourceColumn.tasks];
//       const destTasks = [...destColumn.tasks];

//       const [movedTask] = sourceTasks.splice(source.index, 1);
//       destTasks.splice(destination.index, 0, movedTask);

//       setColumns({
//         ...columns,
//         [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
//         [destination.droppableId]: { ...destColumn, tasks: destTasks },
//       });
//     }
//   };

//   const addNewTask = () => {
//     if (newTask.trim() === "") return;

//     const newTaskObj = {
//       id: Date.now().toString(),
//       content: newTask,
//       priority: selectedPriority,
//       dueDate: dueDate,
//       tags: tags
//     };

//     setColumns((prev) => ({
//       ...prev,
//       backlog: { ...prev.backlog, tasks: [...prev.backlog.tasks, newTaskObj] },
//     }));
    
//     setNewTask("");
//     setDueDate("");
//     setTags([]);
//     setShowNewTask(false);
//   };

//   const addTag = () => {
//     if (newTag.trim() && !tags.includes(newTag)) {
//       setTags([...tags, newTag.trim()]);
//       setNewTag("");
//     }
//   };

//   const removeTag = (tagToRemove) => {
//     setTags(tags.filter(tag => tag !== tagToRemove));
//   };

//   return (
//     <Layout>
//       <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 py-4 md:py-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
//           <div className="mb-4 md:mb-0">
//             <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Project Dashboard</h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and manage your project tasks</p>
//           </div>
//           <button
//             onClick={() => setShowNewTask(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto"
//           >
//             <PlusCircle className="w-5 h-5" />
//             Add Task
//           </button>
//         </div>

//         {/* New Task Form */}
//         {showNewTask && (
//           <div className="px-4 md:px-8 py-4 md:py-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700 space-y-4">
//             <div className="max-w-4xl mx-auto space-y-4">
//               <input
//                 type="text"
//                 placeholder="What needs to be done?"
//                 value={newTask}
//                 onChange={(e) => setNewTask(e.target.value)}
//                 className="w-full px-4 py-3 text-lg bg-gray-50 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
//               />
              
//               <div className="flex gap-4 flex-col md:flex-row">
//                 <div className="flex-1">
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
//                   <select
//                     value={selectedPriority}
//                     onChange={(e) => setSelectedPriority(e.target.value)}
//                     className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                   >
//                     {Object.entries(priorityConfig).map(([key, value]) => (
//                       <option key={key} value={key}>{value.text}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div className="flex-1">
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
//                   <input
//                     type="date"
//                     value={dueDate}
//                     onChange={(e) => setDueDate(e.target.value)}
//                     className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
//                 <div className="flex gap-2 items-center flex-col md:flex-row">
//                   <input
//                     type="text"
//                     placeholder="Add tag..."
//                     value={newTag}
//                     onChange={(e) => setNewTag(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && addTag()}
//                     className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <button
//                     onClick={addTag}
//                     className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors w-full md:w-auto"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {tags.map((tag) => (
//                     <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">
//                       {tag}
//                       <X className="w-4 h-4 cursor-pointer hover:text-gray-700" onClick={() => removeTag(tag)} />
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 flex-col md:flex-row">
//                 <button
//                   onClick={() => setShowNewTask(false)}
//                   className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full md:w-auto"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={addNewTask}
//                   className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto"
//                 >
//                   Create Task
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Kanban Board */}
//         <DragDropContext onDragEnd={onDragEnd}>
//           <div className="flex-1 p-4 md:p-8 overflow-x-auto">
//             <div className="flex gap-4 md:gap-6 min-h-full" style={{ minWidth: `${Object.keys(columns).length * 320}px` }}>
//               {Object.entries(columns).map(([columnId, column]) => (
//                 <div key={columnId} className="flex flex-col w-72 min-w-72 bg-gray-100 dark:bg-gray-800 rounded-xl">
//                   <div className="p-3 md:p-4 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
//                       <h3 className="font-semibold text-gray-900 dark:text-gray-100">
//                         {column.name}
//                       </h3>
//                       <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
//                         {column.tasks.length}
//                       </span>
//                     </div>
//                     <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
//                       <MoreHorizontal className="w-5 h-5 text-gray-500" />
//                     </button>
//                   </div>

//                   <Droppable droppableId={columnId}>
//                     {(provided, snapshot) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.droppableProps}
//                         className={`flex-1 p-1 md:p-2 ${
//                           snapshot.isDraggingOver ? "bg-gray-200 dark:bg-gray-700" : ""
//                         }`}
//                       >
//                         {column.tasks.map((task, index) => (
//                           <Draggable key={task.id} draggableId={task.id} index={index}>
//                             {(provided) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 className="mb-2 md:mb-3 p-3 md:p-4 bg-white dark:bg-gray-750 rounded-lg shadow-sm hover:shadow-md transition-shadow"
//                               >
//                                 <div className="flex items-center gap-2 mb-3">
//                                   <span className={`w-2 h-2 rounded-full ${priorityConfig[task.priority].color}`} />
//                                   <span className="text-xs font-medium  text-gray-500">
//                                     {priorityConfig[task.priority].text}
//                                   </span>
//                                 </div>
                                
//                                 <p className="text-gray-900 dark:text-black font-medium mb-3">
//                                   {task.content}
//                                 </p>

//                                 <div className="flex flex-wrap gap-2 mb-3">
//                                   {task.tags?.map((tag) => (
//                                     <span
//                                       key={tag}
//                                       className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium"
//                                     >
//                                       {tag}
//                                     </span>
//                                   ))}
//                                 </div>

//                                 {task.dueDate && (
//                                   <div className="flex items-center gap-1 text-xs text-gray-500">
//                                     <Clock className="w-4 h-4" />
//                                     {new Date(task.dueDate).toLocaleDateString()}
//                                   </div>
//                                 )}
//                               </div>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Droppable>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </DragDropContext>
//       </div>
//     </Layout>
//   );
// }










// "use client";

// import { useState } from "react";
// import { DragDropContext } from "react-beautiful-dnd";
// import Layout from "@/components/Dashboard/Layout";
// import KanbanHeader from "@/components/Dashboard/Kanban/KanbanHeader";
// import NewTaskForm from "@/components/Dashboard/Kanban/NewTaskForm";
// import KanbanBoard from "@/components/Dashboard/Kanban/KanbanBoard";
// import { Clock, MoreHorizontal } from "lucide-react"; // Add MoreHorizontal here


// // Example initial columns – update with your actual data if needed.
// const initialColumns = {
//   backlog: {
//     name: "Backlog",
//     color: "#6366F1",
//     tasks: [
//       { 
//         id: "1", 
//         content: "Research user requirements",
//         priority: "low",
//         dueDate: "2024-02-15",
//         tags: ["research"]
//       }
//     ]
//   },
//   todo: {
//     name: "To Do",
//     color: "#EC4899",
//     tasks: [
//       { 
//         id: "2", 
//         content: "Design UI mockups",
//         priority: "high",
//         dueDate: "2024-02-10",
//         tags: ["design", "ui"]
//       }
//     ]
//   }
//   // Add additional columns as needed
// };

// export default function KanbanPage() {
//   const [columns, setColumns] = useState(initialColumns);
//   const [newTask, setNewTask] = useState("");
//   const [selectedPriority, setSelectedPriority] = useState("medium");
//   const [dueDate, setDueDate] = useState("");
//   const [newTag, setNewTag] = useState("");
//   const [tags, setTags] = useState([]);
//   const [showNewTask, setShowNewTask] = useState(false);

//   // Define the onDragEnd function to handle drag events
//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const { source, destination } = result;

//     // If dragging within the same column
//     if (source.droppableId === destination.droppableId) {
//       const column = columns[source.droppableId];
//       const updatedTasks = Array.from(column.tasks);
//       const [removed] = updatedTasks.splice(source.index, 1);
//       updatedTasks.splice(destination.index, 0, removed);

//       setColumns({
//         ...columns,
//         [source.droppableId]: { ...column, tasks: updatedTasks }
//       });
//     } else {
//       // If dragging between different columns
//       const sourceColumn = columns[source.droppableId];
//       const destColumn = columns[destination.droppableId];
//       const sourceTasks = Array.from(sourceColumn.tasks);
//       const destTasks = Array.from(destColumn.tasks);
//       const [removed] = sourceTasks.splice(source.index, 1);
//       destTasks.splice(destination.index, 0, removed);

//       setColumns({
//         ...columns,
//         [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
//         [destination.droppableId]: { ...destColumn, tasks: destTasks }
//       });
//     }
//   };

//   // Define addNewTask to add a new task to the "backlog" column
//   const addNewTask = () => {
//     if (!newTask.trim()) return;
//     const newTaskObj = {
//       id: Date.now().toString(),
//       content: newTask,
//       priority: selectedPriority,
//       dueDate: dueDate,
//       tags: tags
//     };
//     setColumns({
//       ...columns,
//       backlog: {
//         ...columns.backlog,
//         tasks: [...columns.backlog.tasks, newTaskObj]
//       }
//     });
//     setNewTask("");
//     setDueDate("");
//     setTags([]);
//     setShowNewTask(false);
//   };

//   // Define addTag and removeTag for managing tags in the new task form
//   const addTag = () => {
//     if (newTag.trim() && !tags.includes(newTag)) {
//       setTags([...tags, newTag.trim()]);
//       setNewTag("");
//     }
//   };

//   const removeTag = (tag) => {
//     setTags(tags.filter((t) => t !== tag));
//   };

//   return (
//     <Layout>
//       <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
//         <KanbanHeader setShowNewTask={setShowNewTask} />
        
//         {showNewTask && (
//           <NewTaskForm
//             newTask={newTask}
//             setNewTask={setNewTask}
//             selectedPriority={selectedPriority}
//             setSelectedPriority={setSelectedPriority}
//             dueDate={dueDate}
//             setDueDate={setDueDate}
//             newTag={newTag}
//             setNewTag={setNewTag}
//             tags={tags}
//             addTag={addTag}
//             removeTag={removeTag}
//             addNewTask={addNewTask}
//             setShowNewTask={setShowNewTask}
//           />
//         )}

//         <DragDropContext onDragEnd={onDragEnd}>
//           <KanbanBoard columns={columns} />
//         </DragDropContext>
//       </div>
//     </Layout>
//   );
// }










"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DragDropContext } from "react-beautiful-dnd";
import Layout from "@/components/Dashboard/Layout";
import KanbanHeader from "@/components/Dashboard/Kanban/KanbanHeader";
import NewTaskForm from "@/components/Dashboard/Kanban/NewTaskForm";
import KanbanBoard from "@/components/Dashboard/Kanban/KanbanBoard";

// GraphQL query to fetch the Kanban board for a given project
const GET_KANBAN_BOARD_QUERY = `
query GetKanbanBoard($projectId: ID!) {
  kanbanBoard(projectId: $projectId) {
    id
    columns {
      id
      title
      color
      order
      tasks {
        id
        content
        priority
        dueDate
        tags
      }
    }
  }
}
`;

// GraphQL mutation to update a task's column and position
const MOVE_KANBAN_TASK_MUTATION = `
mutation MoveKanbanTask($taskId: ID!, $sourceColumnId: ID!, $destinationColumnId: ID!, $newIndex: Int!, $projectId: ID!) {
  moveKanbanTask(taskId: $taskId, sourceColumnId: $sourceColumnId, destinationColumnId: $destinationColumnId, newIndex: $newIndex, projectId: $projectId) {
    id
    content
    priority
    dueDate
    tags
    column {
      id
      title
      color
    }
  }
}
`;

// GraphQL mutation to create a new Kanban task
const CREATE_KANBAN_TASK_MUTATION = `
mutation CreateKanbanTask($projectId: ID!, $columnId: ID!, $content: String!, $priority: String!, $dueDate: String, $tags: [String!]) {
  createKanbanTask(projectId: $projectId, columnId: $columnId, content: $content, priority: $priority, dueDate: $dueDate, tags: $tags) {
    id
    content
    priority
    dueDate
    tags
    column {
      id
      title
      color
    }
    project {
      id
      title
    }
  }
}
`;

export default function KanbanPage() {
  // Extract projectId from the URL
  const { projectId } = useParams();

  // Local state for board data and loading/error states
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local state for new task form
  const [newTask, setNewTask] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState([]);
  const [showNewTask, setShowNewTask] = useState(false);

  // Fallback board structure (if no board data is found)
  const fallbackColumns = {
    "todo": {
      name: "To Do",
      color: "#6366F1",
      tasks: []
    },
    "inprogress": {
      name: "In Progress",
      color: "#EC4899",
      tasks: []
    },
    "done": {
      name: "Done",
      color: "#10B981",
      tasks: []
    }
  };

  // Fetch the board data when the projectId is available
  useEffect(() => {
    if (projectId) {
      fetchKanbanBoard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function fetchKanbanBoard() {
    try {
      setLoading(true);
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: GET_KANBAN_BOARD_QUERY,
          variables: { projectId },
        }),
      });
      const { data, errors } = await res.json();
      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }
      if (!data?.kanbanBoard) {
        // If no board data is found, use the fallback board
        setColumns(fallbackColumns);
        return;
      }
      const boardColumns = data.kanbanBoard.columns;
      // Transform the array of columns into an object keyed by column id
      const transformedColumns = boardColumns.reduce((acc, column) => {
        acc[column.id] = {
          name: column.title,
          color: column.color,
          tasks: column.tasks.map((task) => ({
            id: task.id,
            content: task.content,
            priority: task.priority,
            dueDate: task.dueDate,
            tags: task.tags,
          })),
        };
        return acc;
      }, {});
      setColumns(transformedColumns);
    } catch (err) {
      console.error("Error fetching Kanban board:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Function to call the GraphQL mutation to move a task
  async function moveTask(taskId, sourceColumnId, destinationColumnId, newIndex) {
    const res = await fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        query: MOVE_KANBAN_TASK_MUTATION,
        variables: { taskId, sourceColumnId, destinationColumnId, newIndex, projectId },
      }),
    });
    const { data, errors } = await res.json();
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }
    return data.moveKanbanTask;
  }

  // Function to call the GraphQL mutation and save a new task in the DB
  async function saveNewTask(projectId, columnId, content, priority, dueDate, tags) {
    const res = await fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        query: CREATE_KANBAN_TASK_MUTATION,
        variables: { projectId, columnId, content, priority, dueDate, tags },
      }),
    });
    const { data, errors } = await res.json();
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }
    return data.createKanbanTask;
  }

  // Handle drag-and-drop events
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    // If dragging within the same column, just update local state
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const updatedTasks = Array.from(column.tasks);
      const [removed] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: { ...column, tasks: updatedTasks },
      });
    } else {
      // If dragging between columns, update the DB then local state
      try {
        await moveTask(draggableId, source.droppableId, destination.droppableId, destination.index);

        // Update local state: remove from source and add to destination
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceTasks = Array.from(sourceColumn.tasks);
        const destTasks = Array.from(destColumn.tasks);
        const [removed] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, removed);

        setColumns({
          ...columns,
          [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
          [destination.droppableId]: { ...destColumn, tasks: destTasks },
        });
      } catch (err) {
        console.error("Error moving task:", err);
        // Optionally, you can show an error message to the user here.
      }
    }
  };

  // Function to add a new task. This calls the GraphQL mutation to persist the task,
  // then updates local state with the returned task.
  const addNewTask = async () => {
    if (!newTask.trim()) return;

    // Use the first available column as the default target for new tasks
    const defaultColumnKey = Object.keys(columns)[0];
    if (!defaultColumnKey) return;

    try {
      const savedTask = await saveNewTask(
        projectId,
        defaultColumnKey,
        newTask,
        selectedPriority,
        dueDate,
        tags
      );

      // Update local state: append the new task to the default column's tasks.
      setColumns({
        ...columns,
        [defaultColumnKey]: {
          ...columns[defaultColumnKey],
          tasks: [...columns[defaultColumnKey].tasks, savedTask],
        },
      });
      // Reset new task form state
      setNewTask("");
      setDueDate("");
      setTags([]);
      setShowNewTask(false);
    } catch (err) {
      console.error("Error saving new task:", err);
      // Optionally update error state here
    }
  };

  // Functions to add and remove tags in the new task form
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  if (loading) return <div>Loading Kanban board...</div>;
  if (error) return <div>Error loading Kanban board: {error}</div>;

  return (
    <Layout>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        <KanbanHeader setShowNewTask={setShowNewTask} />

        {showNewTask && (
          <NewTaskForm
            newTask={newTask}
            setNewTask={setNewTask}
            selectedPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
            dueDate={dueDate}
            setDueDate={setDueDate}
            newTag={newTag}
            setNewTag={setNewTag}
            tags={tags}
            addTag={addTag}
            removeTag={removeTag}
            addNewTask={addNewTask}
            setShowNewTask={setShowNewTask}
          />
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <KanbanBoard columns={columns} />
        </DragDropContext>
      </div>
    </Layout>
  );
}
