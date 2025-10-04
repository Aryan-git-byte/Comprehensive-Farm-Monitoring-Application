/*
  # Farm Monitoring System Database Schema

  1. New Tables
    - `sensor_data` - Stores IoT sensor readings with location data
    - `api_data` - Stores external API data (weather, soil analysis)
    - `manual_entries` - User-entered observations and measurements
    - `ai_log` - AI chatbot interaction history

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data

  3. Indexes
    - Optimize queries with proper indexing on timestamp and location columns
*/

-- Create sensor_data table
CREATE TABLE IF NOT EXISTS sensor_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  latitude decimal(10,8),
  longitude decimal(11,8),
  soil_moisture decimal(5,2),
  ec decimal(6,3),
  soil_temperature decimal(5,2),
  n decimal(8,2),
  p decimal(8,2),
  k decimal(8,2),
  ph decimal(4,2),
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- Create api_data table
CREATE TABLE IF NOT EXISTS api_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  api_source text NOT NULL,
  data jsonb NOT NULL,
  latitude decimal(10,8),
  longitude decimal(11,8),
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- Create manual_entries table
CREATE TABLE IF NOT EXISTS manual_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  entry_type text NOT NULL,
  title text NOT NULL,
  description text,
  data jsonb DEFAULT '{}',
  latitude decimal(10,8),
  longitude decimal(11,8),
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- Create ai_log table
CREATE TABLE IF NOT EXISTS ai_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  input_query text NOT NULL,
  output_advice text NOT NULL,
  data_sources_used jsonb DEFAULT '{}',
  status text DEFAULT 'success',
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- Enable Row Level Security
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sensor_data
CREATE POLICY "Users can read own sensor data"
  ON sensor_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sensor data"
  ON sensor_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sensor data"
  ON sensor_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sensor data"
  ON sensor_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for api_data
CREATE POLICY "Users can read own api data"
  ON api_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own api data"
  ON api_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own api data"
  ON api_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own api data"
  ON api_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for manual_entries
CREATE POLICY "Users can read own manual entries"
  ON manual_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own manual entries"
  ON manual_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own manual entries"
  ON manual_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own manual entries"
  ON manual_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for ai_log
CREATE POLICY "Users can read own ai logs"
  ON ai_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai logs"
  ON ai_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ai logs"
  ON ai_log
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ai logs"
  ON ai_log
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_data_user_id ON sensor_data(user_id);
CREATE INDEX IF NOT EXISTS idx_sensor_data_location ON sensor_data(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_api_data_timestamp ON api_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_api_data_user_id ON api_data(user_id);
CREATE INDEX IF NOT EXISTS idx_api_data_source ON api_data(api_source);

CREATE INDEX IF NOT EXISTS idx_manual_entries_timestamp ON manual_entries(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_manual_entries_user_id ON manual_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_manual_entries_type ON manual_entries(entry_type);

CREATE INDEX IF NOT EXISTS idx_ai_log_timestamp ON ai_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_log_user_id ON ai_log(user_id);