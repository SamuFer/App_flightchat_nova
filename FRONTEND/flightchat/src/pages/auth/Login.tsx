import { IonPage, IonContent } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const API_URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 🔁 Elimina TOT el localStorage abans del login
      localStorage.clear();

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasenya: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || 'Credencials incorrectes');
        return;
      }


      if (!data.estat_compte) {
        alert("El teu compte encara no ha estat validat per l'administrador.");
        return;
      }

      localStorage.setItem('token', data.jwt_token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('role', data.role_id.nom);
      localStorage.setItem('user_id', data._id);
      localStorage.setItem('nom', data.nom);

      // ✅ Navegació amb `state` net
      
      history.replace({
        pathname: '/incidencia',
        state: {}
      });
      window.location.reload(); // 🔄 limpio
    } catch (err) {
      console.error('❌ Error de login:', err);
      alert('Login fallit');
    }
  };

  return (
    <IonPage>
      <ToolbarHeader title="Flightchat" />
      <IonContent className="bg-gray-100">
        <div className="h-full flex">
          <div className="flex-1 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">Inicia sessió</h1>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correu electrònic
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contrasenya
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-orange-500 text-white font-semibold py-2 rounded hover:bg-orange-600 transition duration-200"
                >
                  Entra
                </button>
              </form>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
