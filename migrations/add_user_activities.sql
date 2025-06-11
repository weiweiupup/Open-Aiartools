-- 创建用户活动记录表
CREATE TABLE "user_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"credit_amount" integer,
	"metadata" text,
	"created_at" timestamp DEFAULT now()
);

-- 添加外键约束
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

-- 添加索引以提高查询性能
CREATE INDEX "user_activities_user_id_idx" ON "user_activities" ("user_id");
CREATE INDEX "user_activities_type_idx" ON "user_activities" ("type");
CREATE INDEX "user_activities_created_at_idx" ON "user_activities" ("created_at"); 