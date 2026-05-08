import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";


const posts = [
  {
    id: 1,
    title: "10 Must-Try Dishes in Dhaka You Cannot Miss",
    excerpt:
      "Dhaka is a food lover's paradise. From street food to fine dining, here are the top dishes you must try when visiting the capital.",
    category: "Food Guide",
    author: "Ridoan Ahmed",
    date: "May 1, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600",
  },
  {
    id: 2,
    title: "How to Start Your Own Food Business in Bangladesh",
    excerpt:
      "Thinking of starting a food business? Here is everything you need to know about registering as a restaurant partner on MeowMeal.",
    category: "Business",
    author: "Fatema Khan",
    date: "April 25, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
  },
  {
    id: 3,
    title: "The Rise of Food Delivery Apps in Bangladesh",
    excerpt:
      "Food delivery has transformed how Bangladeshis eat. We explore the growth of the industry and what it means for consumers.",
    category: "Industry",
    author: "Karim Hassan",
    date: "April 15, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600",
  },
  {
    id: 4,
    title: "Healthy Eating on a Budget: Tips from Our Nutritionist",
    excerpt:
      "Eating healthy does not have to be expensive. Our in-house nutritionist shares tips on ordering nutritious meals on a budget.",
    category: "Health",
    author: "Dr. Nadia Islam",
    date: "April 10, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">MeowMeal Blog</h1>
            <p className="text-muted-foreground text-lg">
              Food stories, tips, and insights from our team
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-white border-0 text-xs">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <h2 className="font-semibold text-sm leading-snug line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-xs text-muted-foreground line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}