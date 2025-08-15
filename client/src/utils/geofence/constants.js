// Geofence configuration and utilities
export const FENCE_CENTER = {
  lat: 12.97644,   // Latitude of The Lewis College
  lng: 124.00949   // Longitude of The Lewis College
};

export const FENCE_RADIUS_KM = 1.0; // 500 meters radius

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const isWithinGeofence = (currentLat, currentLng) => {
  const distance = calculateDistance(
    FENCE_CENTER.lat,
    FENCE_CENTER.lng,
    currentLat,
    currentLng
  );
  return distance <= FENCE_RADIUS_KM;
};