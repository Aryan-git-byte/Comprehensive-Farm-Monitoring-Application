# Farm Monitoring System

> A modern, mobile-first agricultural monitoring platform designed for farmers to track crop health, soil conditions, weather patterns, and receive AI-powered agricultural insights.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [File & Folder Structure](#file--folder-structure)
- [Design System](#design-system)
  - [Color Palette](#color-palette)
  - [Typography](#typography)
  - [Icons & Illustrations](#icons--illustrations)
  - [Layout & Spacing](#layout--spacing)
- [UI Components](#ui-components)
- [Pages & Structure](#pages--structure)
- [Functionality & Workflow](#functionality--workflow)
- [Setup & Installation](#setup--installation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

---

## Project Overview

The **Farm Monitoring System** is a production-ready Progressive Web App (PWA) designed specifically for farmers in India. It provides real-time crop health monitoring, weather forecasts, soil analysis, and AI-powered agricultural advice through an intuitive, bilingual interface (Hindi/English).

**Key Features:**
- Real-time sensor data monitoring (soil moisture, pH, temperature, NPK levels)
- Weather forecasts integrated with farm location
- Manual data entry for farmers without sensors
- AI chatbot assistant for instant farming advice
- Bilingual support (Hindi & English)
- Dark/Light theme toggle
- Mobile-optimized for slow internet connections
- Offline-capable data entry
- Android native app support via Capacitor

---

## Tech Stack

### Frontend Framework & Libraries
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework for component-based architecture |
| **TypeScript** | 5.5.3 | Type-safe development |
| **Vite** | 5.4.2 | Fast build tool and dev server |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **Lucide React** | 0.344.0 | Icon system |

### Data Visualization & Charts
| Technology | Version | Purpose |
|------------|---------|---------|
| **Chart.js** | 4.5.0 | Interactive charts for sensor data |
| **chartjs-adapter-date-fns** | 2.0.0 | Date handling for time-series charts |
| **date-fns** | 4.1.0 | Date formatting and manipulation |

### Backend & Database
| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.54.0 | Backend-as-a-Service (PostgreSQL, Auth, Storage) |
| **Groq SDK** | 0.30.0 | AI chatbot integration (fast LLM responses) |

### Mobile Development
| Technology | Version | Purpose |
|------------|---------|---------|
| **Capacitor** | 7.4.2 | Cross-platform native runtime |
| **Capacitor Android** | 7.4.2 | Android platform support |

### Development Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.9.1 | Code linting and quality checks |
| **PostCSS** | 8.4.35 | CSS processing |
| **Autoprefixer** | 10.4.18 | CSS vendor prefixing |

### External APIs
- **OpenWeatherMap API** - Real-time weather data and forecasts
- **Groq API** - Ultra-fast AI responses for agricultural queries

---

## File & Folder Structure

```
farm-monitoring-system/
│
├── android/                          # Capacitor Android native project
│   ├── app/                          # Android app source
│   └── build.gradle                  # Android build configuration
│
├── dist/                             # Production build output
│
├── src/                              # Application source code
│   ├── components/                   # React components
│   │   ├── AI/                       # AI chatbot components
│   │   │   └── ChatbotPage.tsx       # Main chatbot interface
│   │   ├── Auth/                     # Authentication components
│   │   │   ├── SimpleAuthComponent.tsx
│   │   │   └── AuthComponent.tsx
│   │   ├── Common/                   # Reusable UI components
│   │   │   ├── ComparisonCard.tsx    # Comparison display card
│   │   │   ├── ErrorBoundary.tsx     # Error handling wrapper
│   │   │   ├── LoadingSpinner.tsx    # Loading state component
│   │   │   └── StatusIndicator.tsx   # Status badge component
│   │   ├── Dashboard/                # Dashboard views
│   │   │   ├── IntegratedDashboard.tsx  # Main dashboard
│   │   │   ├── WeatherDashboard.tsx     # Weather widget
│   │   │   ├── SensorChart.tsx          # Sensor data charts
│   │   │   └── StatusCard.tsx           # Status summary cards
│   │   ├── Help/                     # Help & support
│   │   │   └── SimpleHelp.tsx        # Help documentation
│   │   ├── Layout/                   # Layout components
│   │   │   ├── SimpleNavigation.tsx  # Top navigation bar
│   │   │   └── Navigation.tsx
│   │   ├── ManualEntry/              # Manual data entry
│   │   │   ├── SimpleManualEntry.tsx # Manual entry container
│   │   │   ├── ManualEntryForm.tsx   # Data entry form
│   │   │   └── ManualEntryList.tsx   # Entry history list
│   │   └── Settings/                 # Settings & preferences
│   │       ├── MobileOptimizedSettings.tsx
│   │       ├── MockDataSettings.tsx  # Test data management
│   │       └── SimpleSettings.tsx
│   │
│   ├── contexts/                     # React Context providers
│   │   ├── LanguageContext.tsx       # i18n language switching
│   │   └── ThemeContext.tsx          # Dark/Light theme toggle
│   │
│   ├── services/                     # Business logic & API calls
│   │   ├── aiService.ts              # Groq AI integration
│   │   ├── authService.ts            # Supabase authentication
│   │   ├── locationService.ts        # Geolocation handling
│   │   ├── manualEntryService.ts     # Manual data CRUD
│   │   ├── sensorService.ts          # Sensor data management
│   │   └── weatherService.ts         # OpenWeatherMap integration
│   │
│   ├── config/                       # Configuration files
│   │   ├── languages.ts              # Translation strings (hi/en)
│   │   └── supabase.ts               # Supabase client config
│   │
│   ├── utils/                        # Utility functions
│   │   └── dateUtils.ts              # Date formatting helpers
│   │
│   ├── App.tsx                       # Root application component
│   ├── main.tsx                      # Application entry point
│   ├── index.css                     # Global CSS & Tailwind imports
│   └── vite-env.d.ts                 # TypeScript environment types
│
├── .env                              # Environment variables (Supabase keys)
├── capacitor.config.ts               # Capacitor configuration
├── index.html                        # HTML entry point
├── package.json                      # Node dependencies
├── tailwind.config.js                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── vite.config.js                    # Vite build configuration
└── README.md                         # This file
```

---

## Design System

### Color Palette

The application uses a semantic color system optimized for agricultural monitoring with clear status indicators.

#### Status Colors
| Color Name | Light Mode | Dark Mode | Usage |
|------------|-----------|-----------|-------|
| **Success Green** | `#16a34a` (green-600) | `#4ade80` (green-400) | Optimal conditions, good status |
| **Warning Yellow** | `#ca8a04` (yellow-600) | `#facc15` (yellow-400) | Attention needed, moderate alerts |
| **Critical Red** | `#dc2626` (red-600) | `#f87171` (red-400) | Urgent action required |

#### Background Colors
| Purpose | Light Mode | Dark Mode |
|---------|-----------|-----------|
| **Primary Background** | `#f3f4f6` (gray-100) | `#111827` (gray-900) |
| **Surface/Card** | `#ffffff` (white) | `#1f2937` (gray-800) |
| **Secondary Surface** | `#f9fafb` (gray-50) | `#374151` (gray-700) |

#### Text Colors
| Purpose | Light Mode | Dark Mode |
|---------|-----------|-----------|
| **Primary Text** | `#111827` (gray-900) | `#f9fafb` (gray-100) |
| **Secondary Text** | `#4b5563` (gray-600) | `#9ca3af` (gray-400) |
| **Muted Text** | `#6b7280` (gray-500) | `#6b7280` (gray-500) |

#### Accent Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Primary Green** | `#16a34a` | CTAs, active states, brand |
| **Blue Info** | `#2563eb` | Informational messages |
| **Border Gray** | `#e5e7eb` (light) / `#374151` (dark) | Card borders, dividers |

#### Color Ramp - Green (Primary)
| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | `#f0fdf4` | Light backgrounds, hover states |
| 100 | `#dcfce7` | Active tab backgrounds |
| 600 | `#16a34a` | Primary buttons, icons |
| 700 | `#15803d` | Hover states for buttons |
| 800 | `#166534` | Dark mode borders |
| 900 | `#14532d` | Dark mode backgrounds |

[Insert color palette visualization image here]

---

### Typography

#### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
             'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
             sans-serif;
```

**System Font Benefits:**
- Native appearance on each platform
- Optimal performance (no web font loading)
- Excellent readability across devices
- Supports multiple languages (Hindi/English)

#### Type Scale
| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **H1 Heading** | 30px (text-3xl) | Bold (700) | 1.2 | Page titles |
| **H2 Heading** | 24px (text-2xl) | Bold (700) | 1.2 | Section headers |
| **H3 Heading** | 20px (text-xl) | Semibold (600) | 1.2 | Subsection titles |
| **Body Large** | 18px (text-lg) | Regular (400) | 1.5 | Important body text |
| **Body Regular** | 16px (text-base) | Regular (400) | 1.5 | Standard text |
| **Body Small** | 14px (text-sm) | Regular (400) | 1.5 | Secondary info |
| **Caption** | 12px (text-xs) | Regular (400) | 1.5 | Labels, timestamps |

#### Font Weights Used
- **Regular (400)** - Body text
- **Medium (500)** - Emphasized text
- **Semibold (600)** - Subheadings
- **Bold (700)** - Headings, CTAs

---

### Icons & Illustrations

**Primary Icon Library:** [Lucide React](https://lucide.dev/) v0.344.0

**Icon Design Principles:**
- Stroke-based icons for consistency
- 24px default size (adjustable)
- 2px stroke width
- Rounded corners for friendly appearance

#### Key Icons Used
| Icon | Component | Usage |
|------|-----------|-------|
| `Home` | Navigation, Logo | Dashboard/Home navigation |
| `Plus` | Add button | Create new entries |
| `MessageSquare` | AI Assistant | Chatbot access |
| `Settings` | Settings page | Configuration access |
| `HelpCircle` | Help section | Support documentation |
| `Sun` / `Moon` | Theme toggle | Light/Dark mode switch |
| `AlertTriangle` | Critical status | Urgent alerts |
| `CheckCircle` | Success status | Good conditions |
| `Clock` | Warning status | Moderate alerts |
| `Thermometer` | Temperature | Sensor data |
| `RefreshCw` | Refresh action | Data reload |
| `MapPin` | Location | Geographic position |

**Icon Color Strategy:**
- Status icons inherit semantic colors (green/yellow/red)
- Navigation icons use gray-600 (light) / gray-400 (dark)
- Active state icons use primary green

---

### Layout & Spacing

#### Spacing System
Follows an **8px base unit system** for consistent visual rhythm:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon padding, tight spacing |
| `space-2` | 8px | Between related items |
| `space-3` | 12px | Icon-text spacing |
| `space-4` | 16px | Standard padding |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Large gaps, page margins |
| `space-12` | 48px | Major section separation |

#### Container & Breakpoints
| Breakpoint | Width | Usage |
|------------|-------|-------|
| **Mobile** | 100% | < 640px |
| **Tablet** | 640px | sm: |
| **Desktop** | 1024px | lg: |
| **Max Width** | 1280px (7xl) | Dashboard container |

#### Border Radius
| Size | Value | Usage |
|------|-------|-------|
| `rounded-lg` | 8px | Buttons, small cards |
| `rounded-xl` | 12px | Navigation tabs |
| `rounded-2xl` | 16px | Large cards, sections |
| `rounded-full` | 9999px | Icon containers, badges |

#### Shadows
```css
/* Card Shadow (Light Mode) */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);

/* Hover Shadow */
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

---

## UI Components

### 1. Navigation Bar (`SimpleNavigation.tsx`)

**Purpose:** Top-level navigation with tab switching and theme toggle

**Features:**
- Horizontal scrollable tab bar (mobile-optimized)
- Active tab highlighting with green accent
- Theme toggle button (Sun/Moon icon)
- Logo with brand identity
- Sticky positioning for always-visible navigation

**Screenshot Placeholder:**
```
[Insert navigation bar screenshot - showing tabs: Dashboard, Add Data, AI Assistant, Help, Settings]
```

**Code Location:** `src/components/Layout/SimpleNavigation.tsx`

---

### 2. Status Indicator (`StatusIndicator.tsx`)

**Purpose:** Visual status badges for sensor readings and conditions

**Variants:**
- **Optimal (Green)** - Everything is good
- **Warning (Yellow)** - Check soon
- **Critical (Red)** - Take action now

**Props:**
```typescript
interface StatusIndicatorProps {
  status: 'optimal' | 'warning' | 'critical';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}
```

**Screenshot Placeholder:**
```
[Insert status indicator examples - showing all three states]
```

**Code Location:** `src/components/Common/StatusIndicator.tsx`

---

### 3. Dashboard Cards (`StatusCard.tsx`)

**Purpose:** Large summary cards displaying farm health metrics

**Features:**
- Icon + large number display
- Color-coded backgrounds
- Bilingual labels
- Responsive grid layout

**Screenshot Placeholder:**
```
[Insert 3-column card grid - Good: 5, Warning: 2, Critical: 0]
```

**Code Location:** `src/components/Dashboard/StatusCard.tsx`

---

### 4. Sensor Data Cards

**Purpose:** Display individual sensor readings with status

**Features:**
- Sensor type title
- Large value display with units
- Status badge
- Timestamp
- Gray background for visual separation

**Screenshot Placeholder:**
```
[Insert sensor card example - Soil Moisture: 45% with green status]
```

**Code Location:** `src/components/Dashboard/IntegratedDashboard.tsx:224-238`

---

### 5. Weather Dashboard (`WeatherDashboard.tsx`)

**Purpose:** Current weather and forecast display

**Features:**
- Current temperature, humidity, wind speed
- Weather icon/description
- Location display
- Forecast cards
- Integration with OpenWeatherMap API

**Screenshot Placeholder:**
```
[Insert weather dashboard - showing current weather + 5-day forecast]
```

**Code Location:** `src/components/Dashboard/WeatherDashboard.tsx`

---

### 6. Sensor Charts (`SensorChart.tsx`)

**Purpose:** Time-series visualization of sensor data

**Technology:** Chart.js with date-fns adapter

**Features:**
- Line charts with smooth curves
- Color-coded by status
- Interactive tooltips
- Responsive canvas
- 7-day historical view

**Screenshot Placeholder:**
```
[Insert chart example - soil moisture over time]
```

**Code Location:** `src/components/Dashboard/SensorChart.tsx`

---

### 7. Loading Spinner (`LoadingSpinner.tsx`)

**Purpose:** Loading state indicator

**Variants:**
- Small (16px)
- Medium (32px)
- Large (64px)

**Implementation:**
```typescript
<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500" />
```

**Code Location:** `src/components/Common/LoadingSpinner.tsx`

---

### 8. Manual Entry Form (`ManualEntryForm.tsx`)

**Purpose:** Form for farmers to manually record observations

**Features:**
- Entry type selection (Custom, Water Quality, Fertilizer, Weather)
- Title input
- Description textarea
- Location auto-detection
- Bilingual form labels
- Save/Cancel actions

**Screenshot Placeholder:**
```
[Insert manual entry form - showing all fields]
```

**Code Location:** `src/components/ManualEntry/ManualEntryForm.tsx`

---

### 9. AI Chatbot Interface (`ChatbotPage.tsx`)

**Purpose:** Conversational AI assistant for farming advice

**Features:**
- Chat message bubbles (user/assistant)
- Text input with send button
- Fast response time (<20 seconds)
- Context-aware responses
- Bilingual support

**Screenshot Placeholder:**
```
[Insert chatbot interface - showing conversation flow]
```

**Code Location:** `src/components/AI/ChatbotPage.tsx`

---

### 10. Settings Panel (`MobileOptimizedSettings.tsx`)

**Purpose:** User preferences and configuration

**Features:**
- Language selector (Hindi/English)
- Theme toggle (Light/Dark)
- Mock data insertion (testing)
- Data management tools
- Clear/reset options

**Screenshot Placeholder:**
```
[Insert settings panel - showing all options]
```

**Code Location:** `src/components/Settings/MobileOptimizedSettings.tsx`

---

## Pages & Structure

### 1. Dashboard Page (`/dashboard`)

**Component:** `IntegratedDashboard.tsx`

**Purpose:** Primary landing page showing farm health overview

**Content:**
- Farm status header with last update time
- Refresh button
- 3-card status summary (Good/Warning/Critical)
- Weather dashboard widget
- Sensor data grid (soil moisture, pH, temperature, NPK levels)
- AI assistant tip banner

**User Journey:**
1. User lands on dashboard after login
2. Views quick status summary (green/yellow/red counts)
3. Checks weather conditions
4. Reviews individual sensor readings
5. Can tap refresh to update data
6. Can navigate to other sections via tabs

**Data Flow:**
```
IntegratedDashboard
  ├─> SensorService.getSensorData()
  ├─> SensorService.getLatestReadings()
  ├─> WeatherDashboard (child component)
  └─> StatusIndicator (multiple instances)
```

---

### 2. Manual Entry Page (`/manual-entry`)

**Component:** `SimpleManualEntry.tsx`

**Purpose:** Allow farmers to manually record observations

**Content:**
- Two-button choice: "New Entry" vs "View Entries"
- ManualEntryForm (when creating new)
- ManualEntryList (when viewing history)

**User Journey:**
1. Farmer observes something in field
2. Taps "Add Data" in navigation
3. Chooses "New Entry"
4. Selects entry type (Water Quality, Fertilizer, Weather, Custom)
5. Fills in title and description
6. Location auto-detected
7. Saves entry
8. Can view history by tapping "View Entries"

**Data Flow:**
```
SimpleManualEntry
  ├─> ManualEntryForm
  │   └─> manualEntryService.createEntry()
  └─> ManualEntryList
      └─> manualEntryService.getEntries()
```

---

### 3. AI Assistant Page (`/ai-chatbot`)

**Component:** `ChatbotPage.tsx`

**Purpose:** Conversational AI for farming advice

**Content:**
- Chat message history
- Text input field
- Send button
- "Powered by Groq" attribution

**User Journey:**
1. Farmer has question about crops/weather/soil
2. Taps "AI Assistant" in navigation
3. Types question in input field
4. Receives answer within 20 seconds
5. Can ask follow-up questions
6. Conversation history preserved in session

**Data Flow:**
```
ChatbotPage
  └─> aiService.chat(userMessage)
      └─> Groq API (fast LLM)
          └─> Returns agricultural advice
```

---

### 4. Help Page (`/help`)

**Component:** `SimpleHelp.tsx`

**Purpose:** User documentation and FAQ

**Content:**
- Understanding status colors section (green/yellow/red)
- Mobile usage tips
- Internet connection info
- Common questions (expandable/collapsible)

**Sections:**
1. **Understanding Colors**
   - Green: Everything good
   - Yellow: Check soon
   - Red: Take action now

2. **Using on Mobile**
   - Tap refresh for updates
   - Use + button to add observations
   - Swipe left/right for sections

3. **Internet Connection**
   - Works with slow connections
   - Offline data entry support

4. **Common Questions**
   - How often to check status?
   - What to do for red alerts?
   - Using without sensors?

---

### 5. Settings Page (`/settings`)

**Component:** `MobileOptimizedSettings.tsx`

**Purpose:** User preferences and data management

**Content:**
- Language selector (Hindi ↔ English)
- Theme toggle (Light ↔ Dark)
- Data management section
  - Insert mock data (for testing)
  - Clear all data (danger zone)
- Usage instructions

**User Journey:**
1. User taps "Settings" in navigation
2. Can change language (instant update)
3. Can toggle dark mode (instant update)
4. Can insert sample data for testing
5. Can clear all data if needed

**Data Flow:**
```
MobileOptimizedSettings
  ├─> LanguageContext.setLanguage()
  ├─> ThemeContext.toggleTheme()
  └─> MockDataSettings
      └─> Inserts sample sensor/weather/soil data
```

---

## Functionality & Workflow

### Authentication Flow

**Technology:** Supabase Auth (Email/Password)

**Flow:**
```
User enters email + password
  ↓
authService.signIn() / signUp()
  ↓
Supabase validates credentials
  ↓
Session token stored in localStorage
  ↓
User redirected to Dashboard
```

**Components:**
- `SimpleAuthComponent.tsx` - Login/signup forms
- `authService.ts` - Supabase integration

**Features:**
- No email confirmation required (simplified)
- Session persistence across page reloads
- Secure token storage

---

### Sensor Data Management

**Technology:** Supabase PostgreSQL with Row Level Security

**Database Schema:**
```sql
sensor_data (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES auth.users,
  sensor_type: text (soil_moisture, ph, soil_temperature, ec, n, p, k),
  value: numeric,
  unit: text,
  latitude: numeric,
  longitude: numeric,
  timestamp: timestamptz,
  status: text (optimal, warning, critical)
)
```

**Data Flow:**
```
Sensor/Manual Input
  ↓
sensorService.createReading()
  ↓
Supabase Insert with RLS check
  ↓
Real-time subscription updates UI
  ↓
Dashboard refreshes automatically
```

**Status Calculation:**
```typescript
// Example: Soil Moisture
if (value >= 40 && value <= 60) status = 'optimal'
if (value >= 25 && value < 40) || (value > 60 && value <= 75) status = 'warning'
if (value < 25 || value > 75) status = 'critical'
```

---

### Weather Integration

**API:** OpenWeatherMap

**Endpoints Used:**
- `api.openweathermap.org/data/2.5/weather` - Current weather
- `api.openweathermap.org/data/2.5/forecast` - 5-day forecast

**Data Flow:**
```
User location (lat/lon)
  ↓
weatherService.getCurrentWeather(lat, lon)
  ↓
OpenWeatherMap API call
  ↓
Parse temperature, humidity, wind, description
  ↓
Display in WeatherDashboard component
```

**Update Frequency:**
- Auto-refresh every 30 minutes
- Manual refresh via button
- Cached for 15 minutes to reduce API calls

---

### AI Chatbot Workflow

**Technology:** Groq (ultra-fast LLM API)

**Model Used:** `llama-3.1-70b-versatile`

**Flow:**
```
User types question
  ↓
aiService.chat(userMessage, conversationHistory)
  ↓
System prompt added:
  "You are an agricultural advisor helping Indian farmers.
   Provide practical advice in simple language.
   Focus on: crop health, irrigation, fertilizer, pest control."
  ↓
Groq API processes (< 20 seconds)
  ↓
Response displayed in chat bubble
  ↓
Conversation history maintained for context
```

**Features:**
- Context-aware responses
- Bilingual support (detects language)
- Fast response time (Groq's specialty)
- Farming-specific prompts

---

### Localization (i18n)

**Languages Supported:** Hindi (default), English

**Implementation:** React Context API

**Translation Files:** `src/config/languages.ts`

**Total Translation Keys:** 160+

**Usage Example:**
```typescript
const { t, language } = useLanguage();

// In component:
<h1>{t('farmStatus')}</h1>
// Hindi: "खेत की स्थिति"
// English: "Farm Status"
```

**Language Switching:**
- Instant update (no page reload)
- Preference saved to localStorage
- Affects all UI text, buttons, labels

---

### Theme System (Dark Mode)

**Implementation:** React Context + Tailwind CSS

**Mechanism:**
```typescript
// ThemeContext.tsx
const [theme, setTheme] = useState<'light' | 'dark'>('light');

// Applies class to <html> element
document.documentElement.classList.toggle('dark', theme === 'dark');
```

**CSS Strategy:**
```css
/* Light mode (default) */
.bg-gray-100

/* Dark mode */
.dark:bg-gray-900
```

**Features:**
- Instant toggle (no flicker)
- Persisted to localStorage
- Affects all components automatically
- Smooth transitions

---

### Offline Support

**Technology:** Service Workers (via Vite PWA plugin - ready for implementation)

**Current Capabilities:**
- Manual entry saved locally first
- Syncs when connection restored
- Cached UI for instant loading

**Future Enhancements:**
- Full offline sensor data caching
- Background sync for weather updates

---

### Mobile Optimization

**Responsive Design:**
- Mobile-first CSS approach
- Touch-friendly tap targets (min 44px)
- Horizontal scrollable tabs
- Bottom navigation for thumb reach
- Optimized for 360px width minimum

**Performance:**
- Lazy loading for charts
- Image optimization
- Minimal bundle size
- Fast Time to Interactive (<3s on 3G)

**Native Features (via Capacitor):**
- GPS location access
- Camera for field photos (future)
- Push notifications for alerts (future)

---

## Setup & Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v9.0.0 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

Optional (for mobile development):
- **Android Studio** (for Android builds)
- **Java JDK 11+** (required by Capacitor)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/farm-monitoring-system.git
cd farm-monitoring-system
```

---

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`.

---

### Step 3: Environment Variables

Create a `.env` file in the root directory (if not already present):

```bash
touch .env
```

Add the following environment variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenWeatherMap API (optional)
VITE_OPENWEATHER_API_KEY=your_openweather_api_key

# Groq AI API (optional)
VITE_GROQ_API_KEY=your_groq_api_key
```

**How to Get Keys:**

1. **Supabase:**
   - Sign up at [supabase.com](https://supabase.com/)
   - Create a new project
   - Go to Settings → API → Copy URL and anon key

2. **OpenWeatherMap:**
   - Sign up at [openweathermap.org](https://openweathermap.org/api)
   - Subscribe to free tier (1000 calls/day)
   - Copy API key

3. **Groq:**
   - Sign up at [console.groq.com](https://console.groq.com/)
   - Generate API key
   - Copy key

---

### Step 4: Database Setup (Supabase)

Run the following SQL in your Supabase SQL Editor to create required tables:

```sql
-- Enable Row Level Security
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_entries ENABLE ROW LEVEL SECURITY;

-- Sensor Data Table
CREATE TABLE sensor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sensor_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('optimal', 'warning', 'critical'))
);

-- Manual Entries Table
CREATE TABLE manual_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (users can only see their own data)
CREATE POLICY "Users can view own sensor data"
  ON sensor_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sensor data"
  ON sensor_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own manual entries"
  ON manual_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own manual entries"
  ON manual_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

### Step 5: Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173/`

---

### Step 6: Build for Production

```bash
npm run build
```

Production files will be generated in the `dist/` folder.

---

### Step 7: Preview Production Build (Optional)

```bash
npm run preview
```

Preview server starts at `http://localhost:4173/`

---

### Step 8: Build Android App (Optional)

```bash
# Sync web assets with Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android
```

Then build the APK/AAB from Android Studio.

---

## Deployment

### Deploying to Vercel (Recommended)

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com/)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to `main` branch

**Live URL:** `https://your-project.vercel.app`

---

### Deploying to Netlify

1. **Connect Repository:**
   - Go to [netlify.com](https://netlify.com/)
   - Click "Add new site" → "Import an existing project"

2. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Add Environment Variables:**
   - Go to Site settings → Environment variables
   - Add all variables from `.env`

4. **Deploy:**
   - Netlify will build and deploy automatically

**Live URL:** `https://your-project.netlify.app`

---

### Deploying to AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

---

### Deploying Android App to Google Play Store

1. **Build Release APK:**
   - Open project in Android Studio
   - Build → Generate Signed Bundle / APK
   - Create keystore and sign

2. **Upload to Play Console:**
   - Go to [play.google.com/console](https://play.google.com/console/)
   - Create new app
   - Upload signed AAB
   - Fill in store listing details
   - Submit for review

---

### Environment Variables Reference

**Required for Production:**
```env
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Optional (for full functionality):**
```env
VITE_OPENWEATHER_API_KEY=your_openweather_key
VITE_GROQ_API_KEY=your_groq_key
```

**Security Notes:**
- Never commit `.env` file to Git (already in `.gitignore`)
- Use Vercel/Netlify's environment variable UI for secrets
- Rotate keys if accidentally exposed

---

## Contributing

We welcome contributions to improve the Farm Monitoring System!

### How to Contribute

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/farm-monitoring-system.git
   cd farm-monitoring-system
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   **Commit Message Format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Formatting changes
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Go to original repository
   - Click "New Pull Request"
   - Describe your changes

---

### Code Style Guidelines

- **TypeScript:** Use strict type checking
- **React:** Functional components with hooks
- **CSS:** Tailwind utility classes only (no custom CSS)
- **Naming:**
  - Components: PascalCase (`DashboardCard.tsx`)
  - Functions: camelCase (`fetchSensorData()`)
  - Constants: UPPER_SNAKE_CASE (`DEFAULT_LANGUAGE`)
- **File Organization:** Group related components in folders

---

### Testing Guidelines

```bash
# Run linter
npm run lint

# Build test (ensure no errors)
npm run build
```

---

### Reporting Issues

Use GitHub Issues to report bugs or request features:

1. Check existing issues first
2. Use issue templates
3. Provide clear reproduction steps
4. Include screenshots if applicable

---

## Credits

### Open Source Libraries

- **React** - UI framework ([MIT License](https://github.com/facebook/react/blob/main/LICENSE))
- **Vite** - Build tool ([MIT License](https://github.com/vitejs/vite/blob/main/LICENSE))
- **Tailwind CSS** - CSS framework ([MIT License](https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE))
- **Lucide React** - Icon library ([ISC License](https://github.com/lucide-icons/lucide/blob/main/LICENSE))
- **Chart.js** - Charting library ([MIT License](https://github.com/chartjs/Chart.js/blob/master/LICENSE.md))
- **date-fns** - Date utility ([MIT License](https://github.com/date-fns/date-fns/blob/main/LICENSE.md))
- **Capacitor** - Native runtime ([MIT License](https://github.com/ionic-team/capacitor/blob/main/LICENSE))

### Services & APIs

- **Supabase** - Backend platform ([Apache 2.0](https://github.com/supabase/supabase/blob/master/LICENSE))
- **OpenWeatherMap** - Weather data ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/))
- **Groq** - AI inference ([Proprietary](https://groq.com/))

### Design Inspiration

- **Material Design** - Google's design system
- **Tailwind UI** - Component patterns
- **Agricultural Apps** - Domain-specific UX research

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Farm Monitoring System Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**What this means:**
- You can use this commercially
- You can modify the code
- You can distribute copies
- You can use privately
- You must include the license and copyright notice
- No warranty or liability

---

## Support

### Documentation
- **User Guide:** See [Help Page](/help) in the app
- **API Docs:** Check service files in `src/services/`
- **Component Docs:** Inline JSDoc comments in components

### Community
- **GitHub Issues:** Report bugs or request features
- **Discussions:** Ask questions and share ideas

---

## Roadmap

### Version 1.0 (Current)
- Real-time sensor data monitoring
- Weather integration
- Manual data entry
- AI chatbot assistant
- Bilingual support (Hindi/English)
- Dark mode
- Android app

### Version 1.1 (Planned)
- Push notifications for critical alerts
- Historical data charts (30-day trends)
- Crop calendar/planner
- Offline mode with full sync

### Version 2.0 (Future)
- IoT sensor integration (Bluetooth/WiFi)
- Computer vision for crop disease detection
- Community forum for farmers
- Marketplace for seeds/equipment
- iOS app

### Version 2.1 (Future)
- Multi-language support (Punjabi, Tamil, Telugu)
- Voice commands (regional languages)
- Government scheme recommendations
- Weather-based crop suggestions

---

**Built with care for farmers in India**

**Last Updated:** October 2024 | **Version:** 1.0.0
