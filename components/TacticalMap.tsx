
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// إعداد أيقونات Leaflet لتجنب أخطاء المسارات الافتراضية
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
  // الرابط المحلي لـ TileServer-GL (النمط: Raster Tiles)
  // ملاحظة: osm-bright هو اسم النمط المعرف في config.json
  const localTilesUrl = "http://localhost:8080/styles/osm-bright/{z}/{x}/{y}.png";

  return (
    <div className="w-full h-full relative tactical-map-container overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
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
              <p className="font-black text-yemenBlue">مركز العمليات - صنعاء</p>
              <p className="text-[10px] text-slate-500">الإحداثيات النشطة: {center[0]}, {center[1]}</p>
            </div>
          </Popup>
        </Marker>
        
        <ZoomControl position="bottomright" />
      </MapContainer>
      
      {/* Tactical Overlays */}
      <div className="absolute inset-0 pointer-events-none border-8 border-white/20 z-[400] rounded-2xl"></div>
      <div className="absolute top-4 left-4 z-[400] bg-white/80 backdrop-blur-md p-2 rounded-lg border border-slate-200 text-[9px] font-mono text-yemenBlue font-bold uppercase tracking-widest shadow-sm">
        Local Tile Source: localhost:8080
      </div>
    </div>
  );
};

export default TacticalMap;
