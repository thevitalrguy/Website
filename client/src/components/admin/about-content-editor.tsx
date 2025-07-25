import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Save, Upload, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AboutPageContent } from "@shared/schema";

interface ValueItem {
  title: string;
  description: string;
}

export function AboutContentEditor() {
  const [content, setContent] = useState({
    profileImageUrl: "",
    name: "",
    title: "",
    bio: "",
    mission: "",
    values: [] as ValueItem[],
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: aboutContent, isLoading } = useQuery<AboutPageContent>({
    queryKey: ["/api/about-content"],
    queryFn: async () => {
      const response = await fetch("/api/about-content");
      if (!response.ok) return null;
      return response.json();
    },
  });

  useEffect(() => {
    if (aboutContent) {
      setContent({
        profileImageUrl: aboutContent.profileImageUrl || "",
        name: aboutContent.name || "",
        title: aboutContent.title || "",
        bio: aboutContent.bio || "",
        mission: aboutContent.mission || "",
        values: Array.isArray(aboutContent.values) ? aboutContent.values : [],
      });
    }
  }, [aboutContent]);

  const updateContentMutation = useMutation({
    mutationFn: async (data: typeof content) => {
      const response = await fetch("/api/admin/about-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update content");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about-content"] });
      toast({
        title: "Content Updated",
        description: "About page content has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update about page content",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContentMutation.mutate(content);
  };

  const addValue = () => {
    setContent(prev => ({
      ...prev,
      values: [...prev.values, { title: "", description: "" }],
    }));
  };

  const updateValue = (index: number, field: keyof ValueItem, value: string) => {
    setContent(prev => ({
      ...prev,
      values: prev.values.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeValue = (index: number) => {
    setContent(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <Card className="bg-card-dark border-metal-grey/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="mr-2 h-5 w-5" />
            About Page Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-text-muted">Loading about page content...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card-dark border-metal-grey/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            About Page Editor
          </div>
          <Button
            onClick={handleSubmit}
            disabled={updateContentMutation.isPending}
            className="bg-green-accent hover:bg-green-accent/90 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {updateContentMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardTitle>
        <CardDescription>
          Manage your personal information and about page content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="space-y-2">
            <Label htmlFor="profileImage" className="text-white">Profile Image URL</Label>
            <div className="flex space-x-2">
              <Input
                id="profileImage"
                type="url"
                value={content.profileImageUrl}
                onChange={(e) => setContent(prev => ({ ...prev, profileImageUrl: e.target.value }))}
                className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
                placeholder="https://example.com/your-photo.jpg"
              />
              <Button
                type="button"
                variant="outline"
                className="border-green-accent/30 text-green-accent hover:bg-green-accent/10"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {content.profileImageUrl && (
              <div className="mt-2">
                <img
                  src={content.profileImageUrl}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border border-metal-grey/30"
                />
              </div>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={content.name}
              onChange={(e) => setContent(prev => ({ ...prev, name: e.target.value }))}
              className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
              placeholder="Your full name"
              required
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Professional Title</Label>
            <Input
              id="title"
              type="text"
              value={content.title}
              onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
              className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
              placeholder="e.g., Cybersecurity Specialist, Infrastructure Engineer"
              required
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">Biography</Label>
            <Textarea
              id="bio"
              value={content.bio}
              onChange={(e) => setContent(prev => ({ ...prev, bio: e.target.value }))}
              className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
              placeholder="Tell visitors about yourself, your background, and expertise..."
              rows={4}
              required
            />
          </div>

          {/* Mission */}
          <div className="space-y-2">
            <Label htmlFor="mission" className="text-white">Mission Statement</Label>
            <Textarea
              id="mission"
              value={content.mission}
              onChange={(e) => setContent(prev => ({ ...prev, mission: e.target.value }))}
              className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
              placeholder="Describe your mission and what you aim to achieve..."
              rows={3}
              required
            />
          </div>

          {/* Values */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white">Core Values</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addValue}
                className="border-green-accent/30 text-green-accent hover:bg-green-accent/10"
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Value
              </Button>
            </div>
            
            {content.values.length === 0 ? (
              <div className="text-center py-4 text-text-muted">
                <p>No values added yet. Click "Add Value" to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {content.values.map((value, index) => (
                  <div key={index} className="p-4 bg-primary-dark/30 rounded-lg border border-metal-grey/20">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-white font-medium">Value {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeValue(index)}
                        className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-white text-sm">Title</Label>
                        <Input
                          value={value.title}
                          onChange={(e) => updateValue(index, "title", e.target.value)}
                          className="mt-1 bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
                          placeholder="e.g., Innovation, Privacy & Control"
                        />
                      </div>
                      <div>
                        <Label className="text-white text-sm">Description</Label>
                        <Textarea
                          value={value.description}
                          onChange={(e) => updateValue(index, "description", e.target.value)}
                          className="mt-1 bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
                          placeholder="Describe this core value and its importance..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}