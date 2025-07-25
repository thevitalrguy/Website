import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { RegistrationRequest } from "@shared/schema";

export function RegistrationRequests() {
  const [filter, setFilter] = useState<"all" | "pending">("pending");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery<RegistrationRequest[]>({
    queryKey: ["/api/admin/registration-requests", filter],
    queryFn: async () => {
      const response = await fetch(`/api/admin/registration-requests?status=${filter}`);
      if (!response.ok) throw new Error("Failed to fetch requests");
      return response.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/registration-requests/${id}/approve`, {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to approve request");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/registration-requests"] });
      toast({
        title: "User Approved",
        description: "Registration request approved and user account created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve registration request",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/registration-requests/${id}/reject`, {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reject request");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/registration-requests"] });
      toast({
        title: "Request Rejected",
        description: "Registration request has been rejected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject registration request",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="border-green-500 text-green-500"><UserCheck className="mr-1 h-3 w-3" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="border-red-500 text-red-500"><UserX className="mr-1 h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card-dark border-metal-grey/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Registration Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-text-muted">Loading registration requests...</div>
        </CardContent>
      </Card>
    );
  }

  const pendingCount = requests?.filter(r => r.status === "pending").length || 0;

  return (
    <Card className="bg-card-dark border-metal-grey/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Registration Requests
            {pendingCount > 0 && (
              <Badge className="ml-2 bg-green-accent text-white">{pendingCount} pending</Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
              className={filter === "pending" ? "bg-green-accent hover:bg-green-accent/90" : "border-metal-grey/30 text-text-muted hover:text-white"}
            >
              Pending
            </Button>
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-green-accent hover:bg-green-accent/90" : "border-metal-grey/30 text-text-muted hover:text-white"}
            >
              All
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Manage user registration requests and approve new accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!requests || requests.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            <Users className="mx-auto h-12 w-12 mb-4 opacity-40" />
            <p>No {filter === "pending" ? "pending " : ""}registration requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-primary-dark/30 p-4 rounded-lg border border-metal-grey/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-medium">{request.username}</h4>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-text-muted text-sm mb-1">
                      <strong>Email:</strong> {request.email}
                    </p>
                    {(request.firstName || request.lastName) && (
                      <p className="text-text-muted text-sm mb-1">
                        <strong>Name:</strong> {[request.firstName, request.lastName].filter(Boolean).join(" ")}
                      </p>
                    )}
                    <p className="text-text-muted text-xs">
                      Requested: {new Date(request.requestedAt).toLocaleDateString()} at {new Date(request.requestedAt).toLocaleTimeString()}
                    </p>
                    {request.processedAt && (
                      <p className="text-text-muted text-xs">
                        Processed: {new Date(request.processedAt).toLocaleDateString()} at {new Date(request.processedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  
                  {request.status === "pending" && (
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate(request.id)}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <UserCheck className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectMutation.mutate(request.id)}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <UserX className="mr-1 h-3 w-3" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}