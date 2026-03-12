import { IonPage, IonContent } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';

interface UsuariData {
  nom: string;
  cognoms: string;
  email: string;
  descripcio?: string;
  avatar?: string; // base64
}

const Usuari: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [usuari, setUsuari] = useState<UsuariData | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchUsuari = async () => {
      try {
        const res = await fetch(`${API_URL}/usuaris/${email}`);
        if (!res.ok) throw new Error('No s’ha pogut carregar l’usuari');
        const data = await res.json();
        setUsuari(data);
      } catch (err) {
        console.error('❌ Error carregant usuari:', err);
      }
    };

    fetchUsuari();
  }, [email]);

  return (
    <IonPage>
      <ToolbarHeader title="Perfil públic" />
      <IonContent className="ion-padding">
        {!usuari ? (
          <p>Carregant...</p>
        ) : (
          <div className="text-blue-700">
            {usuari.avatar && (
              <img
                src={usuari.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full mb-4"
              />
            )}
            <h2 className="text-xl font-bold">{usuari.nom} {usuari.cognoms}</h2>
            <p className="mb-1">Email: {usuari.email}</p>
            <p>Descripció: {usuari.descripcio || 'Sense descripció'}</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Usuari;
