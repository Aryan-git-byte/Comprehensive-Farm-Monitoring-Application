/*
  # Create Agricultural Data Integration Tables

  1. New Tables
    - `weather_data` - Store weather information from OpenWeather API
    - `soil_data` - Store soil information from ISRIC SoilGrids API  
    - `locations` - Store user locations with lat/lon coordinates
    - `advice_table` - Store generated farming advice
    - Update `sensor_data` table structure
    - Update `manual_entries` table structure

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Weather Data Table
CREATE TABLE IF NOT EXISTS public.weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  temperature INTEGER NOT NULL, -- in Celsius
  humidity INTEGER NOT NULL, -- percentage
  pressure INTEGER NOT NULL, -- hPa
  wind_speed INTEGER NOT NULL, -- km/h
  wind_direction INTEGER DEFAULT 0, -- degrees
  weather_condition TEXT NOT NULL,
  weather_description TEXT NOT NULL,
  visibility INTEGER DEFAULT 10, -- km
  rainfall DECIMAL(5, 2) DEFAULT 0, -- mm
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Soil Data Table
CREATE TABLE IF NOT EXISTS public.soil_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  sand_content INTEGER NOT NULL, -- percentage
  clay_content INTEGER NOT NULL, -- percentage
  silt_content INTEGER NOT NULL, -- percentage
  ph_level DECIMAL(3, 2) NOT NULL,
  organic_carbon DECIMAL(5, 2) NOT NULL, -- g/kg
  soil_type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Locations Table
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  place_name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  district TEXT DEFAULT 'Unknown',
  state TEXT DEFAULT 'Unknown',
  country TEXT DEFAULT 'India',
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Advice Table
CREATE TABLE IF NOT EXISTS public.advice_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  advice_type TEXT NOT NULL CHECK (advice_type IN ('irrigation', 'fertilizer', 'pest_control', 'crop_management', 'weather_alert')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  action_required BOOLEAN DEFAULT FALSE,
  language TEXT DEFAULT 'hi',
  location TEXT NOT NULL,
  data_sources JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Update sensor_data table if it exists
DO $$
BEGIN
  -- Add location column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sensor_data' AND column_name = 'location'
  ) THEN
    ALTER TABLE public.sensor_data ADD COLUMN location TEXT DEFAULT 'Unknown';
  END IF;
  
  -- Add latitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sensor_data' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE public.sensor_data ADD COLUMN latitude DECIMAL(10, 8);
  END IF;
  
  -- Add longitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sensor_data' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE public.sensor_data ADD COLUMN longitude DECIMAL(11, 8);
  END IF;
END $$;

-- Update manual_entries table if it exists
DO $$
BEGIN
  -- Add latitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'manual_entries' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE public.manual_entries ADD COLUMN latitude DECIMAL(10, 8);
  END IF;
  
  -- Add longitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'manual_entries' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE public.manual_entries ADD COLUMN longitude DECIMAL(11, 8);
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advice_table ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weather_data
CREATE POLICY "Users can read their own weather data"
ON public.weather_data FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weather data"
ON public.weather_data FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for soil_data
CREATE POLICY "Users can read their own soil data"
ON public.soil_data FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own soil data"
ON public.soil_data FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for locations
CREATE POLICY "Users can read their own locations"
ON public.locations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own locations"
ON public.locations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own locations"
ON public.locations FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own locations"
ON public.locations FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for advice_table
CREATE POLICY "Users can read their own advice"
ON public.advice_table FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own advice"
ON public.advice_table FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weather_data_user_timestamp ON public.weather_data(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_weather_data_location ON public.weather_data(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_soil_data_user_timestamp ON public.soil_data(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_soil_data_location ON public.soil_data(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_locations_user_current ON public.locations(user_id, is_current);

CREATE INDEX IF NOT EXISTS idx_advice_user_timestamp ON public.advice_table(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_advice_priority ON public.advice_table(priority, action_required);

-- Create indexes on sensor_data if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sensor_data') THEN
    CREATE INDEX IF NOT EXISTS idx_sensor_data_location ON public.sensor_data(latitude, longitude);
  END IF;
END $$;

-- Create indexes on manual_entries if table exists  
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'manual_entries') THEN
    CREATE INDEX IF NOT EXISTS idx_manual_entries_location ON public.manual_entries(latitude, longitude);
  END IF;
END $$;