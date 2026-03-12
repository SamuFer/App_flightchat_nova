import { IonToast } from '@ionic/react';
import { useState } from 'react';

interface Props {
  message: string;
  duration?: number;
}

const ToastMessage: React.FC<Props> = ({ message, duration = 2000 }) => {
  const [show, setShow] = useState(true);

  return (
    <IonToast
      isOpen={show}
      onDidDismiss={() => setShow(false)}
      message={message}
      duration={duration}
      position="bottom"
    />
  );
};

export default ToastMessage;

// This component is a simple toast message that appears at the bottom of the screen. Missatge temporal