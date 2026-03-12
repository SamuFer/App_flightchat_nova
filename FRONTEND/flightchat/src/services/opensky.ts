// services/openskyService.ts
const API_URL = import.meta.env.VITE_API_URL;



export const getBcnFlights = async () => {
    const res = await fetch(`${API_URL}/opensky/bcn`);
    if (!res.ok) throw new Error('Error carregant dades');
    return await res.json();
  };
  