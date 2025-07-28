import { createServer, type Server } from "http";
import { storage } from "@/lib/storage";
import { insertRatingSchema } from "@/shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/github", async (req, res) => {
    try {
      const { github_id, username, avatar_url } = req.body;
      
      let user = await storage.getUserByGithubId(github_id);
      if (!user) {
        user = await storage.createUser({
          github_id,
          username,
          avatar_url,
        });
      }
      
      res.json({ user });
    } catch (error) {
      console.error("Auth error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  // Rating routes
  app.post("/api/ratings", async (req, res) => {
    try {
      const ratingData = insertRatingSchema.parse(req.body);
      
      // Check if user already rated this item
      const existingRating = await storage.getRating(
        ratingData.user_id,
        ratingData.github_id,
        ratingData.type
      );
      
      if (existingRating) {
        return res.status(400).json({ error: "You have already rated this item" });
      }
      
      const rating = await storage.createRating(ratingData);
      res.json({ rating });
    } catch (error) {
      console.error("Rating error:", error);
      res.status(500).json({ error: "Failed to create rating" });
    }
  });

  app.get("/api/ratings/:githubId/:type/counts", async (req, res) => {
    try {
      const { githubId, type } = req.params;
      const counts = await storage.getRatingCounts(githubId, type);
      res.json(counts);
    } catch (error) {
      console.error("Rating counts error:", error);
      res.status(500).json({ error: "Failed to get rating counts" });
    }
  });

  app.get("/api/ratings/user/:userId/check/:githubId/:type", async (req, res) => {
    try {
      const { userId, githubId, type } = req.params;
      const rating = await storage.getRating(userId, githubId, type);
      res.json({ hasRated: !!rating, rating: rating?.rating });
    } catch (error) {
      console.error("Check rating error:", error);
      res.status(500).json({ error: "Failed to check rating" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const leaderboard = await storage.getLeaderboard(type, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Leaderboard error:", error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  // Priority list routes
  app.get("/api/priority/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const priorityList = await storage.getPriorityList(type);
      res.json(priorityList);
    } catch (error) {
      console.error("Priority list error:", error);
      res.status(500).json({ error: "Failed to get priority list" });
    }
  });

  // User dashboard routes
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const { userId } = req.params;
      const ratingCount = await storage.getUserRatingCount(userId);
      res.json({ ratingCount });
    } catch (error) {
      console.error("User stats error:", error);
      res.status(500).json({ error: "Failed to get user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
