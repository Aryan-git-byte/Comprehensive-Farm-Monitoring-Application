import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, MessageSquare, Menu, Plus, Trash2, Edit3, Search, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
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
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseStartTime, setResponseStartTime] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userConversations, setUserConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  // TTS & STT States
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Get Deepgram API key from environment
  const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY || '';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

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
  }, [language, messages.length]);

  // Speech-to-Text using Deepgram
  const startRecording = async () => {
    if (!DEEPGRAM_API_KEY) {
      alert('Deepgram API key not configured. Please add REACT_APP_DEEPGRAM_API_KEY to your .env file');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&language=' + (language === 'hi' ? 'hi' : 'en'), {
        method: 'POST',
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': 'audio/webm'
        },
        body: audioBlob
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      const transcript = data.results?.channels[0]?.alternatives[0]?.transcript || '';
      
      if (transcript) {
        setInputText(transcript);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Transcription failed. Please check your API key and try again.');
    }
  };

  // Text-to-Speech using Chrome's built-in speechSynthesis
  const speakWithChromeTTS = (text: string) => {
    // Stop any currently playing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(true);

    // Remove ** markdown formatting and emojis before speaking
    const cleanText = text
      .replace(/\*\*/g, '') // Remove ** markdown
      .replace(/\*/g, '') // Remove single * as well
      .replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '') // Remove emojis and special symbols
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Set language based on current language setting
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    
    // Optional: Configure voice parameters
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

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

      // Auto-speak AI response if enabled
      if (autoSpeak) {
        speakWithChromeTTS(response.advice);
      }
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
    setCurrentConversationId(null);
    setMessages([]);
    setInputText('');
    setShowSidebar(false);
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
        confidence: (msg.metadata as any)?.confidence,
        responseTime: (msg.metadata as any)?.responseTime,
        intelligence_level: (msg.metadata as any)?.intelligence_level,
        sources: (msg.metadata as any)?.sources
      }));
      setMessages(formattedMessages);
      setShowSidebar(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
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
    if (!newTitle.trim()) return;
    
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

  const formatMessageText = (text?: string) => {
    if (!text) return null;

    const parts = text.split(/(\*\*[\s\S]*?\*\*)/g);

    return parts.map((part, idx) => {
      const boldMatch = part.match(/^\*\*([\s\S]*?)\*\*$/);
      if (boldMatch) {
        return (
          <strong key={idx} className="font-semibold">
            {boldMatch[1]}
          </strong>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        w-80 sm:w-96 lg:w-80
        transition-transform duration-300 ease-in-out
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col
        lg:translate-x-0
      `}>
        {/* Sidebar Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'hi' ? 'बातचीत' : 'Conversations'}
            </h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={handleNewChat}
            className="w-full bg-green-600 text-white py-2.5 sm:py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>{language === 'hi' ? 'नई बातचीत' : 'New Chat'}</span>
          </button>
        </div>

        {/* Voice Settings */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {language === 'hi' ? 'वॉइस सेटिंग्स' : 'Voice Settings'}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {DEEPGRAM_API_KEY ? '✓ Voice Enabled' : '✗ API Key Missing'}
              </span>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer px-2">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {language === 'hi' ? 'ऑटो-स्पीक' : 'Auto-speak responses'}
              </span>
            </label>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
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

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
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
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleEditTitle(conversation.id, editingTitle);
                            }
                            if (e.key === 'Escape') {
                              setEditingConversationId(null);
                              setEditingTitle('');
                            }
                          }}
                          className="w-full bg-transparent border-none outline-none font-medium text-gray-900 dark:text-white"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
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
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingConversationId(conversation.id);
                          setEditingTitle(conversation.title);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full p-1.5 sm:p-2 flex-shrink-0">
                  <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                    {language === 'hi' ? 'AI खेती सहायक' : 'AI Farm Assistant'}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {language === 'hi' ? 'ऑनलाइन • <20 सेकंड' : 'Online • <20 seconds'}
                    {DEEPGRAM_API_KEY && <span className="ml-2">🎤</span>}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
                {language === 'hi' ? 'लाइव डेटा' : 'Live data'}
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 sm:px-6 sm:py-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm'
                  }`}>
                    <div className="flex items-start justify-between">
                      <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base break-words flex-1">
                        {formatMessageText(message.text)}
                      </p>
                      {message.sender === 'ai' && (
                        <button
                          onClick={() => speakWithChromeTTS(message.text)}
                          disabled={isSpeaking}
                          className="ml-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 flex-shrink-0"
                          title={language === 'hi' ? 'बोलें' : 'Speak'}
                        >
                          <Volume2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      )}
                    </div>
                    {message.sender === 'ai' && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-600 text-xs gap-2 sm:gap-0">
                        <div className="flex items-center flex-wrap gap-2 sm:gap-3 opacity-70">
                          {message.responseTime && (
                            <span className="whitespace-nowrap">
                              ⏱️ {(message.responseTime / 1000).toFixed(1)}s
                            </span>
                          )}
                          {message.confidence && (
                            <span className={`whitespace-nowrap ${getConfidenceColor(message.confidence)}`}>
                              🎯 {Math.round(message.confidence * 100)}%
                            </span>
                          )}
                          {message.intelligence_level && (
                            <span title={message.intelligence_level} className="whitespace-nowrap">
                              {getIntelligenceIcon(message.intelligence_level)}
                            </span>
                          )}
                        </div>
                        {message.sources && message.sources.length > 0 && (
                          <div className="flex items-center space-x-1 opacity-70">
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
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full p-1.5 sm:p-2">
                    <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        {language === 'hi' ? 'डेटा विश्लेषण...' : 'Analyzing...'}
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
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-2 sm:space-x-4">
              {/* Voice Input Button */}
              {DEEPGRAM_API_KEY && (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex-shrink-0 ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isRecording ? (language === 'hi' ? 'रुकें' : 'Stop recording') : (language === 'hi' ? 'बोलें' : 'Start voice input')}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              )}

              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'hi' ? 'अपना सवाल यहाँ लिखें...' : 'Type your question here...'}
                  className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                  rows={1}
                  disabled={isLoading || isRecording}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>

              {/* Stop Speaking Button */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 transform hover:scale-105 active:scale-95 flex-shrink-0"
                  title={language === 'hi' ? 'बोलना बंद करें' : 'Stop speaking'}
                >
                  <VolumeX className="h-5 w-5" />
                </button>
              )}

              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading || isRecording}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 flex-shrink-0"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 sm:mt-3 text-xs text-gray-500 text-center flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span>{language === 'hi' ? 'AI जवाब 20 सेकंड में' : 'AI responds in 20s'}</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center space-x-1">
                <span>📊</span>
                <span>{language === 'hi' ? 'लाइव डेटा से' : 'With live data'}</span>
              </span>
              {DEEPGRAM_API_KEY && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center space-x-1">
                    <span>🎤</span>
                    <span>{language === 'hi' ? 'वॉइस सक्षम' : 'Voice enabled'}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
