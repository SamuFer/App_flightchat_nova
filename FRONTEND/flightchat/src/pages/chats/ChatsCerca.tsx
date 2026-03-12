import React, { useState } from 'react';
import { IonPage, IonContent, IonSearchbar } from '@ionic/react';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';

interface ChatsCercaProps {
  messages: { from: string; to: string; text: string }[];
}

const ChatsCerca: React.FC<ChatsCercaProps> = ({ messages }) => {
  const [searchText, setSearchText] = useState('');

  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <ToolbarHeader title="Cerca en aquest xat" />
      <IonContent className="bg-gray-100 p-4">
        <IonSearchbar
          placeholder="Busca un missatge..."
          animated={true}
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
        />

        <div className="mt-4 space-y-2">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg, i) => (
              <div key={i} className="bg-white p-3 rounded shadow">
                <p className="text-sm text-gray-700">
                  <strong>{msg.from}:</strong> {msg.text}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Cap resultat trobat.</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}; 

export default ChatsCerca;
