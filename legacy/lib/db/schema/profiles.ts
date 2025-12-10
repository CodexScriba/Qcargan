import { pgTable, uuid, text, timestamp, uniqueIndex, foreignKey, pgSchema } from 'drizzle-orm/pg-core';

const authSchema = pgSchema('auth');

export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey().notNull()
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(),
  username: text('username').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  usernameUnique: uniqueIndex('profiles_username_key').on(table.username),
  authUserReference: foreignKey({
    columns: [table.id],
    foreignColumns: [authUsers.id],
    name: 'profiles_id_fkey'
  }).onDelete('cascade')
}));
