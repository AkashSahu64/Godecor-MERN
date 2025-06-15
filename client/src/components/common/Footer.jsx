import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github as GitHub } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-display font-bold text-primary-400 mb-4">
              Godecor
            </h3>
            <p className="text-gray-400 mb-4 max-w-xs">
              Your destination for premium artificial plants. Add a touch of nature to your space without the maintenance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-primary-400 transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=indoor" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Indoor Plants
                </Link>
              </li>
              <li>
                <Link to="/products?category=outdoor" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Outdoor Plants
                </Link>
              </li>
              <li>
                <Link to="/products?category=bonsai" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Bonsai Trees
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-primary-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-primary-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Plant Street, Green City, Nature Country
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-primary-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-primary-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">info@godecor.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-dark-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Godecor. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;