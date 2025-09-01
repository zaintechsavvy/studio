import type { ChargingStation, Connector } from '@/lib/types';

const API_KEY = process.env.NREL_API_KEY || 'DEMO_KEY';
const API_BASE_URL = 'https://developer.nrel.gov/api/alt-fuel-stations/v1.json';

// A simple in-memory cache to avoid re-fetching during the same session
const cache = new Map<string, any>();

interface NrelStation {
  id: number;
  station_name: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  ev_connector_types: string[];
  ev_network: string;
  ev_pricing: string | null;
  access_days_time: string | null;
  station_phone: string | null;
  groups_with_access_code: string;
  facility_type: string | null;
  ev_level1_evse_num: number | null;
  ev_level2_evse_num: number | null;
  ev_dc_fast_num: number | null;
  ev_other_evse: string | null;
  ev_network_web: string | null;
  ev_charge_port_count: number;
  ev_connector_ports: string[];
  access_code: string;
  ev_dc_fast_ports: string[];
}

function mapNrelStationToChargingStation(station: NrelStation): ChargingStation {
  const connectors: Connector[] = [];
  
  const connectorCounts: { [key: string]: number } = {};
  if (station.ev_connector_types) {
      station.ev_connector_types.forEach(type => {
          connectorCounts[type] = (connectorCounts[type] || 0) + 1;
      });
  }

  // Very rough estimation of power based on type
  const getPower = (type: string) => {
    if (type.toLowerCase().includes('dc_fast')) return 150;
    if (type.toLowerCase() === 'j1772') return 7.4;
    if (type.toLowerCase() === 'nema') return 1.9;
    return 0;
  }

  Object.entries(connectorCounts).forEach(([type, quantity]) => {
      connectors.push({
          type: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Prettify type
          powerKw: getPower(type),
          quantity: quantity,
      });
  })

  // Add distinct DC fast chargers if any
  if(station.ev_dc_fast_ports && station.ev_dc_fast_num) {
     if (!connectors.some(c => c.type === "DC Fast")) {
        connectors.push({
            type: 'DC Fast',
            powerKw: 150,
            quantity: station.ev_dc_fast_num,
        });
     }
  }


  return {
    id: station.id.toString(),
    name: station.station_name,
    address: `${station.street_address}, ${station.city}, ${station.state} ${station.zip}`,
    latitude: station.latitude,
    longitude: station.longitude,
    connectors,
    network: station.ev_network || 'Unknown',
    pricing: station.ev_pricing,
    availability: {
      total: station.ev_charge_port_count || 0,
      available: -1, // NREL API doesn't provide real-time availability
    },
    sourceUrl: station.ev_network_web,
    accessType: station.access_code === 'public' ? 'public' : 'private',
    operatingHours: station.access_days_time,
    facilityType: station.facility_type,
  };
}

export async function getChargingStations(params: { lat: number; lon: number; radius?: number }): Promise<ChargingStation[]> {
  const { lat, lon, radius = 5.0 } = params;
  const url = `${API_BASE_URL}?api_key=${API_KEY}&latitude=${lat}&longitude=${lon}&radius=${radius}&fuel_type=ELEC&limit=200`;

  const cacheKey = url;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`NREL API Error: ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch data from NREL API. Status: ${response.status}`);
    }
    
    const data = await response.json();
    const stations: NrelStation[] = data.fuel_stations || [];
    const mappedStations = stations.map(mapNrelStationToChargingStation);

    cache.set(cacheKey, mappedStations);
    return mappedStations;

  } catch (error) {
    console.error("Error in getChargingStations:", error);
    throw error;
  }
}
