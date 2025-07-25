import Header from "@/components/header";
import Hero from "@/components/hero";
import FeaturedTopics from "@/components/featured-topics";
import LatestContent from "@/components/latest-content";
import CodeExample from "@/components/code-example";
import CommunityStatsSection from "@/components/community-stats";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-primary-dark text-white">
      <Header />
      <Hero />
      <FeaturedTopics />
      <LatestContent />
      <CodeExample />
      <CommunityStatsSection />
      <Footer />
    </div>
  );
}
