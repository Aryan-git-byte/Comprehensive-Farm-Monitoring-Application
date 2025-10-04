# Farm Monitoring System

A comprehensive, production-ready farm monitoring web application built with React, TypeScript, and Supabase. This platform provides real-time sensor data visualization, manual data entry capabilities, and an intuitive interface designed specifically for agricultural operations.

## 🌟 Features

### Core Functionality
- **Real-time Dashboard**: Live sensor data with auto-refresh every 30 seconds
- **Manual Data Entry**: Forms for water quality, fertilizer applications, and custom farm data
- **Responsive Design**: Mobile-first approach supporting all device sizes
- **Real-time Updates**: Supabase subscriptions for live data streaming
- **Interactive Charts**: Chart.js integration for data visualization
- **Status Monitoring**: Color-coded indicators (optimal/warning/critical)

### Technical Features
- **Authentication**: Secure user authentication with Supabase Auth
- **Database Integration**: Complete CRUD operations with Row Level Security
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Professional loading spinners and skeleton screens
- **Accessibility**: ARIA labels and keyboard navigation support

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- A Supabase account and project

### Installation

1. **Clone and setup the project:**
   ```bash
   npm install
   ```

2. **Configure Supabase:**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key to the `.env` file

3. **Set up the database:**
   - Run the migration file in your Supabase SQL editor:
     - Copy and execute the contents of `supabase/migrations/create_farm_monitoring_schema.sql`

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Create an account and explore:**
   - Sign up for a new account
   - Use the "Insert Sample Data" button in Settings to populate with demo data
   - Explore the dashboard and manual entry features

## 📊 Database Schema

### Tables Created

#### `sensor_data`
- Stores all sensor readings (moisture, pH, temperature, humidity, nutrients)
- Includes status classification and location tracking
- Optimized with indexes for performance

#### `manual_entries`
- Stores user-entered observations and measurements
- Flexible JSONB data field for different entry types
- Supports water quality, fertilizer, weather, and custom entries

#### `farm_settings`
- User-specific application preferences
- Notification settings and display preferences

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Proper authentication policies implemented

## 🎨 Design System

### Color Palette
- **Primary Green**: #22C55E (optimal status)
- **Secondary Blue**: #3B82F6 (info and links)
- **Warning Yellow**: #F59E0B (warning status)
- **Critical Red**: #EF4444 (critical status)
- **Neutral Grays**: #F9FAFB to #111827

### Typography
- Clean, readable fonts with proper line heights
- Consistent heading hierarchy
- Responsive text sizing

### Components
- Card-based layouts with subtle shadows
- Consistent 8px spacing system
- Smooth transitions and hover states
- Mobile-optimized touch targets

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px+ (single column layouts)
- **Tablet**: 768px+ (2-column grids)
- **Desktop**: 1024px+ (multi-column layouts)

### Features
- Collapsible navigation on mobile
- Optimized charts for small screens
- Touch-friendly form controls
- Readable text at all sizes

## 🔧 Configuration Options

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Customizable Settings
- Auto-refresh intervals (15s to 5min)
- Temperature units (Celsius/Fahrenheit)
- Date formats (MM/DD/YYYY, DD/MM/YYYY, ISO)
- Notification preferences
- Timezone settings

## 📈 Sample Data

The system includes realistic sample data generation for:
- **Soil Moisture**: 20-80% with location-based variations
- **pH Levels**: 4.0-8.5 with optimal ranges
- **Temperature**: 10-35°C with diurnal patterns
- **Humidity**: 30-90% with weather correlations
- **Nutrients**: NPK levels with agricultural standards

## 🔒 Security Features

### Authentication
- Email/password authentication via Supabase Auth
- Secure session management
- Automatic token refresh

### Data Protection
- Row Level Security policies
- User data isolation
- Secure API endpoints
- Input validation and sanitization

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Netlify**: Direct GitHub integration
- **Vercel**: Optimized for React applications
- **Supabase Hosting**: Integrated with your database

### Environment Setup
1. Set production environment variables
2. Configure Supabase project for production
3. Set up custom domain (optional)
4. Configure SSL certificates

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard and charts
│   ├── Layout/         # Navigation and layout
│   ├── ManualEntry/    # Data entry forms
│   ├── Common/         # Reusable components
│   └── Tabs/           # Tab content components
├── services/           # Business logic and API calls
├── config/             # Configuration and types
└── App.tsx            # Main application component
```

### Key Technologies
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Charts**: Chart.js with React integration
- **Backend**: Supabase (Database + Auth + Real-time)
- **Build Tool**: Vite
- **Icons**: Lucide React

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 📝 Future Enhancements

### Planned Features
- **AI Chatbot Integration**: Dialogflow/Microsoft Bot Framework
- **ESP32 Sensor Integration**: Hardware sensor connectivity
- **Advanced Analytics**: Predictive modeling and trends
- **Mobile App**: React Native companion app
- **Multi-farm Support**: Manage multiple farm locations
- **API Integration**: Weather services and market data

### Extension Points
- Custom sensor types
- Advanced data visualization
- Export capabilities (PDF, CSV)
- Automated alerts and notifications
- Integration with farm management systems

## 🤝 Contributing

This is a demonstration project showcasing modern web development practices for agricultural applications. The codebase serves as a foundation for building production farm monitoring systems.

### Best Practices Demonstrated
- Clean, modular architecture
- Comprehensive error handling
- Responsive design principles
- Real-time data management
- Secure authentication patterns
- Accessible UI components

## 📄 License

This project is provided as a demonstration of modern web development techniques for agricultural applications. Feel free to use the code as a reference for your own farm monitoring solutions.

## 🆘 Support

For questions about implementation or extending this system:
1. Check the inline code comments for detailed explanations
2. Review the database schema documentation
3. Examine the component structure and service patterns
4. Test the real-time functionality with sample data

The system is designed to be self-documenting with clear naming conventions and comprehensive TypeScript types for better development experience.