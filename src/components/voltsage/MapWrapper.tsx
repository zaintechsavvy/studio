'use client'

import { MapContainer, TileLayer } from 'react-leaflet'

interface MapWrapperProps {
  center: [number, number];
  children: React.ReactNode;
}

export default function MapWrapper({ center, children }: MapWrapperProps) {
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full z-10">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
