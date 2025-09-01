export type ChargingStationData = {
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

export async function getChargingStations({ lat, lon }: { lat: string, lon: string }): Promise<ChargingStationData[]> {
    const url = `https://api.api-ninjas.com/v1/evchargers?latitude=${lat}&longitude=${lon}&radius=50`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'X-Api-Key': process.env.EV_CHARGER_API_KEY!,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("API did not return an array:", data);
        throw new Error("Received invalid data from charging station API.");
      }

      const chargingStations = data.map((station: any) => {
        let connectorTypes: string[] = [];
        if (station.connections && Array.isArray(station.connections)) {
          const types = station.connections.map((c: any) => c.connection_type || c.type_name).filter(Boolean);
          connectorTypes = [...new Set(types)] as string[];
        }
        if (connectorTypes.length === 0) {
          connectorTypes.push('Unknown');
        }

        let speed = "N/A";
        if (station.connections && station.connections.length > 0) {
            const levels = station.connections.map((c:any) => c.level);
            if (levels.includes('DC Fast')) {
                 speed = "DC Fast Charging";
            } else if (levels.includes('Level 2')) {
                speed = "Level 2";
            } else if (levels.includes('Level 1')) {
                speed = "Level 1";
            }
        }
        
        return {
          name: station.station_name || station.name || 'Unknown Station',
          address: `${station.street_address || ''}, ${station.city || ''}, ${station.state || ''} ${station.zip || ''}`.replace(/(^, | ,$|, ,)/g, '').trim() || 'Address not available',
          latitude: station.latitude,
          longitude: station.longitude,
          network: station.ev_network || 'Unknown',
          speed: speed,
          connectorTypes: connectorTypes,
          availability: station.access_days_time || 'Varies',
          pricing: station.ev_pricing || 'Varies',
        };
      }).filter((station: any) => station.address && station.latitude && station.longitude);

      return chargingStations;

    } catch (error) {
      console.error("Failed to fetch charging stations:", error);
      throw error;
    }
}
