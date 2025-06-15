import { motion } from 'framer-motion';
import { Leaf, Truck, Award, Heart } from 'lucide-react';

const AboutPage = () => {
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
            About <span className="text-primary-400">Godecor</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your premier destination for premium artificial plants. We bring the beauty of nature into your space, without the maintenance.
          </p>
        </div>
        
        {/* Our Story */}
        <div className="glass-card rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-display font-semibold mb-4">Our Story</h2>
          <p className="text-gray-300 mb-4">
            Founded in 2023, Godecor was born from a simple idea: to make the beauty of nature accessible to everyone, regardless of their gardening abilities or lifestyle constraints.
          </p>
          <p className="text-gray-300">
            We understand that not everyone has the time, space, or optimal conditions to maintain real plants. That's why we've curated a collection of the highest quality artificial plants that look and feel incredibly realistic, allowing you to create your own indoor oasis without the worry of maintenance.
          </p>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            {
              icon: <Leaf className="w-8 h-8 text-primary-400" />,
              title: 'Premium Quality',
              description: 'Handcrafted with attention to detail and premium materials',
            },
            {
              icon: <Truck className="w-8 h-8 text-primary-400" />,
              title: 'Fast Shipping',
              description: 'Quick and secure delivery to your doorstep',
            },
            {
              icon: <Award className="w-8 h-8 text-primary-400" />,
              title: 'Satisfaction Guaranteed',
              description: '30-day return policy for peace of mind',
            },
            {
              icon: <Heart className="w-8 h-8 text-primary-400" />,
              title: 'Customer Care',
              description: 'Dedicated support team at your service',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-display font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-300">
              To provide high-quality artificial plants that bring the beauty and tranquility of nature into any space, making green living accessible to everyone regardless of their lifestyle or environment.
            </p>
          </div>
          
          <div className="glass-card p-8">
            <h2 className="text-2xl font-display font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-300">
              To become the leading provider of artificial plants worldwide, known for our quality, innovation, and commitment to customer satisfaction.
            </p>
          </div>
        </div>
        
        {/* Team */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-display font-semibold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'John Smith',
                role: 'Founder & CEO',
                image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              },
              {
                name: 'Sarah Johnson',
                role: 'Head of Design',
                image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              },
              {
                name: 'Mike Wilson',
                role: 'Operations Manager',
                image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              },
              {
                name: 'Emily Brown',
                role: 'Customer Success',
                image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPage;