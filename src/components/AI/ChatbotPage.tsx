import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, MessageSquare, X, Menu, Plus, Trash2, CreditCard as Edit3, Search } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { AiService } from '../../services/aiService';
import { AuthService } from '../../services/authService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  confidence?: number;
  responseTime?: number;
  intelligence_level?: 'instant' | 'smart' | 'advanced';
  sources?: string[];
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

const ChatbotPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseStartTime, setResponseStartTime] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [userConversations, setUserConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(undefined);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize user and load all conversations
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUserId(user?.id || null);

        // Load all conversations regardless of authentication
        const conversations = await AiService.getUserConversations();
        setUserConversations(conversations.map(conv => ({
          id: conv.id,
          title: conv.title,
          lastMessage: conv.messages[conv.messages.length - 1]?.content || '',
          timestamp: conv.updatedAt,
          messageCount: conv.messages.length
        })));
      } catch (error) {
        console.error('Error initializing user:', error);
        setCurrentUserId(null);
      }
    };

    initializeUser();
  }, []);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: language === 'hi' 
          ? '🌾 नमस्ते! मैं आपका उन्नत AI खेती सहायक हूं। मैं आपके सेंसर डेटा, मौसम की जानकारी, और मिट्टी के विश्लेषण का उपयोग करके 20 सेकंड में व्यक्तिगत सलाह देता हूं। आप मुझसे अपनी फसल, सिंचाई, पोषण या किसी भी खेती संबंधी सवाल पूछ सकते हैं।'
          : '🌾 Hello! I\'m your advanced AI farming assistant. I provide personalized advice within 20 seconds using your sensor data, weather information, and soil analysis. Ask me about your crops, irrigation, nutrition, or any farming questions.',
        sender: 'ai',
        timestamp: new Date(),
        intelligence_level: 'advanced'
      };
      setMessages([welcomeMessage]);
    }
  }, [language]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const queryText = inputText;
    setInputText('');
    setIsLoading(true);
    setResponseStartTime(Date.now());

    try {
      const response = await AiService.processQuery(
        queryText,
        currentConversationId,
        currentUserId || undefined,
        language
      );

      // Update conversation ID if this is a new conversation
      if (!currentConversationId && response.conversationId) {
        setCurrentConversationId(response.conversationId);
        // Refresh conversations list for all users
        const conversations = await AiService.getUserConversations();
        setUserConversations(conversations.map(conv => ({
          id: conv.id,
          title: conv.title,
          lastMessage: conv.messages[conv.messages.length - 1]?.content || '',
          timestamp: conv.updatedAt,
          messageCount: conv.messages.length
        })));
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.advice,
        sender: 'ai',
        timestamp: new Date(),
        confidence: response.confidence,
        responseTime: response.responseTime,
        intelligence_level: response.intelligence_level,
        sources: response.sources
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const responseTime = responseStartTime ? Date.now() - responseStartTime : 0;
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'hi' 
          ? `⚠️ माफ करें, ${responseTime > 25000 ? 'जवाब देने में बहुत समय लग गया (25 सेकंड से अधिक)' : 'तकनीकी समस्या हो रही है'}। कृपया फिर कोशिश करें।`
          : `⚠️ Sorry, ${responseTime > 25000 ? 'response took too long (over 25 seconds)' : 'technical issue occurred'}. Please try again.`,
        sender: 'ai',
        timestamp: new Date(),
        confidence: 0.1,
        responseTime,
        intelligence_level: 'instant'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setResponseStartTime(null);
    }
  };

  const handleNewChat = () => {
    setCurrentConversationId(undefined);
    setMessages([]);
    // Re-initialize welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: language === 'hi' 
        ? '🌾 नमस्ते! मैं आपका उन्नत AI खेती सहायक हूं। आप मुझसे अपनी फसल, सिंचाई, पोषण या किसी भी खेती संबंधी सवाल पूछ सकते हैं।'
        : '🌾 Hello! I\'m your advanced AI farming assistant. Ask me about your crops, irrigation, nutrition, or any farming questions.',
      sender: 'ai',
      timestamp: new Date(),
      intelligence_level: 'advanced'
    };
    setMessages([welcomeMessage]);
  };

  const handleSelectConversation = async (conversationId: string) => {
    try {
      setCurrentConversationId(conversationId);
      const history = await AiService.getConversationHistory(conversationId);
      const formattedMessages: Message[] = history.map(msg => ({
        id: msg.id || Date.now().toString(),
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai',
        timestamp: new Date(msg.timestamp),
        confidence: msg.metadata?.confidence,
        responseTime: msg.metadata?.responseTime,
        intelligence_level: msg.metadata?.intelligence_level,
        sources: msg.metadata?.sources
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!window.confirm(language === 'hi' ? 'क्या आप इस बातचीत को हटाना चाहते हैं?' : 'Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      await AiService.deleteConversation(conversationId);
      setUserConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (currentConversationId === conversationId) {
        handleNewChat();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleEditTitle = async (conversationId: string, newTitle: string) => {
    try {
      await AiService.updateConversationTitle(conversationId, newTitle);
      setUserConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, title: newTitle } : conv
      ));
      setEditingConversationId(null);
      setEditingTitle('');
    } catch (error) {
      console.error('Error updating conversation title:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = userConversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIntelligenceIcon = (level?: string) => {
    switch (level) {
      case 'instant': return '⚡';
      case 'smart': return '🧠';
      case 'advanced': return '🚀';
      default: return '🤖';
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-400';
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };


  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleNewChat}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>{language === 'hi' ? 'नई बातचीत' : 'New Chat'}</span>
          </button>
        </div>

        {/* Search */}
        {
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'hi' ? 'बातचीत खोजें...' : 'Search conversations...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          </div>
        }

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {searchTerm ? 
                      (language === 'hi' ? 'कोई बातचीत नहीं मिली' : 'No conversations found') :
                      (language === 'hi' ? 'अभी तक कोई बातचीत नहीं' : 'No conversations yet')
                    }
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                      currentConversationId === conversation.id
                        ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {editingConversationId === conversation.id ? (
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => handleEditTitle(conversation.id, editingTitle)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleEditTitle(conversation.id, editingTitle);
                              }
                            }}
                            className="w-full bg-transparent border-none outline-none font-medium text-gray-900 dark:text-white"
                            autoFocus
                          />
                        ) : (
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {conversation.title}
                          </h3>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-400">
                            {conversation.timestamp.toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-400">
                            {conversation.messageCount} {language === 'hi' ? 'संदेश' : 'messages'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingConversationId(conversation.id);
                            setEditingTitle(conversation.title);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conversation.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full p-2">
                  <Bot className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {language === 'hi' ? 'AI खेती सहायक' : 'AI Farm Assistant'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'hi' ? 'ऑनलाइन • <20 सेकंड' : 'Online • <20 seconds'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'hi' ? 'लाइव डेटा के साथ' : 'With live data'}
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-6 py-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    {message.sender === 'ai' && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-xs opacity-70">
                        <div className="flex items-center space-x-3">
                          {message.responseTime && (
                            <span>
                              ⏱️ {(message.responseTime / 1000).toFixed(1)}s
                            </span>
                          )}
                          {message.confidence && (
                            <span className={getConfidenceColor(message.confidence)}>
                              🎯 {Math.round(message.confidence * 100)}%
                            </span>
                          )}
                          {message.intelligence_level && (
                            <span title={message.intelligence_level}>
                              {getIntelligenceIcon(message.intelligence_level)}
                            </span>
                          )}
                        </div>
                        {message.sources && message.sources.length > 0 && (
                          <div className="flex items-center space-x-1">
                            {message.sources.includes('live_sensor_data') && <span title="Live Sensor Data">📊</span>}
                            {message.sources.includes('live_weather_data') && <span title="Live Weather Data">🌤️</span>}
                            {message.sources.includes('gemini_ai') && <span title="Gemini AI">🚀</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full p-2">
                    <Bot className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <Loader className="h-5 w-5 animate-spin text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {language === 'hi' ? 'डेटा विश्लेषण कर रहा हूं...' : 'Analyzing data...'}
                        {responseStartTime && (
                          <span className="ml-2 font-mono">
                            {Math.round((Date.now() - responseStartTime) / 1000)}s
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'hi' ? 'अपना सवाल यहाँ लिखें...' : 'Type your question here...'}
                  className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white max-h-32"
                  rows={1}
                  disabled={isLoading}
                  style={{ minHeight: '56px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-2xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center flex items-center justify-center space-x-2">
              <span>{language === 'hi' ? 'AI जवाब 20 सेकंड में मिलेगा' : 'AI responds within 20 seconds'}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <span>📊</span>
                <span>{language === 'hi' ? 'लाइव डेटा से' : 'With live data'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;