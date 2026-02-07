
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

const tacticalIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface TacticalMapProps {
  center: [number, number];
  zoom: number;
}

const TacticalMap: React.FC<TacticalMapProps> = ({ center, zoom }) => {
  const localTilesUrl = "http://localhost:8080/styles/osm-bright/{z}/{x}/{y}.png";

  return (
    <div className="w-full h-full relative tactical-map-container overflow-hidden rounded-2xl border border-border-subtle bg-canvas">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false} // Disable capturing mouse wheel for page scrolling
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; Sovereign Mapping Protocol v1.0'
          url={localTilesUrl}
        />
        
        <Marker position={center} icon={tacticalIcon}>
          <Popup>
            <div className="text-right font-tajawal">
              <p className="font-black text-brand-primary">مركز العمليات - صنعاء</p>
              <p className="text-[10px] text-text-subtle">الإحداثيات النشطة: {center[0]}, {center[1]}</p>
            </div>
          </Popup>
        </Marker>
        
        <ZoomControl position="bottomright" />
      </MapContainer>
      
      <div className="absolute inset-0 pointer-events-none border-8 border-panel/20 z-[400] rounded-2xl"></div>
      <div className="absolute top-4 left-4 z-[400] bg-panel/80 backdrop-blur-md p-2 rounded-lg border border-border-subtle text-[9px] font-mono text-brand-primary font-bold uppercase tracking-widest shadow-sm">
        Local Tile Source: localhost:8080
      </div>
    </div>
  );
};

export default TacticalMap;
