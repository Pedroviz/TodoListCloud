import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TaskForm from "@/components/task-form";
import TaskList from "@/components/task-list";
import CategoryManager from "@/components/category-manager";

export default function Home() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <TaskForm />
            <TaskList />
            <Separator className="my-6" />
            <CategoryManager />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}