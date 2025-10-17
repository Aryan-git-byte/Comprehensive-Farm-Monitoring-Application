# 🤖 AI Prompt Structure for Bulk Testing

## Complete Prompt Breakdown

When you upload a CSV and process bulk tests, here's **exactly** what prompt is sent to the AI (LLaMA 3.3 70B) for each test case.

---

## 📋 Example Scenario

**CSV Input:**

```csv
id,latitude,longitude,soil_ph,nitrogen,phosphorus,potassium,crop_type,language
1,28.6139,77.2090,6.5,120,45,180,wheat,en
```

**Auto-Fetched Weather Data:**

- Temperature: 28.5°C
- Humidity: 65%
- Weather: clear sky
- Wind Speed: 12.5 km/h
- Rainfall: 0mm

---

## 🔹 STEP 1: Build User Query

The system first constructs a user query from your CSV data:

```
Provide farming advice based on these parameters. Location: 28.6139, 77.2090, Soil pH: 6.5, Nitrogen: 120 mg/kg, Phosphorus: 45 mg/kg, Potassium: 180 mg/kg, Temperature: 28.5°C, Humidity: 65%, Weather: clear sky, Wind Speed: 12.5 km/h, Crop: wheat
```

**Components:**

- ✅ Base query: "Provide farming advice based on these parameters"
- ✅ Location coordinates (lat, lon)
- ✅ All soil parameters from CSV
- ✅ **Auto-fetched weather data** (temp, humidity, conditions, wind)
- ✅ Crop type
- ✅ Additional rainfall if present

---

## 🔹 STEP 2: Build System Prompt

Then, the system creates a comprehensive **system prompt** that includes:

### **A. Core Role Definition**

**English Version:**

```
You are an Indian agricultural expert with perfect conversation memory. Provide practical and technical advice for summer season during afternoon.
```

**Hindi Version:**

```
आप एक भारतीय कृषि विशेषज्ञ हैं जो पूरी बातचीत का संदर्भ याद रखते हैं। summer के मौसम में afternoon के समय के लिए व्यावहारिक और तकनीकी सलाह दें।
```

### **B. Query Metadata**

```
Query Type: soil_analysis
Urgency Level: medium
Is Follow-up: No
Language: English
```

**Query Types:**

- `irrigation` - Water-related queries
- `health` - Disease/pest issues
- `nutrition` - Fertilizer/nutrient questions
- `harvest` - Harvesting advice
- `weather` - Weather-related
- `soil_analysis` - Soil parameters analysis
- `general` - General farming

**Urgency Levels:**

- `low` - Routine questions
- `medium` - Standard issues
- `high` - Problem situations
- `critical` - Emergency alerts

### **C. Conversation History**

For bulk testing, this is typically empty (new conversation per test):

```
CONVERSATION HISTORY:
(none for first query in bulk testing)
```

### **D. Farmer Profile**

Extracted from CSV or defaults:

```
FARMER PROFILE:
Experience: intermediate
Crop: wheat
Farm Size: (if provided in CSV)
Location: (if location name provided)
```

### **E. Current Sensor Readings**

If there are active sensors in the database:

```
CURRENT SENSOR READINGS:
soil_moisture: 45% (Status: normal, Location: 28.6139, 77.2090)
soil_temperature: 24°C (Status: normal, Location: 28.6139, 77.2090)
```

### **F. Current Weather Conditions**

**From OpenWeather API (Auto-fetched):**

```
CURRENT WEATHER CONDITIONS:
Location Sensor Location: Temperature 28.5°C, Humidity 65%, Wind Speed 12.5km/h, Pressure 1013hPa
```

### **G. Critical Alerts**

If any sensors show critical values:

```
CRITICAL ALERTS:
CRITICAL: soil_moisture showing 15% - requires immediate attention
```

### **H. Ongoing Issues**

Tracked from conversation context:

```
ONGOING ISSUES:
(none for new bulk test conversations)
```

### **I. Previous Recommendations**

From conversation history:

```
PREVIOUS RECOMMENDATIONS:
(none for new bulk test conversations)
```

---

## 🔹 STEP 3: Instructions to AI

The system provides detailed instructions:

```
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

---

## 📨 Complete Example Prompt

Here's what the AI actually receives for a single bulk test:

### **SYSTEM PROMPT:**

```
You are an Indian agricultural expert with perfect conversation memory. Provide practical and technical advice for summer season during afternoon.

Query Type: soil_analysis
Urgency Level: medium
Is Follow-up: No
Language: English

CURRENT SENSOR READINGS:
(if any sensors are active in the database)

CURRENT WEATHER CONDITIONS:
Location 28.6139, 77.2090: Temperature 28.5°C, Humidity 65%, Wind Speed 12.5km/h, Pressure 1013hPa

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

### **USER QUERY:**

