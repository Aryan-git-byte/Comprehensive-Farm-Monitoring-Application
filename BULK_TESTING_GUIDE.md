# 🧪 AI Bulk Testing Guide

## Overview

The bulk testing feature allows you to test hundreds of soil samples with AI-powered agricultural advice. The system automatically fetches real-time weather data from OpenWeather API for each location.

## 🌐 Accessing the Test Page

Navigate to: `/test-ai` (Hidden route - not visible in navigation)

## ✨ Key Features

### 1. **Automatic Weather Data Fetching**

- 🌤️ Weather data is **automatically fetched** from OpenWeather API
- No need to include temperature, humidity, or weather conditions in CSV
- Data includes:
  - Current temperature (°C)
  - Humidity (%)
  - Weather conditions & description
  - Wind speed (km/h)
  - Rainfall (mm) if any

### 2. **CSV Input Format**

#### Minimal Required Fields:

```csv
id,latitude,longitude,crop_type
1,28.6139,77.2090,wheat
```

#### Recommended Fields:

```csv
id,latitude,longitude,soil_moisture,soil_ph,nitrogen,phosphorus,potassium,crop_type,language
1,28.6139,77.2090,45,6.5,120,45,180,wheat,en
2,19.0760,72.8777,35,7.2,95,38,150,rice,hi
```

#### CSV Headers Explained:

| Header          | Required | Description                 | Example                      |
| --------------- | -------- | --------------------------- | ---------------------------- |
| `id`            | Yes      | Unique test case identifier | `1`, `test_001`              |
| `latitude`      | **Yes**  | Latitude for weather fetch  | `28.6139`                    |
| `longitude`     | **Yes**  | Longitude for weather fetch | `77.2090`                    |
| `soil_moisture` | No       | Soil moisture percentage    | `45`                         |
| `soil_ph`       | No       | Soil pH value               | `6.5`                        |
| `nitrogen`      | No       | Nitrogen content (mg/kg)    | `120`                        |
| `phosphorus`    | No       | Phosphorus content (mg/kg)  | `45`                         |
| `potassium`     | No       | Potassium content (mg/kg)   | `180`                        |
| `crop_type`     | No       | Crop type                   | `wheat`, `rice`, `tomato`    |
| `language`      | No       | Response language           | `en` or `hi` (default: `en`) |

### 3. **Processing Flow**

```
1. Upload CSV
   ↓
2. Parse CSV data
   ↓
3. For each row:
   a. Fetch weather from OpenWeather API (lat/lon)
   b. Build comprehensive query (soil + weather)
   c. Send to AI (LLaMA 3.3 70B)
   d. Receive AI analysis & recommendations
   ↓
4. Export results as CSV or JSON
```

### 4. **Output Format**

#### CSV Output Includes:

- All input soil parameters
- **Auto-fetched weather data:**
  - Weather Temperature (°C)
  - Weather Humidity (%)
  - Weather Condition
  - Weather Description
  - Wind Speed (km/h)
  - Rainfall (mm)
- AI-generated query
- Full AI response text
- Confidence score
- Response time (ms)
- Structured recommendations:
  - Immediate actions
  - Next steps
  - Follow-up questions
  - Related topics
- Error messages (if any)
- Timestamp

#### JSON Output Structure:

```json
[
  {
    "id": "1",
    "input": {
      "latitude": 28.6139,
      "longitude": 77.209,
      "soilPH": 6.5,
      "soilNitrogen": 120,
      "cropType": "wheat"
    },
    "weatherData": {
      "temperature": 28.5,
      "humidity": 65,
      "weather_condition": "Clear",
      "weather_description": "clear sky",
      "wind_speed": 12.5,
      "rainfall": 0
    },
    "query": "Provide farming advice based on these parameters...",
    "response": "🌱 **Main Advice**: Based on your wheat crop...",
    "confidence": 0.9,
    "responseTime": 2345,
    "recommendations": {
      "immediate": ["Check irrigation schedule"],
      "shortTerm": ["Apply nitrogen fertilizer"]
    }
  }
]
```

## 🚀 Usage Instructions

### Step 1: Prepare Your CSV

Create a CSV file with your test data. **Important:** Only include soil parameters and coordinates - weather will be auto-fetched!

### Step 2: Access Test Page

Navigate to `/test-ai` in your browser

