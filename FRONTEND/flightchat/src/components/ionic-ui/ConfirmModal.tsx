import { IonAlert } from '@ionic/react';
import { useState } from 'react';

interface Props {
  onConfirm: () => void;
  title: string;
  message: string;
  triggerText: string;
}

const ConfirmModal: React.FC<Props> = ({ onConfirm, title, message, triggerText }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-white bg-red-600 px-4 py-2 rounded">
        {triggerText}
      </button>
      <IonAlert
        isOpen={open}
        onDidDismiss={() => setOpen(false)}
        header={title}
        message={message}
        buttons={[
          {
            text: 'Cancel·la',
            role: 'cancel',
          },
          {
            text: 'Confirma',
            handler: () => onConfirm(),
          },
        ]}
      />
    </>
  );
};

export default ConfirmModal;


// This component is a confirmation modal that appears when the user clicks a button. It asks for confirmation before executing an action. The modal has a title, message, and two buttons: "Cancel·la" and "Confirma". The "Confirma" button executes the onConfirm function passed as a prop.   Confirmació amb acció