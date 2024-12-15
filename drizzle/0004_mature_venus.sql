ALTER TABLE "projects" RENAME TO "project";--> statement-breakpoint
ALTER TABLE "project" RENAME COLUMN "isPro" TO "isPremium";--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "projects_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "createdAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "updatedAt" DROP DEFAULT;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
