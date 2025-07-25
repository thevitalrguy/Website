import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getSession, isAuthenticated, isAdmin } from "./auth";
import { seedDatabase } from "./seed";
import { loginSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow documents, PDFs, images, and configuration files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv',
      'application/json',
      'application/xml',
      'text/xml',
      'application/zip',
      'application/x-tar',
      'application/gzip',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.conf') || file.originalname.endsWith('.cfg')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize session middleware
  app.use(getSession());
  
  // Initialize database with seed data
  await seedDatabase();

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValid = await storage.verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.userId = user.id;
      req.session.userRole = user.role;
      
      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("User fetch error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // File upload routes (admin only)
  app.post("/api/admin/upload", isAdmin, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileExtension = path.extname(req.file.originalname);
      const newFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
      const newFilePath = path.join(uploadsDir, newFileName);
      
      // Move file to permanent location with new name
      fs.renameSync(req.file.path, newFilePath);

      const fileRecord = await storage.createUploadedFile({
        originalName: req.file.originalname,
        fileName: newFileName,
        filePath: `/uploads/${newFileName}`,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.session.userId!,
        isPublic: true,
      });

      res.json(fileRecord);
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  app.get("/api/files", async (req, res) => {
    try {
      const files = await storage.getUploadedFiles();
      res.json(files);
    } catch (error) {
      console.error("Files fetch error:", error);
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  app.get("/api/files/:id/download", async (req, res) => {
    try {
      const file = await storage.getUploadedFile(req.params.id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      const filePath = path.join(__dirname, "..", file.filePath);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on disk" });
      }

      await storage.incrementDownloadCount(file.id);
      
      res.setHeader("Content-Disposition", `attachment; filename="${file.originalName}"`);
      res.setHeader("Content-Type", file.mimeType);
      res.sendFile(filePath);
    } catch (error) {
      console.error("File download error:", error);
      res.status(500).json({ message: "Download failed" });
    }
  });

  // Serve uploaded files statically
  app.use("/uploads", express.static(uploadsDir));

  // Topics routes
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  app.get("/api/topics/:slug", async (req, res) => {
    try {
      const topic = await storage.getTopicBySlug(req.params.slug);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topic" });
    }
  });

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/featured", async (req, res) => {
    try {
      const articles = await storage.getFeaturedArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured articles" });
    }
  });

  app.get("/api/articles/topic/:topicId", async (req, res) => {
    try {
      const articles = await storage.getArticlesByTopic(req.params.topicId);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles by topic" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Resources routes
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/topic/:topicId", async (req, res) => {
    try {
      const resources = await storage.getResourcesByTopic(req.params.topicId);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources by topic" });
    }
  });

  // Community stats routes
  app.get("/api/community-stats", async (req, res) => {
    try {
      const stats = await storage.getCommunityStats();
      if (!stats) {
        return res.status(404).json({ message: "Community stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
