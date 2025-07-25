import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-primary-dark text-white">
      <Header />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
            <p className="text-text-muted text-lg">Comprehensive guides and tutorials for cybersecurity and homelab education</p>
          </div>
          
          <Card className="bg-card-dark border-metal-grey/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Documentation Coming Soon</h2>
              <p className="text-text-muted mb-6">
                We're building comprehensive documentation covering networking, cybersecurity, system administration, and homelab topics.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
