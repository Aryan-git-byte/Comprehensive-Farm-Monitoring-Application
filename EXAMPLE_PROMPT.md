# 🎯 Exact AI Prompt for Your Example Data

## Your CSV Input:

```csv
id,latitude,longitude,soil_moisture,soil_ph,nitrogen,phosphorus,potassium,crop_type,language
1,28.6139,77.209,45,6.5,120,45,180,wheat,en
```

---

## 🔄 Processing Flow

### **Step 1: Weather Data Auto-Fetch**

System calls OpenWeather API with:

- Latitude: `28.6139`
- Longitude: `77.209`

**Returns (example for Delhi):**

```json
{
  "temperature": 28.5,
  "humidity": 65,
  "weather_condition": "Clear",
  "weather_description": "clear sky",
  "wind_speed": 12.5,
  "wind_direction": 270,
  "pressure": 1013,
  "rainfall": 0,
  "visibility": 10000
}
```

### **Step 2: Build User Query**

The system constructs this query string:

```
Provide farming advice based on these parameters. Location: 28.6139, 77.209, Soil Moisture: 45%, Soil pH: 6.5, Nitrogen: 120 mg/kg, Phosphorus: 45 mg/kg, Potassium: 180 mg/kg, Temperature: 28.5°C, Humidity: 65%, Weather: clear sky, Wind Speed: 12.5 km/h, Crop: wheat
```

---

## 📨 EXACT PROMPT SENT TO AI

The AI (LLaMA 3.3 70B) receives TWO messages:

### **MESSAGE 1: SYSTEM PROMPT**

```
You are an Indian agricultural expert with perfect conversation memory. Provide practical and technical advice for summer season during afternoon.

Query Type: soil_analysis
Urgency Level: medium
Is Follow-up: No
Language: English

CURRENT SENSOR READINGS:
soil_moisture: 45% (Status: normal, Location: 28.6139, 77.2090)
[Note: If you have active sensors in database, they appear here]

CURRENT WEATHER CONDITIONS:
Location Sensor Location: Temperature 28.5°C, Humidity 65%, Wind Speed 12.5km/h, Pressure 1013hPa

FARMER PROFILE:
Experience: intermediate
Crop: wheat

INSTRUCTIONS:
- Remember and reference the conversation history when relevant
- If this is a follow-up question, connect your answer to previous discussions
- Provide detailed, actionable advice based on real-time data and conversation context
- Address critical alerts with highest priority
- Consider the farmer's experience level and provide appropriate detail
- Include specific recommendations with quantities, timing, and methods
- Suggest follow-up questions or next steps when appropriate
- Respond in English language
- Use emojis to make the advice more readable and engaging
- Structure your response clearly with sections when appropriate

FORMAT YOUR RESPONSE AS:
🌱 **Main Advice**: [Your detailed recommendation]
⚡ **Immediate Actions**: [What to do right now]
📅 **Next Steps**: [What to plan for coming days/weeks]
❓ **Follow-up Questions**: [Questions to help farmer better, if any]
🔗 **Related Topics**: [Other areas farmer might want to explore]
```

### **MESSAGE 2: USER QUERY**

```
Provide farming advice based on these parameters. Location: 28.6139, 77.209, Soil Moisture: 45%, Soil pH: 6.5, Nitrogen: 120 mg/kg, Phosphorus: 45 mg/kg, Potassium: 180 mg/kg, Temperature: 28.5°C, Humidity: 65%, Weather: clear sky, Wind Speed: 12.5 km/h, Crop: wheat
```

---

## 🧠 What the AI Knows

From your CSV row, the AI receives:

| Data Point            | Value                     | Source                               |
| --------------------- | ------------------------- | ------------------------------------ |
| **Location**          | 28.6139, 77.209 (Delhi)   | Your CSV                             |
| **Soil Moisture**     | 45%                       | Your CSV                             |
| **Soil pH**           | 6.5                       | Your CSV                             |
| **Nitrogen (N)**      | 120 mg/kg                 | Your CSV                             |
| **Phosphorus (P)**    | 45 mg/kg                  | Your CSV                             |
| **Potassium (K)**     | 180 mg/kg                 | Your CSV                             |
| **Crop Type**         | wheat                     | Your CSV                             |
| **Language**          | English                   | Your CSV                             |
| **Temperature**       | 28.5°C                    | 🌐 **Auto-fetched from OpenWeather** |
| **Humidity**          | 65%                       | 🌐 **Auto-fetched from OpenWeather** |
| **Weather Condition** | clear sky                 | 🌐 **Auto-fetched from OpenWeather** |
| **Wind Speed**        | 12.5 km/h                 | 🌐 **Auto-fetched from OpenWeather** |
| **Pressure**          | 1013 hPa                  | 🌐 **Auto-fetched from OpenWeather** |
| **Rainfall**          | 0 mm                      | 🌐 **Auto-fetched from OpenWeather** |
| **Season**            | summer/monsoon/winter     | 🤖 **Auto-detected from date**       |
| **Time Context**      | morning/afternoon/evening | 🤖 **Auto-detected from time**       |
| **Query Type**        | soil_analysis             | 🤖 **Auto-classified**               |
| **Urgency**           | medium                    | 🤖 **Auto-assessed**                 |

