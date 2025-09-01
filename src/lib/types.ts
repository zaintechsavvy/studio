export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  connectors: Connector[];
  network: string;
  pricing: string | null;
  availability: {
    total: number;
    available: number;
  };
  sourceUrl?: string;
  accessType: 'public' | 'private' | 'unknown';
  operatingHours: string | null;
  facilityType: string | null;
  status?: string;
}

export interface Connector {
  type: string;
  powerKw: number;
  quantity: number;
}
