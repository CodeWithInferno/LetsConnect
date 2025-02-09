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
        lastModifiedByUser {
          id
          name
          profile_picture
        }
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
      const result = await res.json();
      console.log("GraphQL GET result:", result); // Now result is defined
      const { data, errors } = result;
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
            lastModifiedByUser: task.lastModifiedByUser || null,  // ✅ Include it
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
