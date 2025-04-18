
interface GeoLocationResponse {
  country_code: string;
  country_name: string;
  currency: string;
  languages: string;
}

export const detectGeoLocation = async (): Promise<GeoLocationResponse> => {
  const response = await fetch('https://ipapi.co/json/');
  
  if (!response.ok) {
    throw new Error('Failed to fetch location data');
  }
  
  return response.json();
};
