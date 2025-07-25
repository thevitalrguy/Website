import { type Topic, type InsertTopic, type Article, type InsertArticle, type Resource, type InsertResource, type CommunityStats, type InsertCommunityStats, type User, type InsertUser, type UploadedFile, type InsertUploadedFile, topics, articles, resources, communityStats, users, uploadedFiles } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // Topics
  getTopics(): Promise<Topic[]>;
  getTopic(id: string): Promise<Topic | undefined>;
  getTopicBySlug(slug: string): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  
  // Articles
  getArticles(): Promise<Article[]>;
  getFeaturedArticles(): Promise<Article[]>;
  getArticlesByTopic(topicId: string): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  
  // Resources
  getResources(): Promise<Resource[]>;
  getResourcesByTopic(topicId: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // Community Stats
  getCommunityStats(): Promise<CommunityStats | undefined>;
  updateCommunityStats(stats: InsertCommunityStats): Promise<CommunityStats>;
  
  // Authentication
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  
  // File Uploads
  getUploadedFiles(): Promise<UploadedFile[]>;
  getUploadedFile(id: string): Promise<UploadedFile | undefined>;
  createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile>;
  incrementDownloadCount(fileId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private topics: Map<string, Topic> = new Map();
  private articles: Map<string, Article> = new Map();
  private resources: Map<string, Resource> = new Map();
  private communityStats: CommunityStats | undefined;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed topics
    const networkingTopic: Topic = {
      id: "networking",
      name: "Networking",
      description: "Network fundamentals, protocols, VLANs, routing, and enterprise networking concepts",
      icon: "fas fa-network-wired",
      slug: "networking",
      guideCount: 24,
      createdAt: new Date(),
    };

    const securityTopic: Topic = {
      id: "security",
      name: "Cybersecurity", 
      description: "Security frameworks, threat analysis, incident response, and defensive strategies",
      icon: "fas fa-shield-alt",
      slug: "cybersecurity",
      guideCount: 32,
      createdAt: new Date(),
    };

    const sysadminTopic: Topic = {
      id: "sysadmin",
      name: "System Administration",
      description: "Linux administration, Windows Server, automation, and infrastructure management",
      icon: "fas fa-server",
      slug: "system-administration",
      guideCount: 28,
      createdAt: new Date(),
    };

    const homelabTopic: Topic = {
      id: "homelab",
      name: "Homelab",
      description: "Self-hosted services, containerization, monitoring, and lab environment setup",
      icon: "fas fa-home",
      slug: "homelab", 
      guideCount: 19,
      createdAt: new Date(),
    };

    this.topics.set(networkingTopic.id, networkingTopic);
    this.topics.set(securityTopic.id, securityTopic);
    this.topics.set(sysadminTopic.id, sysadminTopic);
    this.topics.set(homelabTopic.id, homelabTopic);

    // Seed articles
    const article1: Article = {
      id: "article1",
      title: "Building a Secure Enterprise Network with pfSense and VLANs",
      description: "Complete guide to implementing enterprise-grade network segmentation using pfSense firewall, VLAN configuration, and security policies for homelab environments.",
      content: "# Building a Secure Enterprise Network with pfSense and VLANs\n\nThis comprehensive guide covers the implementation of enterprise-grade network segmentation...",
      slug: "pfsense-vlan-enterprise-network",
      topicId: "networking",
      featured: true,
      readTime: 15,
      hasLab: true,
      hasConfigFiles: true,
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      createdAt: new Date("2024-12-15"),
      updatedAt: new Date("2024-12-15"),
    };

    const article2: Article = {
      id: "article2", 
      title: "Implementing Zero Trust with Cloudflare Tunnel",
      description: "Step-by-step implementation of zero trust architecture using Cloudflare Tunnel for secure remote access...",
      content: "# Implementing Zero Trust with Cloudflare Tunnel\n\nZero trust architecture is becoming essential...",
      slug: "zero-trust-cloudflare-tunnel",
      topicId: "security",
      featured: false,
      readTime: 8,
      hasLab: false,
      hasConfigFiles: true,
      imageUrl: null,
      createdAt: new Date("2024-12-12"),
      updatedAt: new Date("2024-12-12"),
    };

    const article3: Article = {
      id: "article3",
      title: "Docker Swarm vs Kubernetes for Homelabs", 
      description: "Comprehensive comparison of orchestration platforms with practical deployment examples and resource requirements...",
      content: "# Docker Swarm vs Kubernetes for Homelabs\n\nContainer orchestration is a key component...",
      slug: "docker-swarm-vs-kubernetes-homelab",
      topicId: "homelab",
      featured: false,
      readTime: 12,
      hasLab: true,
      hasConfigFiles: false,
      imageUrl: null,
      createdAt: new Date("2024-12-10"),
      updatedAt: new Date("2024-12-10"),
    };

    const article4: Article = {
      id: "article4",
      title: "Automated Backup Strategies with Restic",
      description: "Building resilient backup systems using Restic with encryption, deduplication, and multi-destination support...",
      content: "# Automated Backup Strategies with Restic\n\nData protection is critical for any infrastructure...",
      slug: "automated-backup-restic",
      topicId: "sysadmin",
      featured: false,
      readTime: 10,
      hasLab: true,
      hasConfigFiles: true,
      imageUrl: null,
      createdAt: new Date("2024-12-08"),
      updatedAt: new Date("2024-12-08"),
    };

    this.articles.set(article1.id, article1);
    this.articles.set(article2.id, article2);
    this.articles.set(article3.id, article3);
    this.articles.set(article4.id, article4);

    // Seed community stats
    this.communityStats = {
      id: "stats1",
      guides: 150,
      implementations: 50,
      downloads: 2500,
      members: 1200,
      updatedAt: new Date(),
    };
  }

  async getTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getTopic(id: string): Promise<Topic | undefined> {
    return this.topics.get(id);
  }

  async getTopicBySlug(slug: string): Promise<Topic | undefined> {
    return Array.from(this.topics.values()).find(topic => topic.slug === slug);
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = randomUUID();
    const topic: Topic = { 
      ...insertTopic, 
      id, 
      createdAt: new Date(),
      guideCount: 0,
    };
    this.topics.set(id, topic);
    return topic;
  }

  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getFeaturedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.featured)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getArticlesByTopic(topicId: string): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.topicId === topicId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(article => article.slug === slug);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const now = new Date();
    const article: Article = { 
      ...insertArticle, 
      id, 
      featured: insertArticle.featured ?? false,
      hasLab: insertArticle.hasLab ?? false,
      hasConfigFiles: insertArticle.hasConfigFiles ?? false,
      imageUrl: insertArticle.imageUrl ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.articles.set(id, article);
    return article;
  }

  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getResourcesByTopic(topicId: string): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .filter(resource => resource.topicId === topicId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const resource: Resource = { 
      ...insertResource, 
      id, 
      downloadUrl: insertResource.downloadUrl ?? null,
      externalUrl: insertResource.externalUrl ?? null,
      createdAt: new Date(),
      downloadCount: 0,
    };
    this.resources.set(id, resource);
    return resource;
  }

  async getCommunityStats(): Promise<CommunityStats | undefined> {
    return this.communityStats;
  }

  async updateCommunityStats(stats: InsertCommunityStats): Promise<CommunityStats> {
    const updated: CommunityStats = {
      id: this.communityStats?.id || randomUUID(),
      guides: stats.guides ?? 0,
      implementations: stats.implementations ?? 0,
      downloads: stats.downloads ?? 0,
      members: stats.members ?? 0,
      updatedAt: new Date(),
    };
    this.communityStats = updated;
    return updated;
  }

  // Authentication methods (stub implementations for memory storage)
  async getUserByEmail(email: string): Promise<User | undefined> {
    return undefined; // Memory storage doesn't support users
  }

  async getUserById(id: string): Promise<User | undefined> {
    return undefined; // Memory storage doesn't support users
  }

  async createUser(user: InsertUser): Promise<User> {
    throw new Error("User creation not supported in memory storage");
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // File upload methods (stub implementations for memory storage)
  async getUploadedFiles(): Promise<UploadedFile[]> {
    return []; // Memory storage doesn't support file uploads
  }

  async getUploadedFile(id: string): Promise<UploadedFile | undefined> {
    return undefined; // Memory storage doesn't support file uploads
  }

  async createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile> {
    throw new Error("File upload not supported in memory storage");
  }

  async incrementDownloadCount(fileId: string): Promise<void> {
    // No-op for memory storage
  }
}

