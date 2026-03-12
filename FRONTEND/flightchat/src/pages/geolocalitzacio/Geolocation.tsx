import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/react';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { companyIcons, defaultIcon } from './icons/companyIcons';

const getBcnFlights = async () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/opensky/bcn`);
  if (!res.ok) throw new Error('Error carregant vols de BCN');
  return await res.json();
};

const getCompanyName = (callsign: string) => {
  if (callsign.startsWith('VLG')) return 'Vueling';
  if (callsign.startsWith('ETD')) return 'Etihad Airways';
  if (callsign.startsWith('QTR')) return 'Qatar Airways';
  if (callsign.startsWith('AAL')) return 'American Airlines';
  if (callsign.trim() === '') return '[sense callsign]';
  return 'Companyia desconeguda';
};

const getCompanyIcon = (callsign: string) => {
  const prefix = callsign.slice(0, 3);
  return companyIcons[prefix] || defaultIcon;
};

type Flight = {
  icao24: string;
  callsign: string;
  country: string;
  lat: number;
  lon: number;
  altitude: number | null;
  velocity: number | null;
};

const GeolocationPage: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flights, setFlights] = useState<any[]>([]);
  const [view, setView] = useState<'device' | 'prat'>('device');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  const getCurrentPosition = async () => {
    try {
      setError(null);
      const position = await Geolocation.getCurrentPosition();
      setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
    } catch (err) {
      setError("No s'ha pogut obtenir la ubicació");
      console.error('❌ Error geolocalització:', err);
    }
  };

  const fetchFlights = async () => {
    try {
      const allFlights: Flight[] = await getBcnFlights();
      setFlights(allFlights);
    } catch (err) {
      console.error('Error carregant vols:', err);
    }
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  useEffect(() => {
    const checkPerms = async () => {
      const status: PermissionStatus = await Geolocation.checkPermissions();
      if (status.location === 'denied') {
        setError('Permís de geolocalització denegat');
      }
    };
    checkPerms();
  }, []);

  const MapUpdater = ({ lat, lon }: { lat: number; lon: number }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lon], 16);
    }, [lat, lon, map]);
    return null;
  };

  const pratCoords = { lat: 41.2969, lon: 2.0787 };

  return (
    <IonPage>
      <ToolbarHeader title="Flightchat" showNavButtons />
      <IonContent className="bg-gray-100 h-full">
        <div className="h-full flex">
          <div className="hidden md:flex w-1/5 bg-white border-r p-4 flex-col justify-start items-center">
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/comandes">
              COMANDES
            </IonButton>
          </div>

          <div className="flex-1 flex flex-col items-center p-6 space-y-6">
            <IonCard className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
              <IonCardHeader>
                <IonCardTitle className="text-xl font-semibold text-orange-600">
                  Posició actual del dispositiu
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonButton
                  expand="block"
                  className="mb-2"
                  onClick={async () => {
                    setView('prat');
                    await fetchFlights();
                  }}
                >
                  Centra mapa a Aeroport del Prat
                </IonButton>

                <IonButton
                  expand="block"
                  className="mb-4"
                  onClick={async () => {
                    await getCurrentPosition();
                    setView('device');
                  }}
                >
                  Actualitza i centra la meva ubicació
                </IonButton>

                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                  Filtra per companyia:
                </label>
                <select
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm text-black"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                >
                  <option value="all">Totes les companyies</option>
                  <option value="VLG">Vueling</option>
                  <option value="ETD">Etihad Airways</option>
                  <option value="QTR">Qatar Airways</option>
                  <option value="AAL">American Airlines</option>
                </select>

                {error ? (
                  <p className="text-red-500 font-medium mt-2">{error}</p>
                ) : coords ? (
                  <>
                    <p className="text-base text-neutral-dark mt-2">Latitud: {coords.lat.toFixed(6)}</p>
                    <p className="text-base text-neutral-dark">Longitud: {coords.lon.toFixed(6)}</p>
                  </>
                ) : (
                  <p className="text-base text-gray-500">Ubicació no disponible</p>
                )}
              </IonCardContent>
            </IonCard>

            {(coords || view === 'prat') && (
              <>
                <div className="h-[400px] w-full max-w-xl rounded overflow-hidden shadow">
                  <MapContainer
                    center={
                      view === 'device' && coords
                        ? [coords.lat, coords.lon]
                        : [pratCoords.lat, pratCoords.lon]
                    }
                    zoom={16}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {view === 'device' && coords && (
                      <Marker position={[coords.lat, coords.lon]} icon={defaultIcon}>
                        <Popup>Estàs aquí</Popup>
                      </Marker>
                    )}

                    {flights
                      .filter((f) =>
                        selectedCompany === 'all' ||
                        f.callsign?.startsWith(selectedCompany) ||
                        f.callsign === selectedCompany
                      )
                      .map((flight, index) => (
                        <Marker
                          key={index}
                          position={[flight.lat, flight.lon]}
                          icon={getCompanyIcon(flight.callsign || '')}
                        >
                          <Popup>
                            <strong>{getCompanyName(flight.callsign || '')}</strong><br />
                            Vol: {flight.callsign?.trim() || '[sense callsign]'} <br />
                            Altitud: {flight.altitude !== null ? `${flight.altitude.toFixed(0)} m` : 'Estacionat'}
                          </Popup>
                        </Marker>
                      ))}

                    <MapUpdater
                      lat={view === 'device' && coords ? coords.lat : pratCoords.lat}
                      lon={view === 'device' && coords ? coords.lon : pratCoords.lon}
                    />
                  </MapContainer>
                </div>

                <div className="w-full max-w-xl flex flex-wrap justify-center gap-2 mt-4">
                  {[
                    'ETD112', 'ETD114',
                    'QTR3622', 'QTR3619',
                    'VLG1676', 'VLG3906',
                    'AAL193', 'AAL113'
                  ].map((vol) => (
                    <IonButton
                      key={vol}
                      size="small"
                      className="bg-orange-500 text-white"
                      onClick={() => setSelectedCompany(vol)}
                    >
                      {vol}
                    </IonButton>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="hidden md:flex w-1/5 bg-white border-l p-4 flex-col justify-start items-center space-y-4">
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/chatlist">
              CHATS
            </IonButton>
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/incidencies">
              INCIDÈNCIES
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GeolocationPage;