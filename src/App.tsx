import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import ChatbotPage from './components/AI/ChatbotPage';
import RagChatInterface from './components/AI/RagChatInterface';

import SimpleNavigation from './components/Layout/SimpleNavigation';
import IntegratedDashboard from './components/Dashboard/IntegratedDashboard';
import EducationalVideos from './components/Educational/EducationalVideos';
import MobileOptimizedSettings from './components/Settings/MobileOptimizedSettings';
import SimpleHelp from './components/Help/SimpleHelp';
import TestAIPage from './components/Testing/TestAIPage';
import { Seo } from './components/SEO/Seo';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Optional: set in hosting env as VITE_SITE_URL=https://your-domain.com
  const siteUrl = (import.meta as any).env?.VITE_SITE_URL as string | undefined;

  useEffect(() => {
    // Check if accessing hidden test route
    const path = window.location.pathname;
    if (path === '/test-ai') {
      setActiveTab('test-ai');
    }

    // Initialize app
    const initializeApp = async () => {
      try {
        // Simple initialization for MVP
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </ErrorBoundary>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <IntegratedDashboard />;
      case 'manual-entry':
        return <EducationalVideos />;
      case 'ai-chatbot':
        return <ChatbotPage onNavigateBack={() => setActiveTab('dashboard')} />;
      case 'rag-ai':
        return <RagChatInterface onNavigateBack={() => setActiveTab('dashboard')} />;
      case 'help':
        return <SimpleHelp />;
      case 'settings':
        return <MobileOptimizedSettings />;
      case 'test-ai':
        return <TestAIPage />;
      default:
        return <IntegratedDashboard />;
    }
  };

  const seoForTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'FarmBot AI — Farm Monitoring Dashboard',
          description:
            'Monitor soil, weather, and farm conditions with FarmBot AI. View real-time insights, sensor trends, and smart recommendations for better yield.',
          path: '/'
        };
      case 'manual-entry':
        return {
          title: 'FarmBot AI — Educational Videos for Farmers',
          description:
            'Watch practical, easy-to-follow farming videos and learn best practices for soil health, irrigation, crop care, and sustainable agriculture.',
          path: '/education'
        };
      case 'ai-chatbot':
        return {
          title: 'FarmBot AI — AI Farming Assistant Chat',
          description:
            'Ask questions in natural language and get helpful, farmer-friendly guidance on crops, soil, pests, irrigation, and weather-ready planning.',
          path: '/ai-chat'
        };
      case 'rag-ai':
        return {
          title: 'FarmBot AI — Knowledge-Backed AI Chat',
          description:
            'Chat with a knowledge-backed assistant to get more grounded answers for farming practices, monitoring insights, and troubleshooting.',
          path: '/rag-ai'
        };
      case 'help':
        return {
          title: 'FarmBot AI — Help & How to Use',
          description:
            'Get help using FarmBot AI: navigation, dashboards, AI chat, settings, and common troubleshooting steps.',
          path: '/help'
        };
      case 'settings':
        return {
          title: 'FarmBot AI — Settings',
          description:
            'Configure language, theme, data preferences, and app behavior in FarmBot AI.',
          path: '/settings'
        };
      case 'test-ai':
        return {
          title: 'FarmBot AI — Internal Test Page',
          description: 'Internal testing route for AI experiments.',
          path: '/test-ai',
          noIndex: true
        };
      default:
        return {
          title: 'FarmBot AI — Smart Agriculture Monitoring',
          description:
            'AI-powered agriculture monitoring with sensor insights, weather integration, and intelligent farming advice tailored for Indian farmers.',
          path: '/'
        };
    }
  };

  const seo = seoForTab();

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Seo
              title={seo.title}
              description={seo.description}
              siteUrl={siteUrl}
              path={seo.path}
              noIndex={(seo as any).noIndex}
              siteName="FarmBot AI"
            />
            {activeTab !== 'test-ai' && activeTab !== 'rag-ai' && (
              <SimpleNavigation 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
              />
            )}
            <main className={activeTab === 'test-ai' || activeTab === 'rag-ai' ? '' : 'py-6'}>
              {renderContent()}
            </main>
          </div>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;