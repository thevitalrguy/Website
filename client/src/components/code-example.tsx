import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Play, Shield, Download, Check } from "lucide-react";

export default function CodeExample() {
  const [copied, setCopied] = useState(false);

  const codeExample = `version: '3.8'

services:
  traefik:
    image: traefik:v2.9
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik:/etc/traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=Host(\`traefik.local\`)"`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card-dark/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Hands-On Learning</h2>
          <p className="text-text-muted text-lg">Real-world implementations with detailed code examples and configurations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Example */}
          <Card className="bg-card-dark border-metal-grey/20 overflow-hidden">
            <div className="bg-primary-dark border-b border-metal-grey/20 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-text-muted text-sm font-mono">docker-compose.yml</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopy}
                className="text-text-muted hover:text-green-accent h-8 w-8 p-0"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
            <CardContent className="p-6 overflow-x-auto">
              <pre className="text-sm font-mono text-white">
                <code>
                  <span className="text-green-accent">version:</span> <span className="text-yellow-400">'3.8'</span>
                  {'\n\n'}
                  <span className="text-green-accent">services:</span>
                  {'\n  '}
                  <span className="text-blue-400">traefik:</span>
                  {'\n    '}
                  <span className="text-green-accent">image:</span> <span className="text-yellow-400">traefik:v2.9</span>
                  {'\n    '}
                  <span className="text-green-accent">container_name:</span> <span className="text-yellow-400">traefik</span>
                  {'\n    '}
                  <span className="text-green-accent">restart:</span> <span className="text-yellow-400">unless-stopped</span>
                  {'\n    '}
                  <span className="text-green-accent">ports:</span>
                  {'\n      - '}
                  <span className="text-yellow-400">"80:80"</span>
                  {'\n      - '}
                  <span className="text-yellow-400">"443:443"</span>
                  {'\n    '}
                  <span className="text-green-accent">volumes:</span>
                  {'\n      - '}
                  <span className="text-yellow-400">/var/run/docker.sock:/var/run/docker.sock</span>
                  {'\n      - '}
                  <span className="text-yellow-400">./traefik:/etc/traefik</span>
                  {'\n    '}
                  <span className="text-green-accent">labels:</span>
                  {'\n      - '}
                  <span className="text-yellow-400">"traefik.enable=true"</span>
                  {'\n      - '}
                  <span className="text-yellow-400">"traefik.http.routers.dashboard.rule=Host(`traefik.local`)"</span>
                </code>
              </pre>
            </CardContent>
          </Card>

          {/* Implementation Details */}
          <div className="space-y-6">
            <Card className="bg-card-dark border-metal-grey/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-accent/20 rounded-lg flex items-center justify-center">
                    <Play className="text-green-accent" size={16} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Quick Start</h3>
                </div>
                <p className="text-text-muted text-sm mb-4">
                  Deploy a complete reverse proxy solution with SSL termination and automatic service discovery in under 5 minutes.
                </p>
                <div className="bg-primary-dark rounded-lg p-3 font-mono text-sm text-green-accent">
                  $ docker-compose up -d
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card-dark border-metal-grey/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-accent/20 rounded-lg flex items-center justify-center">
                    <Shield className="text-green-accent" size={16} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Security Features</h3>
                </div>
                <ul className="space-y-2 text-text-muted text-sm">
                  <li className="flex items-center space-x-2">
                    <Check className="text-green-accent" size={14} />
                    <span>Automatic SSL/TLS certificates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="text-green-accent" size={14} />
                    <span>HTTP to HTTPS redirection</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="text-green-accent" size={14} />
                    <span>Rate limiting and middleware</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card-dark border-metal-grey/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-accent/20 rounded-lg flex items-center justify-center">
                    <Download className="text-green-accent" size={16} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Lab Resources</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary-dark text-green-accent">
                    Docker Compose
                  </Badge>
                  <Badge variant="secondary" className="bg-primary-dark text-green-accent">
                    Config Files
                  </Badge>
                  <Badge variant="secondary" className="bg-primary-dark text-green-accent">
                    Lab Guide
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
