import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    {
      question: 'Are your artificial plants safe for homes with pets?',
      answer: 'Yes, our artificial plants are made from non-toxic materials and are safe to have around pets. However, we recommend keeping them out of reach as pets might be tempted to chew on them.',
    },
    {
      question: 'How do I clean and maintain artificial plants?',
      answer: 'Our artificial plants are easy to maintain. Simply dust them regularly with a feather duster or soft cloth. For deeper cleaning, you can use a damp cloth to wipe the leaves gently. Avoid using harsh chemicals or soaking the plants in water.',
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can see the exact shipping cost during checkout after entering your delivery address.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all our products. Items must be unused and in their original packaging. Contact our customer service team to initiate a return.',
    },
    {
      question: 'Are your plants UV resistant?',
      answer: 'Many of our outdoor artificial plants are UV resistant and designed to withstand sun exposure. Check the product description for specific UV protection information.',
    },
    {
      question: 'Do you offer bulk discounts?',
      answer: 'Yes, we offer discounts for bulk orders. Please contact our sales team for more information about bulk pricing and commercial orders.',
    },
    {
      question: 'How realistic do your artificial plants look?',
      answer: 'Our artificial plants are crafted with attention to detail using high-quality materials to achieve a realistic appearance. We carefully select products that mimic the texture, color, and overall appearance of real plants.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various digital payment methods. All payments are processed securely.',
    },
  ];
  
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
          <h1 className="text-4xl font-display font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about our artificial plants, shipping, returns, and more.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-xl overflow-hidden">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border-b border-dark-700 last:border-0 ${
                  openIndex === index ? 'bg-dark-700/50' : ''
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp size={20} className="text-primary-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-400">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          
          {/* Contact Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-display font-semibold mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-400 mb-6">
              Can't find the answer you're looking for? Please chat to our friendly team.
            </p>
            <a
              href="/contact"
              className="btn-primary inline-flex items-center"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FAQPage;