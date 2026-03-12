import { IonSearchbar } from '@ionic/react';
import { useState } from 'react';

interface Props {
  onSearch: (text: string) => void;
}

const ChatSearchbar: React.FC<Props> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleChange = (e: CustomEvent) => {
    const value = e.detail.value!;
    setSearchText(value);
    onSearch(value);
  };

  return (
    <IonSearchbar
      value={searchText}
      onIonChange={handleChange}
      placeholder="Cerca dins del xat..."
      animated={true}
    />
  );
};

export default ChatSearchbar;
