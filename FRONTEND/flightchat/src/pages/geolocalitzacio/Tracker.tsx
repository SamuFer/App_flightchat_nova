// FRONTEND/flightchat/src/pages/geolocalitzacio/Tracker.tsx
import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';
import LiveMap from '../../components/maps/LiveMap';

const Tracker: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCurrentPosition = async () => {
    try {
      setError(null);
      const position = await Geolocation.getCurrentPosition();
      setCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
    } catch (err) {
      setError('No s\'ha pogut obtenir la ubicació');
      console.error('❌ Error obtenint geolocalització:', err);
    }
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  return (
    <IonPage>
      <ToolbarHeader title="Seguiment en temps real" />
      <IonContent className="p-6">
        <IonButton expand="block" onClick={getCurrentPosition} className="mb-4 bg-orange-500 text-white hover:bg-orange-600">
          Actualitza ubicació
        </IonButton>

        {coords ? (
          <>
            <LiveMap lat={coords.lat} lon={coords.lon} />
            <p className="text-center text-gray-700 mt-4">
              📍 Latitud: {coords.lat.toFixed(6)} | Longitud: {coords.lon.toFixed(6)}
            </p>
          </>
        ) : (
          <p className="text-center text-gray-500">Ubicació no disponible</p>
        )}

        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </IonContent>
    </IonPage>
  );
};

export default Tracker;
