import { storage } from "./storage";
import type { InsertUser, InsertTopic, InsertArticle, InsertCommunityStats } from "@shared/schema";

export async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // Create admin user if it doesn't exist
    const existingAdmin = await storage.getUserByEmail("admin@vitalr.tech");
    if (!existingAdmin) {
      const adminUser: InsertUser = {
        email: "admin@vitalr.tech",
        passwordHash: "admin123", // This will be hashed in the storage layer
        role: "admin",
        firstName: "Admin",
        lastName: "User",
      };
      await storage.createUser(adminUser);
      console.log("Created admin user: admin@vitalr.tech / admin123");
    }

    // Check if topics already exist
    const existingTopics = await storage.getTopics();
    if (existingTopics.length === 0) {
      // Seed topics
      const topics: InsertTopic[] = [
        {
          name: "Cybersecurity",
          description: "Security frameworks, threat analysis, incident response, and defensive strategies",
          icon: "fas fa-shield-alt",
          slug: "cybersecurity",
          guideCount: 32,
        },
        {
          name: "Homelab",
          description: "Self-hosted infrastructure, virtualization, and hands-on learning environments",
          icon: "fas fa-home",
          slug: "homelab",
          guideCount: 18,
        },
        {
          name: "Networking",
          description: "Network fundamentals, protocols, VLANs, routing, and enterprise networking concepts",
          icon: "fas fa-network-wired",
          slug: "networking",
          guideCount: 24,
        },
        {
          name: "System Administration",
          description: "Linux administration, Windows Server, automation, and infrastructure management",
          icon: "fas fa-server",
          slug: "system-administration",
          guideCount: 28,
        },
      ];

      for (const topic of topics) {
        await storage.createTopic(topic);
      }
      console.log("Created topics");

      // Seed some sample articles
      const topicList = await storage.getTopics();
      const cyberTopic = topicList.find(t => t.slug === "cybersecurity");
      const networkTopic = topicList.find(t => t.slug === "networking");
      const homelabTopic = topicList.find(t => t.slug === "homelab");
      const sysadminTopic = topicList.find(t => t.slug === "system-administration");

      if (cyberTopic) {
        const articles: InsertArticle[] = [
          {
            title: "Building a Home SOC with Wazuh",
            description: "Complete guide to setting up a Security Operations Center using Wazuh SIEM",
            content: "Learn how to build a comprehensive home Security Operations Center...",
            slug: "building-home-soc-wazuh",
            topicId: cyberTopic.id,
            featured: true,
            readTime: 15,
            hasLab: true,
            hasConfigFiles: true,
            imageUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          },
          {
            title: "Network Intrusion Detection with Suricata",
            description: "Deploy and configure Suricata IDS for network monitoring and threat detection",
            content: "This comprehensive guide covers Suricata installation, configuration...",
            slug: "network-intrusion-detection-suricata",
            topicId: cyberTopic.id,
            featured: true,
            readTime: 12,
            hasLab: true,
            hasConfigFiles: true,
          },
        ];

        for (const article of articles) {
          await storage.createArticle(article);
        }
      }

      if (networkTopic) {
        const networkArticles: InsertArticle[] = [
          {
            title: "VLAN Configuration on pfSense",
            description: "Step-by-step guide to configuring VLANs for network segmentation",
            content: "VLANs are essential for network segmentation and security...",
            slug: "vlan-configuration-pfsense",
            topicId: networkTopic.id,
            featured: false,
            readTime: 8,
            hasLab: true,
            hasConfigFiles: true,
          },
        ];

        for (const article of networkArticles) {
          await storage.createArticle(article);
        }
      }

      if (homelabTopic) {
        const homelabArticles: InsertArticle[] = [
          {
            title: "Proxmox VE Home Server Setup",
            description: "Building a powerful virtualization platform for your homelab",
            content: "Proxmox Virtual Environment is an excellent choice for homelab virtualization...",
            slug: "proxmox-ve-home-server-setup",
            topicId: homelabTopic.id,
            featured: true,
            readTime: 20,
            hasLab: true,
            hasConfigFiles: false,
            imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          },
        ];

        for (const article of homelabArticles) {
          await storage.createArticle(article);
        }
      }

      console.log("Created sample articles");
    }

    // Seed community stats
    const existingStats = await storage.getCommunityStats();
    if (!existingStats) {
      const stats: InsertCommunityStats = {
        guides: 102,
        implementations: 1247,
        downloads: 8934,
        members: 3521,
      };
      await storage.updateCommunityStats(stats);
      console.log("Created community stats");
    }

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}