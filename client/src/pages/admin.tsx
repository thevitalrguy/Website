import { useAuth } from "@/hooks/useAuth";
import { FileUpload } from "@/components/admin/file-upload";
import { RegistrationRequests } from "@/components/admin/registration-requests";
import { DocumentManagement } from "@/components/admin/document-management";
import { AboutContentEditor } from "@/components/admin/about-content-editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Users, Files, TrendingUp, Shield } from "lucide-react";
import type { CommunityStats } from "@shared/schema";

export default function Admin() {
  const { user, isAdmin, isLoading } = useAuth();

  const { data: stats } = useQuery<CommunityStats>({
    queryKey: ["/api/community-stats"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <Shield className="mx-auto mb-4 h-16 w-16 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-text-muted">You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-text-muted">
            Welcome back, {user?.firstName || user?.email}. Manage your cybersecurity education platform.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card-dark border-metal-grey/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-muted">Total Members</CardTitle>
              <Users className="h-4 w-4 text-green-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.members || 0}</div>
              <p className="text-xs text-text-muted">Active community members</p>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-metal-grey/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-muted">Total Guides</CardTitle>
              <Files className="h-4 w-4 text-green-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.guides || 0}</div>
              <p className="text-xs text-text-muted">Published documentation</p>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-metal-grey/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-muted">Implementations</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.implementations || 0}</div>
              <p className="text-xs text-text-muted">Community implementations</p>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-metal-grey/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-muted">Total Downloads</CardTitle>
              <Shield className="h-4 w-4 text-green-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.downloads || 0}</div>
              <p className="text-xs text-text-muted">Resource downloads</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Management Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card-dark border-metal-grey/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-accent data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-green-accent data-[state=active]:text-white">
              User Requests
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-green-accent data-[state=active]:text-white">
              Documents
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-green-accent data-[state=active]:text-white">
              About Page
            </TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-green-accent data-[state=active]:text-white">
              File Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RegistrationRequests />
              </div>
              
              <div className="space-y-6">
                <Card className="bg-card-dark border-metal-grey/20">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-green-accent hover:bg-green-accent/90 text-white">
                      Create New Guide
                    </Button>
                    <Button variant="outline" className="w-full border-metal-grey/30 text-white hover:border-green-accent">
                      Manage Users
                    </Button>
                    <Button variant="outline" className="w-full border-metal-grey/30 text-white hover:border-green-accent">
                      System Settings
                    </Button>
                    <Button variant="outline" className="w-full border-metal-grey/30 text-white hover:border-green-accent">
                      Backup Database
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-card-dark border-metal-grey/20">
                  <CardHeader>
                    <CardTitle className="text-white">System Status</CardTitle>
                    <CardDescription>Real-time platform health</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">Database</span>
                      <span className="text-sm text-green-accent">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">File Storage</span>
                      <span className="text-sm text-green-accent">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">Authentication</span>
                      <span className="text-sm text-green-accent">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">Email Service</span>
                      <span className="text-sm text-yellow-400">Pending</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <RegistrationRequests />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManagement />
          </TabsContent>

          <TabsContent value="about">
            <AboutContentEditor />
          </TabsContent>

          <TabsContent value="files">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-3">
                <FileUpload />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}