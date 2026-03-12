import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem } from '@ionic/react';
import { useEffect, useState } from 'react';
import { getUsuaris } from '../../services/api';

const Usuaris: React.FC = () => {
  const [usuaris, setUsuaris] = useState([]);

  useEffect(() => {
    getUsuaris()
      .then(data => setUsuaris(data))
      .catch(err => console.error('Error carregant usuaris:', err));
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Usuaris</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {usuaris.map((usuari: any) => (
            <IonItem key={usuari.id}>{usuari.nom}</IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Usuaris;
