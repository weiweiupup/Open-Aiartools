ALTER TABLE "users" ADD COLUMN "subscription_credits" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_status" text DEFAULT 'none';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_plan" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_start_date" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_end_date" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_subscription_id" text;