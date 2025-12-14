import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function MapClick({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

export default function MapPickerModal({ show, onClose, position, onSelect }) {
  const [mapCenter, setMapCenter] = useState(position || { lat: 20.5937, lng: 78.9629 });

  useEffect(() => {
    if (position) setMapCenter(position);
  }, [position]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-slate-900/90 rounded-2xl border border-cyan-400/30 p-4 w-[90%] max-w-3xl">
        <h3 className="text-cyan-300 font-semibold text-lg mb-2">Select Your Location</h3>

        <div className="rounded-xl overflow-hidden border border-cyan-400/30">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "350px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {position && <Marker position={position}></Marker>}
            <MapClick setPosition={(latlng) => onSelect(latlng)} />
          </MapContainer>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
