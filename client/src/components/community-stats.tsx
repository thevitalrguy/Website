import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import type { CommunityStats } from "@shared/schema";

export default function CommunityStatsSection() {
  const { data: stats, isLoading } = useQuery<CommunityStats>({
    queryKey: ["/api/community-stats"],
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Growing Community</h2>
            <p className="text-text-muted text-lg">Join thousands of learners and professionals sharing knowledge</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-card-dark border-metal-grey/20 animate-pulse">
                <CardContent className="p-6 text-center">
                  <div className="h-10 bg-metal-grey/20 rounded mb-2"></div>
                  <div className="h-6 bg-metal-grey/20 rounded mb-1"></div>
                  <div className="h-4 bg-metal-grey/20 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const statsData = [
    {
      value: `${stats?.guides ?? 0}+`,
      label: "Technical Guides",
      description: "Comprehensive tutorials",
    },
    {
      value: `${stats?.implementations ?? 0}+`,
      label: "Lab Implementations",
      description: "Real-world examples",
    },
    {
      value: `${stats?.members ?? 0}+`,
      label: "Community Members",
      description: "Active contributors",
    },
    {
      value: `${stats?.downloads ?? 0}+`,
      label: "Resource Downloads",
      description: "Files served to members",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Growing Community</h2>
          <p className="text-text-muted text-lg">Join thousands of learners and professionals sharing knowledge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <Card key={index} className="bg-card-dark border-metal-grey/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-accent mb-2">{stat.value}</div>
                <div className="text-white font-medium mb-1">{stat.label}</div>
                <div className="text-text-muted text-sm">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card-dark border-metal-grey/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Journey?</h3>
            <p className="text-text-muted mb-6 max-w-2xl mx-auto">
              Join our community-driven platform and gain access to comprehensive cybersecurity and homelab resources. Build practical skills through hands-on learning and real-world implementations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.reddit.com/r/vitalrtech/" target="_blank" rel="noopener noreferrer">
                <Button className="bg-green-accent hover:bg-green-accent/90 text-white px-8 py-3 font-medium">
                  <UserPlus className="mr-2" size={18} />
                  Join Community
                </Button>
              </a>
              <a href="https://discord.gg/Pzy2wygGwm" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-metal-grey/30 hover:border-green-accent text-white px-8 py-3 font-medium">
                  <SiDiscord className="mr-2" size={18} />
                  Discord Server
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
        </div>
        </section>
        );
    }

