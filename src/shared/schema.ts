import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  github_id: text("github_id").notNull().unique(),
  username: text("username").notNull(),
  avatar_url: text("avatar_url"),
  created_at: timestamp("created_at").defaultNow(),
});

export const ratings = pgTable("ratings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").references(() => users.id).notNull(),
  github_id: text("github_id").notNull(),
  github_username: text("github_username"), 
  full_name: text("full_name"), 
  type: text("type").notNull(), // 'profile' or 'repo'
  rating: text("rating").notNull(), // 'hotty' or 'notty'
  created_at: timestamp("created_at").defaultNow(),
});

export const leaderboard_cache = pgTable("leaderboard_cache", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  github_id: text("github_id").notNull().unique(),
  type: text("type").notNull(),
  username: text("username"),
  hotty_count: integer("hotty_count").default(0),
  notty_count: integer("notty_count").default(0),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  created_at: true,
});

export const insertLeaderboardCacheSchema = createInsertSchema(leaderboard_cache).omit({
  id: true,
  updated_at: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type LeaderboardCache = typeof leaderboard_cache.$inferSelect;
export type InsertLeaderboardCache = z.infer<typeof insertLeaderboardCacheSchema>;
