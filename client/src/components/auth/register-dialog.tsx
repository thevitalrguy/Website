import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { RegistrationData } from "@shared/schema";

export function RegisterDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationData) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Submitted",
        description: "Your registration request has been submitted for admin approval. You'll be notified when approved.",
      });
      setOpen(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      });
      setErrors({});
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to submit registration request",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    registerMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-green-accent/30 text-green-accent hover:bg-green-accent/10">
          <UserPlus className="mr-2 h-4 w-4" />
          Register
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-dark border-metal-grey/30 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Request Account Access</DialogTitle>
          <DialogDescription className="text-text-muted">
            Submit your information for admin approval. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">Username *</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
              placeholder="Enter your username"
              disabled={registerMutation.isPending}
            />
            {errors.username && (
              <div className="flex items-center text-red-400 text-sm">
                <AlertCircle className="mr-1 h-3 w-3" />
                {errors.username}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
              placeholder="Enter your email address"
              disabled={registerMutation.isPending}
            />
            {errors.email && (
              <div className="flex items-center text-red-400 text-sm">
                <AlertCircle className="mr-1 h-3 w-3" />
                {errors.email}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
              placeholder="Enter a secure password (min 8 characters)"
              disabled={registerMutation.isPending}
            />
            {errors.password && (
              <div className="flex items-center text-red-400 text-sm">
                <AlertCircle className="mr-1 h-3 w-3" />
                {errors.password}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
                placeholder="Optional"
                disabled={registerMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="bg-primary-dark border-metal-grey/30 text-white placeholder-text-muted focus:border-green-accent"
                placeholder="Optional"
                disabled={registerMutation.isPending}
              />
            </div>
          </div>

          <div className="bg-primary-dark/50 p-3 rounded-md border border-metal-grey/20 text-sm text-text-muted">
            <div className="flex items-start">
              <CheckCircle className="mr-2 h-4 w-4 text-green-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-white mb-1">What happens next?</p>
                <p>An admin will review your request and approve your account. You can then log in using your email and password.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={registerMutation.isPending}
              className="border-metal-grey/30 text-text-muted hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="bg-green-accent hover:bg-green-accent/90 text-white"
            >
              {registerMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}