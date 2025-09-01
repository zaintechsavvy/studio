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

export async function getChargingStations({
  lat,
  lon,
}: {
  lat: string;
  lon: string;
}): Promise<ChargingStationData[]> {
  const apiKey = process.env.EV_CHARGER_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured.");
  }
  
  const url = `https://api.api-ninjas.com/v1/evchargers?lat=${lat}&lon=${lon}&radius=50`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Provide a more user-friendly error
      if (response.status === 404) {
        throw new Error(`Endpoint not found. Please check your spelling and try again.`);
      }
      throw new Error(
        `API call failed with status ${response.status}: ${errorText}`
      );
    }

    const data: any[] = await response.json();

    if (!Array.isArray(data)) {
      console.error("API did not return an array:", data);
      throw new Error("Received invalid data from charging station API.");
    }

    const chargingStations: ChargingStationData[] = data
      .map((station: any) => {
        let connectorTypes: string[] = [];
        if (station.connections && Array.isArray(station.connections)) {
          const types = station.connections
            .map(
              (c: any) =>
                c.connection_type || c.type_name || c.connector_type || null
            )
            .filter(Boolean);
          connectorTypes = [...new Set(types)] as string[];
        }
        if (connectorTypes.length === 0) {
          connectorTypes.push("Unknown");
        }

        let speed = "N/A";
        if (station.connections && station.connections.length > 0) {
          const levels: (string | number)[] = station.connections.map((c: any) => c.level).filter(Boolean);
          if (levels.includes("DC Fast") || levels.some(l => typeof l === 'string' && l.toLowerCase().includes('dc'))) {
            speed = "DC Fast Charging";
          } else if (levels.includes(2) || levels.includes("2") || levels.includes("Level 2")) {
            speed = "Level 2";
          } else if (levels.includes(1) || levels.includes("1") || levels.includes("Level 1")) {
            speed = "Level 1";
          }
        }
        
        const fullAddress = `${station.street_address || ""}, ${station.city || ""}, ${
              station.state || ""
            } ${station.zip || ""}`
              .replace(/^[ ,]+|[ ,]+$/g, "") // remove leading/trailing commas/spaces
              .replace(/ , /g, ", ")
              .trim();

        return {
          name: station.station_name || station.name || "Unknown Station",
          address: fullAddress || "Address not available",
          latitude: Number(station.latitude) || 0,
          longitude: Number(station.longitude) || 0,
          network: station.ev_network || "Unknown",
          speed,
          connectorTypes,
          availability: station.access_days_time || "Varies",
          pricing: station.ev_pricing || "Varies",
        } satisfies ChargingStationData;
      })
      .filter(
        (station) =>
          station.latitude !== 0 &&
          station.longitude !== 0
      );

    return chargingStations;
  } catch (error) {
    console.error("Failed to fetch charging stations:", error);
    throw error;
  }
}
