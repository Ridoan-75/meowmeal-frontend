import { HeroSection } from "@/components/sections/HeroSection";
import { CategorySection } from "@/components/sections/CategorySection";
import { FeaturedMeals } from "@/components/sections/FeaturedMeals";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { TopProviders } from "@/components/sections/TopProviders";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQSection } from "@/components/sections/FAQSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { CTASection } from "@/components/sections/CTASection";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedMeals />
        <HowItWorks />
        <TopProviders />
        <Testimonials />
        <FAQSection />
        <NewsletterSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}