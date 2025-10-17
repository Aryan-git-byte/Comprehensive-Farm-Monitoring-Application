# 🌾 Comprehensive Farm Monitoring Application

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7.4.2-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An AI-powered agricultural monitoring system that provides intelligent farming advice based on real-time sensor data, weather conditions, and soil analysis. Built for Indian farmers with bilingual support (English & Hindi).

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [AI System](#-ai-system)
- [Bulk Testing](#-bulk-testing)
- [Safety Features](#-safety-features)
- [API Integration](#-api-integration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🤖 AI-Powered Agricultural Advice

- **Intelligent Analysis**: LLaMA 3.3 70B powered recommendations
- **Real-time Data Processing**: Integration with sensors and weather APIs
- **Context-Aware**: Considers season, time of day, and regional practices
- **Safety-First**: Built-in constraints to prevent harmful recommendations
- **Bilingual Support**: English and Hindi language options

### 📊 Comprehensive Monitoring

- **Real-time Weather Data**: Automatic fetching from OpenWeather API
- **Soil Analysis**: pH, moisture, NPK (Nitrogen, Phosphorus, Potassium) monitoring
- **Dashboard**: Interactive charts and status indicators
- **Manual Entry**: Support for manual data input when sensors unavailable
- **Historical Data**: Track trends and patterns over time

### 🧪 Bulk Testing Suite

- **CSV Upload**: Process hundreds of locations simultaneously
- **Auto-Weather Fetch**: Automatic weather data for each location
- **Comprehensive Results**: Export detailed analysis in CSV/JSON formats
- **Progress Tracking**: Real-time processing status
- **Sample Data**: Pre-filled test cases across India

### 🛡️ Safety Features

- **Input Validation**: Prevents processing of incomplete data
- **Anti-Hallucination**: Detects missing data and prevents AI from fabricating values
- **Nutrient Guidelines**: Clear interpretation thresholds for NPK levels
- **Conservative Recommendations**: Prioritizes safety over aggressive treatments
- **Expert Consultation**: Always recommends local agricultural expert verification

## 🛠️ Tech Stack

### Frontend

- **React 18.3.1**: Modern UI with hooks and functional components
- **TypeScript 5.5.3**: Type-safe development
- **Vite 5.4.2**: Lightning-fast build tool
- **TailwindCSS 3.4.1**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Chart.js 4.5.0**: Interactive data visualization

### Backend Services

- **Supabase**: Database and authentication
- **OpenRouter API**: AI model access (LLaMA 3.3 70B)
- **OpenWeather API**: Real-time weather data
- **Groq SDK**: AI inference

### Mobile

- **Capacitor 7.4.2**: Cross-platform native runtime

### Development

- **ESLint**: Code quality and consistency
- **PostCSS & Autoprefixer**: CSS processing
- **Date-fns**: Date manipulation

## 📁 Project Structure

```
Comprehensive-Farm-Monitoring-Application/
├── src/
│   ├── components/
│   │   ├── AI/                    # AI chatbot and testing components
│   │   │   ├── ChatbotPage.tsx
│   │   │   └── ...
│   │   ├── Auth/                  # Authentication components
│   │   ├── Common/                # Reusable components
│   │   ├── Dashboard/             # Dashboard and charts
│   │   ├── Help/                  # Help and documentation
│   │   ├── LanguageSelector/      # Language selection
│   │   ├── Layout/                # Navigation and layout
│   │   ├── ManualEntry/           # Manual data entry forms
│   │   ├── Settings/              # Settings and preferences
│   │   ├── Tabs/                  # Tab components
│   │   └── Testing/               # Bulk testing UI
│   │       └── TestAIPage.tsx
│   ├── config/                    # Configuration files
│   │   ├── languages.ts
│   │   └── supabase.ts
│   ├── contexts/                  # React contexts
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/                     # Custom React hooks
│   │   └── useUserPreferences.ts
│   ├── services/                  # API and business logic
│   │   ├── aiService.ts          # AI processing and bulk testing
│   │   ├── authService.ts
│   │   ├── locationService.ts
│   │   ├── manualEntryService.ts
│   │   ├── sensorService.ts
│   │   └── weatherService.ts
│   └── utils/                     # Utility functions
│       └── dateUtils.ts
├── docs/                          # Documentation files (see below)
├── capacitor.config.ts           # Capacitor configuration
├── tailwind.config.js            # TailwindCSS configuration
├── vite.config.js                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 16.x
- **npm** or **yarn**
- **OpenRouter API Key** (for AI features)
- **OpenWeather API Key** (for weather data)
- **Supabase Account** (for database)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Aryan-git-byte/Comprehensive-Farm-Monitoring-Application.git
   cd Comprehensive-Farm-Monitoring-Application
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Running with Capacitor (Mobile)

```bash
# Add Android/iOS platform
npx cap add android
npx cap add ios

# Build and sync
npm run build
npx cap sync

# Open in native IDE
npx cap open android
npx cap open ios
```

## 🤖 AI System

### Model: LLaMA 3.3 70B Instruct

The application uses LLaMA 3.3 70B through OpenRouter API for agricultural advice generation.

### How It Works

```
User Input → System Prompt → AI Model → Structured Response
     ↓           ↓              ↓              ↓
  Soil Data   Safety Rules   LLaMA 3.3    Main Advice
  Weather     Guidelines      70B         Immediate Actions
  Crop Type   Context                     Next Steps
  Location                                Follow-ups
```

### System Prompt Components

1. **Role Definition**: Indian agricultural expert with conversation memory
2. **Safety Rules**: 10 critical safety constraints for fertilizer recommendations
3. **Interpretation Guidelines**: Clear NPK level thresholds
4. **Context**: Season, time of day, regional practices
5. **Farmer Profile**: Experience level and crop information
6. **Response Format**: Structured with emojis for readability

### Safety Rules

```typescript
1. NEVER provide specific doses without crop growth stage
2. If N > 100 mg/kg → say "adequate, monitor only"
3. NEVER recommend > 50 kg/ha N without stage info
4. For P > 40 or K > 150 → say "adequate, maintain"
5. NEVER contradict yourself
6. Always clarify: "total seasonal" vs "per application"
7. Specify total budget AND splits separately
8. Always recommend soil test + expert consultation
9. Use ranges, not exact doses
10. If data missing → ask for it, don't guess
```

### Nutrient Interpretation Guidelines

| Nutrient       | Low (mg/kg) | Adequate (mg/kg) | High (mg/kg) |
| -------------- | ----------- | ---------------- | ------------ |
| **Nitrogen**   | < 80        | 80-120           | > 120        |
| **Phosphorus** | < 30        | 30-50            | > 50         |
| **Potassium**  | < 120       | 120-180          | > 180        |

**Soil pH**: 6.0-7.5 optimal for most crops

## 🧪 Bulk Testing

### Overview

Process hundreds of soil samples with AI-powered advice, automatic weather fetching, and comprehensive results export.

### Quick Start

1. **Navigate to Test Page**: `/test-ai` (hidden route)

2. **Create CSV File** (minimal format):

   ```csv
   id,latitude,longitude,soil_ph,nitrogen,phosphorus,potassium,crop_type
   1,28.6139,77.2090,6.5,120,45,180,wheat
   2,19.0760,72.8777,7.2,95,38,150,rice
   ```

3. **Upload and Process**: System auto-fetches weather for each location

4. **Download Results**: Export as CSV or JSON

### CSV Format

#### Required Fields

- `id`: Unique identifier
- `latitude`: Location latitude
- `longitude`: Location longitude

#### Optional Fields

- `soil_moisture`: Soil moisture percentage
- `soil_ph`: pH value (6.0-8.0)
- `nitrogen`: N content (mg/kg)
- `phosphorus`: P content (mg/kg)
- `potassium`: K content (mg/kg)
- `crop_type`: Crop name (wheat, rice, potato, etc.)
- `language`: Response language (`en` or `hi`)

### Processing Flow

```
1. Upload CSV
   ↓
2. Parse data
   ↓
3. For each row:
   a. Fetch weather from OpenWeather API (lat/lon)
   b. Build comprehensive query (soil + weather)
   c. Send to AI (LLaMA 3.3 70B)
   d. Receive analysis & recommendations
   ↓
4. Export results (CSV/JSON)
```

### Output Format

The results include:

- ✅ All input parameters
- ✅ Auto-fetched weather data (temp, humidity, conditions, wind)
- ✅ AI-generated query
- ✅ Full AI response
- ✅ Structured recommendations
- ✅ Confidence scores
- ✅ Processing timestamps
- ✅ Error messages (if any)

### Sample Locations

10 pre-configured test locations across India:

- **Northern**: Delhi
- **Coastal**: Mumbai, Chennai
- **Eastern**: Kolkata, Varanasi
- **Western**: Ahmedabad, Kota
- **Southern**: Bangalore, Hyderabad
- **Central**: Nagpur

## 🛡️ Safety Features

### Problem: AI Safety Issues

During bulk testing, three critical issues were identified:

#### 1. Contradictory Advice ⚠️

```
AI: "Nitrogen 120 mg/kg is relatively high"
AI: "Apply 30 kg/ha nitrogen top-dressing"
→ CONTRADICTION!
```

#### 2. Unsafe Amounts ⚠️

```
AI: "100-150 kg/ha nitrogen every 10-15 days"
→ DANGEROUS: Could kill crops with overdose
→ UNCLEAR: Total seasonal or per-application?
```

#### 3. Data Hallucination ⚠️

```
Input: Only "language: en"
AI: Invented "soil moisture 48.3%, nitrogen 88ppm"
AI: "Apply 100 kg/ha of 20:10:10 NPK"
→ FABRICATED DATA + DANGEROUS ADVICE
```

### Solution: Three-Layer Safety System

#### Layer 1: Enhanced System Prompt

- 10 critical safety rules embedded in AI prompt
- Clear nutrient interpretation guidelines
- Conservative recommendation protocols

#### Layer 2: Input Validation

- Detects missing critical fields
- Prevents processing of incomplete data
- Adds warning prefixes to queries

#### Layer 3: Response Parsing

- Validates AI responses for contradictions
- Ensures dose clarity (total vs per-application)
- Flags potentially unsafe recommendations

### Testing the Safety System

Use the provided test CSV files:

```csv
id,latitude,longitude,soil_ph,nitrogen,crop_type,language
1,28.6139,77.209,6.5,120,wheat,en        # High N test
2,22.5726,88.3639,7,100,potato,hi        # Potato dosage test
3,,,,,,wheat,en                          # Missing data test
```

Expected behaviors:

- **Test 1**: Should NOT recommend adding nitrogen
- **Test 2**: Should clarify total vs split applications
- **Test 3**: Should request data, NOT hallucinate

## 🔌 API Integration

### OpenWeather API

**Purpose**: Real-time weather data fetching

**Endpoints Used**:

- Current Weather: `https://api.openweathermap.org/data/2.5/weather`

**Data Retrieved**:

- Temperature (°C)
- Humidity (%)
- Weather conditions & description
- Wind speed (km/h)
- Atmospheric pressure (hPa)
- Rainfall (mm)

**Usage**:

```typescript
const weatherData = await WeatherService.getCurrentWeather(latitude, longitude);
```

### OpenRouter API

**Purpose**: AI model access (LLaMA 3.3 70B)

**Endpoints Used**:

- Chat Completions: `https://openrouter.ai/api/v1/chat/completions`

**Model**: `meta-llama/llama-3.3-70b-instruct`

**Features**:

- Streaming responses
- Context window: 128K tokens
- Temperature: 0.7 (balanced creativity)
- System prompts for safety

### Supabase

**Purpose**: Database and authentication

**Features Used**:

- User authentication
- Sensor data storage
- Manual entry records
- User preferences

## 🧪 Testing

### Manual Testing

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Open Test Page**

   ```
   http://localhost:5173/test-ai
   ```

3. **Use Sample CSV**

   Download the provided sample CSV or create your own.

4. **Verify Results**

   Check that:

   - Weather data is auto-fetched
   - AI responses are safe and consistent
   - No data hallucination occurs
   - Recommendations are conservative

### Automated Testing (Coming Soon)

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Set Environment Variables**

   Add your API keys in Vercel dashboard under project settings.

### Netlify

1. **Install Netlify CLI**

   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

```bash
docker build -t farm-monitor .
docker run -p 5173:5173 farm-monitor
```

## 📚 Documentation

Comprehensive documentation files included:

| File                           | Description                          |
| ------------------------------ | ------------------------------------ |
| `AI_SAFETY_FIXES.md`           | Details on AI safety implementations |
| `BUG_EXPLANATION_VISUAL.md`    | Visual guide to CSV parsing bug fix  |
| `BULK_TESTING_GUIDE.md`        | Complete bulk testing documentation  |
| `BULK_TESTING_PROMPT.md`       | AI prompt structure breakdown        |
| `CORRECTED_ADVICE_EXAMPLES.md` | Before/after examples of safe advice |
| `CSV_PARSING_BUG_FIX.md`       | CSV parsing issue resolution         |
| `EXAMPLE_PROMPT.md`            | Real-world AI prompt examples        |
| `IMPLEMENTATION_SUMMARY.md`    | Implementation overview              |
| `QUICK_START_TESTING.md`       | Quick testing reference              |
| `SAFETY_FIX_SUMMARY.md`        | Safety fix summary                   |
| `SYSTEM_FLOW.md`               | System architecture diagrams         |
| `TESTING_INSTRUCTIONS.md`      | Detailed testing guide               |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**

2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**

   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain type safety
- Add JSDoc comments for functions
- Update documentation for new features
- Test thoroughly before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Aryan** - [@Aryan-git-byte](https://github.com/Aryan-git-byte)

## 🙏 Acknowledgments

- **OpenRouter** for AI model access
- **OpenWeather** for weather data API
- **Supabase** for backend infrastructure
- **Meta AI** for LLaMA 3.3 70B model
- Indian agricultural experts for domain knowledge
- Open source community for amazing tools

## 📞 Support

For support, email [your-email@example.com] or open an issue in the GitHub repository.

## 🗺️ Roadmap

### Phase 1 (Current)

- ✅ AI-powered agricultural advice
- ✅ Real-time weather integration
- ✅ Bulk testing suite
- ✅ Safety features implementation
- ✅ Bilingual support (EN/HI)

### Phase 2 (Upcoming)

- 🔲 Mobile app deployment (Android/iOS)
- 🔲 Offline mode support
- 🔲 IoT sensor integration
- 🔲 Historical data analytics
- 🔲 Community forum

### Phase 3 (Future)

- 🔲 Machine learning for yield prediction
- 🔲 Marketplace integration
- 🔲 Multi-language support (10+ languages)
- 🔲 Voice assistant integration
- 🔲 Drone integration for field monitoring

---

<div align="center">

**Made with ❤️ for Indian Farmers**

⭐ Star this repo if you find it helpful!

</div>
