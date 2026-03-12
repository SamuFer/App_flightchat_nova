import {
    IonPage,
    IonContent,
    IonButton
  } from '@ionic/react';
  import { useEffect, useState } from 'react';
  import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';
  
  interface Informe {
    _id: string;
    companya_aerea: string;
    num_vol: string;
    estat: string;
    menjar: { codi: string; quantitat: number }[];
    createdAt: string;
  }
  
  const InformeList: React.FC = () => {
    const [informes, setInformes] = useState<Informe[]>([]);
    const [error, setError] = useState<string | null>(null);
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
      const fetchInformes = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/informes`, {
            headers: {
              Authorization: `jwt ${token}`
            }
          });
  
          if (!res.ok) throw new Error('Error en carregar els informes');
          const data = await res.json();
          setInformes(data);
        } catch (err) {
          console.error(err);
          setError('No s’han pogut carregar els informes.');
        }
      };
  
      fetchInformes();
    }, []);
  
    return (
      <IonPage>
        <ToolbarHeader title="Informes de comandes" showNavButtons />
        <IonContent className="bg-gray-100 h-full">
          <div className="h-full flex">
  
            {/* 📋 Panell esquerre només per escriptori */}
            <div className="hidden md:flex w-1/5 bg-white border-r p-4 flex-col justify-start items-center">
              <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/comandes">
                COMANDES
              </IonButton>
            </div>
  
            {/* 🧾 Contingut central */}
            <div className="flex-1 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
                <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">Informes registrats</h1>
  
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
  
                {informes.length === 0 ? (
                  <p className="text-gray-700 text-center">No hi ha informes registrats.</p>
                ) : (
                  <div className="space-y-4">
                    {informes.map((inf) => (
                      <div key={inf._id} className="bg-orange-100 rounded p-4">
                        <h2 className="text-orange-700 font-semibold">Vol: {inf.num_vol}</h2>
                        <p className="text-sm text-gray-700">Companyia: {inf.companya_aerea}</p>
                        <p className="text-sm text-gray-700">Estat: {inf.estat}</p>
                        <p className="text-sm text-gray-500 mb-2">Data: {new Date(inf.createdAt).toLocaleString()}</p>
                        <ul className="text-sm text-gray-800 list-disc ml-5">
                          {inf.menjar.map((m, i) => (
                            <li key={i}>{m.codi} - {m.quantitat}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
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
              <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/incidencies">
                INCIDÈNCIES
              </IonButton>
            </div>
  
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default InformeList;
  