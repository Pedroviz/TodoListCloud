import { tasks, type Task, type InsertTask } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, completed: boolean): Promise<Task>;
  deleteTask(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async updateTask(id: number, completed: boolean): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set({ completed })
      .where(eq(tasks.id, id))
      .returning();

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const [task] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    if (!task) {
      throw new Error("Task not found");
    }
  }
}

export const storage = new DatabaseStorage();