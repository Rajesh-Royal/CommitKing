import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, desc, sql } from "drizzle-orm";
import { 
  users, 
  ratings, 
  leaderboard_cache, 
  type User, 
  type InsertUser, 
  type Rating, 
  type InsertRating,
  type LeaderboardCache,
  type InsertLeaderboardCache,
} from "@/shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(process.env.DATABASE_URL, { prepare: false });
const db = drizzle(client);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByGithubId(githubId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Rating operations
  getRating(userId: string, githubId: string, type: string): Promise<Rating | undefined>;
  createRating(rating: InsertRating): Promise<Rating>;
  getRatingCounts(githubId: string, type: string): Promise<{ hotty: number; notty: number }>;
  getUserRatingCount(userId: string): Promise<number>;

  // Leaderboard operations
  getLeaderboard(type: string, limit?: number): Promise<LeaderboardCache[]>;
  updateLeaderboardCache(githubId: string, type: string, data: InsertLeaderboardCache): Promise<void>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.github_id, githubId)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getRating(userId: string, githubId: string, type: string): Promise<Rating | undefined> {
    const result = await db.select().from(ratings)
      .where(and(
        eq(ratings.user_id, userId),
        eq(ratings.github_id, githubId),
        eq(ratings.type, type)
      ))
      .limit(1);
    return result[0];
  }

  async createRating(rating: InsertRating): Promise<Rating> {
    const result = await db.insert(ratings).values(rating).returning();
    
    // Update leaderboard cache
    await this.updateRatingCounts(rating.github_id, rating.type);
    
    return result[0];
  }

  async getRatingCounts(githubId: string, type: string): Promise<{ hotty: number; notty: number }> {
    const hottyResult = await db.select({ count: sql<number>`count(*)` })
      .from(ratings)
      .where(and(
        eq(ratings.github_id, githubId),
        eq(ratings.type, type),
        eq(ratings.rating, 'hotty')
      ));

    const nottyResult = await db.select({ count: sql<number>`count(*)` })
      .from(ratings)
      .where(and(
        eq(ratings.github_id, githubId),
        eq(ratings.type, type),
        eq(ratings.rating, 'notty')
      ));

    return {
      hotty: hottyResult[0]?.count || 0,
      notty: nottyResult[0]?.count || 0,
    };
  }

  async getUserRatingCount(userId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(ratings)
      .where(eq(ratings.user_id, userId));
    return result[0]?.count || 0;
  }

  async getLeaderboard(type: string, limit = 50): Promise<LeaderboardCache[]> {
    return await db.select().from(leaderboard_cache)
      .where(eq(leaderboard_cache.type, type))
      .orderBy(
        desc(sql`${leaderboard_cache.hotty_count} - ${leaderboard_cache.notty_count}`)
      )
      .limit(limit);
  }

  async updateLeaderboardCache(githubId: string, type: string, data: Partial<InsertLeaderboardCache>): Promise<void> {
    await db.insert(leaderboard_cache)
      .values({ github_id: githubId, type, ...data })
      .onConflictDoUpdate({
        target: leaderboard_cache.github_id,
        set: { ...data, updated_at: sql`now()` }
      });
  }

  private async updateRatingCounts(githubId: string, type: string): Promise<void> {
    const counts = await this.getRatingCounts(githubId, type);
    
    // Get user data to populate username and avatar_url
    const user = await this.getUserByGithubId(githubId);
    
    await this.updateLeaderboardCache(githubId, type, {
      github_id: githubId,
      type,
      username: user?.username,
      hotty_count: counts.hotty,
      notty_count: counts.notty,
    });
  }
}

export const storage = new DbStorage();
