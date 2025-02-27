import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull().default("#94a3b8"), // Default slate-400 color
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  categoryId: serial("category_id").references(() => categories.id),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  tasks: many(tasks),
}));

export const insertTaskSchema = createInsertSchema(tasks)
  .pick({
    title: true,
    categoryId: true,
  })
  .extend({
    title: z.string().min(1, "Task title is required").max(100, "Task title is too long"),
    categoryId: z.number().optional(),
  });

export const insertCategorySchema = createInsertSchema(categories)
  .pick({
    name: true,
    color: true,
  })
  .extend({
    name: z.string().min(1, "Category name is required").max(50, "Category name is too long"),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
  });

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;