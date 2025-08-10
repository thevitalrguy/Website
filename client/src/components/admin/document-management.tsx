import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FolderPlus, Upload, FileText, Download, Folder, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DocumentFolder, Document, Topic } from "@shared/schema";

export function DocumentManagement() {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [uploadDocOpen, setUploadDocOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: topics } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  const { data: folders } = useQuery<DocumentFolder[]>({
    queryKey: ["/api/document-folders", selectedTopic],
    queryFn: () =>
      apiRequest<DocumentFolder[]>(
        `/api/document-folders${selectedTopic ? `?topicId=${selectedTopic}` : ""}`,
      ),
  });

  const { data: documents } = useQuery<Document[]>({
    queryKey: ["/api/documents", selectedFolder],
    queryFn: () =>
      apiRequest<Document[]>(
        `/api/documents${selectedFolder ? `?folderId=${selectedFolder}` : ""}`,
      ),
  });

  const createFolderMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string; topicId?: string; parentId?: string }) => {
      return apiRequest<DocumentFolder>("/api/admin/document-folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/document-folders"] });
      toast({
        title: "Folder Created",
        description: "Document folder created successfully.",
      });
      setCreateFolderOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create folder",
        variant: "destructive",
      });
    },
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return fetch("/api/admin/documents", {
        method: "POST",
        body: formData,
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document Uploaded",
        description: "Document uploaded successfully.",
      });
      setUploadDocOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const CreateFolderDialog = () => {
    const [folderData, setFolderData] = useState({
      name: "",
      description: "",
      topicId: selectedTopic,
      parentId: selectedFolder,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!folderData.name.trim()) return;
      
      createFolderMutation.mutate({
        name: folderData.name,
        description: folderData.description || undefined,
        topicId: folderData.topicId || undefined,
        parentId: folderData.parentId || undefined,
      });
    };

    return (
      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogTrigger asChild>
          <Button className="bg-green-accent hover:bg-green-accent/90 text-white">
            <FolderPlus className="mr-2 h-4 w-4" />
            Create Folder
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card-dark border-metal-grey/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Create Document Folder</DialogTitle>
            <DialogDescription className="text-text-muted">
              Create a new folder to organize your documents by topic and category.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folderName" className="text-white">Folder Name</Label>
              <Input
                id="folderName"
                value={folderData.name}
                onChange={(e) => setFolderData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
                placeholder="e.g., Hardware, Configurations, Learning Materials"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="folderDesc" className="text-white">Description (Optional)</Label>
              <Textarea
                id="folderDesc"
                value={folderData.description}
                onChange={(e) => setFolderData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
                placeholder="Brief description of folder contents"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="folderTopic" className="text-white">Topic</Label>
              <Select
                value={folderData.topicId}
                onValueChange={(value) => setFolderData(prev => ({ ...prev, topicId: value }))}
              >
                <SelectTrigger className="bg-primary-dark border-metal-grey/30 text-white">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent className="bg-card-dark border-metal-grey/30">
                  {topics?.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id} className="text-white hover:bg-primary-dark">
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateFolderOpen(false)}
                className="border-metal-grey/30 text-text-muted hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!folderData.name.trim() || createFolderMutation.isPending}
                className="bg-green-accent hover:bg-green-accent/90 text-white"
              >
                {createFolderMutation.isPending ? "Creating..." : "Create Folder"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const UploadDocumentDialog = () => {
    const [file, setFile] = useState<File | null>(null);
    const [docData, setDocData] = useState({
      title: "",
      description: "",
      folderId: selectedFolder,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", docData.title || file.name);
      formData.append("description", docData.description);
      if (docData.folderId) {
        formData.append("folderId", docData.folderId);
      }

      uploadDocumentMutation.mutate(formData);
    };

    return (
      <Dialog open={uploadDocOpen} onOpenChange={setUploadDocOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-green-accent/30 text-green-accent hover:bg-green-accent/10">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card-dark border-metal-grey/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Upload Document</DialogTitle>
            <DialogDescription className="text-text-muted">
              Upload PDF, DOCX, or other document files to organize by folder.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="docFile" className="text-white">File</Label>
              <Input
                id="docFile"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="bg-primary-dark border-metal-grey/30 text-white file:bg-green-accent file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="docTitle" className="text-white">Title (Optional)</Label>
              <Input
                id="docTitle"
                value={docData.title}
                onChange={(e) => setDocData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
                placeholder="Leave blank to use filename"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="docDescription" className="text-white">Description (Optional)</Label>
              <Textarea
                id="docDescription"
                value={docData.description}
                onChange={(e) => setDocData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
                placeholder="Brief description of the document"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="docFolder" className="text-white">Folder</Label>
              <Select
                value={docData.folderId}
                onValueChange={(value) => setDocData(prev => ({ ...prev, folderId: value }))}
              >
                <SelectTrigger className="bg-primary-dark border-metal-grey/30 text-white">
                  <SelectValue placeholder="Select a folder (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-card-dark border-metal-grey/30">
                  {folders?.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id} className="text-white hover:bg-primary-dark">
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadDocOpen(false)}
                className="border-metal-grey/30 text-text-muted hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!file || uploadDocumentMutation.isPending}
                className="bg-green-accent hover:bg-green-accent/90 text-white"
              >
                {uploadDocumentMutation.isPending ? "Uploading..." : "Upload Document"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Card className="bg-card-dark border-metal-grey/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Document Management
          </div>
          <div className="flex space-x-2">
            <CreateFolderDialog />
            <UploadDocumentDialog />
          </div>
        </CardTitle>
        <CardDescription>
          Organize and manage your documentation files with folder structure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Topic Filter */}
        <div className="space-y-2">
          <Label className="text-white">Filter by Topic</Label>
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="bg-primary-dark border-metal-grey/30 text-white">
              <SelectValue placeholder="All Topics" />
            </SelectTrigger>
            <SelectContent className="bg-card-dark border-metal-grey/30">
              <SelectItem value="" className="text-white hover:bg-primary-dark">All Topics</SelectItem>
              {topics?.map((topic) => (
                <SelectItem key={topic.id} value={topic.id} className="text-white hover:bg-primary-dark">
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Folders */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Folders</h4>
          {!folders || folders.length === 0 ? (
            <div className="text-center py-4 text-text-muted">
              <Folder className="mx-auto h-8 w-8 mb-2 opacity-40" />
              <p>No folders found. Create your first folder to organize documents.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedFolder === folder.id
                      ? "bg-green-accent/10 border-green-accent/30"
                      : "bg-primary-dark/30 border-metal-grey/20 hover:border-metal-grey/40"
                  }`}
                  onClick={() => setSelectedFolder(selectedFolder === folder.id ? "" : folder.id)}
                >
                  <div className="flex items-center space-x-2">
                    {selectedFolder === folder.id ? (
                      <FolderOpen className="h-4 w-4 text-green-accent" />
                    ) : (
                      <Folder className="h-4 w-4 text-text-muted" />
                    )}
                    <span className="text-white text-sm font-medium">{folder.name}</span>
                  </div>
                  {folder.description && (
                    <p className="text-text-muted text-xs mt-1 ml-6">{folder.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">
            Documents {selectedFolder && folders && (
              <span className="text-text-muted text-sm font-normal">
                in {folders.find(f => f.id === selectedFolder)?.name}
              </span>
            )}
          </h4>
          {!documents || documents.length === 0 ? (
            <div className="text-center py-4 text-text-muted">
              <FileText className="mx-auto h-8 w-8 mb-2 opacity-40" />
              <p>No documents found. Upload your first document to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-primary-dark/30 rounded-lg border border-metal-grey/20"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-green-accent" />
                    <div>
                      <p className="text-white text-sm font-medium">{doc.title}</p>
                      {doc.description && (
                        <p className="text-text-muted text-xs">{doc.description}</p>
                      )}
                      <p className="text-text-muted text-xs">
                        {Math.round(doc.size / 1024)} KB • Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(doc.filePath, '_blank')}
                    className="border-metal-grey/30 text-text-muted hover:text-white"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
