import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import ToolbarHeader from '../../components/ionic-ui/ToolbarHeader';

interface Usuari {
  nom: string;
  cognoms: string;
  email: string;
  data_naixement: string;
  telefon: string;
  avatar?: string;
  avatarFile?: File;
  role: string;
}

const Perfil: React.FC = () => {
  const [usuari, setUsuari] = useState<Usuari | null>(null);
  const [formData, setFormData] = useState<Usuari | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `jwt ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al cargar perfil');

        const userData: Usuari = {
          nom: data.nom,
          cognoms: data.cognoms,
          email: data.email,
          data_naixement: data.data_naixement?.substring(0, 10) || '',
          telefon: data.telefon,
          avatar: data.avatar ?? undefined,
          role: data.role_id?.nom || 'Desconegut',
        };
        setUsuari(userData);
        setFormData(userData);
      } catch (error) {
        console.error('Error carregant el perfil:', error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setAvatarPreview(imageUrl);

    // Guardamos solo el archivo para subir, no la URL en avatar
    setFormData(prev => prev ? { ...prev, avatarFile: file } : null);
  };

  const isBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !token) return;

    try {
      // Subir avatar si hay archivo nuevo
      if (formData.avatarFile) {
        const formDataForUpload = new FormData();
        formDataForUpload.append('avatar', formData.avatarFile);

        const uploadRes = await fetch(`${API_URL}/profile/avatar`, {
          method: 'POST',
          headers: { Authorization: `jwt ${token}` },
          body: formDataForUpload,
        });
        if (!uploadRes.ok) throw new Error('Error al subir el avatar');
        const uploadData = await uploadRes.json();
        if (uploadData.avatar) {
          setFormData(prev => prev ? { 
            ...prev, 
            avatar: uploadData.avatar, 
            avatarFile: undefined 
          } : null);
          setAvatarPreview(null);
        }
      }

      // Actualizar datos del perfil (sin avatarFile)
      const { nom, cognoms, telefon, email, data_naixement } = formData;
      const profileRes = await fetch(`${API_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `jwt ${token}`
        },
        body: JSON.stringify({ nom, cognoms, telefon, email, data_naixement }),
      });
      if (!profileRes.ok) throw new Error('Error al actualizar el perfil');

      setUsuari(formData);
      alert('Perfil actualizado correctamente.');
    } catch (error) {
      console.error('Error actualizando el perfil:', error);
      alert('Error al actualizar el perfil. Inténtalo más tarde.');
    }
  };

  return (
    <IonPage>
      <ToolbarHeader title="Flightchat" showNavButtons/>
      <IonContent className="bg-gray-100 h-full">
        <div className="h-full flex">
          {/* Panell esquerre: només visible en md+ */}
          <div className="hidden md:flex w-1/5 bg-white border-r p-4 flex-col justify-start items-center"></div>

          {/* Contingut central */}
          <div className="flex-1 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">Informació del Perfil</h1>
              {formData ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {(avatarPreview || formData.avatar) && (
                    <div className="flex justify-center">
                      <img
                        src={
                          avatarPreview
                            ? avatarPreview
                            : formData.avatar?.startsWith('data:image')
                              ? formData.avatar
                              : isBase64(formData.avatar || '')
                                ? `data:image/png;base64,${formData.avatar}`
                                : `${BASE_URL}/uploads/avatars/${formData.avatar}`
                        }
                        alt="Avatar"
                        className="w-24 h-24 rounded-full mb-4 object-cover"
                      />
                    </div>
                  )}

                  {['nom', 'cognoms', 'email', 'data_naixement', 'telefon'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field === 'nom' ? 'Nom' :
                         field === 'cognoms' ? 'Cognoms' :
                         field === 'email' ? 'Email' :
                         field === 'data_naixement' ? 'Data de naixement' :
                         'Telèfon'}
                      </label>
                      <input
                        type={field === 'email' ? 'email' : field === 'data_naixement' ? 'date' : field === 'telefon' ? 'tel' : 'text'}
                        name={field}
                        value={(formData as any)[field]}
                        onChange={handleChange}
                        className="bg-gray-100 border border-gray-300 rounded px-3 py-2 w-full text-black"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Canviar Avatar</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="bg-gray-100 border border-gray-300 rounded px-3 py-2 w-full text-black"
                    />
                  </div>

                  <IonButton
                    type="submit"
                    expand="block"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded"
                  >
                    Desar canvis
                  </IonButton>
                </form>
              ) : (
                <p className="text-center text-gray-500">Carregant dades...</p>
              )}
            </div>
          </div>

          {/* Panell dret: només visible en md+ */}
          <div className="hidden md:flex w-1/5 bg-white border-l p-4 flex-col justify-start items-center space-y-6">
            <IonButton
              expand="block"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded w-full"
              routerLink="/comandes"
            >
              COMANDES
            </IonButton>
            <IonButton
              expand="block"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded w-full"
              routerLink="/chatlist"
            >
              CHATS
            </IonButton>
            <IonButton
              expand="block"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded w-full"
              routerLink="/geolocation"
            >
              VOLS
            </IonButton>
            <IonButton
              expand="block"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded w-full"
              routerLink="/incidencies"
            >
              INCIDÈNCIES
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
