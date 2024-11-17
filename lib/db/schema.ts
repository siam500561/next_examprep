import {
  boolean,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  clerkId: varchar("clerk_id").notNull().unique(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull(),
  isMember: boolean("is_member").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const materialsTable = pgTable("materials", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  courseId: varchar("course_id").notNull().unique(),
  courseType: varchar("course_type").notNull(),
  topic: varchar("topic").notNull(),
  difficultyLevel: varchar("difficulty_level").notNull(),
  courseLayout: json("course_layout"),
  status: varchar("status").default("Generating"),
  createdBy: varchar("created_by").references(() => usersTable.clerkId, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chapterNotesTable = pgTable("chapter_notes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  courseId: varchar("course_id").references(() => materialsTable.courseId, {
    onDelete: "cascade",
  }),
  chapterId: integer("chapter_id").notNull(),
  notes: text(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Material = typeof materialsTable.$inferSelect;
