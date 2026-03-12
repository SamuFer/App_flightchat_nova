import {
  IonPage,
  IonContent,
  IonSpinner,
  IonButton
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';

interface Chat {
  _id: string;
  companya_aerea: string;
  num_vol: string;
  menjar: {
    codi: string;
    quantitat: number;
  }[];
  assignar_equip: {
    email: string;
    nom: string;
    rol: string;
  }[];
}

const ChatList: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const perPagina = 3;

  const history = useHistory();
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const carregarChats = async () => {
      try {
        const res = await fetch(`${API_URL}/chats/actius`, {
          headers: {
            Authorization: `jwt ${token}`,
          },
        });
        if (!res.ok) throw new Error('Error carregant xats');
        const dades = await res.json();
        const filtrats = dades.filter((chat: Chat) =>
          chat.assignar_equip.some((u) => u.email === email)
        );
        setChats(filtrats);
      } catch (err) {
        console.error('❌ Error carregant xats:', err);
      } finally {
        setLoading(false);
      }
    };
    carregarChats();
  }, [email, token]);

  const totalPagines = Math.ceil(chats.length / perPagina);
  const inici = (paginaActual - 1) * perPagina;
  const visibles = chats.slice(inici, inici + perPagina);

  const anterior = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const seguent = () => setPaginaActual((p) => Math.min(p + 1, totalPagines));

  return (
    <IonPage>
      <ToolbarHeader title="Flightchat" showNavButtons />
      <IonContent className="bg-gray-100 h-full">
        <div className="h-full flex">

          {/* 📋 Panell esquerre només per escriptori */}
          <div className="hidden md:flex w-1/5 bg-white border-r p-4 flex-col justify-start items-center">
            <IonButton expand="block" className="bg-orange-500 text-white w-full" routerLink="/incidencies">
              INCIDÈNCIES
            </IonButton>
          </div>

          {/* 🔘 Contingut principal */}
          <div className="flex-1 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
              <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">Xats Actius</h1>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <IonSpinner name="crescent" />
                </div>
              ) : chats.length === 0 ? (
                <p className="text-center text-gray-500">No hi ha cap xat actiu associat al teu compte.</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {visibles.map((chat) => (
                      <div
                        key={chat._id}
                        className="bg-orange-100 rounded p-4 cursor-pointer hover:bg-orange-200 transition"
                        onClick={() => {
                          console.log('➡️ Navegant al xat amb ID:', chat._id);
                          history.push({
                            pathname: '/chat',
                            state: { chatId: chat._id, vol: chat.num_vol, companyia: chat.companya_aerea, menjar: chat.menjar, participants: chat.assignar_equip  }
                          });
                        }}
                      >
                        <h2 className="text-orange-700 font-semibold">Vol: {chat.num_vol}</h2>
                        <p className="text-sm text-gray-700">Companyia: {chat.companya_aerea}</p>
                        <p className="text-sm text-gray-700">Participants: {chat.assignar_equip.map(u => u.nom).join(', ')}</p>
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

export default ChatList;