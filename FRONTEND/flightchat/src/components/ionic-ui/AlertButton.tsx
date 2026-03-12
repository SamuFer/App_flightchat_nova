import { IonAlert, IonButton } from '@ionic/react';
import { useState } from 'react';

interface Props {
  message: string;
  buttonText?: string;
}

const AlertButton: React.FC<Props> = ({ message, buttonText = "Mostrar alerta" }) => {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <IonButton onClick={() => setShowAlert(true)}>{buttonText}</IonButton>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Atenció"
        message={message}
        buttons={['OK']}
      />
    </>
  );
};

export default AlertButton;

// // This component is a button that, when clicked, shows an alert with a message. The alert has a single "OK" button to dismiss it. The button text can be customized through the buttonText prop.   Botó d’alerta
