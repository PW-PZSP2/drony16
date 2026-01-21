import axios from "axios";

export const MapService = {
  geocodeAddress: async (address: string) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: address,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "Droneo/1.0",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Geocoding error:", error);
      return [];
    }
  },
};
