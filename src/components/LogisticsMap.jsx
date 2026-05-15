import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useDashboard } from '../context/DashboardContext.jsx';
import Card from './Card.jsx';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const blueIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const coralIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#fb7185" stroke="#ffffff" stroke-width="2"/>
      <animate attributeName="r" values="10;12;10" dur="1.5s" repeatCount="indefinite"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const DALLAS_CENTER = [32.7767, -96.7970];

const convertToLatLng = (x, y) => {
  const lat = 32.7767 + (y - 200) * 0.001;
  const lng = -96.7970 + (x - 300) * 0.001;
  return [lat, lng];
};

export default function LogisticsMap() {
  const { shipments, theme } = useDashboard();

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Logistics Map</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">FastForward Courier Tracking</h2>
          </div>
          <p className="rounded-3xl bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
            Tracking {shipments.length} active shipments
          </p>
        </div>
      </Card>

      <Card className="relative overflow-hidden min-h-[calc(100vh-14rem)]">
        <MapContainer
          center={DALLAS_CENTER}
          zoom={12}
          style={{ minHeight: 'calc(100vh - 14rem)', width: '100%' }}
          className="rounded-3xl"
        >
          <TileLayer
            url={theme === 'light' ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {shipments.map((shipment) => {
            const position = convertToLatLng(shipment.x, shipment.y);
            const icon = shipment.risk_level === 'high' ? coralIcon : blueIcon;
            return (
              <Marker key={shipment.id} position={position} icon={icon}>
                <Popup className="custom-popup">
                  <div className="text-slate-900">
                    <p className="font-semibold">{shipment.contents}</p>
                    <p>Temp: {shipment.currentTemp}°C</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </Card>
    </div>
  );
}