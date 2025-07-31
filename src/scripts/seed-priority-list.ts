// This script is not used anywhere as we have the priority profiles and repos hardcoded in the codebase.
// It is kept here for reference and can be used to seed the priority list in the database
// if needed in the future.

import { storage } from "@/lib/storage";
import { PRIORITY_PROFILES, PRIORITY_REPOS } from "@/lib/github";


async function seedPriorityList() {
  console.log("🌱 Seeding priority list...");
  
  try {
    // Seed priority profiles
    console.log("Adding priority profiles...");
    for (const profile of PRIORITY_PROFILES) {
      try {
        await storage.addToPriorityList({
          github_id: profile,
          type: 'profile',
          priority_score: Math.floor(Math.random() * 100) + 50, // Random score between 50-150
        });
        console.log(`✓ Added profile: ${profile}`);
      } catch (error) {
        // Skip if already exists
        console.log(`~ Profile ${profile} already exists`);
      }
    }

    // Seed priority repositories  
    console.log("Adding priority repositories...");
    for (const repo of PRIORITY_REPOS) {
      try {
        await storage.addToPriorityList({
          github_id: repo,
          type: 'repo',
          priority_score: Math.floor(Math.random() * 100) + 50, // Random score between 50-150
        });
        console.log(`✓ Added repo: ${repo}`);
      } catch (error) {
        // Skip if already exists
        console.log(`~ Repo ${repo} already exists`);
      }
    }

    console.log("🎉 Priority list seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding priority list:", error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPriorityList().then(() => process.exit(0));
}

export { seedPriorityList };