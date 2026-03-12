import {
  IonPage,
  IonContent,
  IonSpinner,
  IonButton
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';

interface Comanda {
  _id: string;
  estat: string;
  companya_aerea: string;
  num_vol: string;
  menjar: {
    codi: string;
    quantitat: number;
  }[];
}

const Comanda: React.FC = () => {
  const location = useLocation<{ comandaId?: string }>();
  const history = useHistory();
  const [comanda, setComanda] = useState<Comanda | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const comandaId = location.state?.comandaId || sessionStorage.getItem('comandaId');
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (comandaId) {
      sessionStorage.setItem('comandaId', comandaId);
    } else {
      history.replace('/comandes');
    }
  }, [comandaId, history]);

  useEffect(() => {
    if (!comandaId) return;

    const fetchComanda = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/orders/${comandaId}`, {
          headers: {
            Authorization: `jwt ${token}`
          }
        });
        const data = await res.json();
        setComanda(data);
      } catch (err) {
        console.error('Error carregant la comanda:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComanda();
  }, [comandaId]);

  return (
    <IonPage>
      <ToolbarHeader title="Flightchat" showNavButtons />
      <IonContent className="bg-gray-100 h-full">
        <div className="h-full flex">

          {/* 📋 Panell esquerre només per escriptori */}
          <div className="hidden md:flex w-1/5 bg-white border-r p-4 flex-col justify-start items-center">
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/chatlist">
              CHATS
            </IonButton>
          </div>

          {/* 🧾 Contingut central */}
          <div className="flex-1 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <IonSpinner name="crescent" />
                </div>
              ) : comanda ? (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">Vol: {comanda.num_vol}</h1>
                  <p className="text-sm text-gray-700 text-center">Companyia: <strong>{comanda.companya_aerea}</strong></p>
                  <p className="text-sm text-gray-700 text-center">Estat: <strong>{comanda.estat}</strong></p>

                  <div className="mt-4">
                    <h3 className="text-lg text-gray-800 font-semibold mb-2">Codi assignat:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-800">
                      {comanda.menjar?.map((item, idx) => (
                        <li key={idx}>{item.codi} + {item.quantitat}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">No s'ha trobat la comanda.</p>
              )}
            </div>
          </div>

          {/* 🔘 Panell dret només per escriptori */}
          <div className="hidden md:flex w-1/5 bg-white border-l p-4 flex-col justify-start items-center space-y-4">
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/comandes">
              COMANDES
            </IonButton>
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/geolocation">
              VOLS
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

export default Comanda;