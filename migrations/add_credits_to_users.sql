-- 添加积分字段到users表
ALTER TABLE users ADD COLUMN credits INTEGER NOT NULL DEFAULT 10;

-- 为现有用户设置默认积分
UPDATE users SET credits = 10 WHERE credits IS NULL; 