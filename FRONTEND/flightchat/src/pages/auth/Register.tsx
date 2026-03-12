import { IonPage, IonContent } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const history = useHistory();
  const API_URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Les contrasenyes no coincideixen");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: name,
          cognoms: surname,
          data_naixement: birthdate,
          telefon: phone,
          email,
          contrasenya: password,
        }),
      });

      if (!res.ok) throw new Error('Error en el registre');

      alert("Registre completat. Espera la validació de l'administrador.");
      history.push('/login');
    } catch (err) {
      console.error('❌ Error en el registre:', err);
      alert('No s’ha pogut completar el registre');
    }
  };

  return (
    <IonPage>
      <ToolbarHeader title="Flightchat" />
      <IonContent className="bg-gray-100">
        <div className="h-full flex">

          {/* 📋 Panell esquerre: només es mostra en md+ */}
          <div className="hidden md:flex w-1/5 bg-white border-r p-4 flex-col justify-start items-center"></div>

          {/* 🧾 Formulari central */}
          <div className="flex-1 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">
                Registra't a Flightchat
              </h1>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                    Cognoms
                  </label>
                  <input
                    id="surname"
                    type="text"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de naixement
                  </label>
                  <input
                    id="birthdate"
                    type="date"
                    required
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telèfon
                  </label>
                  <input
                    id="phone"
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correu electrònic
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirma la contrasenya
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-orange-500 text-white font-semibold py-2 rounded hover:bg-orange-600 transition duration-200"
                >
                  Enviar
                </button>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Ja tens compte?{' '}
                  <span
                    className="text-orange-600 hover:underline cursor-pointer"
                    onClick={() => history.push('/login')}
                  >
                    Inicia sessió
                  </span>
                </p>
              </form>
            </div>
          </div>

         
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
