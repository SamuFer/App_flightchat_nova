import { IonContent, IonPage, IonButton } from '@ionic/react';
import ToolbarHeader from '../components/ionic-ui/ToolbarHeader';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      history.push('/incidencies'); // o la pàgina per defecte del teu usuari
    }
  }, [token, history]);

  const goToLogin = () => {
    history.push('/login');
  };

  return (
    <IonPage>
      <ToolbarHeader title="Flightchat" />
      <IonContent className="bg-gray-100">
        <div className="h-full flex flex-col justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-orange-700 mb-4 text-center">
              Benvingut/da a FlightChat
            </h2>
            <p className="text-gray-600 text-lg text-center mb-4">
              Per continuar, inicia sessió.
            </p>
            <div className="flex justify-center">
              <IonButton onClick={goToLogin} color="primary">
                Inicia Sessió
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;