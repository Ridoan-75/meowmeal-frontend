import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Users, Store, ShoppingBag, Star, Target, Heart, Zap } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Customers" },
  { icon: Store, value: "500+", label: "Partner Restaurants" },
  { icon: ShoppingBag, value: "50,000+", label: "Orders Delivered" },
  { icon: Star, value: "4.8", label: "Average Rating" },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To connect food lovers with the best restaurants in their city, making delicious meals accessible to everyone.",
  },
  {
    icon: Heart,
    title: "Our Vision",
    description:
      "A world where great food is just a few taps away, delivered fresh and fast to your doorstep.",
  },
  {
    icon: Zap,
    title: "Our Values",
    description:
      "Speed, quality, and reliability. We believe every meal should be a delightful experience from order to delivery.",
  },
];

const team = [
  {
    name: "Ridoan Ahmed",
    role: "Founder & CEO",
    avatar: "R",
    bio: "Food enthusiast and tech entrepreneur with 10 years of experience.",
  },
  {
    name: "Fatema Khan",
    role: "Head of Operations",
    avatar: "F",
    bio: "Operations expert ensuring every delivery is on time and perfect.",
  },
  {
    name: "Karim Hassan",
    role: "Lead Developer",
    avatar: "K",
    bio: "Full-stack developer building the tech that powers MeowMeal.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              About <span className="text-primary">MeowMeal</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are on a mission to make delicious food accessible to everyone.
              From local favorites to hidden gems, we connect you with the best
              restaurants in your city.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-white/70">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                What Drives Us
              </h2>
              <p className="text-muted-foreground">
                Our core beliefs that shape everything we do
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4"
                >
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Meet the Team
              </h2>
              <p className="text-muted-foreground">
                The people behind MeowMeal
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="bg-card border border-border rounded-2xl p-6 text-center flex flex-col gap-3"
                >
                  <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-primary">{member.role}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}