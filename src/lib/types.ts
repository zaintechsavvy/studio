export type ChargingStation = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  network: string;
  speed: string;
  connectorTypes: string[];
  availability: string;
  pricing: string;
};
