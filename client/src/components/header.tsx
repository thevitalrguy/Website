import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Menu, Shield, LogOut, Settings } from "lucide-react";
import { LoginDialog } from "@/components/auth/login-dialog";
import { RegisterDialog } from "@/components/auth/register-dialog";
import { useAuth, useLogout } from "@/hooks/useAuth";

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, isAdmin } = useAuth();
  const logout = useLogout();

  const navigation = [
    { name: "Documentation", href: "/documentation", active: location === "/documentation" },
    { name: "Homelab", href: "/homelab", active: location === "/homelab" },
    { name: "Resources", href: "/resources", active: location === "/resources" },
    { name: "Community", href: "/community", active: location === "/community" },
    { name: "About", href: "/about", active: location === "/about" },
  ];

  return (
    <header className="border-b border-metal-grey/30 sticky top-0 bg-primary-dark/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-green-accent rounded-lg flex items-center justify-center">
              <Shield className="text-white text-lg" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VITALR</h1>
              <p className="text-xs text-text-muted">Technologies</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`transition-colors duration-200 ${
                  item.active 
                    ? "text-white" 
                    : "text-text-muted hover:text-green-accent"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search & Auth */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block relative">
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card-dark border-metal-grey/30 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-text-muted focus:border-green-accent transition-colors duration-200 w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={14} />
            </div>

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="border-green-accent/30 text-green-accent hover:bg-green-accent/10">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <span className="text-sm text-text-muted">Welcome, {user?.firstName || user?.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout.mutate()}
                  className="text-text-muted hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <RegisterDialog />
                <LoginDialog />
              </div>
            )}
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-text-muted hover:text-white">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card-dark border-metal-grey/30">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link 
                      key={item.name}
                      href={item.href}
                      className={`text-lg transition-colors duration-200 ${
                        item.active 
                          ? "text-white" 
                          : "text-text-muted hover:text-green-accent"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
