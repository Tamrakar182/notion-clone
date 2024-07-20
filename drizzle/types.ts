import * as schema from "./schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const insertUserSchema = createInsertSchema(schema.UserTable)
export const selectUserSchema = createSelectSchema(schema.UserTable)

export type User = z.infer<typeof selectUserSchema>;

export const insertNotionFileSchema = createInsertSchema(schema.NotionFileTable)
export const selectNotionFileSchema = createSelectSchema(schema.NotionFileTable)

export type NotionFile = z.infer<typeof selectNotionFileSchema>;
