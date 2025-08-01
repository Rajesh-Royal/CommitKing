CREATE TABLE "leaderboard_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_id" text NOT NULL,
	"type" text NOT NULL,
	"username" text,
	"hotty_count" integer DEFAULT 0,
	"notty_count" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "leaderboard_cache_github_id_unique" UNIQUE("github_id")
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"github_id" text NOT NULL,
	"github_username" text,
	"full_name" text,
	"type" text NOT NULL,
	"rating" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_rating" ON "ratings" USING btree ("user_id","github_id","type");