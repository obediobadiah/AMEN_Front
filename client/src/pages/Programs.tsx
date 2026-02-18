import { Layout } from "@/components/Layout";
import { programs } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Programs() {
  return (
    <Layout>
      {/* Hero */}
      <div className="bg-sidebar py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Our Programs</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Discover the initiatives we are implementing to transform lives and communities.
          </p>
        </div>
      </div>

      {/* Programs Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card key={program.id} className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary z-10">
                    {program.category}
                  </div>
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-heading group-hover:text-primary transition-colors">{program.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">{program.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-primary">Raised: ${program.raised.toLocaleString()}</span>
                      <span className="text-muted-foreground">Goal: ${program.goal.toLocaleString()}</span>
                    </div>
                    <Progress value={(program.raised / program.goal) * 100} className="h-2" />
                  </div>

                  <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white transition-all">
                    Donate Now <Heart className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
