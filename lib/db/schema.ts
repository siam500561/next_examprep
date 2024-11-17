import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar().notNull(),
  username: varchar().notNull(),
  email: varchar().notNull(),
  isMember: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
});
