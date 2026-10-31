import React, { useEffect, useRef } from 'react';
import { GPSCoordinate } from '../types';

interface GpsMapProps {
  coordinates: GPSCoordinate[];
  currentLocation?: GPSCoordinate | null;
  interactive?: boolean;
  className?: string;
  zoom?: number;
}

export const GpsMap: React.FC<GpsMapProps> = ({
  coordinates,
  currentLocation,
  interactive = true,
  className = 'h-64 w-full',
  zoom = 15,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const currentMarkerRef = useRef<any>(null);
  const startMarkerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      try {
        // Dynamically import Leaflet so it only loads in browser
        const L = (await import('leaflet')).default;
        if (!isMounted || !mapContainerRef.current) return;

        // Cleanup existing map if container already initialized
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Determine starting center
        const defaultCenter: [number, number] = coordinates.length > 0
          ? [coordinates[0].lat, coordinates[0].lng]
          : currentLocation
          ? [currentLocation.lat, currentLocation.lng]
          : [40.785091, -73.968285]; // Central Park default

        const map = L.map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: zoom,
          zoomControl: interactive,
          dragging: interactive,
          scrollWheelZoom: interactive,
          attributionControl: false,
        });

        // OpenStreetMap tiles with custom dark styling filter in index.css
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        mapInstanceRef.current = map;

        // Initialize Polyline
        const latLngs = coordinates.map((c) => [c.lat, c.lng] as [number, number]);
        const polyline = L.polyline(latLngs, {
          color: '#2563eb', // Vibrant Blue matching mockup
          weight: 5,
          opacity: 0.95,
          smoothFactor: 1,
        }).addTo(map);
        polylineRef.current = polyline;

        // Custom pulsing divIcon for current location (blue dot with white border matching mockup)
        const currentIcon = L.divIcon({
          className: 'custom-gps-marker',
          html: `
            <div style="position: relative; width: 22px; height: 22px;">
              <div style="position: absolute; width: 22px; height: 22px; background: rgba(37, 99, 235, 0.35); border-radius: 50%; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; background: #2563eb; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px rgba(37,99,235,0.7);"></div>
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });



        const activeCoord = currentLocation || (coordinates.length > 0 ? coordinates[coordinates.length - 1] : null);
        if (activeCoord) {
          currentMarkerRef.current = L.marker([activeCoord.lat, activeCoord.lng], { icon: currentIcon }).addTo(map);
        }

        if (latLngs.length > 1) {
          map.fitBounds(polyline.getBounds(), { padding: [25, 25], maxZoom: 16 });
        }
      } catch (err) {
        console.error('Leaflet initialization error', err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update polyline and current position dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const latLngs = coordinates.map((c) => [c.lat, c.lng] as [number, number]);

    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latLngs);
    }

    const activeCoord = currentLocation || (coordinates.length > 0 ? coordinates[coordinates.length - 1] : null);
    if (activeCoord) {
      if (currentMarkerRef.current) {
        currentMarkerRef.current.setLatLng([activeCoord.lat, activeCoord.lng]);
      }
      if (coordinates.length <= 2) {
        map.panTo([activeCoord.lat, activeCoord.lng]);
      }
    }
  }, [coordinates, currentLocation]);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-[#1c2638] shadow-xl bg-slate-900 ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[180px]" />
    </div>
  );
};
