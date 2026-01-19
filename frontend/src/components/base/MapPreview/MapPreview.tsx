import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect, useState } from "react";

import { MapService } from "@/services/map_service";



interface MapPreviewProps {
  address: string;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

export default function MapPreview({ address }: MapPreviewProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [debouncedAddress, setDebouncedAddress] = useState(address);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAddress(address);
    }, 1000);

    return () => clearTimeout(timer);
  }, [address]);

  useEffect(() => {
    if (!debouncedAddress || debouncedAddress.length < 3) return;

    const fetchCoordinates = async () => {
      const results = await MapService.geocodeAddress(debouncedAddress);
      if (results && results.length > 0) {
        const { lat, lon } = results[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      }
    };

    fetchCoordinates();
  }, [debouncedAddress]);

  if (!position) {
    return (
      <div className="h-[200px] w-full rounded-md border border-dashed bg-muted flex items-center justify-center text-muted-foreground">
        Wpisz adres aby zobaczyć podgląd
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full rounded-md overflow-hidden border shadow-sm">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
        <MapUpdater center={position} />
      </MapContainer>
    </div>
  );
}
