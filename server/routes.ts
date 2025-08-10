import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getSession, isAuthenticated, isAdmin } from "./auth";
import { seedDatabase } from "./seed";
import { loginSchema, registrationSchema } from "@shared/schema";
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
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registrationSchema.parse(req.body);

      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const requests = await storage.getRegistrationRequests();
      const existingRequest = requests.find(
        r => r.email === data.email && r.status === "pending",
      );
      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Registration request already submitted" });
      }

      const request = await storage.createRegistrationRequest(data);
      res
        .status(201)
        .json({
          message: "Registration request submitted",
          requestId: request.id,
        });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });
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

  // Admin registration management routes
  app.get("/api/admin/registration-requests", isAdmin, async (req, res) => {
    try {
      const status = req.query.status as string;
      let requests;
      if (status === "pending") {
        requests = await storage.getPendingRegistrationRequests();
      } else {
        requests = await storage.getRegistrationRequests();
      }
      res.json(requests);
    } catch (error) {
      console.error("Failed to fetch registration requests:", error);
      res.status(500).json({ message: "Failed to fetch registration requests" });
    }
  });

  app.post("/api/admin/registration-requests/:id/approve", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const requests = await storage.getRegistrationRequests();
      const request = requests.find(r => r.id === id);
      
      if (!request || request.status !== "pending") {
        return res.status(404).json({ message: "Registration request not found or already processed" });
      }
      
      // Create user account
      const user = await storage.createUser({
        email: request.email,
        passwordHash: request.password, // Already hashed in registration request
        role: "user",
        firstName: request.firstName || undefined,
        lastName: request.lastName || undefined,
      });
      
      // Update registration request status
      await storage.updateRegistrationRequestStatus(id, "approved", req.session.userId!);
      
      // Log approval notification
      console.log(`✅ USER APPROVED:`);
      console.log(`   Username: ${request.username}`);
      console.log(`   Email: ${request.email}`);
      console.log(`   User ID: ${user.id}`);
      console.log(`   Approved by: Admin`);
      console.log(`   Time: ${new Date().toLocaleString()}`);
      console.log(`─────────────────────────────────────────────────`);
      
      res.json({ message: "User approved and account created", userId: user.id });
    } catch (error) {
      console.error("Failed to approve registration:", error);
      res.status(500).json({ message: "Failed to approve registration" });
    }
  });

  app.post("/api/admin/registration-requests/:id/reject", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const requests = await storage.getRegistrationRequests();
      const request = requests.find(r => r.id === id);
      
      await storage.updateRegistrationRequestStatus(id, "rejected", req.session.userId!);
      
      // Log rejection notification
      if (request) {
        console.log(`❌ USER REJECTED:`);
        console.log(`   Username: ${request.username}`);
        console.log(`   Email: ${request.email}`);
        console.log(`   Rejected by: Admin`);
        console.log(`   Time: ${new Date().toLocaleString()}`);
        console.log(`─────────────────────────────────────────────────`);
      }
      
      res.json({ message: "Registration request rejected" });
    } catch (error) {
      console.error("Failed to reject registration:", error);
      res.status(500).json({ message: "Failed to reject registration" });
    }
  });

  // Document folder routes
  app.get("/api/document-folders", async (req, res) => {
    try {
      const topicId = req.query.topicId as string;
      let folders;
      if (topicId) {
        folders = await storage.getDocumentFoldersByTopic(topicId);
      } else {
        folders = await storage.getDocumentFolders();
      }
      res.json(folders);
    } catch (error) {
      console.error("Failed to fetch document folders:", error);
      res.status(500).json({ message: "Failed to fetch document folders" });
    }
  });

  app.post("/api/admin/document-folders", isAdmin, async (req, res) => {
    try {
      const folder = await storage.createDocumentFolder(req.body);
      res.json(folder);
    } catch (error) {
      console.error("Failed to create document folder:", error);
      res.status(500).json({ message: "Failed to create document folder" });
    }
  });

  // Document routes
  app.get("/api/documents", async (req, res) => {
    try {
      const folderId = req.query.folderId as string;
      let documents;
      if (folderId) {
        documents = await storage.getDocumentsByFolder(folderId);
      } else {
        documents = await storage.getDocuments();
      }
      res.json(documents);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/admin/documents", isAdmin, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { title, description, folderId } = req.body;
      
      const fileExtension = path.extname(req.file.originalname);
      const newFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
      const newFilePath = path.join(uploadsDir, newFileName);
      
      // Move file to permanent location with new name
      fs.renameSync(req.file.path, newFilePath);

      const document = await storage.createDocument({
        title: title || req.file.originalname,
        description: description || null,
        fileName: newFileName,
        filePath: `/uploads/${newFileName}`,
        mimeType: req.file.mimetype,
        size: req.file.size,
        folderId: folderId || null,
        uploadedBy: req.session.userId!,
        isPublic: true,
      });

      res.json(document);
    } catch (error) {
      console.error("Failed to upload document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  // About page content routes
  app.get("/api/about-content", async (req, res) => {
    try {
      const content = await storage.getAboutPageContent();
      res.json(content);
    } catch (error) {
      console.error("Failed to fetch about content:", error);
      res.status(500).json({ message: "Failed to fetch about content" });
    }
  });

  app.post("/api/admin/about-content", isAdmin, async (req, res) => {
    try {
      const content = await storage.updateAboutPageContent({
        ...req.body,
        updatedBy: req.session.userId!,
      });
      res.json(content);
    } catch (error) {
      console.error("Failed to update about content:", error);
      res.status(500).json({ message: "Failed to update about content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
