"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapPin {
  id: string;
  lat: number;
  lon: number;
  label: string;
  sublabel?: string;
  tone: "you" | "tracked" | "discoverable" | "hot";
  /** Custom fill colour overrides `tone`. */
  color?: string;
}

interface Props {
  center: { lat: number; lon: number };
  zoom?: number;
  pins: MapPin[];
  height?: number | string;
  className?: string;
}

const TONE_COLORS: Record<MapPin["tone"], string> = {
  you: "#2D5A41",
  tracked: "#D95D39",
  discoverable: "#A8B0A4",
  hot: "#A2196F",
};

function makeIcon(tone: MapPin["tone"], color: string | undefined, isYou: boolean) {
  const fill = color ?? TONE_COLORS[tone];
  const size = isYou ? 30 : tone === "discoverable" ? 16 : 20;
  const inner = isYou ? "★" : "";
  const html = `
    <span style="
      display:flex; align-items:center; justify-content:center;
      width:${size}px; height:${size}px;
      background:${fill};
      color:#F4F1EA;
      border:2px solid #FCFCFB;
      border-radius:999px;
      box-shadow: 0 4px 10px rgba(26,31,27,0.25);
      font-size:11px; font-weight:700;
      ${tone === "discoverable" ? "opacity:0.65;" : ""}
    ">${inner}</span>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function Recenter({ center, zoom }: { center: { lat: number; lon: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lon], zoom, { animate: true });
  }, [center.lat, center.lon, zoom, map]);
  return null;
}

export default function MapInner({ center, zoom = 14, pins, height = 280 }: Props) {
  return (
    <div
      style={{
        height,
        width: "100%",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid var(--rule)",
        background: "var(--cream)",
      }}
    >
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          // Carto's light-theme tiles match our warm cream/green palette better than vanilla OSM.
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        <Recenter center={center} zoom={zoom} />
        {pins.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lon]}
            icon={makeIcon(p.tone, p.color, p.tone === "you")}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <strong>{p.label}</strong>
              {p.sublabel && <div style={{ fontSize: 11, color: "#5A6660" }}>{p.sublabel}</div>}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
