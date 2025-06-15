import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the message
    alert('Message sent successfully!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">Contact Us</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary-400 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium mb-1">Our Location</h3>
                    <p className="text-gray-400">
                      123 Plant Street
                      <br />
                      Green City, Nature Country
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-primary-400 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium mb-1">Phone Number</h3>
                    <p className="text-gray-400">+91 98765 43210</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-primary-400 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium mb-1">Email Address</h3>
                    <p className="text-gray-400">info@godecor.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-dark-700">
                <h3 className="font-medium mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Saturday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input w-full"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group mb-6">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input w-full"
                    required
                  />
                </div>
                
                <div className="form-group mb-6">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="input w-full"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center w-full sm:w-auto"
                >
                  <Send size={16} className="mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-12">
          <div className="glass-card rounded-xl p-8">
            <div className="aspect-w-16 aspect-h-9 bg-dark-700 rounded-lg">
              {/* In a real app, this would be a Google Maps embed */}
              <div className="w-full h-64 flex items-center justify-center text-gray-400">
                Google Maps would be embedded here
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;