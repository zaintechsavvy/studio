'use client';

import type { ChargingStation } from '@/lib/types';
import MapWrapper from './MapWrapper';
import MapController from './MapController';

interface MapProps {
  center: [number, number];
  stations: ChargingStation[] | null;
  selectedStationId: string | null;
  onSelectStation: (id: string | null) => void;
}

export default function Map({ center, stations, selectedStationId, onSelectStation }: MapProps) {
  return (
    <MapWrapper center={center}>
      <MapController
        center={center}
        stations={stations}
        selectedStationId={selectedStationId}
        onSelectStation={onSelectStation}
      />
    </MapWrapper>
  );
}
