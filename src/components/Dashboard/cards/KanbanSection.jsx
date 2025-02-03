"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import KanbanBoard from "./KanbanBoard";

export default function KanbanSection({ columns, onTaskDragEnd }) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Project Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <KanbanBoard columns={columns} onTaskDragEnd={onTaskDragEnd} />
      </CardContent>
    </Card>
  );
}