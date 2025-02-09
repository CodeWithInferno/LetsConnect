"use client";
import { useEffect } from "react";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

export default function KanbanBoard({ columns, onTaskDragEnd }) {
  useEffect(() => {
    console.log("Updated columns data:", columns);
  }, [columns]);

  return (
    <DragDropContext onDragEnd={onTaskDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            className="flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-800 rounded-xl"
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {column.name}
                </h3>
                <span className="px-2.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                  {column.tasks.length}
                </span>
              </div>
            </div>
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "p-3 min-h-[calc(100vh-15rem)]",
                    snapshot.isDraggingOver && "bg-gray-100 dark:bg-gray-700"
                  )}
                >
                  {column.tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "mb-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
                            snapshot.isDragging && "shadow-lg border-blue-500",
                            "hover:shadow-md transition-shadow duration-200"
                          )}
                        >
                          <p className="text-gray-900 dark:text-gray-100 text-sm">
                            {task.content}
                          </p>
                          {task.lastModifiedByUser && (
                            <div className="flex items-center gap-2 mt-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage
                                  src={
                                    task.lastModifiedByUser.profile_picture ||
                                    "/default-avatar.png"
                                  }
                                  alt={
                                    task.lastModifiedByUser.name ||
                                    "Unknown User"
                                  }
                                />
                                <AvatarFallback>
                                  {task.lastModifiedByUser.name
                                    ? task.lastModifiedByUser.name.charAt(0)
                                    : "?"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">
                                {task.lastModifiedByUser.name || "Unknown"}{" "}
                                (last modified)
                              </span>
                            </div>
                          )}

                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {task.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
