import { tasks, categories, type Task, type InsertTask, type Category, type InsertCategory } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, completed: boolean): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    // Convert ISO string to Date object for the database
    const taskData = {
      ...insertTask,
      dueDate: insertTask.dueDate ? new Date(insertTask.dueDate) : null,
    };

    const [task] = await db
      .insert(tasks)
      .values(taskData)
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

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const [category] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    if (!category) {
      throw new Error("Category not found");
    }
  }
}

export const storage = new DatabaseStorage();