import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, index, jsonb, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const topics = pgTable("topics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  slug: text("slug").notNull().unique(),
  guideCount: integer("guide_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull().unique(),
  topicId: varchar("topic_id").references(() => topics.id).notNull(),
  featured: boolean("featured").default(false).notNull(),
  readTime: integer("read_time").notNull(),
  hasLab: boolean("has_lab").default(false).notNull(),
  hasConfigFiles: boolean("has_config_files").default(false).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'config', 'script', 'guide', 'tool'
  downloadUrl: text("download_url"),
  externalUrl: text("external_url"),
  topicId: varchar("topic_id").references(() => topics.id).notNull(),
  downloadCount: integer("download_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communityStats = pgTable("community_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guides: integer("guides").notNull().default(0),
  implementations: integer("implementations").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  members: integer("members").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  role: text("role").notNull().default("user"), // 'admin' or 'user'
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// File uploads table
export const uploadedFiles = pgTable("uploaded_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalName: text("original_name").notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id).notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  downloadCount: integer("download_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTopicSchema = createInsertSchema(topics).omit({
  id: true,
  createdAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityStatsSchema = createInsertSchema(communityStats).omit({
  id: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUploadedFileSchema = createInsertSchema(uploadedFiles).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Registration requests table
export const registrationRequests = pgTable("registration_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull(),
  email: varchar("email").notNull(),
  password: text("password").notNull(), // Will be hashed
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  processedBy: varchar("processed_by").references(() => users.id),
});

// Document folders table
export const documentFolders = pgTable("document_folders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  parentId: varchar("parent_id"),
  topicId: varchar("topic_id").references(() => topics.id),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  parentReference: foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
  }),
}));

// Documents table (enhanced version of uploadedFiles for structured docs)
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  folderId: varchar("folder_id").references(() => documentFolders.id),
  uploadedBy: varchar("uploaded_by").references(() => users.id).notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  downloadCount: integer("download_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// About page content management
export const aboutPageContent = pgTable("about_page_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileImageUrl: text("profile_image_url"),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  mission: text("mission").notNull(),
  values: jsonb("values").notNull(), // Array of value objects {title, description}
  updatedBy: varchar("updated_by").references(() => users.id).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const registrationSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const insertRegistrationRequestSchema = createInsertSchema(registrationRequests).omit({
  id: true,
  requestedAt: true,
  processedAt: true,
  processedBy: true,
});

export const insertDocumentFolderSchema = createInsertSchema(documentFolders).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertAboutPageContentSchema = createInsertSchema(aboutPageContent).omit({
  id: true,
  updatedAt: true,
});

export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type CommunityStats = typeof communityStats.$inferSelect;
export type InsertCommunityStats = z.infer<typeof insertCommunityStatsSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UploadedFile = typeof uploadedFiles.$inferSelect;
export type InsertUploadedFile = z.infer<typeof insertUploadedFileSchema>;

export type LoginRequest = z.infer<typeof loginSchema>;

export type RegistrationRequest = typeof registrationRequests.$inferSelect;
export type InsertRegistrationRequest = z.infer<typeof insertRegistrationRequestSchema>;

export type DocumentFolder = typeof documentFolders.$inferSelect;
export type InsertDocumentFolder = z.infer<typeof insertDocumentFolderSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type AboutPageContent = typeof aboutPageContent.$inferSelect;
export type InsertAboutPageContent = z.infer<typeof insertAboutPageContentSchema>;

export type RegistrationData = z.infer<typeof registrationSchema>;
