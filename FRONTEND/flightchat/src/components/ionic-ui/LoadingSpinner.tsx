import { IonSpinner } from '@ionic/react';

interface Props {
  text?: string;
}

const LoadingSpinner: React.FC<Props> = ({ text = "Carregant..." }) => (
  <div className="flex flex-col items-center justify-center p-6">
    <IonSpinner name="crescent" />
    <p className="mt-2 text-gray-600 text-sm">{text}</p>
  </div>
);

export default LoadingSpinner;

// Spinner de càrrega
// Componente de càrrega que mostra un missatge opcional