### Step 3: Download Sample (Optional)

Click "Download Sample CSV Template" to see the correct format with 10 sample locations across India

### Step 4: Upload CSV

Drag & drop or click to upload your CSV file

### Step 5: Start Processing

Click "Start Processing Tests" button

### Step 6: Monitor Progress

- Watch the progress bar
- See real-time statistics update
- View results appearing in the table
- Weather data is being fetched for each location (indicated by animated icon)

### Step 7: Download Results

Choose format:

- **CSV** - For Excel/spreadsheet analysis
- **JSON** - For programmatic processing

## 💡 Tips & Best Practices

### For Best Results:

1. **Provide accurate coordinates** - Weather accuracy depends on location
2. **Include all available soil parameters** - More data = better advice
3. **Specify crop type** - Enables crop-specific recommendations
4. **Test with small batches first** - Verify format before large batches
5. **Use meaningful IDs** - Makes results easier to track

### Performance:

- **Processing Speed**: ~2-3 seconds per test case
- **Rate Limiting**: 500ms delay between requests (built-in)
- **Recommended Batch Size**: 100-500 tests at a time
- **Weather API**: Uses caching to minimize API calls

### Error Handling:

- If weather fetch fails for a location, processing continues without weather data
- Failed tests are marked with error status and error message
- Can stop processing mid-way with "Stop Processing" button

## 📊 Statistics Dashboard

Real-time metrics shown:

- **Total Tests** - Number of tests completed
- **Successful** - Tests completed successfully
- **Failed** - Tests with errors
- **Avg Response Time** - Average processing time per test

## 🌍 Sample Locations (Included in Template)

The sample CSV includes diverse locations across India:

1. **Delhi** (28.6139, 77.2090) - Northern plains
2. **Mumbai** (19.0760, 72.8777) - Coastal region
3. **Chennai** (13.0827, 80.2707) - Southern coastal
4. **Kolkata** (22.5726, 88.3639) - Eastern region
5. **Ahmedabad** (23.0225, 72.5714) - Western region
6. **Kota** (26.9124, 75.7873) - Rajasthan
7. **Bangalore** (12.9716, 77.5946) - Southern plateau
8. **Hyderabad** (17.3850, 78.4867) - Deccan plateau
9. **Nagpur** (21.1458, 79.0882) - Central India
10. **Varanasi** (25.3176, 82.9739) - Eastern plains

## 🔧 Technical Details

### Weather Data Source

- **API**: OpenWeather API
- **Endpoint**: Current Weather Data
- **Caching**: 30-minute cache per location
- **Units**: Metric (Celsius, km/h, mm)
- **Language**: English & Hindi support

### AI Model

- **Model**: LLaMA 3.3 70B Instruct
- **Provider**: OpenRouter API
- **Intelligence Level**: Advanced
- **Context**: Full conversation context + real-time data

### Data Storage

- Conversation history saved to Supabase
- AI logs tracked for performance monitoring
- Weather data cached in database

## 🎯 Use Cases

1. **Research Projects** - Analyze AI recommendations across regions
2. **Farm Planning** - Get advice for multiple plots
3. **Seasonal Analysis** - Test conditions across different times
4. **Crop Comparison** - Compare recommendations for different crops
5. **Quality Assurance** - Verify AI response quality and consistency

## 🐛 Troubleshooting

### Common Issues:

**CSV Upload Fails:**

- Check CSV format matches template
- Ensure headers are correct (case-insensitive)
- Remove any special characters or empty rows

**Weather Data Not Fetched:**

- Verify latitude/longitude are valid
- Check OpenWeather API key in `.env` file
- Network connectivity required

**Processing Stops:**

- Check browser console for errors
- Verify OpenRouter API key is valid
- Try smaller batch sizes

**Slow Processing:**

- Normal: ~2-3 seconds per test
- Weather API calls add ~500ms per location
- Can process in background tab

## 📝 Notes

- Hidden route: Not accessible from navigation menu
- Production ready: Includes error handling and rate limiting
- Scalable: Can handle hundreds of tests per session
- Real-time: Weather data is fetched live for each location
- Bilingual: Supports English (`en`) and Hindi (`hi`) responses

---

**Created for**: Comprehensive Farm Monitoring Application  
**Feature**: AI Bulk Testing with Auto Weather Fetching  
**Date**: October 2025
