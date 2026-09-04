import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi NCR

export interface MapMarker {
  lat: number;
  lng: number;
  id: string;
  title?: string;
  icon?: string;
}

interface MapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  route?: { lat: number; lng: number }[];
  className?: string;
}

// Component to handle dynamic map bounds
function BoundsHandler({ markers, route, center, zoom }: { markers?: MapMarker[], route?: any[], center: any, zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    if ((markers && markers.length > 1) || (route && route.length > 1)) {
      const bounds = L.latLngBounds([]);
      if (markers) markers.forEach(m => bounds.extend([m.lat, m.lng]));
      if (route) route.forEach(r => bounds.extend([r.lat, r.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (center) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [map, markers, route, center, zoom]);
  
  return null;
}

export default function MapComponent({ center = defaultCenter, zoom = 11, markers = [], route, className = "" }: MapComponentProps) {
  return (
    <div className={`relative w-full h-full ${className}`} style={{ zIndex: 0 }}>
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={zoom} 
        style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
        zoomControl={false}
        className="dark-map-tiles"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <BoundsHandler markers={markers} route={route} center={center} zoom={zoom} />

        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]}>
            {marker.title && (
              <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                <span className="font-bold text-slate-800">{marker.title}</span>
              </Tooltip>
            )}
          </Marker>
        ))}

        {route && route.length > 0 && (
          <Polyline 
            positions={route.map(r => [r.lat, r.lng])} 
            color="#06b6d4" 
            weight={4} 
            opacity={0.8} 
          />
        )}
      </MapContainer>
    </div>
  );
}
