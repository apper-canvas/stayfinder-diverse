import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <Card className="p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name="MapPin" className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            404
          </h1>
          
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off. 
            Let's get you back to exploring amazing destinations.
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/')}
              className="w-full"
              size="lg"
            >
              <ApperIcon name="Home" className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Need help finding something specific?
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                onClick={() => navigate('/destinations')}
                variant="ghost"
                size="sm"
              >
                Destinations
              </Button>
              <Button
                onClick={() => navigate('/deals')}
                variant="ghost"
                size="sm"
              >
                Deals
              </Button>
              <Button
                onClick={() => navigate('/help')}
                variant="ghost"
                size="sm"
              >
                Help
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;