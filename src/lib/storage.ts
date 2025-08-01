import { and, desc, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
  type InsertLeaderboardCache,
  type InsertRating,
  type LeaderboardCache,
  type Rating,
  leaderboard_cache,
  ratings,
} from '@/shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(process.env.DATABASE_URL, { prepare: false });
const db = drizzle(client);

export interface IStorage {
  // Rating operations - no more user table operations
  getRating(
    userId: string,
    githubId: string,
    type: string
  ): Promise<Rating | undefined>;
  createRating(rating: InsertRating): Promise<Rating>;
  getRatingCounts(
    githubId: string,
    type: string
  ): Promise<{ hotty: number; notty: number }>;
  getUserRatingCount(userId: string): Promise<number>;

  // Leaderboard operations
  getLeaderboard(type: string, limit?: number): Promise<LeaderboardCache[]>;
  updateLeaderboardCache(
    githubId: string,
    type: string,
    data: InsertLeaderboardCache
  ): Promise<void>;
}

export class DbStorage implements IStorage {
  async getRating(
    userId: string,
    githubId: string,
    type: string
  ): Promise<Rating | undefined> {
    const result = await db
      .select()
      .from(ratings)
      .where(
        and(
          eq(ratings.user_id, userId),
          eq(ratings.github_id, githubId),
          eq(ratings.type, type)
        )
      )
      .limit(1);
    return result[0];
  }

  async createRating(rating: InsertRating): Promise<Rating> {
    const result = await db.insert(ratings).values(rating).returning();

    // Update leaderboard cache
    await this.updateRatingCounts(
      rating.github_id,
      rating.type,
      rating.github_username
    );

    return result[0];
  }

  async getRatingCounts(
    githubId: string,
    type: string
  ): Promise<{ hotty: number; notty: number }> {
    const hottyResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(ratings)
      .where(
        and(
          eq(ratings.github_id, githubId),
          eq(ratings.type, type),
          eq(ratings.rating, 'hotty')
        )
      );

    const nottyResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(ratings)
      .where(
        and(
          eq(ratings.github_id, githubId),
          eq(ratings.type, type),
          eq(ratings.rating, 'notty')
        )
      );

    return {
      hotty: hottyResult[0]?.count || 0,
      notty: nottyResult[0]?.count || 0,
    };
  }

  async getUserRatingCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(ratings)
      .where(eq(ratings.user_id, userId));
    return result[0]?.count || 0;
  }

  async getLeaderboard(type: string, limit = 50): Promise<LeaderboardCache[]> {
    return await db
      .select()
      .from(leaderboard_cache)
      .where(eq(leaderboard_cache.type, type))
      .orderBy(
        desc(
          sql`${leaderboard_cache.hotty_count} - ${leaderboard_cache.notty_count}`
        )
      )
      .limit(limit);
  }

  async updateLeaderboardCache(
    githubId: string,
    type: string,
    data: Partial<InsertLeaderboardCache>
  ): Promise<void> {
    await db
      .insert(leaderboard_cache)
      .values({ github_id: githubId, type, ...data })
      .onConflictDoUpdate({
        target: leaderboard_cache.github_id,
        set: { ...data, updated_at: sql`now()` },
      });
  }

  private async updateRatingCounts(
    githubId: string,
    type: string,
    githubUsername?: string | null
  ): Promise<void> {
    const counts = await this.getRatingCounts(githubId, type);

    // No more user lookup needed - just update with what we have
    await this.updateLeaderboardCache(githubId, type, {
      github_id: githubId,
      type,
      hotty_count: counts.hotty,
      notty_count: counts.notty,
      username: githubUsername,
    });
  }
}

export const storage = new DbStorage();
