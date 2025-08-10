import { Link } from "wouter";
import { Shield } from "lucide-react";
import { SiGithub, SiDiscord, SiLinkedin } from "react-icons/si";
import { Rss } from "lucide-react";

export default function Footer() {
  const documentationLinks = [
    { name: "Getting Started", href: "/documentation" },
    { name: "Networking Guides", href: "/documentation" },
    { name: "Security Tutorials", href: "/documentation" },
    { name: "Homelab Setup", href: "/documentation" },
  ];

  const resourceLinks = [
    { name: "Lab Downloads", href: "/resources" },
    { name: "Config Files", href: "/resources" },
    { name: "Scripts & Tools", href: "/resources" },
    { name: "Reference Materials", href: "/resources" },
  ];

  const communityLinks = [
    { name: "Discord Server", href: "https://discord.com/invite/Pzy2wygGwm" },
    { name: "GitHub", href: "https://github.com/thevitalrguy" },
    { name: "Ask a Question", href: "https://www.reddit.com/r/vitalrtech/" },
    { name: "Contact", href: "/about" },
  ];

  const socialLinks = [
    { name: "Reddit", icon: SiReddit, href: "https://www.reddit.com/r/vitalrtech/" },
    { name: "Discord", icon: SiDiscord, href: "https://discord.com/invite/Pzy2wygGwm" },
    { name: "My LinkedIn", icon: SiLinkedin, href: "https://www.linkedin.com/in/knewton/" },
  ];

  return (
    <footer className="bg-card-dark border-t border-metal-grey/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-4 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 bg-green-accent rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">VITALR</h1>
                <p className="text-xs text-text-muted">Technologies</p>
              </div>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Empowering cybersecurity and homelab education through practical learning and community knowledge sharing.
            </p>
          </div>

          {/* Documentation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Documentation</h4>
            <ul className="space-y-2 text-text-muted text-sm">
              {documentationLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-green-accent transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-text-muted text-sm">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-green-accent transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-text-muted text-sm">
              {communityLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-green-accent transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-metal-grey/30 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-muted text-sm">
            © 2024 VITALR Technologies. Built with privacy and control in mind.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-text-muted hover:text-green-accent transition-colors duration-200"
                  aria-label={social.name}
                >
                  <IconComponent size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
