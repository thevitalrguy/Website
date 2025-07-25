import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Trophy, TrendingUp, Calendar, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import type { CommunityStats } from "@shared/schema";

export default function Community() {
  const { data: stats, isLoading } = useQuery<CommunityStats>({
    queryKey: ["/api/community-stats"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-dark py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Community Hub</h1>
            <p className="text-xl text-text-muted">Loading community information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Community Hub</h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Connect with cybersecurity professionals, share knowledge, and collaborate on homelab projects. 
            Join a thriving community of learners and experts.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-card-dark border-metal-grey/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-muted">Total Members</CardTitle>
              <Users className="h-4 w-4 text-green-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalMembers || 0}</div>
              <p className="text-xs text-text-muted">Active community members</p>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-metal-grey/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-muted">Total Guides</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalGuides || 0}</div>
              <p className="text-xs text-text-muted">Knowledge articles shared</p>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-metal-grey/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-muted">Labs Completed</CardTitle>
              <Trophy className="h-4 w-4 text-green-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.labsCompleted || 0}</div>
              <p className="text-xs text-text-muted">Hands-on labs finished</p>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-metal-grey/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-muted">Server Uptime</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.serverUptime || "99.9%"}</div>
              <p className="text-xs text-text-muted">Infrastructure reliability</p>
            </CardContent>
          </Card>
        </div>

        {/* Community Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card-dark border-metal-grey/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-green-accent" />
                Discussion Forums
              </CardTitle>
              <CardDescription>
                Engage in technical discussions, ask questions, and share insights with fellow cybersecurity enthusiasts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-metal-grey/10 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-white">Network Security Best Practices</h4>
                    <p className="text-xs text-text-muted">24 replies • Last active 2h ago</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-accent/20 text-green-accent">Hot</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-metal-grey/10 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-white">Homelab Setup Questions</h4>
                    <p className="text-xs text-text-muted">12 replies • Last active 4h ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-metal-grey/10 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-white">Vulnerability Assessment Tools</h4>
                    <p className="text-xs text-text-muted">8 replies • Last active 6h ago</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-green-accent hover:bg-green-accent/90 text-white">
                Join Discussions
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-metal-grey/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-green-accent" />
                Upcoming Events
              </CardTitle>
              <CardDescription>
                Join virtual meetups, workshops, and collaborative learning sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-metal-grey/10 rounded-lg">
                  <h4 className="text-sm font-medium text-white">Penetration Testing Workshop</h4>
                  <p className="text-xs text-text-muted">Tomorrow, 7:00 PM EST</p>
                  <Badge variant="outline" className="mt-2 border-orange-400/30 text-orange-400">Live</Badge>
                </div>
                <div className="p-3 bg-metal-grey/10 rounded-lg">
                  <h4 className="text-sm font-medium text-white">Homelab Showcase & Q&A</h4>
                  <p className="text-xs text-text-muted">Friday, 6:00 PM EST</p>
                  <Badge variant="outline" className="mt-2 border-blue-400/30 text-blue-400">Virtual</Badge>
                </div>
                <div className="p-3 bg-metal-grey/10 rounded-lg">
                  <h4 className="text-sm font-medium text-white">Security Certification Study Group</h4>
                  <p className="text-xs text-text-muted">Next Monday, 8:00 PM EST</p>
                  <Badge variant="outline" className="mt-2 border-purple-400/30 text-purple-400">Study</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full border-green-accent/30 text-green-accent hover:bg-green-accent/10">
                View All Events
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Join Community CTA */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-green-accent/10 to-blue-500/10 border-green-accent/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Join Our Community?</h3>
              <p className="text-text-muted mb-6 max-w-2xl mx-auto">
                Connect with like-minded professionals, share your homelab setups, contribute to open-source projects, 
                and accelerate your cybersecurity career through collaborative learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-green-accent hover:bg-green-accent/90 text-white">
                  Join Discord Server
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-green-accent/30 text-green-accent hover:bg-green-accent/10">
                  Follow on GitHub
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}