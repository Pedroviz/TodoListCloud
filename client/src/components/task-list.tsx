import { useQuery, useMutation } from "@tanstack/react-query";
import { type Task, type Category } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, CalendarIcon, Flag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format, isPast, isToday } from "date-fns";
import { useState } from "react";
import Confetti from "./confetti";

function PriorityFlag({ priority }: { priority: string }) {
  const colorMap = {
    low: "text-slate-400",
    medium: "text-orange-400",
    high: "text-red-500",
  };

  return (
    <Flag 
      className={`h-4 w-4 ${colorMap[priority as keyof typeof colorMap]}`} 
    />
  );
}

export default function TaskList() {
  const { toast } = useToast();
  const [confetti, setConfetti] = useState<{ x: number; y: number } | null>(null);

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, { completed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "The task has been removed from your list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTaskComplete = (taskId: number, completed: boolean, event: React.MouseEvent<HTMLDivElement>) => {
    const taskItem = event.currentTarget.closest('[data-task-item]') as HTMLElement;
    const rect = taskItem.getBoundingClientRect();

    updateMutation.mutate({ id: taskId, completed });

    if (completed) {
      setConfetti({ 
        x: rect.left + (rect.width / 2), 
        y: rect.top + (rect.height / 2)  
      });
      setTimeout(() => setConfetti(null), 1500); 
    }
  };

  if (tasksLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No tasks yet. Add one above to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {confetti && <Confetti x={confetti.x} y={confetti.y} />}
      {tasks.map((task) => {
        const category = categories?.find((c) => c.id === task.categoryId);
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;

        let dueDateColor = "text-muted-foreground";
        if (dueDate) {
          if (isPast(dueDate) && !isToday(dueDate)) {
            dueDateColor = "text-destructive";
          } else if (isToday(dueDate)) {
            dueDateColor = "text-orange-500";
          }
        }

        return (
          <div
            key={task.id}
            data-task-item
            className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) =>
                handleTaskComplete(task.id, !!checked, event as React.MouseEvent<HTMLDivElement>)
              }
              disabled={updateMutation.isPending}
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={task.completed ? "line-through text-muted-foreground" : ""}
                >
                  {task.title}
                </span>
                <div className="flex items-center gap-2">
                  <PriorityFlag priority={task.priority} />
                  {category && (
                    <Badge
                      variant="outline"
                      style={{
                        backgroundColor: category.color + "20",
                        borderColor: category.color,
                      }}
                    >
                      {category.name}
                    </Badge>
                  )}
                </div>
              </div>
              {dueDate && (
                <div className={`flex items-center gap-1 text-sm ${dueDateColor}`}>
                  <CalendarIcon className="h-3 w-3" />
                  <span>{format(dueDate, "PPP")}</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate(task.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}