import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
  explore: [
    { href: "/meals", label: "Browse Meals" },
    { href: "/providers", label: "Restaurants" },
    { href: "/meals?category=biryani", label: "Biryani" },
    { href: "/meals?category=burger", label: "Burgers" },
    { href: "/meals?category=pizza", label: "Pizza" },
  ],
};

const socialLinks = [
  { href: "https://facebook.com", icon: FaFacebookF, label: "Facebook" },
  { href: "https://twitter.com", icon: FaTwitter, label: "Twitter" },
  { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
  { href: "https://youtube.com", icon: FaYoutube, label: "Youtube" },
];

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-64 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-48 bg-orange-400/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 pt-2">
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-14" />

        {/* 4-column grid: Brand | Contact | Company | Explore */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14">

          {/* ── Col 1: Brand ── */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <Image
                src="/logo.png"
                alt="MeowMeal"
                width={36}
                height={36}
                className="rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-black text-xl text-primary tracking-tight">
                meowmeal
              </span>
            </Link>

            <p className="text-sm text-white/40 leading-relaxed max-w-[200px]">
              Order delicious food from the best restaurants near you. Fast delivery, great taste.
            </p>

            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                >
                  <social.icon className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Contact ── */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-3.5 w-[2px] bg-primary rounded-full" />
              <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.18em]">
                Contact
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href="mailto:support@meowmeal.com"
                className="group flex items-start gap-3 hover:text-primary transition-colors duration-200"
              >
                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-200">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-white/30 mb-0.5">Email us</span>
                  <span className="text-sm text-white/50 group-hover:text-primary transition-colors duration-200">
                    support@meowmeal.com
                  </span>
                </div>
              </a>

              <a
                href="tel:+8801700000000"
                className="group flex items-start gap-3 hover:text-primary transition-colors duration-200"
              >
                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-200">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-white/30 mb-0.5">Call us</span>
                  <span className="text-sm text-white/50 group-hover:text-primary transition-colors duration-200">
                    +880 1700-000000
                  </span>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-white/30 mb-0.5">Location</span>
                  <span className="text-sm text-white/50">Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Col 3: Company ── */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-3.5 w-[2px] bg-primary rounded-full" />
              <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.18em]">
                Company
              </h3>
            </div>
            <ul className="flex flex-col gap-3.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-white/45 hover:text-primary transition-all duration-200 w-fit"
                  >
                    <ArrowRight className="h-3 w-3 text-primary opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Explore ── */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-3.5 w-[2px] bg-primary rounded-full" />
              <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.18em]">
                Explore
              </h3>
            </div>
            <ul className="flex flex-col gap-3.5">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-white/45 hover:text-primary transition-all duration-200 w-fit"
                  >
                    <ArrowRight className="h-3 w-3 text-primary opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40 tracking-wide">
            © {new Date().getFullYear()} meowmeal. All rights reserved.
          </p>
          <p className="text-xs text-white/40">Made with love in Bangladesh 🇧🇩</p>
        </div>
      </div>
    </footer>
  );
}