import { Button } from "@/components/ui/button";
import { Rocket, BookOpen } from "lucide-react";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Expand your <span className="text-green-accent">Knowledge</span> & <span className="text-green-accent">Homelabbing</span> Journey
          </h1>
          <p className="text-xl text-text-muted mb-8 leading-relaxed">
            Education and experience through self-hosted infrastructure,  experimenting and breaking self-hosted infrastructure, and community-driven knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/documentation">
              <Button className="bg-green-accent hover:bg-green-accent/90 text-white px-8 py-3 font-medium">
                <Rocket className="mr-2" size={18} />
                Start Learning
              </Button>
            </Link>
            <Link href="/documentation">
              <Button variant="outline" className="border-metal-grey/30 hover:border-green-accent text-white px-8 py-3 font-medium">
                <BookOpen className="mr-2" size={18} />
                Browse Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
