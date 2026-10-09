/**
 * GIS Map & Leaflet Visualization Service
 * Provides interactive map rendering, marker plotting, and location radius filtering.
 */

/* global L */

export function initializeMap(containerId, center = [20.5937, 78.9629], zoom = 5) {
  if (typeof L === "undefined") {
    console.warn("Leaflet library not loaded yet.");
    return null;
  }

  const container = document.getElementById(containerId);
  if (!container) return null;

  // Clean existing map instance if any
  if (container._leaflet_id) {
    container._leaflet_id = null;
  }

  try {
    const map = L.map(containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView(center, zoom);

    // Modern clean CartoDB Voyager tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 18,
      subdomains: "abcd"
    }).addTo(map);

    return map;
  } catch (e) {
    console.error("Map initialization error:", e);
    return null;
  }
}

export function addListingMarkers(map, listings = [], onMarkerClick = null) {
  if (!map || typeof L === "undefined") return [];

  const markers = [];

  // Custom green SVG marker for Agri Waste
  const wasteIcon = L.divIcon({
    className: "custom-map-marker",
    html: `<div style="background:#16a34a; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:16px; border:3px solid #ffffff; box-shadow:0 4px 10px rgba(0,0,0,0.25);">🌾</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });

  listings.forEach(listing => {
    if (listing.lat && listing.lng) {
      const marker = L.marker([listing.lat, listing.lng], { icon: wasteIcon }).addTo(map);

      const popupHtml = `
        <div style="font-family:Plus Jakarta Sans, sans-serif; min-width:200px; padding:4px;">
          <h4 style="font-weight:700; font-size:14px; color:#142017; margin-bottom:4px;">${listing.title}</h4>
          <p style="font-size:12px; color:#16a34a; font-weight:600; margin-bottom:4px;">₹${listing.price.toLocaleString("en-IN")} / Ton • ${listing.quantity} Tons</p>
          <p style="font-size:11px; color:#64748b; margin-bottom:8px;">📍 ${listing.location}</p>
          <a href="#waste/${listing.id}" style="display:inline-block; background:#16a34a; color:white; font-size:11px; font-weight:600; padding:5px 12px; border-radius:6px; text-decoration:none;">View Waste Details →</a>
        </div>
      `;

      marker.bindPopup(popupHtml);

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(listing));
      }

      markers.push(marker);
    }
  });

  return markers;
}