export class DatabaseStorage implements IStorage {
  async getTopics(): Promise<Topic[]> {
    const result = await db.select().from(topics).orderBy(topics.name);
    return result;
  }

  async getTopic(id: string): Promise<Topic | undefined> {
    const result = await db.select().from(topics).where(eq(topics.id, id));
    return result[0] || undefined;
  }

  async getTopicBySlug(slug: string): Promise<Topic | undefined> {
    const result = await db.select().from(topics).where(eq(topics.slug, slug));
    return result[0] || undefined;
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const result = await db.insert(topics).values(insertTopic).returning();
    return result[0];
  }

  async getArticles(): Promise<Article[]> {
    const result = await db.select().from(articles).orderBy(articles.createdAt);
    return result;
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const result = await db.select().from(articles).where(eq(articles.featured, true)).orderBy(articles.createdAt);
    return result;
  }

  async getArticlesByTopic(topicId: string): Promise<Article[]> {
    const result = await db.select().from(articles).where(eq(articles.topicId, topicId)).orderBy(articles.createdAt);
    return result;
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.id, id));
    return result[0] || undefined;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.slug, slug));
    return result[0] || undefined;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const result = await db.insert(articles).values(insertArticle).returning();
    return result[0];
  }

  async getResources(): Promise<Resource[]> {
    const result = await db.select().from(resources).orderBy(resources.createdAt);
    return result;
  }

  async getResourcesByTopic(topicId: string): Promise<Resource[]> {
    const result = await db.select().from(resources).where(eq(resources.topicId, topicId)).orderBy(resources.createdAt);
    return result;
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const result = await db.insert(resources).values(insertResource).returning();
    return result[0];
  }

  async getCommunityStats(): Promise<CommunityStats | undefined> {
    const result = await db.select().from(communityStats).limit(1);
    return result[0] || undefined;
  }

  async updateCommunityStats(stats: InsertCommunityStats): Promise<CommunityStats> {
    // Check if stats exist, if not insert, otherwise update
    const existing = await this.getCommunityStats();
    if (existing) {
      const result = await db.update(communityStats).set(stats).where(eq(communityStats.id, existing.id)).returning();
      return result[0];
    } else {
      const result = await db.insert(communityStats).values(stats).returning();
      return result[0];
    }
  }

  // Authentication methods
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.passwordHash, 10);
    const userWithHashedPassword = { ...user, passwordHash: hashedPassword };
    const result = await db.insert(users).values(userWithHashedPassword).returning();
    return result[0];
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // File upload methods
  async getUploadedFiles(): Promise<UploadedFile[]> {
    const result = await db.select().from(uploadedFiles).orderBy(uploadedFiles.createdAt);
    return result;
  }

  async getUploadedFile(id: string): Promise<UploadedFile | undefined> {
    const result = await db.select().from(uploadedFiles).where(eq(uploadedFiles.id, id));
    return result[0] || undefined;
  }

  async createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile> {
    const result = await db.insert(uploadedFiles).values(file).returning();
    return result[0];
  }

  async incrementDownloadCount(fileId: string): Promise<void> {
    await db.update(uploadedFiles)
      .set({ downloadCount: sql`${uploadedFiles.downloadCount} + 1` })
      .where(eq(uploadedFiles.id, fileId));
  }
}

export const storage = new DatabaseStorage();
