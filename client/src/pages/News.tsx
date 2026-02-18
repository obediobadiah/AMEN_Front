import { Layout } from "@/components/Layout";
import { news } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

export default function News() {
  return (
    <Layout>
      {/* Hero */}
      <div className="bg-sidebar py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">News & Media</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Stay updated with our latest activities, stories, and press releases.
          </p>
        </div>
      </div>

      {/* News Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {news.map((item) => (
              <div key={item.id} className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    News
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User size={14} /> {item.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} /> {item.date}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold font-heading leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-3 flex-grow">
                    {item.excerpt}
                  </p>
                  
                  <div className="pt-4 border-t border-border">
                    <span className="inline-flex items-center text-sm font-bold text-primary hover:underline">
                      Read Full Story
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button variant="outline" size="lg" className="rounded-full px-8">Load More Articles</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
