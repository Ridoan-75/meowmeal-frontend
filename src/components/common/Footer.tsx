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
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.png"
                alt="MeowMeal"
                width={44}
                height={44}
                className="rounded-xl"
              />
              <span className="font-black text-2xl text-primary tracking-tight">
                meowmeal
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
              Order delicious food from the best restaurants near you. Fast
              delivery, great taste, every time.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-3">
              <a
                href="mailto:support@meowmeal.com"
                className="group flex items-center gap-3 text-sm text-white/40 hover:text-primary transition-colors"
              >
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                </div>
                support@meowmeal.com
              </a>
              <a
                href="tel:+8801700000000"
                className="group flex items-center gap-3 text-sm text-white/40 hover:text-primary transition-colors"
              >
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                +880 1700-000000
              </a>
              <div className="flex items-center gap-3 text-sm text-white/40">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                Dhaka, Bangladesh
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-white/40 hover:text-primary transition-colors"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">
              Explore
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-white/40 hover:text-primary transition-colors"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/25">
            © {new Date().getFullYear()} MeowMeal. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all"
              >
                <social.icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
