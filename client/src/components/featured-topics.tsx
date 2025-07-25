import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Network, Shield, Server, Home } from "lucide-react";
import { Link } from "wouter";
import type { Topic } from "@shared/schema";

const topicIcons = {
  "fas fa-network-wired": Network,
  "fas fa-shield-alt": Shield,
  "fas fa-server": Server,
  "fas fa-home": Home,
};

export default function FeaturedTopics() {
  const { data: topics, isLoading } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card-dark/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Core Learning Areas</h2>
            <p className="text-text-muted text-lg">Comprehensive resources covering essential cybersecurity and infrastructure topics</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-card-dark border-metal-grey/20 animate-pulse">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-metal-grey/20 rounded-lg mb-4"></div>
                  <div className="h-6 bg-metal-grey/20 rounded mb-2"></div>
                  <div className="h-16 bg-metal-grey/20 rounded mb-4"></div>
                  <div className="h-4 bg-metal-grey/20 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card-dark/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Core Learning Areas</h2>
          <p className="text-text-muted text-lg">Comprehensive resources covering essential cybersecurity and infrastructure topics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics?.map((topic) => {
            const IconComponent = topicIcons[topic.icon as keyof typeof topicIcons] || Network;
            
            return (
              <Link key={topic.id} href={`/documentation?topic=${topic.slug}`}>
                <Card className="bg-card-dark border-metal-grey/20 hover:border-green-accent/50 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-accent/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-accent/30 transition-colors duration-300">
                      <IconComponent className="text-green-accent" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{topic.name}</h3>
                    <p className="text-text-muted text-sm mb-4">{topic.description}</p>
                    <div className="flex items-center text-green-accent text-sm font-medium">
                      <span>{topic.guideCount} Guides</span>
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={14} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
