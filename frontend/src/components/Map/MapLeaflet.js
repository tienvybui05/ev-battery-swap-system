import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
});

const stationIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
});

function MapLeaflet({ userLocation, stations }) {
  if (!userLocation.lat) return <p>Chưa có vị trí hiện tại</p>;

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{
        height: "250px",
        width: "100%",
        borderRadius: "10px",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />

      {/* Marker vị trí của bạn */}
      <Marker
        position={[userLocation.lat, userLocation.lng]}
        icon={userIcon}
      >
        <Popup>Bạn đang ở đây</Popup>
      </Marker>

      {/* Marker các trạm */}
      {stations.map((st) => (
        <Marker key={st.id} position={[st.lat, st.lng]} icon={stationIcon}>
          <Popup>
            <strong>{st.name}</strong>
            <br />
            {st.address}
            <br />
            🚗 {st.distance ? `${st.distance} km` : "Đang tính..."}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapLeaflet;
