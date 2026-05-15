import axios from 'axios';

interface GeocodingResult {
  lat: number;
  lng: number;
  displayName?: string;
}

/**
 * Fetch coordinates from pincode using OpenStreetMap Nominatim API
 * Note: For production, consider using Google Maps Geocoding API or a dedicated Indian Pincode API
 */
export const getCoordinatesFromPincode = async (pincode: string): Promise<GeocodingResult | null> => {
  try {
    // Nominatim expects a user-agent
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        postalcode: pincode,
        country: 'India', // Assuming India based on 'pincode' term
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'ServiceApp/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching coordinates from pincode:', error);
    return null;
  }
};
