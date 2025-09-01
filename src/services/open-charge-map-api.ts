import type { ChargingStation, Connector } from '@/lib/types';

// It's recommended to get a free key from https://openchargemap.org/site/develop/api
const API_KEY = process.env.OCM_API_KEY;
const API_BASE_URL = 'https://api.openchargemap.io/v3/poi/';

const cache = new Map<string, any>();

interface OcmStation {
  ID: number;
  UUID: string;
  AddressInfo: {
    Title: string;
    AddressLine1: string;
    Town: string;
    StateOrProvince: string;
    Postcode: string;
    Country: { Title: string };
    Latitude: number;
    Longitude: number;
    ContactTelephone1?: string;
    RelatedURL?: string;
  };
  Connections: {
    ConnectionType?: { Title: string };
    PowerKW?: number;
    Quantity?: number;
    StatusType?: { ID: number, Title: string };
  }[];
  OperatorInfo?: {
    Title: string;
    WebsiteURL?: string;
  };
  UsageType?: {
    Title: string;
  };
  StatusType?: {
    Title: string;
    IsOperational: boolean;
  };
  DataProvider?: {
    Title: string;
    WebsiteURL: string;
  };
  NumberOfPoints?: number;
}

function mapOcmStationToChargingStation(station: OcmStation): ChargingStation {
  const connectors: Connector[] = [];

  station.Connections.forEach(conn => {
    if (conn.ConnectionType) {
        connectors.push({
            type: conn.ConnectionType.Title,
            powerKw: conn.PowerKW || 0,
            quantity: conn.Quantity || 1,
        });
    }
  });
  
  const totalConnectors = station.NumberOfPoints || station.Connections.reduce((sum, conn) => sum + (conn.Quantity || 1), 0);
  
  // StatusType ID 50 is 'Operational'
  const availableConnectors = station.Connections.filter(c => c.StatusType?.ID === 50).reduce((sum, conn) => sum + (conn.Quantity || 1), 0);


  return {
    id: station.ID.toString(),
    name: station.AddressInfo.Title,
    address: `${station.AddressInfo.AddressLine1}, ${station.AddressInfo.Town}, ${station.AddressInfo.StateOrProvince} ${station.AddressInfo.Postcode}`,
    latitude: station.AddressInfo.Latitude,
    longitude: station.AddressInfo.Longitude,
    connectors,
    network: station.OperatorInfo?.Title || 'Unknown',
    pricing: station.UsageType?.Title || null,
    availability: {
      total: totalConnectors,
      available: availableConnectors,
    },
    sourceUrl: station.DataProvider?.WebsiteURL || station.OperatorInfo?.WebsiteURL || station.AddressInfo.RelatedURL || undefined,
    accessType: station.UsageType?.Title.toLowerCase().includes('public') ? 'public' : 'private',
    operatingHours: null, // OCM doesn't provide a standard field for this
    facilityType: null, // OCM doesn't provide this
    status: station.StatusType?.Title,
  };
}

export async function getChargingStations(params: { lat: number; lon: number; radius?: number }): Promise<ChargingStation[]> {
  const { lat, lon, radius = 5 } = params;
  
  if (!API_KEY) {
    throw new Error('Open Charge Map API key is missing. Please add OCM_API_KEY to your .env file.');
  }

  // OCM uses distance in miles for radius
  const distance = radius;
  const url = `${API_BASE_URL}?key=${API_KEY}&latitude=${lat}&longitude=${lon}&distance=${distance}&distanceunit=Miles&maxresults=100&output=json&verbose=false`;
  
  const cacheKey = url;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Open Charge Map API Error: ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch data from Open Charge Map API. Status: ${response.status}`);
    }
    
    const data: OcmStation[] = await response.json();
    const mappedStations = data.map(mapOcmStationToChargingStation);
    
    // De-duplicate stations by ID, merging connector info
    const stationMap = new Map<string, ChargingStation>();
    mappedStations.forEach(station => {
      if (stationMap.has(station.id)) {
        const existing = stationMap.get(station.id)!;
        existing.connectors.push(...station.connectors);
      } else {
        stationMap.set(station.id, station);
      }
    });

    const uniqueStations = Array.from(stationMap.values());
    
    cache.set(cacheKey, uniqueStations);
    return uniqueStations;

  } catch (error) {
    console.error("Error in getChargingStations:", error);
    throw error;
  }
}
