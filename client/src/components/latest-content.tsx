import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Code, Download, ArrowRight } from "lucide-react";
import type { Article } from "@shared/schema";

export default function LatestContent() {
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: featuredArticles } = useQuery<Article[]>({
    queryKey: ["/api/articles/featured"],
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Latest Documentation</h2>
              <p className="text-text-muted text-lg">Fresh guides and real-world implementations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-card-dark border-metal-grey/20 animate-pulse">
                <div className="h-48 bg-metal-grey/20"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-metal-grey/20 rounded mb-4"></div>
                  <div className="h-8 bg-metal-grey/20 rounded mb-3"></div>
                  <div className="h-16 bg-metal-grey/20 rounded"></div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-card-dark border-metal-grey/20 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-metal-grey/20 rounded mb-3"></div>
                    <div className="h-6 bg-metal-grey/20 rounded mb-2"></div>
                    <div className="h-12 bg-metal-grey/20 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const featuredArticle = featuredArticles?.[0];
  const recentArticles = articles?.slice(0, 3) || [];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Latest Documentation</h2>
            <p className="text-text-muted text-lg">Fresh guides and real-world implementations</p>
          </div>
          <Button variant="ghost" className="mt-6 md:mt-0 text-green-accent hover:text-green-accent/80 font-medium">
            View All Documentation
            <ArrowRight className="ml-2" size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Article */}
          {featuredArticle && (
            <div className="lg:col-span-2">
              <Card className="bg-card-dark border-metal-grey/20 overflow-hidden hover:border-green-accent/50 transition-all duration-300 group">
                {featuredArticle.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={featuredArticle.imageUrl}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="secondary" className="bg-green-accent/20 text-green-accent">
                      Networking
                    </Badge>
                    <span className="text-text-muted text-sm">
                      {new Date(featuredArticle.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span className="text-text-muted text-sm">{featuredArticle.readTime} min read</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-accent transition-colors duration-200">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-text-muted mb-4 leading-relaxed">
                    {featuredArticle.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {featuredArticle.hasLab && (
                        <div className="flex items-center space-x-2 text-text-muted text-sm">
                          <Code size={14} />
                          <span>Hands-on Lab</span>
                        </div>
                      )}
                      {featuredArticle.hasConfigFiles && (
                        <div className="flex items-center space-x-2 text-text-muted text-sm">
                          <Download size={14} />
                          <span>Config Files</span>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" className="text-green-accent hover:text-green-accent/80 font-medium p-0">
                      Read More →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Articles */}
          <div className="space-y-6">
            {recentArticles.map((article) => (
              <Card key={article.id} className="bg-card-dark border-metal-grey/20 hover:border-green-accent/50 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Badge variant="secondary" className="bg-green-accent/20 text-green-accent text-xs">
                      {article.topicId === 'security' ? 'Security' : 
                       article.topicId === 'homelab' ? 'Homelab' : 
                       article.topicId === 'sysadmin' ? 'SysAdmin' : 'Tech'}
                    </Badge>
                    <span className="text-text-muted text-xs">
                      {new Date(article.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-green-accent transition-colors duration-200">
                    {article.title}
                  </h4>
                  <p className="text-text-muted text-sm mb-3 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center text-green-accent text-sm">
                    <Clock className="mr-1" size={12} />
                    <span>{article.readTime} min read</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
