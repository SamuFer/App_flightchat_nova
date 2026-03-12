// src/pages/geolocalitzacio/icons/companyIcons.ts
import L from 'leaflet';

export const companyIcons: Record<string, L.Icon> = {
  VLG: L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3079/3079098.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  QTR: L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/197/197376.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  ETD: L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/197/197602.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  AAL: L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/197/197484.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
};

export const defaultIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
