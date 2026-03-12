import {
    IonPage,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
  } from '@ionic/react';
  import { useEffect, useState } from 'react';
  import { useHistory } from 'react-router-dom';
  import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';
  
  const UserList: React.FC = () => {
    const [users, setUsers] = useState<string[]>([]);
    const history = useHistory();
    const API_URL = import.meta.env.VITE_API_URL;
  
    useEffect(() => {
      const fetchOnlineUsers = async () => {
        try {
          const res = await fetch(`${API_URL}/online-users`);
          if (!res.ok) throw new Error('No s\'han pogut carregar els usuaris online');
          const data = await res.json();
          setUsers(data); // espera un array d'emails, ex: ["anna@exemple.cat", "joan@exemple.cat"]
        } catch (err) {
          console.error('❌ Error carregant usuaris:', err);
        }
      };
  
      fetchOnlineUsers();
    }, []);
  
    const startChat = (email: string) => {
      history.push(`/chat/${email}`);
    };
  
    const viewProfile = (email: string) => {
      history.push(`/users/${encodeURIComponent(email)}`); // encode per si hi ha caràcters especials
    };
  
    return (
      <IonPage>
        <ToolbarHeader title="Usuaris online" />
        <IonContent className="ion-padding">
          <IonList>
            {users.map((email) => (
              <IonItem key={email}>
                <IonLabel>{email}</IonLabel>
                <IonButton slot="end" onClick={() => startChat(email)}>
                  Xateja
                </IonButton>
                <IonButton slot="end" color="secondary" onClick={() => viewProfile(email)}>
                  Perfil
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonPage>
    );
  };
  
  export default UserList;
  