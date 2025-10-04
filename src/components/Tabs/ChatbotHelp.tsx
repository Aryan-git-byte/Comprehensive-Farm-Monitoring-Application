import React from 'react';
import { MessageSquare, HelpCircle, Lightbulb, Settings } from 'lucide-react';

const ChatbotHelp: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
          <MessageSquare className="h-12 w-12 text-blue-600 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Farm Assistant</h1>
        <p className="text-gray-600">
          Your intelligent farming companion (Coming Soon)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <HelpCircle className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Expert Guidance</h2>
          </div>
          <p className="text-gray-600">
            Get instant answers to farming questions, pest identification, and crop management advice from our AI-powered assistant.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lightbulb className="h-6 w-6 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900">Smart Recommendations</h2>
          </div>
          <p className="text-gray-600">
            Receive personalized recommendations based on your sensor data, weather conditions, and crop requirements.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-6 w-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Automated Insights</h2>
          </div>
          <p className="text-gray-600">
            Get automated alerts and insights about your farm conditions, helping you make data-driven decisions.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">24/7 Support</h2>
          </div>
          <p className="text-gray-600">
            Access farming expertise anytime, anywhere. Our AI assistant is available around the clock to help you succeed.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-8 text-center">
        <MessageSquare className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
        <p className="text-gray-600 mb-4">
          Our AI-powered farm assistant is currently in development. This feature will integrate with popular chatbot platforms to provide you with intelligent farming guidance.
        </p>
        <div className="text-sm text-gray-500">
          <p>Planned integrations:</p>
          <p>• Google Dialogflow • Microsoft Bot Framework • Custom AI Models</p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotHelp;