import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-primary-dark text-white">
      <Header />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">About VITALR Technologies</h1>
            <p className="text-text-muted text-lg">Empowering cybersecurity and homelab education through community-driven learning</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card-dark border-metal-grey/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-text-muted leading-relaxed">
                  VITALR Technologies exists to centralize and elevate cybersecurity and homelab education through self-hosted infrastructure, hands-on experimentation, and community-driven knowledge sharing. We're built as a hub for documenting technical processes, showcasing real-world implementations, and providing accessible resources for anyone looking to deepen their understanding of IT, networking, security, and system administration.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card-dark border-metal-grey/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Our Values</h2>
                <ul className="space-y-3 text-text-muted">
                  <li>• <span className="text-green-accent font-medium">Privacy & Control:</span> Self-hosted solutions and data sovereignty</li>
                  <li>• <span className="text-green-accent font-medium">Hands-On Learning:</span> Practical application over theoretical knowledge</li>
                  <li>• <span className="text-green-accent font-medium">Community-Driven:</span> Knowledge sharing and collaborative growth</li>
                  <li>• <span className="text-green-accent font-medium">Innovation:</span> Custom-built solutions and cutting-edge practices</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card-dark border-metal-grey/20 mt-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Empowering Through Education</h2>
              <p className="text-text-muted leading-relaxed max-w-4xl mx-auto">
                Our goal is to empower learners and professionals by making advanced tech concepts tangible through practical application. Everything is grounded in a dark, clean, and custom-built online presence that reflects our commitment to control, privacy, and innovation. We believe that the best way to learn cybersecurity and infrastructure management is through hands-on experience in real-world scenarios.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
