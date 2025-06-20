import { relations } from "drizzle-orm/relations";
import { users, accounts, sessions, userActivities } from "./schema";

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(accounts),
	sessions: many(sessions),
	userActivities: many(userActivities),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const userActivitiesRelations = relations(userActivities, ({one}) => ({
	user: one(users, {
		fields: [userActivities.userId],
		references: [users.id]
	}),
}));