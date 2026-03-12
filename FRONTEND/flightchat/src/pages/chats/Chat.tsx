import './Chat.css';
import {
  IonPage,
  IonContent,
  IonSpinner,
  IonButton,
  IonIcon
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { camera, navigate } from 'ionicons/icons';
import ChatBubble from '../../components/ionic-ui/ChatBubble';
import ChatInput from '../../components/ionic-ui/ChatInput';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';
import ToastMessage from '../../components/ionic-ui/ToastMessage';
import ChatSearchbar from '../../components/ionic-ui/ChatSearchbar';

interface Message {
  from: {
    nom: string;
    email: string;
    rol: string;
  };
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const location = useLocation<{
  chatId?: string;
  vol?: string;
  companyia?: string;
  menjar?: { codi: string; quantitat: number }[];
  participants?: { email: string; nom: string; rol: string }[];
  }>();

  const jwt = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  const userNom = localStorage.getItem('nom');
  const userEmail = localStorage.getItem('email');
  const userRol = localStorage.getItem('role');
  const chatId = location.state?.chatId || sessionStorage.getItem('chatId');
  const vol = location.state?.vol;
  const companyia = location.state?.companyia;  
  const menjar = location.state?.menjar || [];
  const participants = location.state?.participants || [];
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    if (chatId) {
      sessionStorage.setItem('chatId', chatId);
    } else {
      history.replace('/chatlist');
    }
  }, [chatId, history]);

  useEffect(() => {
    if (!jwt || !chatId) return;

    const socketInstance = io(BASE_URL, {
      auth: { token: jwt },
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      socketInstance.emit('joinChat', chatId);
    });

    socketInstance.on('newMessage', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(socketInstance);

    fetch(`${API_URL}/chats/${chatId}/messages`, {
      headers: { Authorization: `jwt ${jwt}` }
    })
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error carregant missatges antics', err);
        setLoading(false);
      });

    return () => {
      socketInstance.disconnect();
    };
  }, [jwt, chatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!socket || !chatId || !userId || !userNom || !userEmail || !userRol) return;

    const messageData = {
      chatId,
      message: {
        from: {
          _id: userId,
          nom: userNom,
          cognoms: '',
          email: userEmail,
          rol: userRol
        },
        content: text
      }
    };
    
    socket.emit('sendMessage', messageData);
    
  };

  const ferFoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      if (image.base64String) {
        const base64Img = `data:image/jpeg;base64,${image.base64String}`;
        // setMessages((prev) => [
        //   ...prev,
        //   {
        //     from: {
        //       nom: userNom!,
        //       email: userEmail!,
        //       rol: userRol!
        //     },
        //     content: `<img src="${base64Img}" alt="Foto" class="rounded max-h-48"/>`
        //   }
        // ]);

        if (socket && chatId) {
          socket.emit('sendMessage', {
            chatId,
            message: {
              from: {
                _id: userId,
                nom: userNom,
                cognoms: '',
                email: userEmail,
                rol: userRol
              },
              content: `<img src="${base64Img}" alt="Foto" class="rounded max-h-48"/>`
            }
          });
        }
      }
    } catch (error) {
      console.error('❌ Error capturant la imatge:', error);
    }
  };

  const enviarUbicacio = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const mapLink = `https://maps.google.com/?q=${lat},${lon}`;
      const missatge = `\ud83d\udccd Posició actual: ${mapLink}`;
      sendMessage(missatge);
    } catch (error) {
      console.error('❌ No s’ha pogut obtenir la ubicació:', error);
    }
  };

  const missatgesFiltrats = messages.filter((msg) =>
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <IonPage>
      <ToolbarHeader title="Flightchat" showNavButtons/>
      <IonContent className="bg-gray-100">
        <div className="h-full flex">

          {/*  Panell esquerre */}
          <div className="hidden md:flex w-1/5 bg-white border-r p-4 flex-col justify-start items-center">
            <IonButton expand="block" className="bg-orange-500 text-white font-semibold w-full" routerLink="/incidencies">
              INCIDÈNCIES
            </IonButton>
          </div>

          {/*  Panell central */}
          <div className="flex-1 flex justify-center items-center">
            
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <IonSpinner name="crescent" />
                <p className="ml-4 text-gray-500">Carregant xat...</p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-full md:max-w-none h-[90vh] flex flex-col">
                <h1 className="text-2xl font-bold text-orange-600 mb-2 text-center">Xat Actiu</h1>
                {/* Botón para mostrar/ocultar info del vuelo */}
                <div className="w-full flex gap-2 justify-between mb-1 my-14">
                  <div className="flex gap-2">
                    <IonButton onClick={ferFoto} className="camera-button bg-orange-500 text-white" size="small">
                      <IonIcon slot="icon-only" icon={camera} />
                    </IonButton>
                    <IonButton onClick={enviarUbicacio} className="bg-blue-500 text-white" size="small">
                      <IonIcon slot="start" icon={navigate} />
                      Enviar ubicació
                    </IonButton>
                  </div>
                  <IonButton
                    color="warning"
                    size="small"
                    onClick={() => setShowFlightInfo(!showFlightInfo)}
                  >
                    {showFlightInfo ? 'Ocultar info' : `Mostrar info del vol (${vol})`}
                  </IonButton>
                </div>
                {showFlightInfo && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-2 mb-2 text-sm text-gray-800 shadow-sm">
                    {vol && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-orange-500 text-lg">✈️</span>
                        <span><strong>Vol:</strong> {vol}</span>
                      </div>
                    )}

                    {companyia && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-orange-500 text-lg">🏢</span>
                        <span><strong>Companyia:</strong> {companyia}</span>
                      </div>
                    )}
                    {participants.length > 0 && (
                      <div className="flex items-start gap-2 mb-1">
                        <span className="text-orange-500 text-lg">👥</span>
                        <span><strong>Participants:</strong> {participants.map(p => p.nom).join(', ')}</span>
                      </div>
                    )}
                    {menjar.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-orange-500 text-lg">🍽️</span>
                        <span><strong>Pedidos:</strong> {menjar.map(p => `${p.codi} (${p.quantitat} unitats)`).join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}
                {/*  Botons d'acció */}
             
                <ChatSearchbar onSearch={(text) => setSearchTerm(text)} />

                <div className="flex-1 overflow-y-auto space-y-2 mt-2 p-2 border border-gray-300 rounded">
                  {missatgesFiltrats.map((msg, index) => (
                    <ChatBubble
                      key={index}
                      message={msg.content}
                      author={msg.from.nom}
                      own={msg.from.email === userEmail}
                    />
                  ))}
                  <div ref={scrollRef} />
                </div>

                <div className="mt-4">
                  <ChatInput onSend={sendMessage} />
                </div>
              </div>
            )}
          </div>

          {/*  Panell dret */}
          <div className="hidden md:flex w-1/5 bg-white border-l p-4 flex-col justify-start items-center space-y-6">
            <IonButton expand="block" className="bg-orange-500 text-white font-semibold w-full" routerLink="/chatlist">
              CHATS
            </IonButton>
            <IonButton expand="block" className="bg-orange-500 text-white font-semibold w-full" routerLink="/geolocation">
              VOLS
            </IonButton>
            <IonButton expand="block" className="bg-orange-500 text-white font-semibold w-full" routerLink="/comandes">
              COMANDES
            </IonButton>
          </div>

        </div>

        {toastMessage && <ToastMessage message={toastMessage} />}
        {!connected && <ToastMessage message="WebSocket desconnectat" />}
      </IonContent>
    </IonPage>
  );
};

export default Chat;