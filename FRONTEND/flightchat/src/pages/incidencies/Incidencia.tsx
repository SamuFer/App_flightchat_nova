import {
  IonPage,
  IonContent,
  IonButton,
  IonSpinner
} from '@ionic/react';
import { useEffect, useState } from 'react';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';
import { useHistory } from 'react-router-dom';

const Incidencia: React.FC = () => {
  const [companyia, setCompanyia] = useState('');
  const [vol, setVol] = useState('');
  const [codi, setCodi] = useState('');
  const [quantitat, setQuantitat] = useState('');
  const [resum, setResum] = useState<{ codi: string; quantitat: string }[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${API_URL}/companies`);
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error('Error carregant companyies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const afegirItem = () => {
    if (codi && quantitat) {
      setResum([...resum, { codi, quantitat }]);
      setCodi('');
      setQuantitat('');
    }
  };

  const eliminarItem = (index: number) => {
    setResum(resum.filter((_, i) => i !== index));
  };

  const enviarComanda = async () => {
    const comanda = {
      companyia,
      vol,
      items: resum.map(item => `${item.codi} - ${item.quantitat}`),
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `jwt ${token}`,
        },
        body: JSON.stringify(comanda),
      });

      if (!res.ok) throw new Error('Error en enviar la comanda');
      alert('✅ Incidència enviada correctament');
      setCompanyia('');
      setVol('');
      setResum([]);
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Error en enviar la incidència');
    }
  };

  const volsFiltrats = companies.find((c) => c.companyia === companyia)?.vols || [];

  if (loading) {
    return (
      <IonPage>
        <ToolbarHeader title="Flightchat"/>
        <IonContent className="bg-gray-100">
          <div className="flex justify-center items-center h-full">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <ToolbarHeader title="Flightchat" showNavButtons/>
      <IonContent className="bg-gray-100">
        <div className="h-full flex">

          {/* 📋 Panell esquerre: només es mostra en md+ */}
          <div className="hidden md:flex w-1/5 bg-white border-r p-4 flex-col justify-start items-center">

            <IonButton expand="block" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded w-full" onClick={() => history.push('/incidencies')}>
              INCIDÈNCIES
            </IonButton>
          </div>

          {/* 🧾 Formulari central */}
          <div className="flex-1 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
              <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">Incidència</h1>
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Companyia Aèria</label>
                  <select
                    value={companyia}
                    onChange={(e) => {
                      setCompanyia(e.target.value);
                      setVol('');
                    }}
                    className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">Selecciona una companyia</option>
                    {companies.map((c) => (
                      <option key={c._id} value={c.companyia}>{c.companyia}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vol Nº</label>
                  <select
                    value={vol}
                    onChange={(e) => setVol(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    disabled={!companyia}
                  >
                    <option value="">Selecciona un vol</option>
                    {volsFiltrats.map((v: string, idx: number) => (
                      <option key={idx} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Codi</label>
                    <select
                      value={codi}
                      onChange={(e) => setCodi(e.target.value)}
                      className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="">Selecciona un codi</option>
                      <option value="GFML">GFML</option>
                      <option value="KSML">KSML</option>
                      <option value="VLML">VLML</option>
                      <option value="AVML">AVML</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantitat</label>
                    <input
                      type="number"
                      value={quantitat}
                      onChange={(e) => setQuantitat(e.target.value)}
                      className="bg-white text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>
                <IonButton expand="block" onClick={afegirItem} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition duration-200">
                  Afegir
                </IonButton>

                <div className="bg-gray-100 w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 space-y-2">
                  {resum.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{item.codi} - {item.quantitat}</span>
                      <button
                        type="button"
                        onClick={() => eliminarItem(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>

                <IonButton expand="block" onClick={enviarComanda} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition duration-200">
                  Enviar Incidència
                </IonButton>
              </form>
            </div>
          </div>

          {/* 🔘 Panell dret: només es mostra en md+ */}
          <div className="hidden md:flex w-1/5 bg-white border-l p-4 flex-col justify-start items-center space-y-6">
            <IonButton expand="block" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded w-full" onClick={() => history.push('/chatlist')}>
              CHATS
            </IonButton>
            <IonButton expand="block" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded w-full" onClick={() => history.push('/geolocation')}>
              VOLS
            </IonButton>
            <IonButton
              expand="block"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded w-full"
              onClick={() => history.push('/comandes')}
            >
              COMANDES
            </IonButton>

            
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Incidencia;