import { motion } from "framer-motion";
import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "How do I search for hotels?",
      answer: "Use our search form on the home page to enter your destination, check-in and check-out dates, and number of guests. Our system will show you available hotels that match your criteria."
    },
    {
      id: 2,
      question: "Can I modify or cancel my booking?",
      answer: "Yes, most bookings can be modified or cancelled. The specific terms depend on the hotel's policy and the type of rate you booked. Check your confirmation email for details or contact our support team."
    },
    {
      id: 3,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, MasterCard, American Express, and Discover. Some properties may also accept PayPal or other digital payment methods."
    },
    {
      id: 4,
      question: "How do I know if my booking is confirmed?",
      answer: "You'll receive a confirmation email immediately after booking with all the details of your reservation. You can also check your booking status by contacting our support team with your confirmation number."
    },
    {
      id: 5,
      question: "What if I need special accommodations?",
      answer: "We're happy to help with special requests like accessible rooms, cribs, or dietary requirements. Contact the hotel directly or reach out to our support team to arrange special accommodations."
    },
    {
      id: 6,
      question: "Are there any hidden fees?",
      answer: "We believe in transparent pricing. The price you see includes all our fees. However, some hotels may charge additional resort fees, taxes, or optional services directly at the property."
    }
  ];

  const contactMethods = [
    {
      icon: "Phone",
      title: "Phone Support",
      description: "Call us 24/7 for immediate assistance",
      contact: "1-800-STAYFINDER",
      color: "from-success to-success/80"
    },
    {
      icon: "Mail",
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "support@stayfinder.com",
      color: "from-info to-primary"
    },
    {
      icon: "MessageCircle",
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 9 AM - 11 PM EST",
      color: "from-accent to-accent/80"
    }
  ];

  const helpTopics = [
    {
      icon: "Search",
      title: "Booking Help",
      description: "Learn how to search and book hotels",
      link: "#booking"
    },
    {
      icon: "CreditCard",
      title: "Payment & Billing",
      description: "Payment methods and billing questions",
      link: "#payment"
    },
    {
      icon: "Calendar",
      title: "Manage Booking",
      description: "Modify or cancel your reservations",
      link: "#manage"
    },
    {
      icon: "MapPin",
      title: "Travel Tips",
      description: "Destination guides and travel advice",
      link: "#tips"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-info via-primary to-accent py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              How Can We Help You?
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Find answers to common questions or get in touch with our support team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Help */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
            <ApperIcon name="Search" className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Search Our Help Center
            </h2>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What do you need help with?"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-center"
                />
                <button className="absolute right-2 top-2 bg-primary hover:bg-primary-600 text-white p-2 rounded-lg transition-colors">
                  <ApperIcon name="Search" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Topics */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Popular Help Topics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-lg shadow-card-rest hover:shadow-card-hover transition-all duration-300 p-6 text-center cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ApperIcon name={topic.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {topic.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {topic.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <span className="font-display text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <ApperIcon 
                    name="ChevronDown" 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openFaq === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-600">
              Our support team is here to assist you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-card-rest hover:shadow-card-hover transition-shadow duration-300 p-6 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <ApperIcon name={method.icon} className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                  {method.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {method.description}
                </p>
                
                <div className="font-semibold text-primary">
                  {method.contact}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Contact Us
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;