"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Sample initial data for the Kanban board.
const initialData = {
  tasks: {
    "task-1": { id: "task-1", content: "Design wireframes" },
    "task-2": { id: "task-2", content: "Setup project structure" },
    "task-3": { id: "task-3", content: "Implement authentication" },
    "task-4": { id: "task-4", content: "Write unit tests" },
    "task-5": { id: "task-5", content: "Deploy to production" }
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      taskIds: ["task-1", "task-2"]
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      taskIds: ["task-3"]
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      taskIds: ["task-4", "task-5"]
    }
  },
  // Order of columns.
  columnOrder: ["column-1", "column-2", "column-3"]
};

export default function Kanban({ className = "" }) {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    // If dropped in the same position, do nothing.
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // Moving within the same column.
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...start, taskIds: newTaskIds };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn
        }
      };
      setData(newState);
      return;
    }

    // Moving from one column to another.
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };
    setData(newState);
  };

  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}>
      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Organize Your Tasks
      </h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
            return (
              <div key={column.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex-1">
                <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  {column.title}
                </h4>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[100px] p-2 rounded-lg transition-colors duration-200 ${
                        snapshot.isDraggingOver
                          ? "bg-blue-100 dark:bg-blue-900"
                          : "bg-gray-50 dark:bg-gray-600"
                      }`}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-2 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-200 ${
                                snapshot.isDragging ? "bg-blue-50 dark:bg-blue-800" : ""
                              }`}
                            >
                              {task.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
