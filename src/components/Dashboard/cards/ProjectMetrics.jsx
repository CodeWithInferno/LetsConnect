"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DollarSign, Users, Calendar } from "lucide-react";

export default function ProjectMetrics({ project }) {
  const metrics = [
    {
      label: "Budget",
      value: `$${project.budget}`,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      label: "Team Members",
      value: `${project.members?.length} members`,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Owner",
      value: project.owner?.name,
      icon: Calendar,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={cn("p-3 rounded-full bg-gray-100 dark:bg-gray-700", metric.color)}>
                <metric.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {metric.label}
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {metric.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}