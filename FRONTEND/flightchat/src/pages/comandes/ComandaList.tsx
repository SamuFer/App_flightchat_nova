import {
  IonPage,
  IonContent,
  IonSpinner,
  IonButton
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';

interface Comanda {
  _id: string;
  estat: string;
  companya_aerea: string;
  num_vol: string;
}

const ComandaList: React.FC = () => {
  const [comandes, setComandes] = useState<Comanda[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const perPagina = 5;
  const API_URL = import.meta.env.VITE_API_URL;
  const history = useHistory();

  useEffect(() => {
    const fetchComandes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/orders/actives`, {
          headers: {
            Authorization: `jwt ${token}`
          }
        });
        const data = await response.json();
        setComandes(data);
      } catch (error) {
        console.error('Error carregant les comandes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComandes();
  }, []);

  const totalPagines = Math.ceil(comandes.length / perPagina);
  const inici = (paginaActual - 1) * perPagina;
  const visibles = comandes.slice(inici, inici + perPagina);

  const anterior = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const seguent = () => setPaginaActual((p) => Math.min(p + 1, totalPagines));

  return (
    <IonPage>
      <ToolbarHeader title="Flightchat" showNavButtons />
      <IonContent className="bg-gray-100 h-full">
        <div className="h-full flex">

          {/*  Panell esquerre només per escriptori */}
          <div className="hidden md:flex w-1/5 bg-white border-r p-4 flex-col justify-start items-center">
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/incidencies">
              INCIDÈNCIES
            </IonButton>
          </div>

          {/* Contingut central */}
          <div className="flex-1 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
              <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">Comandes Actives</h1>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <IonSpinner name="crescent" />
                </div>
              ) : comandes.length === 0 ? (
                <p className="text-center text-gray-500">No hi ha comandes actives en aquest moment.</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {visibles.map((comanda) => (
                      <div
                        key={comanda._id}
                        className="bg-orange-100 rounded p-4 cursor-pointer hover:bg-orange-200 transition"
                        onClick={() =>
                          history.push({
                            pathname: '/comanda',
                            state: { comandaId: comanda._id }
                          })
                        }
                        
                      >
                        <h2 className="text-orange-700 font-semibold">Vol: {comanda.num_vol}</h2>
                        <p className="text-sm text-gray-700">Companyia: {comanda.companya_aerea}</p>
                        <p className="text-sm text-gray-700">Estat: {comanda.estat}</p>
                      </div>
                    ))}
                  </div>

                  {/*  Paginació */}
                  <div className="flex justify-between items-center mt-6">
                    <IonButton disabled={paginaActual === 1} onClick={anterior}>
                      Anterior
                    </IonButton>
                    <span className="text-sm text-gray-600">
                      Pàgina {paginaActual} de {totalPagines}
                    </span>
                 
                  </div>
                </>
              )}
            </div>
          </div>

          {/*  Panell dret només per escriptori */}
          <div className="hidden md:flex w-1/5 bg-white border-l p-4 flex-col justify-start items-center space-y-4">
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/geolocation">
              VOLS
            </IonButton>
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/chatlist">
              CHATS
            </IonButton>
          
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default ComandaList;