"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import KanbanBoard from "./kanbanboard"

export default function KanbanSection({ columns, onTaskDragEnd }) {
  return (
    <Card className="mt-6 border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold">Project Tasks</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <KanbanBoard columns={columns} onTaskDragEnd={onTaskDragEnd} />
      </CardContent>
    </Card>
  )
}

