import { sqliteTable, integer, text, AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

export const UserTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().default(''),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').notNull().default(sql`(CURRENT_TIMESTAMP)`).$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const NotionFileTable = sqliteTable('notion_files', {
  id: integer('id').primaryKey(),
  coverPhoto: text('cover_photo').notNull(),
  icon: text('icon').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  type: text('type').notNull(),
  authorId: integer('author_id').notNull().references(() => UserTable.id, { onDelete: 'cascade' }),
  parentFileId: integer('parent_file_id').references((): AnySQLiteColumn => NotionFileTable.id, { onDelete: 'cascade' }).default(0),
  order: integer('order').default(0),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').notNull().default(sql`(CURRENT_TIMESTAMP)`).$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const UserRelations = relations(UserTable, ({ many }) => ({
  notionFiles: many(NotionFileTable),
}));

export const NotionFileRelations = relations(NotionFileTable, ({ one, many }) => ({
  author: one(UserTable, {
    fields: [NotionFileTable.authorId],
    references: [UserTable.id],
  }),
  parentFile: one(NotionFileTable, {
    fields: [NotionFileTable.parentFileId],
    references: [NotionFileTable.id],
  }),
  subFiles: many(NotionFileTable),
}));
