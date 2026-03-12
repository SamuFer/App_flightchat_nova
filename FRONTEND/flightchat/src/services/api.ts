const API_URL = import.meta.env.VITE_API_URL;

export async function getUsuaris() {
  const res = await fetch(`${API_URL}/usuaris`);
  if (!res.ok) throw new Error('Error carregant usuaris');
  return res.json();
}


export async function getQuickMessages() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${import.meta.env.VITE_API_URL}/messages/quick`, {
    headers: {
      Authorization: `jwt ${token}`
    }
  });
  if (!res.ok) throw new Error('Error carregant missatges ràpids');
  return res.json();
}
