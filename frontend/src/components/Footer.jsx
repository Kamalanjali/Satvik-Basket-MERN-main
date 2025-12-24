import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#3b1515] text-[#f5f1ec]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">
              About Satvik Basket
            </h3>
            <p className="text-[#d8c7bd] leading-relaxed mb-4">
              Satvik Basket is dedicated to preserving the authentic flavors of
              traditional Indian cooking. We bring you handcrafted, organic, and
              pure homemade products — from rich ghee to aromatic spice blends.
            </p>
            <p className="text-sm italic text-[#cdb6aa]">
              Rooted in tradition, crafted with love.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-[#d8c7bd]">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#c07a6a]" />
                <span>
                  123 Traditional Lane, Heritage District,
                  Bangalore – 560001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-[#c07a6a]" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-[#f1b8a6] transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-[#c07a6a]" />
                <a
                  href="mailto:hello@satvikbasket.com"
                  className="hover:text-[#f1b8a6] transition-colors"
                >
                  hello@satvikbasket.com
                </a>
              </li>
            </ul>
          </div>

          {/* Links + Social */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 mb-6">
              <li>
                <Link
                  to="/"
                  className="text-[#d8c7bd] hover:text-[#f1b8a6] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-[#d8c7bd] hover:text-[#f1b8a6] transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-[#d8c7bd] hover:text-[#f1b8a6] transition-colors"
                >
                  Create Account
                </Link>
              </li>
            </ul>

            <h4 className="text-lg font-semibold mb-3">
              Follow Us
            </h4>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full
                             bg-[#4a1f1f]
                             flex items-center justify-center
                             text-[#d8c7bd]
                             hover:bg-[#6a2f2f]
                             hover:text-[#f5f1ec]
                             transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[#5a2a2a] text-center">
          <p className="text-sm text-[#cdb6aa]">
            © {new Date().getFullYear()} Satvik Basket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
