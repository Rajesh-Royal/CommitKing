import { sql } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Supabase user interface from GitHub auth
export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    sub: string; // GitHub ID
    name: string;
    full_name: string;
    user_name: string;
    avatar_url: string;
    email: string;
    preferred_username: string;
  };
  created_at: string;
  updated_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
}

// Ratings table - now references Supabase auth.users directly via user_id (UUID)
export const ratings = pgTable(
  'ratings',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: uuid('user_id').notNull(), // References auth.users(id) from Supabase
    github_id: text('github_id').notNull(),
    github_username: text('github_username'),
    full_name: text('full_name'),
    type: text('type').notNull(), // 'profile' or 'repo'
    rating: text('rating').notNull(), // 'hotty' or 'notty'
    created_at: timestamp('created_at').defaultNow(),
  },
  table => [
    // Prevent duplicate ratings by the same user for the same item
    uniqueIndex('unique_rating').on(table.user_id, table.github_id, table.type),
  ]
);

// Leaderboard cache table
export const leaderboard_cache = pgTable('leaderboard_cache', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  github_id: text('github_id').notNull().unique(),
  type: text('type').notNull(),
  username: text('username'),
  hotty_count: integer('hotty_count').default(0),
  notty_count: integer('notty_count').default(0),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Schemas and types - removed users table references
export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  created_at: true,
});

export const insertLeaderboardCacheSchema = createInsertSchema(
  leaderboard_cache
).omit({
  id: true,
  updated_at: true,
});

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type LeaderboardCache = typeof leaderboard_cache.$inferSelect;
export type InsertLeaderboardCache = z.infer<
  typeof insertLeaderboardCacheSchema
>;
