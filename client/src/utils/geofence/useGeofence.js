import { useState, useEffect } from 'react';
import { FENCE_CENTER, FENCE_RADIUS_KM, calculateDistance, isWithinGeofence } from './constants';

export const useGeofence = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWithinFence, setIsWithinFence] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ latitude, longitude, accuracy });
        setIsWithinFence(isWithinGeofence(latitude, longitude));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const distanceFromCenter = location 
    ? calculateDistance(
        FENCE_CENTER.lat,
        FENCE_CENTER.lng,
        location.latitude,
        location.longitude
      )
    : null;

  return {
    location,
    error,
    loading,
    isWithinFence,
    distanceFromCenter,
    fenceCenter: FENCE_CENTER,
    fenceRadius: FENCE_RADIUS_KM
  };
};