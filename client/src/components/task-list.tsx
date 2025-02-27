import { useQuery, useMutation } from "@tanstack/react-query";
import { type Task, type Category } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function TaskList() {
  const { toast } = useToast();

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
      {tasks.map((task) => {
        const category = categories?.find((c) => c.id === task.categoryId);

        return (
          <div
            key={task.id}
            className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) =>
                updateMutation.mutate({ id: task.id, completed: !!checked })
              }
              disabled={updateMutation.isPending}
            />
            <div className="flex-1 space-y-1">
              <span
                className={task.completed ? "line-through text-muted-foreground" : ""}
              >
                {task.title}
              </span>
              {category && (
                <Badge
                  variant="outline"
                  className="ml-2"
                  style={{
                    backgroundColor: category.color + "20",
                    borderColor: category.color,
                  }}
                >
                  {category.name}
                </Badge>
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