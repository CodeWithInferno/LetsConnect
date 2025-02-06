"use client";

import { Draggable, Droppable } from "react-beautiful-dnd";
import { Clock, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const priorityConfig = {
  low: { color: "bg-emerald-500", text: "Low" },
  medium: { color: "bg-amber-500", text: "Medium" },
  high: { color: "bg-rose-500", text: "High" }
};

export default function KanbanBoard({ columns }) {
  return (
    <div className="flex-1 p-4 md:p-8 overflow-x-auto">
      <div
        className="flex gap-4 md:gap-6 min-h-full"
        style={{ minWidth: `${Object.keys(columns).length * 320}px` }}
      >
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="flex flex-col w-72 min-w-72 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <div className="p-3 md:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {column.name}
                </h3>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                  {column.tasks.length}
                </span>
              </div>
              <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-1 md:p-2 ${snapshot.isDraggingOver ? "bg-gray-200 dark:bg-gray-700" : ""}`}
                >
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-2 md:mb-3 p-3 md:p-4 bg-white dark:bg-gray-750 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`w-2 h-2 rounded-full ${priorityConfig[task.priority].color}`} />
                            <span className="text-xs font-medium text-gray-500">
                              {priorityConfig[task.priority].text}
                            </span>
                          </div>
                          
                          <p className="text-gray-900 dark:text-black font-medium mb-3">
                            {task.content}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {task.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          

                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-4 h-4" />
                              {new Date(task.dueDate).toLocaleDateString()}
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
    </div>
  );
}
