import { supabase, AiLog, ProcessedSensorReading } from '../config/supabase';
import { SensorService } from './sensorService';
import { WeatherService, WeatherData } from './weatherService';

const OPEN_ROUTER_API_KEY = import.meta.env.VITE_OPEN_ROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://yourfarm.app';
const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'Smart Farm Assistant';

if (!OPEN_ROUTER_API_KEY) {
  throw new Error('OpenRouter API key is required for AI responses');
}

// Enhanced conversation message structure
interface ConversationMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    sensorData?: ProcessedSensorReading[];
    weatherData?: WeatherData[];
    queryType?: string;
    urgency?: string;
    location?: { lat: number; lon: number; name?: string };
  };
}

// Conversation session structure
interface ConversationSession {
  id: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: Date;
  updatedAt: Date;
  context: {
    farmLocation?: { lat: number; lon: number; name?: string };
    cropType?: string;
    season?: string;
    language?: string;
    farmerExperience?: 'beginner' | 'intermediate' | 'expert';
    farmSize?: string;
    previousRecommendations?: string[];
    currentIssues?: string[];
    followUpNeeded?: boolean;
  };
}

// Enhanced context for AI processing
interface QueryContext {
  type: 'irrigation' | 'health' | 'nutrition' | 'harvest' | 'weather' | 'general' | 'analysis' | 'soil_analysis' | 'follow_up';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  language: string;
  season: 'summer' | 'monsoon' | 'winter';
  timeContext: 'morning' | 'afternoon' | 'evening' | 'night';
  conversationContext?: {
    isFollowUp: boolean;
    previousTopics: string[];
    unresolvedIssues: string[];
    farmerProfile?: {
      experience: string;
      cropType?: string;
      farmSize?: string;
    };
  };
}

// Farm data structure with location-based maps
interface FarmData {
  sensorData: ProcessedSensorReading[];
  weatherDataMap: Map<string, WeatherData>;
  locations: Array<{ lat: number; lon: number; name?: string; locationKey: string }>;
  criticalAlerts: ProcessedSensorReading[];
}

export interface AiResponse {
  advice: string;
  confidence: number;
  sources: string[];
  responseTime?: number;
  intelligence_level: 'advanced';
  conversationId: string;
  followUpQuestions?: string[];
  recommendations?: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  relatedTopics?: string[];
}

export class AiService {
  private static conversationCache = new Map<string, ConversationSession>();
  private static readonly MAX_CONTEXT_MESSAGES = 10;
  private static readonly CONTEXT_RELEVANCE_THRESHOLD = 0.7;

  // MAIN PROCESSING METHOD WITH CONTEXT
  static async processQuery(
    query: string,
    conversationId?: string,
    userId?: string | null,
    language: string = 'en'
  ): Promise<AiResponse> {
    const startTime = performance.now();

    // 1. Get or create conversation session
    const session = conversationId
      ? await this.getConversationSession(conversationId)
      : await this.createNewConversation(language);
    
    // 2. Analyze query with conversation context
    const context = this.analyzeQueryWithContext(query, language, session);
    
    // 3. Fetch all farm data
    const farmData = await this.getFarmData();
    
    // 4. Add user message to conversation
    const userMessage: ConversationMessage = {
      role: 'user',
      content: query,
      timestamp: new Date(),
      metadata: {
        sensorData: farmData.sensorData,
        weatherData: Array.from(farmData.weatherDataMap.values()),
        queryType: context.type,
        urgency: context.urgency
      }
    };
    session.messages.push(userMessage);
    
    // 5. Build comprehensive prompt with conversation history
    const systemPrompt = this.buildSystemPrompt(language, context, farmData, session);
    
    // 6. Get AI response from OpenRouter
    const aiResponse = await this.callOpenRouterAPI(systemPrompt, query, session);
    
    // 7. Parse AI response for structured data
    const parsedResponse = this.parseAiResponse(aiResponse);
    
    // 8. Add assistant message to conversation
    const assistantMessage: ConversationMessage = {
      role: 'assistant',
      content: parsedResponse.advice,
      timestamp: new Date(),
      metadata: {
        queryType: context.type,
        urgency: context.urgency
      }
    };
    session.messages.push(assistantMessage);
    
    // 9. Update session context based on conversation
    await this.updateSessionContext(session, query, parsedResponse);
    
    // 10. Save conversation to database
    await this.saveConversation(session);
    
    // 11. Format and return response
    const response: AiResponse = {
      ...parsedResponse,
      conversationId: session.id,
      confidence: 0.9,
      sources: ['llama_3.3_70b', 'live_sensor_data', 'live_weather_data', 'conversation_context'],
      responseTime: performance.now() - startTime,
      intelligence_level: 'advanced'
    };

    // Log the query and response to Supabase
    await this.logQuery(query, response, session.id);
    
    return response;
  }

  // CONVERSATION SESSION MANAGEMENT
  private static async createNewConversation(language: string = 'en'): Promise<ConversationSession> {
    const sessionId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session: ConversationSession = {
      id: sessionId,
      title: 'New Farm Consultation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      context: {
        language,
        season: this.getCurrentSeason(),
        previousRecommendations: [],
        currentIssues: [],
        followUpNeeded: false
      }
    };

    // Add welcome message
    const welcomeMessage: ConversationMessage = {
      role: 'system',
      content: language === 'hi' 
        ? 'नमस्कार! मैं आपका कृषि सहायक हूं। मैं आपकी खेती से जुड़ी समस्याओं का समाधान और सलाह दे सकता हूं।'
        : 'Hello! I\'m your agricultural assistant. I can help solve your farming problems and provide expert advice.',
      timestamp: new Date()
    };
    session.messages.push(welcomeMessage);

    this.conversationCache.set(sessionId, session);
    return session;
  }

  private static async getConversationSession(conversationId: string): Promise<ConversationSession> {
    // Check cache first
    if (this.conversationCache.has(conversationId)) {
      return this.conversationCache.get(conversationId)!;
    }

    // Load from database
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) {
      console.error('Error loading conversation:', error);
      return this.createNewConversation();
    }

    // Load messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });

    if (messagesError) {
      console.error('Error loading messages:', messagesError);
    }

    const session: ConversationSession = {
      id: data.id,
      title: data.title,
      messages: messages || [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      context: data.context || {}
    };

    this.conversationCache.set(conversationId, session);
    return session;
  }

  // ENHANCED QUERY ANALYSIS WITH CONTEXT
  private static analyzeQueryWithContext(
    query: string, 
    language: string, 
    session: ConversationSession
  ): QueryContext {
    const lowerQuery = query.toLowerCase();
    const recentMessages = session.messages.slice(-5);
    
    const followUpIndicators = ['what about', 'and also', 'but what if', 'how about', 'also', 'additionally'];
    const isFollowUp = followUpIndicators.some(indicator => lowerQuery.includes(indicator)) ||
                      recentMessages.length > 2;

    const previousTopics = recentMessages
      .filter(msg => msg.role === 'user')
      .map(msg => this.extractTopicFromMessage(msg.content))
      .filter(Boolean);

    let type: QueryContext['type'] = 'general';
    
    if (lowerQuery.includes('water') || lowerQuery.includes('पानी') || lowerQuery.includes('irrigation') || lowerQuery.includes('सिंचाई')) {
      type = 'irrigation';
    } else if (lowerQuery.includes('disease') || lowerQuery.includes('बीमारी') || lowerQuery.includes('health') || lowerQuery.includes('स्वास्थ्य')) {
      type = 'health';
    } else if (lowerQuery.includes('fertilizer') || lowerQuery.includes('खाद') || lowerQuery.includes('nutrition') || lowerQuery.includes('पोषण')) {
      type = 'nutrition';
    } else if (lowerQuery.includes('weather') || lowerQuery.includes('मौसम')) {
      type = 'weather';
    } else if (lowerQuery.includes('soil') || lowerQuery.includes('मिट्टी')) {
      type = 'soil_analysis';
    } else if (lowerQuery.includes('analyze') || lowerQuery.includes('विश्लेषण')) {
      type = 'analysis';
    } else if (lowerQuery.includes('harvest') || lowerQuery.includes('फसल')) {
      type = 'harvest';
    } else if (isFollowUp) {
      type = 'follow_up';
    }

    let urgency: QueryContext['urgency'] = 'medium';
    
    const hasRecentCriticalAlerts = recentMessages.some(msg => 
      msg.metadata?.sensorData?.some(sensor => sensor.status === 'critical')
    );
    
    if (hasRecentCriticalAlerts || lowerQuery.includes('urgent') || lowerQuery.includes('emergency')) {
      urgency = 'critical';
    } else if (lowerQuery.includes('problem') || lowerQuery.includes('issue') || lowerQuery.includes('समस्या')) {
      urgency = 'high';
    }

    const unresolvedIssues = session.context.currentIssues || [];

    return {
      type,
      urgency,
      language,
      season: this.getCurrentSeason(),
      timeContext: this.getTimeContext(),
      conversationContext: {
        isFollowUp,
        previousTopics,
        unresolvedIssues,
        farmerProfile: {
          experience: session.context.farmerExperience || 'intermediate',
          cropType: session.context.cropType,
          farmSize: session.context.farmSize
        }
      }
    };
  }

  // COMPREHENSIVE DATA FETCHING
  private static async getFarmData(): Promise<FarmData> {
    const sensorData = await SensorService.getLatestReadings(10);
    
    const uniqueLocations = new Map<string, { lat: number; lon: number; name?: string }>();
    
    sensorData.forEach(reading => {
      if (reading.latitude && reading.longitude) {
        const locationKey = `${reading.latitude.toFixed(4)},${reading.longitude.toFixed(4)}`;
        uniqueLocations.set(locationKey, {
          lat: reading.latitude,
          lon: reading.longitude,
          name: `Sensor ${reading.sensor_id || 'Location'}`
        });
      }
    });

    if (uniqueLocations.size === 0) {
      uniqueLocations.set('28.6139,77.2090', { 
        lat: 28.6139, 
        lon: 77.2090, 
        name: 'Delhi, India' 
      });
    }

    const locations = Array.from(uniqueLocations.entries()).map(([locationKey, location]) => ({
      ...location,
      locationKey
    }));

    const weatherPromises = locations.map(async location => {
      try {
        const weatherData = await WeatherService.getCurrentWeather(location.lat, location.lon);
        return { locationKey: location.locationKey, data: weatherData };
      } catch (error) {
        console.error(`Weather fetch failed for ${location.locationKey}:`, error);
        throw error;
      }
    });

    const weatherResults = await Promise.all(weatherPromises);
    const weatherDataMap = new Map<string, WeatherData>();

    weatherResults.forEach(result => {
      weatherDataMap.set(result.locationKey, result.data);
    });

    const criticalAlerts = sensorData.filter(reading => reading.status === 'critical');

    return {
      sensorData,
      weatherDataMap,
      locations,
      criticalAlerts
    };
  }

  // BUILD SYSTEM PROMPT
  private static buildSystemPrompt(
    language: string, 
    context: QueryContext, 
    farmData: FarmData, 
    session: ConversationSession
  ): string {
    const isHindi = language === 'hi';
    
    const systemPrompt = isHindi 
      ? `आप एक भारतीय कृषि विशेषज्ञ हैं जो पूरी बातचीत का संदर्भ याद रखते हैं। ${context.season} के मौसम में ${context.timeContext} के समय के लिए व्यावहारिक और तकनीकी सलाह दें।`
      : `You are an Indian agricultural expert with perfect conversation memory. Provide practical and technical advice for ${context.season} season during ${context.timeContext}.`;

    let conversationHistory = '';
    const recentMessages = session.messages.slice(-this.MAX_CONTEXT_MESSAGES);
    
    if (recentMessages.length > 1) {
      const historyText = recentMessages
        .filter(msg => msg.role !== 'system')
        .map(msg => `${msg.role === 'user' ? 'FARMER' : 'EXPERT'}: ${msg.content}`)
        .join('\n');
      
      conversationHistory = `\n\nCONVERSATION HISTORY:\n${historyText}`;
    }

    let sensorContext = '';
    if (farmData.sensorData.length > 0) {
      const sensorInfo = farmData.sensorData.map(reading => {
        return `${reading.sensor_type}: ${reading.value}${reading.unit || ''} (Status: ${reading.status}, Location: ${reading.latitude?.toFixed(4)}, ${reading.longitude?.toFixed(4)})`;
      }).join('\n');
      sensorContext = `\n\nCURRENT SENSOR READINGS:\n${sensorInfo}`;
    }

    let weatherContext = '';
    if (farmData.weatherDataMap.size > 0) {
      const weatherEntries = Array.from(farmData.weatherDataMap.entries()).map(([locationKey, weather]) => {
        const location = farmData.locations.find(l => l.locationKey === locationKey);
        return `Location ${location?.name || locationKey}: Temperature ${weather.temperature}°C, Humidity ${weather.humidity}%, Wind Speed ${weather.windSpeed}km/h, Pressure ${weather.pressure}hPa${weather.rainfall ? `, Rainfall ${weather.rainfall}mm` : ''}`;
      });
      weatherContext = `\n\nCURRENT WEATHER CONDITIONS:\n${weatherEntries.join('\n')}`;
    }

    let farmerContext = '';
    if (session.context) {
      const profile = [];
      if (session.context.farmerExperience) profile.push(`Experience: ${session.context.farmerExperience}`);
      if (session.context.cropType) profile.push(`Crop: ${session.context.cropType}`);
      if (session.context.farmSize) profile.push(`Farm Size: ${session.context.farmSize}`);
      if (session.context.farmLocation) profile.push(`Location: ${session.context.farmLocation.name}`);
      
      if (profile.length > 0) {
        farmerContext = `\n\nFARMER PROFILE:\n${profile.join('\n')}`;
      }
    }

    let issuesContext = '';
    if (session.context.currentIssues && session.context.currentIssues.length > 0) {
      issuesContext = `\n\nONGOING ISSUES:\n${session.context.currentIssues.join('\n')}`;
    }

    let recommendationsContext = '';
    if (session.context.previousRecommendations && session.context.previousRecommendations.length > 0) {
      recommendationsContext = `\n\nPREVIOUS RECOMMENDATIONS:\n${session.context.previousRecommendations.slice(-3).join('\n')}`;
    }

    let alertsContext = '';
    if (farmData.criticalAlerts.length > 0) {
      const alerts = farmData.criticalAlerts.map(alert => 
        `CRITICAL: ${alert.sensor_type} showing ${alert.value}${alert.unit || ''} - requires immediate attention`
      ).join('\n');
      alertsContext = `\n\nCRITICAL ALERTS:\n${alerts}`;
    }

    return `${systemPrompt}

Query Type: ${context.type}
Urgency Level: ${context.urgency}
Is Follow-up: ${context.conversationContext?.isFollowUp ? 'Yes' : 'No'}
Language: ${isHindi ? 'Hindi' : 'English'}${conversationHistory}${farmerContext}${sensorContext}${weatherContext}${alertsContext}${issuesContext}${recommendationsContext}

INSTRUCTIONS:
- Remember and reference the conversation history when relevant
- If this is a follow-up question, connect your answer to previous discussions
- Provide detailed, actionable advice based on real-time data and conversation context
- Address critical alerts with highest priority
- Consider the farmer's experience level and provide appropriate detail
- Include specific recommendations with quantities, timing, and methods
- Suggest follow-up questions or next steps when appropriate
- Respond in ${isHindi ? 'Hindi' : 'English'} language
- Use emojis to make the advice more readable and engaging
- Structure your response clearly with sections when appropriate

FORMAT YOUR RESPONSE AS:
🌱 **Main Advice**: [Your detailed recommendation]
⚡ **Immediate Actions**: [What to do right now]
📅 **Next Steps**: [What to plan for coming days/weeks]
❓ **Follow-up Questions**: [Questions to help farmer better, if any]
🔗 **Related Topics**: [Other areas farmer might want to explore]`;
  }

  // OPENROUTER API CALL
  private static async callOpenRouterAPI(
    systemPrompt: string,
    userQuery: string,
    session: ConversationSession
  ): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userQuery
      }
    ];

    const requestBody = {
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      messages: messages
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPEN_ROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenRouter API');
    }

    return data.choices[0].message.content;
  }

  // PARSE AI RESPONSE FOR STRUCTURED DATA
  private static parseAiResponse(response: string): Omit<AiResponse, 'conversationId' | 'confidence' | 'sources' | 'responseTime' | 'intelligence_level'> {
    const followUpQuestions: string[] = [];
    const relatedTopics: string[] = [];
    const recommendations = {
      immediate: [] as string[],
      shortTerm: [] as string[],
      longTerm: [] as string[]
    };

    const lines = response.split('\n');
    let currentSection = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.includes('❓') || trimmed.includes('Follow-up Questions')) {
        currentSection = 'followup';
      } else if (trimmed.includes('🔗') || trimmed.includes('Related Topics')) {
        currentSection = 'related';
      } else if (trimmed.includes('⚡') || trimmed.includes('Immediate Actions')) {
        currentSection = 'immediate';
      } else if (trimmed.includes('📅') || trimmed.includes('Next Steps')) {
        currentSection = 'shortterm';
      } else if (currentSection === 'followup' && trimmed && !trimmed.startsWith('🌱') && !trimmed.startsWith('⚡') && !trimmed.startsWith('📅') && !trimmed.startsWith('🔗')) {
        followUpQuestions.push(trimmed.replace(/^[-•*]\s*/, ''));
      } else if (currentSection === 'related' && trimmed && !trimmed.startsWith('🌱') && !trimmed.startsWith('⚡') && !trimmed.startsWith('📅') && !trimmed.startsWith('❓')) {
        relatedTopics.push(trimmed.replace(/^[-•*]\s*/, ''));
      } else if (currentSection === 'immediate' && trimmed && !trimmed.startsWith('🌱') && !trimmed.startsWith('📅') && !trimmed.startsWith('❓') && !trimmed.startsWith('🔗')) {
        recommendations.immediate.push(trimmed.replace(/^[-•*]\s*/, ''));
      } else if (currentSection === 'shortterm' && trimmed && !trimmed.startsWith('🌱') && !trimmed.startsWith('⚡') && !trimmed.startsWith('❓') && !trimmed.startsWith('🔗')) {
        recommendations.shortTerm.push(trimmed.replace(/^[-•*]\s*/, ''));
      }
    });

    return {
      advice: response,
      followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined,
      recommendations: recommendations.immediate.length > 0 || recommendations.shortTerm.length > 0 ? recommendations : undefined,
      relatedTopics: relatedTopics.length > 0 ? relatedTopics : undefined
    };
  }

  // UPDATE SESSION CONTEXT
  private static async updateSessionContext(
    session: ConversationSession, 
    query: string, 
    response: Omit<AiResponse, 'conversationId' | 'confidence' | 'sources' | 'responseTime' | 'intelligence_level'>
  ): Promise<void> {
    const lowerQuery = query.toLowerCase();
    
    const cropKeywords = {
      'rice': 'rice', 'धान': 'rice',
      'wheat': 'wheat', 'गेहूं': 'wheat', 
      'corn': 'corn', 'मक्का': 'corn',
      'tomato': 'tomato', 'टमाटर': 'tomato',
      'potato': 'potato', 'आलू': 'potato'
    };
    
    for (const [keyword, crop] of Object.entries(cropKeywords)) {
      if (lowerQuery.includes(keyword)) {
        session.context.cropType = crop;
        break;
      }
    }

    const sizeKeywords = {
      'small': 'small', 'छोटा': 'small',
      'medium': 'medium', 'मध्यम': 'medium',
      'large': 'large', 'बड़ा': 'large',
      'acre': 'medium', 'एकड़': 'medium'
    };
    
    for (const [keyword, size] of Object.entries(sizeKeywords)) {
      if (lowerQuery.includes(keyword)) {
        session.context.farmSize = size;
        break;
      }
    }

    if (lowerQuery.includes('problem') || lowerQuery.includes('issue') || lowerQuery.includes('समस्या') || 
        lowerQuery.includes('disease') || lowerQuery.includes('बीमारी')) {
      if (!session.context.currentIssues) session.context.currentIssues = [];
      const issue = this.extractIssueFromQuery(query);
      if (issue && !session.context.currentIssues.includes(issue)) {
        session.context.currentIssues.push(issue);
      }
    }

    if (response.recommendations) {
      if (!session.context.previousRecommendations) session.context.previousRecommendations = [];
      
      [...response.recommendations.immediate, ...response.recommendations.shortTerm]
        .forEach(rec => {
          if (rec && !session.context.previousRecommendations?.includes(rec)) {
            session.context.previousRecommendations?.push(rec);
          }
        });
      
      session.context.previousRecommendations = session.context.previousRecommendations.slice(-10);
    }

    if (session.title === 'New Farm Consultation' && session.messages.length > 2) {
      session.title = this.generateConversationTitle(query);
    }

    session.context.followUpNeeded = (response.followUpQuestions?.length || 0) > 0;
    session.updatedAt = new Date();
  }

  // SAVE CONVERSATION TO DATABASE
  private static async saveConversation(session: ConversationSession): Promise<void> {
    try {
      const { error: convError } = await supabase
        .from('conversations')
        .upsert({
          id: session.id,
          title: session.title,
          context: session.context,
          created_at: session.createdAt.toISOString(),
          updated_at: session.updatedAt.toISOString()
        });

      if (convError) {
        console.error('Error saving conversation:', convError);
        return;
      }

      const newMessages = session.messages.slice(-2);
      const messagesToInsert = newMessages.map(msg => ({
        id: `${session.id}_${msg.timestamp.getTime()}`,
        conversation_id: session.id,
        role: msg.role,
        content: msg.content,
        metadata: msg.metadata,
        timestamp: msg.timestamp.toISOString()
      }));

      if (messagesToInsert.length > 0) {
        const { error: msgError } = await supabase
          .from('conversation_messages')
          .upsert(messagesToInsert);

        if (msgError) {
          console.error('Error saving messages:', msgError);
        }
      }
    } catch (error) {
      console.error('Error in saveConversation:', error);
    }
  }

  // LOGGING
  private static async logQuery(
    query: string,
    response: AiResponse,
    conversationId: string
  ): Promise<void> {
    try {
      const logEntry: Omit<AiLog, 'id' | 'created_at' | 'timestamp'> = {
        query,
        response: response.advice,
        confidence: response.confidence,
        response_time: Math.round(response.responseTime || 0),
        language: 'auto-detected',
        sources: response.sources,
        intelligence_level: response.intelligence_level,
        status: 'success',
        model_used: 'llama-3.3-70b-instruct',
        user_feedback: null,
        conversation_id: conversationId
      };

      const { error } = await supabase.from('ai_log').insert([logEntry]);
      
      if (error) {
        console.error('Failed to insert AI log:', error);
      }
    } catch (error) {
      console.error('Failed to log AI query:', error);
    }
  }

  // UTILITY METHODS
  private static getCurrentSeason(): 'summer' | 'monsoon' | 'winter' {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return 'summer';
    if (month >= 6 && month <= 9) return 'monsoon';
    return 'winter';
  }

  private static getTimeContext(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  private static extractTopicFromMessage(content: string): string | null {
    const topicKeywords = {
      'irrigation': ['water', 'irrigation', 'पानी', 'सिंचाई'],
      'disease': ['disease', 'health', 'बीमारी', 'स्वास्थ्य'],
      'fertilizer': ['fertilizer', 'nutrition', 'खाद', 'पोषण'],
      'weather': ['weather', 'rain', 'मौसम', 'बारिश'],
      'soil': ['soil', 'मिट्टी'],
      'harvest': ['harvest', 'crop', 'फसल'],
      'pest': ['pest', 'insect', 'कीट']
    };

    const lowerContent = content.toLowerCase();
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        return topic;
      }
    }
    return null;
  }

  private static extractIssueFromQuery(query: string): string | null {
    const issuePatterns = [
      /problem with (.+)/i,
      /issue with (.+)/i,
      /(.+) disease/i,
      /(.+) की समस्या/i,
      /(.+) बीमारी/i
    ];

    for (const pattern of issuePatterns) {
      const match = query.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    if (query.toLowerCase().includes('problem') || query.toLowerCase().includes('समस्या')) {
      return query.substring(0, 50) + (query.length > 50 ? '...' : '');
    }

    return null;
  }

  private static generateConversationTitle(query: string): string {
    const words = query.split(' ').slice(0, 4);
    return words.join(' ') + (query.split(' ').length > 4 ? '...' : '');
  }

  // PUBLIC METHODS FOR CONVERSATION MANAGEMENT

  static async getConversationHistory(conversationId: string): Promise<ConversationMessage[]> {
    try {
      const session = await this.getConversationSession(conversationId);
      return session.messages;
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return [];
    }
  }

  static async getUserConversations(userId?: string | null, limit: number = 20): Promise<ConversationSession[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(conv => ({
        id: conv.id,
        title: conv.title,
        messages: [],
        createdAt: new Date(conv.created_at),
        updatedAt: new Date(conv.updated_at),
        context: conv.context || {}
      }));
    } catch (error) {
      console.error('Error getting user conversations:', error);
      return [];
    }
  }

  static async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const { error: msgError } = await supabase
        .from('conversation_messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (msgError) {
        console.error('Error deleting messages:', msgError);
        return false;
      }

      const { error: convError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (convError) {
        console.error('Error deleting conversation:', convError);
        return false;
      }

      this.conversationCache.delete(conversationId);
      return true;
    } catch (error) {
      console.error('Error in deleteConversation:', error);
      return false;
    }
  }

  static async updateConversationTitle(conversationId: string, title: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      if (error) {
        console.error('Error updating conversation title:', error);
        return false;
      }

      if (this.conversationCache.has(conversationId)) {
        const session = this.conversationCache.get(conversationId)!;
        session.title = title;
        session.updatedAt = new Date();
      }

      return true;
    } catch (error) {
      console.error('Error in updateConversationTitle:', error);
      return false;
    }
  }

  static async getConversationInsights(conversationId: string): Promise<{
    totalMessages: number;
    topics: string[];
    issues: string[];
    recommendations: string[];
    duration: number;
    lastActivity: Date;
  }> {
    try {
      const session = await this.getConversationSession(conversationId);
      
      const topics = new Set<string>();
      const issues = new Set<string>();
      const recommendations = new Set<string>();

      session.messages.forEach(msg => {
        if (msg.role === 'user') {
          const topic = this.extractTopicFromMessage(msg.content);
          if (topic) topics.add(topic);

          const issue = this.extractIssueFromQuery(msg.content);
          if (issue) issues.add(issue);
        }
      });

      session.context.previousRecommendations?.forEach(rec => {
        recommendations.add(rec);
      });

      const duration = Math.round(
        (session.updatedAt.getTime() - session.createdAt.getTime()) / (1000 * 60)
      );

      return {
        totalMessages: session.messages.length,
        topics: Array.from(topics),
        issues: Array.from(issues),
        recommendations: Array.from(recommendations),
        duration,
        lastActivity: session.updatedAt
      };
    } catch (error) {
      console.error('Error getting conversation insights:', error);
      return {
        totalMessages: 0,
        topics: [],
        issues: [],
        recommendations: [],
        duration: 0,
        lastActivity: new Date()
      };
    }
  }

  static async searchConversations(
    userId: string | null,
    searchQuery: string,
    limit: number = 10
  ): Promise<ConversationSession[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,context->cropType.ilike.%${searchQuery}%`)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(conv => ({
        id: conv.id,
        title: conv.title,
        messages: [],
        createdAt: new Date(conv.created_at),
        updatedAt: new Date(conv.updated_at),
        context: conv.context || {}
      }));
    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  }

  // LOCATION AND SENSOR BASED METHODS
  static getLocationBasedAdvice(
    latitude: number, 
    longitude: number, 
    conversationId?: string,
    language: string = 'en'
  ): Promise<AiResponse> {
    const locationQuery = language === 'hi' 
      ? `इस स्थान (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) के लिए खेती की सलाह दें`
      : `Provide farming advice for location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
    
    return this.processQuery(locationQuery, conversationId, undefined, language);
  }

  static getSensorBasedRecommendations(
    sensorType: string, 
    value: number, 
    unit: string, 
    conversationId?: string,
    language: string = 'en'
  ): Promise<AiResponse> {
    const query = language === 'hi'
      ? `${sensorType} सेंसर ${value}${unit} दिखा रहा है। क्या करना चाहिए?`
      : `${sensorType} sensor showing ${value}${unit}. What should I do?`;
    
    return this.processQuery(query, conversationId, undefined, language);
  }

  // PERFORMANCE MONITORING
  static async getPerformanceStats(): Promise<{
    totalQueries: number;
    avgResponseTime: number;
    successRate: number;
    lastQueryTime: string | null;
    conversationStats: {
      totalConversations: number;
      avgConversationLength: number;
      activeConversations: number;
    };
  }> {
    try {
      const { data: logs, error: logsError } = await supabase
        .from('ai_log')
        .select('response_time, created_at, status, conversation_id')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;

      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id, created_at, updated_at')
        .order('updated_at', { ascending: false });

      if (convError) throw convError;

      const totalQueries = logs.length;
      const successfulQueries = logs.filter(log => log.status === 'success').length;
      const avgResponseTime = logs.reduce((sum, log) => sum + (log.response_time || 0), 0) / totalQueries;
      const successRate = totalQueries > 0 ? successfulQueries / totalQueries : 0;
      const lastQueryTime = logs[0]?.created_at || null;

      const totalConversations = conversations.length;
      const recentConversations = conversations.filter(conv => {
        const updatedAt = new Date(conv.updated_at);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return updatedAt > dayAgo;
      });
      const activeConversations = recentConversations.length;

      const conversationLengths = await Promise.all(
        conversations.slice(0, 20).map(async conv => {
          const { data: messages } = await supabase
            .from('conversation_messages')
            .select('id')
            .eq('conversation_id', conv.id);
          return messages?.length || 0;
        })
      );
      const avgConversationLength = conversationLengths.reduce((sum, len) => sum + len, 0) / conversationLengths.length;

      return {
        totalQueries,
        avgResponseTime,
        successRate,
        lastQueryTime,
        conversationStats: {
          totalConversations,
          avgConversationLength,
          activeConversations
        }
      };
    } catch (error) {
      console.error('Error fetching performance stats:', error);
      return {
        totalQueries: 0,
        avgResponseTime: 0,
        successRate: 0,
        lastQueryTime: null,
        conversationStats: {
          totalConversations: 0,
          avgConversationLength: 0,
          activeConversations: 0
        }
      };
    }
  }

  // CACHE MANAGEMENT
  static clearCache(): void {
    this.conversationCache.clear();
    console.log('Conversation cache cleared');
  }

  static getCacheSize(): number {
    return this.conversationCache.size;
  }

  static purgeCacheOlderThan(minutes: number): void {
    const cutoffTime = Date.now() - minutes * 60 * 1000;
    for (const [id, session] of this.conversationCache.entries()) {
      if (session.updatedAt.getTime() < cutoffTime) {
        this.conversationCache.delete(id);
      }
    }
  }
}