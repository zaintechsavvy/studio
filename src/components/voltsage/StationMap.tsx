'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { ChargingStation } from '@/lib/types';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

// Fix for default icon path issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface StationMapProps {
  stations: ChargingStation[] | null;
  selectedStation: ChargingStation | null;
  onSelectStation: (stationId: string | null) => void;
}

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const CustomMarker = ({ station, isSelected, onSelectStation }: { station: ChargingStation, isSelected: boolean, onSelectStation: (id: string) => void }) => {
  const markerRef = useRef<L.Marker>(null);

  const icon = new L.Icon({
    iconUrl: isSelected ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png' : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <Marker
      ref={markerRef}
      position={[station.latitude, station.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => {
          onSelectStation(station.id);
        },
      }}
    >
      <Popup>
        <div>
          <h3 className="font-bold">{station.name}</h3>
          <p>{station.address}</p>
          <Button size="sm" className="mt-2" onClick={() => onSelectStation(station.id)}>View Details</Button>
        </div>
      </Popup>
    </Marker>
  );
};


export default function StationMap({ stations, selectedStation, onSelectStation }: StationMapProps) {
  const defaultCenter: [number, number] = [37.7749, -122.4194];

  const mapCenter = useMemo((): [number, number] => {
    if (selectedStation) {
      return [selectedStation.latitude, selectedStation.longitude];
    }
    if (stations && stations.length > 0) {
      return [stations[0].latitude, stations[0].longitude];
    }
    return defaultCenter;
  }, [selectedStation, stations]);

  const zoom = selectedStation ? 14 : 11;

  return (
    <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={true} className="h-full w-full z-0">
      <ChangeView center={mapCenter} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations?.map(station => (
         <CustomMarker 
            key={station.id}
            station={station}
            isSelected={selectedStation?.id === station.id}
            onSelectStation={onSelectStation}
        />
      ))}
    </MapContainer>
  );
}
