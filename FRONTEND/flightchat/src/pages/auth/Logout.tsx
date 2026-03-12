import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useEffect } from 'react';

const Logout: React.FC = () => {
  useEffect(() => {
    // 🔁 Neteja completa del localStorage
    localStorage.clear();

    // ✅ Força reload de tota l'aplicació (com si obrissis un tab nou)
    setTimeout(() => {
      window.location.replace('/login'); // 🟢 Alternativa més segura que href
    }, 200);
  }, []);

  return (
    <IonPage>
      <IonContent className="flex items-center justify-center h-full">
        <div className="text-center">
          <IonSpinner name="dots" />
          <p className="mt-4 text-gray-500">Tancant sessió...</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Logout;
