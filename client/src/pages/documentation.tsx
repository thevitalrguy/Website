import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Zap, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import type { Topic, Article } from "@shared/schema";

export default function Documentation() {
  const { data: topics, isLoading: topicsLoading } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  const { data: featuredArticles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles/featured"],
  });

  if (topicsLoading || articlesLoading) {
    return (
      <div className="min-h-screen bg-primary-dark py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Documentation Center</h1>
            <p className="text-xl text-text-muted">Loading comprehensive guides and resources...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-card-dark border-metal-grey/20 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-metal-grey/20 rounded mb-4"></div>
                  <div className="h-20 bg-metal-grey/20 rounded mb-4"></div>
                  <div className="h-4 bg-metal-grey/20 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Documentation Center</h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Comprehensive guides, tutorials, and best practices for cybersecurity, networking, and homelab management. 
            Build your skills through hands-on learning and real-world scenarios.
          </p>
        </div>

        {/* Featured Articles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Featured Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles?.map((article) => (
              <Card key={article.id} className="bg-card-dark border-metal-grey/20 hover:border-green-accent/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="bg-green-accent/20 text-green-accent">
                      Featured
                    </Badge>
                    {article.hasLab && (
                      <Badge variant="outline" className="border-orange-400/30 text-orange-400">
                        <Zap className="w-3 h-3 mr-1" />
                        Lab
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg text-white group-hover:text-green-accent transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-text-muted">
                    {article.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.readTime} min read
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Guide
                    </div>
                  </div>
                  <Link href={`/article/${article.slug}`}>
                    <Button variant="outline" className="w-full border-metal-grey/30 text-white hover:border-green-accent group-hover:bg-green-accent/10">
                      Read Guide
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Topics */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics?.map((topic) => (
              <Card key={topic.id} className="bg-card-dark border-metal-grey/20 hover:border-green-accent/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-white">{topic.name}</CardTitle>
                  <CardDescription className="text-text-muted">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">
                      {topic.guideCount} guides available
                    </span>
                    <Link href={`/topic/${topic.slug}`}>
                      <Button variant="outline" size="sm" className="border-green-accent/30 text-green-accent hover:bg-green-accent/10">
                        Explore
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-green-accent/10 to-blue-500/10 border-green-accent/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">New to Cybersecurity?</h3>
              <p className="text-text-muted mb-6 max-w-2xl mx-auto">
                Start your journey with our beginner-friendly guides. Learn the fundamentals 
                of network security, set up your first homelab, and build practical skills 
                through hands-on exercises.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/topic/networking">
                  <Button className="bg-green-accent hover:bg-green-accent/90 text-white">
                    Networking Basics
                  </Button>
                </Link>
                <Link href="/topic/security">
                  <Button variant="outline" className="border-green-accent/30 text-green-accent hover:bg-green-accent/10">
                    Security Fundamentals
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}