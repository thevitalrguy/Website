import { db } from "./db";
import { topics, articles, communityStats } from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data
    await db.delete(articles);
    await db.delete(topics);
    await db.delete(communityStats);

    // Seed topics
    const topicsData = [
      {
        id: "networking",
        name: "Networking",
        description: "Network fundamentals, protocols, VLANs, routing, and enterprise networking concepts",
        icon: "fas fa-network-wired",
        slug: "networking",
        guideCount: 24,
      },
      {
        id: "security",
        name: "Cybersecurity",
        description: "Security frameworks, threat analysis, incident response, and defensive strategies",
        icon: "fas fa-shield-alt",
        slug: "cybersecurity",
        guideCount: 32,
      },
      {
        id: "sysadmin",
        name: "System Administration",
        description: "Linux administration, Windows Server, automation, and infrastructure management",
        icon: "fas fa-server",
        slug: "system-administration",
        guideCount: 28,
      },
      {
        id: "homelab",
        name: "Homelab",
        description: "Self-hosted services, containerization, monitoring, and lab environment setup",
        icon: "fas fa-home",
        slug: "homelab",
        guideCount: 19,
      },
    ];

    console.log("📝 Inserting topics...");
    await db.insert(topics).values(topicsData);

    // Seed articles
    const articlesData = [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
    ];

    console.log("📰 Inserting articles...");
    await db.insert(articles).values(articlesData);

    // Seed community stats
    const statsData = {
      id: "stats1",
      guides: 150,
      implementations: 50,
      downloads: 2500,
      members: 1200,
    };

    console.log("📊 Inserting community stats...");
    await db.insert(communityStats).values(statsData);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };