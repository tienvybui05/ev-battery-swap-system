import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import polyline from "@mapbox/polyline"; // 👈 để giải mã đường đi

const userIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
});

const stationIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
});

// Tự động fit map theo tuyến đường
function FitBounds({ routeCoords }) {
  const map = useMap();

  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routeCoords, map]);

  return null;
}

function MapLeaflet({ userLocation, stations }) {
  const [route, setRoute] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  const apiKey =
    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjczNWNlN2JlMWEwYzQ2YjVhY2JjOGQ5N2VjN2FiMzhlIiwiaCI6Im11cm11cjY0In0=";

  if (!userLocation.lat) return <p>Chưa có vị trí hiện tại</p>;

  // Khi nhấn vào trạm → vẽ đường đi
  const handleStationClick = async (st) => {
    setSelectedStation(st);
    try {
      const res = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
          coordinates: [
            [userLocation.lng, userLocation.lat],
            [st.lng, st.lat],
          ],
        },
        {
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      // 🔹 Giải mã polyline (chuỗi mã hóa) → mảng tọa độ [lat, lng]
      const encoded = res.data.routes[0].geometry;
      const decoded = polyline.decode(encoded); // [[lat,lng],[lat,lng],...]
      const coords = decoded.map((c) => [c[0], c[1]]); // giữ nguyên định dạng

      setRoute(coords);
    } catch (err) {
      console.error("Lỗi khi lấy đường đi:", err);
    }
  };

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "10px",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />

      {/* Marker user */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>Bạn đang ở đây</Popup>
      </Marker>

      {/* Marker các trạm */}
      {stations.map((st) => (
        <Marker
          key={st.id}
          position={[st.lat, st.lng]}
          icon={stationIcon}
          eventHandlers={{
            click: () => handleStationClick(st),
          }}
        >
          <Popup>
            <strong>{st.name}</strong>
            <br />
            {st.address}
            <br />
            🚗 {st.distance ? `${st.distance} km` : "Đang tính..."}
            <br />
          </Popup>
        </Marker>
      ))}

      {/* Vẽ đường đi */}
      {route && (
        <>
          <Polyline positions={route} color="blue" weight={5} opacity={0.7} />
          <FitBounds routeCoords={route} />
        </>
      )}
    </MapContainer>
  );
}

export default MapLeaflet;
