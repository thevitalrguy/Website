import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { AboutPageContent } from "@shared/schema";

export default function About() {
  const { data: aboutContent, isLoading } = useQuery<AboutPageContent>({
    queryKey: ["/api/about-content"],
    queryFn: async () => {
      const response = await fetch("/api/about-content");
      if (!response.ok) return null;
      return response.json();
    },
  });

  // Default fallback content if no custom content is set
  const defaultContent = {
    profileImageUrl: null as string | null,
    name: "VITALR Technologies",
    title: "Cybersecurity & Homelab Education Platform",
    bio: "VITALR Technologies exists to centralize and elevate cybersecurity and homelab education through self-hosted infrastructure, hands-on experimentation, and community-driven knowledge sharing.",
    mission: "Our goal is to empower learners and professionals by making advanced tech concepts tangible through practical application. Everything is grounded in a dark, clean, and custom-built online presence that reflects our commitment to control, privacy, and innovation.",
    values: [
      {
        title: "Privacy & Control",
        description: "Self-hosted solutions and data sovereignty"
      },
      {
        title: "Hands-On Learning", 
        description: "Practical application over theoretical knowledge"
      },
      {
        title: "Community-Driven",
        description: "Knowledge sharing and collaborative growth"
      },
      {
        title: "Innovation",
        description: "Custom-built solutions and cutting-edge practices"
      }
    ]
  };

  const content = aboutContent ? 
    { 
      ...aboutContent, 
      values: Array.isArray(aboutContent.values) ? aboutContent.values : defaultContent.values 
    } : 
    defaultContent;

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      <Header />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            {content.profileImageUrl && (
              <div className="mb-6">
                <img
                  src={content.profileImageUrl}
                  alt={content.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-2 border-green-accent/30"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold text-white mb-4">About {content.name}</h1>
            <p className="text-text-muted text-lg">{content.title}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card-dark border-metal-grey/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Biography</h2>
                <p className="text-text-muted leading-relaxed whitespace-pre-wrap">
                  {content.bio}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card-dark border-metal-grey/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Core Values</h2>
                <ul className="space-y-3 text-text-muted">
                  {content.values.map((value: any, index: number) => (
                    <li key={index}>
                      • <span className="text-green-accent font-medium">{value.title}:</span> {value.description}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card-dark border-metal-grey/20 mt-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Mission Statement</h2>
              <p className="text-text-muted leading-relaxed max-w-4xl mx-auto whitespace-pre-wrap">
                {content.mission}
              </p>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="text-center py-8">
              <div className="text-text-muted">Loading about content...</div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
