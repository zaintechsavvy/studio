'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import type { ChargingStation } from '@/lib/types';
import L from 'leaflet';
import { useEffect } from 'react';

const icon = L.icon({
  iconUrl: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="%232563eb"><path d="M12 2C7.03 2 3 6.03 3 11c0 2.89 1.39 5.5 3.56 7.26L12 22l5.44-3.74C19.61 16.5 21 13.89 21 11c0-4.97-4.03-9-9-9zm0 2c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.14-7-7 3.14-7 7-7zm-1 3v4h-2l3 4 3-4h-2V7h-2z"/></svg>')}`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const selectedIcon = L.icon({
  iconUrl: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="%23ea580c"><path d="M12 2C7.03 2 3 6.03 3 11c0 2.89 1.39 5.5 3.56 7.26L12 22l5.44-3.74C19.61 16.5 21 13.89 21 11c0-4.97-4.03-9-9-9zm0 2c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.14-7-7 3.14-7 7-7zm-1 3v4h-2l3 4 3-4h-2V7h-2z"/></svg>')}`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});


function ChangeView({ center, zoom }: {center: [number, number], zoom: number}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface MapProps {
  center: [number, number];
  stations: ChargingStation[] | null;
  selectedStationId: string | null;
  onSelectStation: (id: string | null) => void;
}

export default function Map({ center, stations, selectedStationId, onSelectStation }: MapProps) {
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full z-10">
      <ChangeView center={center} zoom={13} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations?.map(station => (
        <Marker 
          key={station.id}
          position={[station.latitude, station.longitude]}
          icon={station.id === selectedStationId ? selectedIcon : icon}
          eventHandlers={{
            click: () => {
              onSelectStation(station.id);
            },
          }}
        >
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-base mb-1">{station.name}</h3>
              <p className="text-sm">{station.address}</p>
              <p className="text-sm mt-1">{station.connectors.map(c => c.type).join(', ')}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
