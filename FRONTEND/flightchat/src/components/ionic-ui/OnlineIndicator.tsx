interface Props {
    online: boolean;
  }
  
  const OnlineIndicator: React.FC<Props> = ({ online }) => (
    <span className={`inline-block w-3 h-3 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
  );
  
  export default OnlineIndicator;
  
// Indicador d’estat en línia, Component que mostra un indicador d'estat en líniai es pot reutilitzar en diferents parts de l'aplicació. Utilitza Ionic React per crear un indicador d'estat ¡ que es pot mostrar com a cercle de color verd quan l'usuari està en línia o gris quan no ho està. El component rep un prop "online" que determina l'estat de l'usuari.
