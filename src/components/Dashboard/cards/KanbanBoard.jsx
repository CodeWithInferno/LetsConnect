"use client"

import { useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GripVertical } from "lucide-react"

export default function KanbanBoard({ columns, onTaskDragEnd }) {
  useEffect(() => {
    console.log("Updated columns data:", columns)
  }, [columns])

  return (
    <DragDropContext onDragEnd={onTaskDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-6">
        {Object.entries(columns).map(([columnId, column]) => (
          <Card key={columnId} className="flex-shrink-0 w-80 bg-background">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center space-x-3 text-lg">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
                <span>{column.name}</span>
                <Badge variant="secondary" className="ml-auto">
                  {column.tasks.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <CardContent
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn("p-2 min-h-[calc(100vh-15rem)]", snapshot.isDraggingOver && "bg-muted")}
                >
                  <ScrollArea className="h-[calc(100vh-15rem)]">
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              "mb-3 bg-card",
                              snapshot.isDragging && "shadow-lg border-primary",
                              "hover:shadow-md transition-shadow duration-200",
                            )}
                          >
                            <CardContent className="p-4">
                              <div {...provided.dragHandleProps} className="flex items-center justify-between mb-2">
                                <GripVertical className="text-muted-foreground" size={16} />
                                {task.lastModifiedByUser && (
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage
                                      src={task.lastModifiedByUser.profile_picture || "/default-avatar.png"}
                                      alt={task.lastModifiedByUser.name || "Unknown User"}
                                    />
                                    <AvatarFallback>
                                      {task.lastModifiedByUser.name ? task.lastModifiedByUser.name.charAt(0) : "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                              <p className="text-sm text-foreground">{task.content}</p>
                              {task.tags && task.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {task.tags.map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {task.lastModifiedByUser && (
                                <div className="mt-3 text-xs text-muted-foreground">
                                  Last modified by {task.lastModifiedByUser.name || "Unknown"}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ScrollArea>
                </CardContent>
              )}
            </Droppable>
          </Card>
        ))}
      </div>
    </DragDropContext>
  )
}

