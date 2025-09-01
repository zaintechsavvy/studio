'use client';

import { useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import type { Map as MapInstance } from '@vis.gl/react-google-maps';
import { ChargingStation } from '@/lib/types';
import { motion } from 'framer-motion';

interface StationMapProps {
  stations: ChargingStation[] | null;
  selectedStation: ChargingStation | null;
  onSelectStation: (stationId: string | null) => void;
}

// IMPORTANT: You must add your Google Maps API key to your environment variables.
// Create a .env.local file in the root of your project and add the following line:
// NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
// You can get a key from the Google Cloud Console: https://console.cloud.google.com/

const MAP_ID = 'voltsage_map';

export default function StationMap({ stations, selectedStation, onSelectStation }: StationMapProps) {
  const mapRef = useRef<MapInstance | null>(null);

  const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
  
  const mapCenter = useMemo(() => {
    if (selectedStation) {
      return { lat: selectedStation.latitude, lng: selectedStation.longitude };
    }
    if (stations && stations.length > 0) {
      // Center on the first station of a new search
      return { lat: stations[0].latitude, lng: stations[0].longitude };
    }
    return defaultCenter;
  }, [selectedStation, stations]);
  
  useEffect(() => {
    if (mapRef.current) {
        mapRef.current.panTo(mapCenter);
    }
  }, [mapCenter]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Google Maps API Key Missing</h2>
          <p className="text-muted-foreground">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.</p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <Map
        ref={mapRef}
        defaultCenter={defaultCenter}
        center={mapCenter}
        defaultZoom={11}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={MAP_ID}
        className="h-full w-full"
      >
        {stations?.map(station => (
          <AdvancedMarker
            key={station.id}
            position={{ lat: station.latitude, lng: station.longitude }}
            onClick={() => onSelectStation(station.id)}
          >
            <motion.div
              animate={{ scale: selectedStation?.id === station.id ? 1.5 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Pin
                background={selectedStation?.id === station.id ? 'var(--color-primary)' : '#FF5252'}
                borderColor={selectedStation?.id === station.id ? 'var(--color-accent)' : '#B71C1C'}
                glyphColor={selectedStation?.id === station.id ? 'hsl(var(--primary-foreground))' : '#FFFFFF'}
              />
            </motion.div>
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}

// Custom hook to use in other components if needed, e.g. for calculating average location
function useMemo<T>(factory: () => T, deps: React.DependencyList | undefined): T {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useMemo(factory, deps);
}

// Add React to dependencies if not already present
import React from 'react';
