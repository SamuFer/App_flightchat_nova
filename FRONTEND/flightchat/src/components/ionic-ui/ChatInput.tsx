import { IonInput, IonButton } from '@ionic/react';
import { useState } from 'react';

interface Props {
  onSend: (msg: string) => void;
}

const ChatInput: React.FC<Props> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-2">
      <IonInput
        value={message}
        placeholder="Escriu un missatge..."
        onIonChange={(e) => setMessage(e.detail.value!)}
        className="flex-1 bg-white rounded px-3 py-2 text-black"
      />
      <IonButton onClick={handleSend}>Envia</IonButton>
    </div>
  );
};

export default ChatInput;


//Input amb botó d’enviament