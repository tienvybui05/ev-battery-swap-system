import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
});

const stationIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
});

const incidentIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/caution.png",
  iconSize: [28, 28],
});

// Fit map vào route
function FitBounds({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (!coords || coords.length === 0) return;
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [coords]);
  return null;
}

function MapLeaflet({ userLocation, stations, selectedStationId }) {
  const [routeCoords, setRouteCoords] = useState(null);
  const [routeColor, setRouteColor] = useState("blue");
  const [incidents, setIncidents] = useState([]);

  // ⭐ Tạo ref để mở popup
  const markerRefs = useRef({});

  const decodeTomTomPolyline = (points) =>
    points.map((p) => [p.latitude, p.longitude]);

  const getTrafficColor = (flow) => {
    if (!flow || !flow.flowSegmentData) return "blue";
    const cs = flow.flowSegmentData.currentSpeed;
    const fs = flow.flowSegmentData.freeFlowSpeed;
    const ratio = cs / fs;

    if (ratio > 0.9) return "green";
    if (ratio > 0.6) return "orange";
    return "red";
  };

  const handleStationClick = (st) => {
    if (!st.route?.routes?.length) return;

    const leg = st.route.routes[0].legs[0];
    const coords = decodeTomTomPolyline(leg.points);

    setRouteCoords(coords);
    setRouteColor(getTrafficColor(st.flow));
    setIncidents(st.incidents?.incidents || []);
  };

  // 🔥 Auto vẽ route + mở popup khi click danh sách
  useEffect(() => {
    if (!selectedStationId) return;

    const st = stations.find((s) => s.id === selectedStationId);
    if (st) {
      handleStationClick(st);

      // ⭐ Mở popup marker
      const marker = markerRefs.current[st.id];
      if (marker) marker.openPopup();
    }
  }, [selectedStationId, stations]);

  if (!userLocation.lat) {
    return <p>Chưa có vị trí hiện tại</p>;
  }

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{ height: "350px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Marker người dùng */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>Bạn đang ở đây</Popup>
      </Marker>

      {/* Marker các trạm */}
      {stations.map((st) => (
        <Marker
          key={st.id}
          position={[st.lat, st.lng]}
          icon={stationIcon}
          ref={(el) => (markerRefs.current[st.id] = el)} // ⭐ Lưu ref
          eventHandlers={{
            click: () => handleStationClick(st),
          }}
        >
          <Popup>
            <strong>{st.name}</strong>
            <br />
            🚗 {st.distance}
            <br />
            ⏱ {st.time}
          </Popup>
        </Marker>
      ))}

      {/* Route */}
      {routeCoords && (
        <>
          <Polyline
            positions={routeCoords}
            color={routeColor}
            weight={6}
            opacity={0.85}
          />
          <FitBounds coords={routeCoords} />
        </>
      )}

      {/* Incidents */}
      {incidents.map((inc, index) =>
        inc.geometry?.coordinates?.length > 0 ? (
          <Marker
            key={index}
            position={[
              inc.geometry.coordinates[0][1],
              inc.geometry.coordinates[0][0],
            ]}
            icon={incidentIcon}
          >
            <Popup>⚠ Sự cố giao thông gần khu vực này</Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}

export default MapLeaflet;