import {
  IonPage,
  IonContent,
  IonButton
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';

interface Incidencia {
  _id: string;
  companya_aerea: string;
  num_vol: string;
  estat: string;
  menjar: { codi: string; quantitat: number }[];
  createdAt: string;
}

const IncidenciaList: React.FC = () => {
  const [incidencies, setIncidencies] = useState<Incidencia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const perPagina = 3;
  const API_URL = import.meta.env.VITE_API_URL;
  const history = useHistory();

  useEffect(() => {
    const fetchIncidencies = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/incidents`, {
          headers: {
            Authorization: `jwt ${token}`
          }
        });

        if (!res.ok) throw new Error('Error en carregar les incidències');
        const data = await res.json();
        setIncidencies(data);
      } catch (err) {
        console.error(err);
        setError('No s’han pogut carregar les incidències.');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidencies();
  }, []);

  const totalPagines = Math.ceil(incidencies.length / perPagina);
  const inici = (paginaActual - 1) * perPagina;
  const visibles = incidencies.slice(inici, inici + perPagina);

  const anterior = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const seguent = () => setPaginaActual((p) => Math.min(p + 1, totalPagines));

  return (
    <IonPage>
      <ToolbarHeader title="Flightchat" showNavButtons />
      <IonContent className="bg-gray-100 h-full">
        <div className="h-full flex">

          {/* 📋 Panell esquerre només per escriptori */}
          <div className="hidden md:flex w-1/5 bg-white border-r p-4 flex-col justify-start items-center">
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/incidencia">
              nova Incidencia
            </IonButton>
          </div>

          {/* 🧾 Contingut central */}
          <div className="flex-1 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
              <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">Incidències enregistrades</h1>

              {error && <p className="text-red-500 text-center mb-4">{error}</p>}

              {loading ? (
                <p className="text-gray-500 text-center">Carregant incidències...</p>
              ) : incidencies.length === 0 ? (
                <p className="text-gray-700 text-center">No hi ha incidències registrades.</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {visibles.map((inc) => (
                      <div key={inc._id} className="bg-orange-100 rounded p-4">
                        <h2 className="text-orange-700 font-semibold">Vol: {inc.num_vol}</h2>
                        <p className="text-sm text-gray-700">Companyia: {inc.companya_aerea}</p>
                        <p className="text-sm text-gray-700">Estat: {inc.estat}</p>
                        <p className="text-sm text-gray-500 mb-2">Data: {new Date(inc.createdAt).toLocaleString()}</p>
                        <ul className="text-sm text-gray-800 list-disc ml-5">
                          {inc.menjar.map((m, i) => (
                            <li key={i}>{m.codi} - {m.quantitat}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* 🔢 Paginació */}
                  <div className="flex justify-between items-center mt-6">
                    <IonButton disabled={paginaActual === 1} onClick={anterior}>
                      Anterior
                    </IonButton>
                    <span className="text-sm text-gray-600">
                      Pàgina {paginaActual} de {totalPagines}
                    </span>
                    <IonButton disabled={paginaActual === totalPagines} onClick={seguent}>
                      Següent
                    </IonButton>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 🔘 Panell dret només per escriptori */}
          <div className="hidden md:flex w-1/5 bg-white border-l p-4 flex-col justify-start items-center space-y-4">
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/chatlist">
              CHATS
            </IonButton>
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/geolocation">
              VOLS
            </IonButton>
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/comandes">
              COMANDES
            </IonButton>
           
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default IncidenciaList;