```
Provide farming advice based on these parameters. Location: 28.6139, 77.2090, Soil pH: 6.5, Nitrogen: 120 mg/kg, Phosphorus: 45 mg/kg, Potassium: 180 mg/kg, Temperature: 28.5°C, Humidity: 65%, Weather: clear sky, Wind Speed: 12.5 km/h, Crop: wheat
```

---

## 🎯 Key Features of the Prompt

### 1. **Context-Aware**

- Season detection (summer/monsoon/winter)
- Time of day (morning/afternoon/evening/night)
- Regional farming practices

### 2. **Data-Rich**

- Real sensor readings from database
- **Live weather from OpenWeather API**
- Soil parameters from your CSV
- Crop-specific information

### 3. **Structured Output**

- Emoji-enhanced readability
- Clear sections (Main Advice, Immediate Actions, Next Steps)
- Follow-up questions for continuous learning
- Related topics for exploration

### 4. **Safety-Focused**

- Urgency level prioritization
- Critical alert highlighting
- Farmer experience consideration

### 5. **Bilingual Support**

- English (`en`) or Hindi (`hi`)
- Culturally appropriate advice
- Regional context

---

## 🔄 Differences from Regular Chat

| Feature                  | Regular Chat                 | Bulk Testing                 |
| ------------------------ | ---------------------------- | ---------------------------- |
| **Conversation History** | ✅ Full history              | ❌ New conversation per test |
| **User Context**         | ✅ Tracked across messages   | ❌ One-time query            |
| **Follow-ups**           | ✅ Contextual references     | ❌ Independent tests         |
| **Weather Data**         | ✅ Fetched once per location | ✅ Fetched per CSV location  |
| **Sensor Data**          | ✅ Real-time from database   | ✅ Real-time from database   |
| **Processing**           | 🔄 Interactive               | 📊 Batch sequential          |

---

## 📊 Query Type Detection

The system automatically detects query type based on keywords:

```javascript
// English & Hindi keywords
'water', 'irrigation', 'पानी', 'सिंचाई'        → irrigation
'disease', 'health', 'बीमारी', 'स्वास्थ्य'      → health
'fertilizer', 'nutrition', 'खाद', 'पोषण'       → nutrition
'weather', 'rain', 'मौसम', 'बारिश'              → weather
'soil', 'मिट्टी'                                → soil_analysis
'harvest', 'crop', 'फसल'                       → harvest
```

For bulk testing with soil parameters, it typically defaults to `soil_analysis`.

---

## 🌤️ Weather Integration Flow

```
CSV Row → Extract (lat, lon)
    ↓
OpenWeather API Call
    ↓
Fetch: temp, humidity, conditions, wind, rainfall
    ↓
Merge with soil data from CSV
    ↓
Build comprehensive query
    ↓
Send to AI with full context
```

---

## 💡 Pro Tips

### **For Better Bulk Testing Results:**

1. **Provide Accurate Coordinates**

   - Weather accuracy depends on location precision
   - Use decimal format (e.g., 28.6139)

2. **Include All Soil Parameters**

   - More data = better AI analysis
   - pH, NPK values highly valuable

3. **Specify Crop Type**

   - Enables crop-specific recommendations
   - Considers growth stages

4. **Use Custom Queries**

   - Override default query with `customQuery` field
   - Ask specific questions

5. **Test Language Variations**
   - Compare English vs Hindi responses
   - Cultural context differences

---

## 🧪 Testing the Prompt

Want to see the actual prompt? Add console logging:

```typescript
// In aiService.ts, callOpenRouterAPI method
console.log("=== SYSTEM PROMPT ===");
console.log(systemPrompt);
console.log("=== USER QUERY ===");
console.log(userQuery);
```

Then check browser console while processing bulk tests!

---

## 📝 Sample AI Response

Based on the prompt above, the AI might respond:

```
🌱 **Main Advice**: Your wheat crop in Delhi region shows good soil pH (6.5)
and adequate nitrogen levels (120 mg/kg). The current clear weather with
moderate temperature (28.5°C) and humidity (65%) is ideal for wheat growth
during this season.

⚡ **Immediate Actions**:
- Monitor soil moisture levels - clear weather may increase irrigation needs
- Consider phosphorus supplementation (current 45 mg/kg is moderate)
- Inspect for any pest activity given the favorable weather

📅 **Next Steps**:
- Plan for top-dressing with nitrogen after 3-4 weeks if needed
- Increase potassium application (current 180 mg/kg is good but wheat benefits from more)
- Schedule irrigation based on soil moisture and weather forecasts

❓ **Follow-up Questions**:
- What growth stage is your wheat currently in?
- Have you noticed any yellowing of leaves?
- What's your current irrigation schedule?

🔗 **Related Topics**:
- Wheat disease management in clear weather
- Optimal irrigation timing for wheat
- Nutrient management for higher yield
```

---

**Model**: LLaMA 3.3 70B Instruct  
**API**: OpenRouter  
**Weather Source**: OpenWeather API  
**Context**: Real-time sensors + Live weather + CSV data
