// FRONTEND/flightchat/src/components/maps/LiveMap.tsx
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  lat: number;
  lon: number;
}

const LiveMap: React.FC<Props> = ({ lat, lon }) => {
  useEffect(() => {
    const map = L.map('map').setView([lat, lon], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup('📍 Tu ets aquí!').openPopup();

    return () => {
      map.remove();
    };
  }, [lat, lon]);

  return (
    <div
      id="map"
      className="w-full h-96 rounded-lg border border-gray-300 shadow-md"
    ></div>
  );
};

export default LiveMap;