---

## 💬 Sample AI Response

Based on this exact prompt, the AI would respond something like:

```
🌱 **Main Advice**: Your wheat crop in the Delhi region (28.61°N, 77.21°E)
is showing favorable conditions. The soil pH of 6.5 is ideal for wheat
cultivation, and your nitrogen level of 120 mg/kg is adequate for the current
growth stage. The soil moisture at 45% is good, and the clear weather with
moderate temperature (28.5°C) supports healthy growth.

However, your phosphorus level at 45 mg/kg is on the lower side for wheat,
and could benefit from supplementation to optimize yield.

⚡ **Immediate Actions**:
1. Apply phosphorus fertilizer - Add 20-25 kg/acre of Single Super Phosphate
   (SSP) or 10-12 kg/acre of Di-Ammonium Phosphate (DAP)
2. Monitor soil moisture - With clear weather and 65% humidity, check soil
   moisture every 2-3 days
3. Inspect for pest activity - Clear, moderate weather is ideal for aphids
   and other wheat pests

📅 **Next Steps** (Next 2-4 weeks):
1. Plan nitrogen top-dressing if wheat is in tillering stage - Apply 30-40 kg
   N/acre as urea 25-30 days after sowing
2. Schedule irrigation based on growth stage:
   - Crown root initiation: Critical irrigation period
   - Tillering stage: Maintain 50-60% soil moisture
3. Consider foliar spray of micronutrients (Zinc, Iron) if any deficiency
   symptoms appear
4. Keep monitoring weather - Wind speed of 12.5 km/h is moderate; watch for
   any sudden changes

❓ **Follow-up Questions**:
1. What is the current growth stage of your wheat crop? (Germination,
   Tillering, Stem elongation, or Heading?)
2. When did you sow the wheat? This will help determine the next fertilizer
   application timing
3. Are you observing any yellowing of leaves or stunted growth?
4. What is your current irrigation schedule and method (flood/drip/sprinkler)?
5. Have you applied any fertilizer since sowing?

🔗 **Related Topics**:
- Optimal NPK ratio for wheat at different growth stages
- Integrated Pest Management for wheat in Delhi region
- Water management strategies for wheat in October-November period
- Phosphorus mobilization in soil and its importance for root development
- Weather-based irrigation scheduling for wheat
```

---

## 🎯 Key Points

### **What AI KNOWS:**

✅ Your exact soil parameters (moisture, pH, NPK)  
✅ **Live weather data** for your location  
✅ Crop type and regional context  
✅ Season and time of day  
✅ Indian agricultural practices

### **What AI DOESN'T KNOW:**

❌ Exact field size (unless you add it to CSV)  
❌ Previous fertilizer applications  
❌ Current growth stage  
❌ Your specific farming practices  
❌ Historical data from this field

### **What Makes This Powerful:**

🌟 Combines YOUR soil data with LIVE weather  
🌟 Provides context-specific advice  
🌟 Uses real-time information  
🌟 Structured, actionable recommendations  
🌟 Follow-up questions to refine advice

---

## 🔬 Behind the Scenes

### Query Type Classification:

```javascript
// Your data triggers "soil_analysis" because:
- Contains soil parameters (pH, NPK, moisture) ✓
- No disease/pest keywords
- No irrigation-specific questions
- No weather emergency keywords
```

### Urgency Assessment:

```javascript
// Urgency = "medium" because:
- No critical sensor alerts
- Soil parameters in normal range
- No emergency keywords
- Standard farming advice request
```

### Season Detection:

```javascript
// Auto-detected based on current date (October 16):
const month = new Date().getMonth(); // October = 9
// Result: "winter" (October-January in India)
// Note: Sample showed "summer" - actual would be based on real date
```

---

## 📊 Data Flow Visualization

```
Your CSV Row
     ↓
[1, 28.6139, 77.209, 45, 6.5, 120, 45, 180, wheat, en]
     ↓
     ├─→ Soil Data: pH 6.5, N 120, P 45, K 180, Moisture 45%
     ├─→ Location: 28.6139, 77.209
     ├─→ Crop: wheat
     └─→ Language: en
     ↓
OpenWeather API Call → Returns live weather data
     ↓
Merge: Soil + Weather + Context
     ↓
Build Prompt:
  - System: Role, instructions, format requirements
  - User: "Provide advice for [all combined data]"
     ↓
Send to LLaMA 3.3 70B via OpenRouter API
     ↓
AI processes with full context
     ↓
Returns structured advice with emojis
     ↓
Parsed & stored in result object
     ↓
Added to CSV/JSON export
```

---

## 🧪 Want to See the Raw Prompt?

Add this to your browser console while testing:

```javascript
// The actual API call is in aiService.ts
// You can see network requests in DevTools:
// 1. Open Developer Tools (F12)
// 2. Go to Network tab
// 3. Filter by "openrouter.ai"
// 4. Click on request
// 5. View "Payload" to see exact prompt sent
```

---

**Result**: The AI receives a comprehensive, context-rich prompt that combines your soil data with real-time weather, enabling it to provide accurate, actionable farming advice! 🌾
