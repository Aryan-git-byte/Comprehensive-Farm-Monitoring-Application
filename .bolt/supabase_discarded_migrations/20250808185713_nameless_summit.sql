/*
  # Farm Monitoring System Database Schema

  1. New Tables
    - `sensor_data`
      - `id` (uuid, primary key)
      - `sensor_type` (text) - moisture, ph, temperature, humidity, nutrients
      - `sensor_location` (text) - field location identifier
      - `value` (numeric) - sensor reading value
      - `unit` (text) - measurement unit
      - `status` (text) - optimal, warning, critical
      - `timestamp` (timestamptz)
      - `user_id` (uuid, foreign key)
    
    - `manual_entries`
      - `id` (uuid, primary key) 
      - `entry_type` (text) - water_quality, fertilizer, weather, custom
      - `title` (text)
      - `description` (text)
      - `data` (jsonb) - flexible data storage
      - `location` (text)
      - `timestamp` (timestamptz)
      - `user_id` (uuid, foreign key)
    
    - `farm_settings`
      - `id` (uuid, primary key)
      - `setting_key` (text)
      - `setting_value` (jsonb)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Sample Data
    - Insert 7 days of realistic sensor data for demonstration
*/

-- Create sensor_data table
CREATE TABLE IF NOT EXISTS sensor_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_type text NOT NULL CHECK (sensor_type IN ('moisture', 'ph', 'temperature', 'humidity', 'nitrogen', 'phosphorus', 'potassium')),
  sensor_location text NOT NULL,
  value numeric NOT NULL,
  unit text NOT NULL,
  status text NOT NULL DEFAULT 'optimal' CHECK (status IN ('optimal', 'warning', 'critical')),
  timestamp timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create manual_entries table
CREATE TABLE IF NOT EXISTS manual_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_type text NOT NULL CHECK (entry_type IN ('water_quality', 'fertilizer', 'weather', 'custom')),
  title text NOT NULL,
  description text,
  data jsonb DEFAULT '{}',
  location text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create farm_settings table
CREATE TABLE IF NOT EXISTS farm_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL,
  setting_value jsonb DEFAULT '{}',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(setting_key, user_id)
);

-- Enable Row Level Security
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for sensor_data
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

-- Create policies for manual_entries
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

-- Create policies for farm_settings
CREATE POLICY "Users can read own farm settings"
  ON farm_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own farm settings"
  ON farm_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own farm settings"
  ON farm_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own farm settings"
  ON farm_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sensor_data_user_timestamp ON sensor_data(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_data_type_location ON sensor_data(sensor_type, sensor_location);
CREATE INDEX IF NOT EXISTS idx_manual_entries_user_timestamp ON manual_entries(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_manual_entries_type ON manual_entries(entry_type);
CREATE INDEX IF NOT EXISTS idx_farm_settings_user_key ON farm_settings(user_id, setting_key);