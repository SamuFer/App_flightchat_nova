import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';

/* RUTES */
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Logout from './pages/auth/Logout';
import PrivateRoute from './components/PrivateRoute';
import Chat from './pages/chats/Chat';
import ChatList from './pages/chats/ChatList';
import UserList from './pages/users/UserList';

import Perfil from './pages/users/Perfil';
import Usuari from './pages/users/Usuari';
import Geolocation from './pages/geolocalitzacio/Geolocation';
import Comanda from './pages/comandes/Comanda';
import ComandaList from './pages/comandes/ComandaList';
import Incidencia from './pages/incidencies/Incidencia';
import IncidenciaList from './pages/incidencies/IncidenciaList';


/* CSS IONIC */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

/* TEMA */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin');
  const isRepartidor = localStorage.getItem('isRepartidor');

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>

          {/* RUTES PÚBLIQUES */}
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/logout">
            <Logout />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>

          {/* RUTES PROTEGIDES */}
          <PrivateRoute exact path="/users">
            <UserList />
          </PrivateRoute>
          <PrivateRoute exact path="/chat">
            <Chat />
          </PrivateRoute>
          <PrivateRoute exact path="/chatlist">
            <ChatList />
          </PrivateRoute>
          <PrivateRoute exact path="/perfil">
            <Perfil />
          </PrivateRoute>
          <PrivateRoute exact path="/usuari/:email">
            <Usuari />
          </PrivateRoute>
          <PrivateRoute exact path="/geolocation">
            <Geolocation />
          </PrivateRoute>
          <PrivateRoute exact path="/incidencia">
            <Incidencia />
          </PrivateRoute>
          <PrivateRoute exact path="/incidencies">
            <IncidenciaList />
          </PrivateRoute>
          <PrivateRoute exact path="/incidencies/:id">
            <Incidencia />
          </PrivateRoute>
          {/* <PrivateRoute exact path="/comanda">
            <Comanda />
          </PrivateRoute> */}
          <PrivateRoute exact path="/comandes">
            <ComandaList />
          </PrivateRoute>
          <PrivateRoute exact path="/comanda">
            <Comanda />
          </PrivateRoute>
          <PrivateRoute exact path="/perfil/:email">
            <Perfil />
          </PrivateRoute>

          {/* RUTA PER DEFECTE */}
          <Route exact path="/">
            <Redirect to={isLoggedIn ? "/incidencia" : "/home"} />
          </Route>

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
