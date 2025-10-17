# 🔄 AI Bulk Testing - System Flow Diagram

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER UPLOADS CSV FILE                            │
│                                                                         │
│  id,latitude,longitude,soil_ph,nitrogen,phosphorus,potassium,crop     │
│  1,28.6139,77.2090,6.5,120,45,180,wheat                              │
│  2,19.0760,72.8777,7.2,95,38,150,rice                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        CSV PARSER                                       │
│  • Reads CSV file                                                       │
│  • Extracts headers (case-insensitive)                                 │
│  • Parses each row into BulkTestCase                                   │
│  • Validates data types                                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    BULK QUERY PROCESSOR                                 │
│  FOR EACH TEST CASE:                                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
    ┌───────────────────────────┐   ┌───────────────────────────┐
    │  WEATHER DATA FETCHER     │   │   SOIL DATA PROCESSOR     │
    │                           │   │                           │
    │  📍 Location:             │   │  📊 Parameters:           │
    │     Lat: 28.6139          │   │     • Soil pH: 6.5       │
    │     Lon: 77.2090          │   │     • Nitrogen: 120      │
    │                           │   │     • Phosphorus: 45     │
    │  🌐 API Call:             │   │     • Potassium: 180     │
    │     OpenWeather API       │   │     • Crop: wheat        │
    │                           │   │                           │
    │  ⚡ Returns:              │   └───────────────────────────┘
    │     • Temp: 28.5°C        │                │
    │     • Humidity: 65%       │                │
    │     • Condition: Clear    │                │
    │     • Wind: 12.5 km/h     │                │
    │     • Rainfall: 0mm       │                │
    └───────────────────────────┘                │
                    │                            │
                    └────────────┬───────────────┘
                                 ▼
            ┌─────────────────────────────────────┐
            │     QUERY BUILDER                   │
            │                                     │
            │  Combines:                          │
            │  • Soil parameters                  │
            │  • Weather data (auto-fetched)      │
            │  • Crop information                 │
            │  • Location context                 │
            │                                     │
            │  Generated Query:                   │
            │  "Provide farming advice based on   │
            │   these parameters. Location:       │
            │   28.6139, 77.2090, Soil pH: 6.5,  │
            │   Nitrogen: 120 mg/kg, Temperature: │
            │   28.5°C, Humidity: 65%, Weather:   │
            │   clear sky, Crop: wheat"           │
            └─────────────────────────────────────┘
                                 │
                                 ▼
            ┌─────────────────────────────────────┐
            │      AI PROCESSING                  │
            │                                     │
            │  🤖 Model: LLaMA 3.3 70B Instruct  │
            │  🔗 API: OpenRouter                 │
            │                                     │
            │  Context Includes:                  │
            │  • Season (auto-detected)           │
            │  • Time of day                      │
            │  • Regional farming practices       │
            │  • Crop-specific knowledge          │
            │  • Weather patterns                 │
            │                                     │
            │  Generates:                         │
            │  • Main advice                      │
            │  • Immediate actions                │
            │  • Next steps                       │
            │  • Follow-up questions              │
            │  • Related topics                   │
            └─────────────────────────────────────┘
                                 │
                                 ▼
            ┌─────────────────────────────────────┐
            │    RESPONSE PARSER                  │
            │                                     │
            │  Extracts:                          │
            │  ✓ Main advice text                 │
            │  ✓ Immediate actions list           │
            │  ✓ Short-term steps                 │
            │  ✓ Long-term recommendations        │
            │  ✓ Follow-up questions              │
            │  ✓ Related topics                   │
            └─────────────────────────────────────┘
                                 │
                                 ▼
            ┌─────────────────────────────────────┐
            │    RESULT BUILDER                   │
            │                                     │
            │  Creates BulkTestResult:            │
            │  {                                  │
            │    id: "1",                         │
            │    input: {...soil data...},        │
            │    weatherData: {...weather...},    │
            │    query: "...",                    │
            │    response: "🌱 Main Advice...",   │
            │    confidence: 0.9,                 │
            │    responseTime: 2345ms,            │
            │    recommendations: {...},          │
            │    status: "success"                │
            │  }                                  │
            └─────────────────────────────────────┘
                                 │
                                 ▼
            ┌─────────────────────────────────────┐
            │    PROGRESS TRACKER                 │
            │                                     │
            │  Updates UI:                        │
            │  📊 Progress: 1/100 complete        │
            │  ⏱️ Avg Time: 2.3s per test        │
            │  ✅ Successful: 1                   │
            │  ❌ Failed: 0                       │
            │                                     │
            │  Adds 500ms delay to avoid         │
            │  rate limiting                      │
            └─────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            REPEAT FOR NEXT TEST CASE         │
                    │                         │
                    └─────────┬───────────────┘
                              ▼
            ┌─────────────────────────────────────┐
            │   ALL TESTS COMPLETE                │
            │                                     │
            │   📊 Statistics:                    │
            │      • Total: 100                   │
            │      • Successful: 98               │
            │      • Failed: 2                    │
            │      • Avg Time: 2.4s               │
            └─────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
    ┌──────────────────────┐    ┌──────────────────────┐
    │   CSV EXPORTER       │    │   JSON EXPORTER      │
    │                      │    │                      │
    │  Generates:          │    │  Generates:          │
    │  • All input data    │    │  • Structured JSON   │
    │  • Weather data      │    │  • Full objects      │
    │  • AI responses      │    │  • Nested data       │
    │  • Recommendations   │    │  • Easy parsing      │
    │  • Statistics        │    │  • API-ready         │
    │                      │    │                      │
    │  Format:             │    │  Format:             │
    │  Excel-compatible    │    │  Programmatic use    │
    └──────────────────────┘    └──────────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
            ┌─────────────────────────────────────┐
            │      DOWNLOAD TO USER               │
            │                                     │
            │  📥 results-2025-10-16.csv          │
            │  📥 results-2025-10-16.json         │
            └─────────────────────────────────────┘
