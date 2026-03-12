import { IonFooter, IonToolbar, IonTitle } from '@ionic/react';

const Footer: React.FC = () => {
  return (
    <IonFooter>
      <IonToolbar className="bg-gray-900 text-white">
        <IonTitle className="text-center text-sm">
          © {new Date().getFullYear()} FlightChat · Tots els drets reservats
        </IonTitle>
      </IonToolbar>
    </IonFooter>
  );
};

export default Footer;
