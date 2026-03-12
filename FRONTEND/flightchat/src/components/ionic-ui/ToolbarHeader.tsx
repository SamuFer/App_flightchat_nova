import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/react';
import { personCircle, menuOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface Props {
  title: string;
  showNavButtons?: boolean;
}

const ToolbarHeader: React.FC<Props> = ({ title, showNavButtons }) => {
  const history = useHistory();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const avatar = localStorage.getItem('avatar');
  const email = localStorage.getItem('email');

  const goToPerfil = () => {
    if (email) {
      history.push(`/perfil`);
    }
  };

  const goToLogin = () => {
    history.push('/login');
  };

  const goToRegister = () => {
    history.push('/register');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('avatar');
    history.push('/login');
  };

  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isHomePage = location.pathname.toLowerCase() === '/home';

  return (
    <IonHeader>
      <IonToolbar className="flex justify-between items-center px-4 relative z-10">
        {/* Botón hamburguesa (a la izquierda, solo móvil) */}
        {showNavButtons && (
          <IonButtons slot="start" className="block md:hidden">
            <IonButton onClick={() => setMenuOpen(!menuOpen)}>
              <IonIcon icon={menuOutline} />
            </IonButton>
          </IonButtons>
        )}

        {/* Logo y título */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Flightchat logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-orange-500 font-bold text-lg">{title}</span>
        </div>

        {/* Botones de navegación y usuario */}
        <IonButtons slot="end" className="flex items-center gap-2">
          {token ? (
            <>
              <p className="hidden sm:block text-sm text-white-600">{email}</p>
              <IonButton onClick={goToPerfil}>
                <IonIcon slot="icon-only" icon={personCircle} />
              </IonButton>
              <IonButton onClick={handleLogout}>Logout</IonButton>
            </>
          ) : (
            <>
              {!isLoginPage && !isHomePage && (
                <IonButton onClick={goToLogin}>Login</IonButton>
              )}
              {!isRegisterPage && (
                <IonButton onClick={goToRegister}>Register</IonButton>
              )}
            </>
          )}
        </IonButtons>
      </IonToolbar>

      {/* Menú móvil (fuera del Toolbar) */}
      {showNavButtons && menuOpen && (
        <div className="md:hidden bg-white shadow-md z-50 flex flex-col space-y-1 p-4">
          <IonButton color="secondary" expand="block" routerLink="/comandes" onClick={() => setMenuOpen(false)}>Comandes</IonButton>
          <IonButton color="secondary" expand="block" routerLink="/chatlist" onClick={() => setMenuOpen(false)}>Chats</IonButton>
          <IonButton color="secondary" expand="block" routerLink="/geolocation" onClick={() => setMenuOpen(false)}>Vols</IonButton>
          <IonButton color="secondary" expand="block" routerLink="/incidencies" onClick={() => setMenuOpen(false)}>Incidències</IonButton>
          <IonButton color="secondary" expand="block" routerLink="/" onClick={() => setMenuOpen(false)}>Crear incidencia</IonButton>
        </div>
      )}
    </IonHeader>
  );
};

export default ToolbarHeader;