```

## Weather Fetch Detail

```
┌──────────────────────────────────────────────────┐
│  WEATHER DATA FETCHING (Per Location)           │
└──────────────────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │  Check Cache                  │
    │  (30-minute TTL)              │
    └───────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼ CACHE HIT             ▼ CACHE MISS
    ┌─────────┐             ┌──────────────────┐
    │ Return  │             │ Call OpenWeather │
    │ Cached  │             │ API              │
    │ Data    │             │                  │
    └─────────┘             │ • lat: 28.6139   │
                            │ • lon: 77.2090   │
                            │ • units: metric  │
                            │                  │
                            └──────────────────┘
                                    │
                                    ▼
                            ┌──────────────────┐
                            │ Parse Response   │
                            │                  │
                            │ • temperature    │
                            │ • humidity       │
                            │ • conditions     │
                            │ • wind           │
                            │ • rainfall       │
                            └──────────────────┘
                                    │
                                    ▼
                            ┌──────────────────┐
                            │ Save to Cache    │
                            └──────────────────┘
                                    │
                                    ▼
                            ┌──────────────────┐
                            │ Return Weather   │
                            │ Data Object      │
                            └──────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────┐
│  ERROR HANDLING AT EACH STAGE                   │
└─────────────────────────────────────────────────┘

CSV Parsing Error
    ↓
❌ Show error message
    ↓
Allow re-upload

Weather Fetch Error
    ↓
⚠️ Log warning
    ↓
Continue without weather data
    ↓
Use manual temp/humidity if provided

AI API Error
    ↓
❌ Mark test as failed
    ↓
Store error message
    ↓
Continue to next test

Network Error
    ↓
⚠️ Retry once
    ↓
If still fails, mark as error
    ↓
Continue processing
```

## Performance Optimization

```
┌─────────────────────────────────────────────────┐
│  OPTIMIZATION STRATEGIES                        │
└─────────────────────────────────────────────────┘

1. Weather Caching
   • Cache duration: 30 minutes
   • Reduces API calls for same location
   • Stored in Supabase database

2. Rate Limiting
   • 500ms delay between tests
   • Prevents API throttling
   • Ensures stable processing

3. Parallel Processing Potential
   • Currently sequential for reliability
   • Can be parallelized (5 at a time)
   • Future enhancement

4. Progress Tracking
   • Real-time UI updates
   • Non-blocking operations
   • Responsive user experience

5. Error Recovery
   • Graceful failure handling
   • Continue processing on errors
   • Detailed error reporting
```

---

**System Architecture**: Modular & Scalable  
**Processing Model**: Sequential with rate limiting  
**Weather Integration**: Real-time with caching  
**Error Strategy**: Continue on failure  
**Export Formats**: CSV & JSON
