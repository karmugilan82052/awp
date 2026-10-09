/**
 * FilterPanel Component for Marketplace Search and Faceted Filtering
 */

import { INITIAL_CATEGORIES } from "../store/initialData.js";

const INDIAN_STATES = [
  "All States",
  "Punjab",
  "Haryana",
  "Tamil Nadu",
  "Karnataka",
  "Maharashtra",
  "Gujarat",
  "Uttar Pradesh",
  "Rajasthan",
  "Madhya Pradesh",
  "Kerala",
  "Telangana",
  "Andhra Pradesh",
  "West Bengal",
  "Jharkhand",
  "Assam",
  "Delhi"
];

export function renderFilterPanel(activeFilters = {}) {
  const selectedCat = activeFilters.category || "all";
  const selectedState = activeFilters.state || "all";
  const searchVal = activeFilters.search || "";
  const maxPrice = activeFilters.maxPrice || 10000;
  const minQty = activeFilters.minQty || 0;

  return `
    <div class="filter-panel" style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:20px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
      
      <!-- Filter Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid #f0f6f0;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:18px;">🔍</span>
          <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#0f172a;">Filters & Search</h3>
        </div>
        <button id="btn-reset-filters" style="background:none; border:none; color:#16a34a; font-size:12px; font-weight:700; cursor:pointer; text-decoration:underline;">
          Reset All
        </button>
      </div>

      <!-- Keyword Search -->
      <div style="margin-bottom:18px;">
        <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:6px;">Keyword Search</label>
        <input type="text" id="filter-search-input" value="${searchVal}" placeholder="Search straw, bagasse, manure..." style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; outline:none; font-family:'Plus Jakarta Sans', sans-serif;" />
      </div>

      <!-- Category Filter -->
      <div style="margin-bottom:18px;">
        <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:6px;">Waste Category</label>
        <select id="filter-category-select" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; font-family:'Plus Jakarta Sans', sans-serif; background:#ffffff;">
          <option value="all" ${selectedCat === "all" ? "selected" : ""}>All Categories (${INITIAL_CATEGORIES.length})</option>
          ${INITIAL_CATEGORIES.map(
            c => `
            <option value="${c.id}" ${selectedCat === c.id ? "selected" : ""}>${c.name}</option>
          `
          ).join("")}
        </select>
      </div>

      <!-- State / Region Filter -->
      <div style="margin-bottom:18px;">
        <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:6px;">Location / State</label>
        <select id="filter-state-select" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; font-family:'Plus Jakarta Sans', sans-serif; background:#ffffff;">
          ${INDIAN_STATES.map(
            st => `
            <option value="${st === "All States" ? "all" : st}" ${selectedState === st || (st === "All States" && selectedState === "all") ? "selected" : ""}>${st}</option>
          `
          ).join("")}
        </select>
      </div>

      <!-- Max Price Slider -->
      <div style="margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; color:#475569; margin-bottom:6px;">
          <span>Max Price / Ton</span>
          <span id="label-max-price" style="color:#16a34a;">₹${parseInt(maxPrice, 10).toLocaleString("en-IN")}</span>
        </div>
        <input type="range" id="filter-price-slider" min="1000" max="10000" step="500" value="${maxPrice}" style="width:100%; accent-color:#16a34a; cursor:pointer;" />
        <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8; margin-top:2px;">
          <span>₹1,000</span>
          <span>₹10,000+</span>
        </div>
      </div>

      <!-- Minimum Quantity Slider -->
      <div style="margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; color:#475569; margin-bottom:6px;">
          <span>Min Quantity</span>
          <span id="label-min-qty" style="color:#16a34a;">${minQty} Tons</span>
        </div>
        <input type="range" id="filter-qty-slider" min="0" max="30" step="2" value="${minQty}" style="width:100%; accent-color:#16a34a; cursor:pointer;" />
      </div>

      <!-- Quality Grade Filter -->
      <div style="margin-bottom:18px;">
        <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:8px;">Quality Grade</label>
        <div style="display:flex; flex-direction:column; gap:6px; font-size:13px; color:#334155;">
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" name="quality-grade" value="Grade A" checked style="accent-color:#16a34a;" />
            <span>Grade A (Premium / Dry)</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" name="quality-grade" value="Commercial" checked style="accent-color:#16a34a;" />
            <span>Commercial Standard</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" name="quality-grade" value="Export" checked style="accent-color:#16a34a;" />
            <span>Export Quality</span>
          </label>
        </div>
      </div>

      <!-- Apply Button -->
      <button id="btn-apply-filters" style="width:100%; background:#16a34a; color:white; border:none; padding:10px; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans', sans-serif;">
        Apply Filters
      </button>

    </div>
  `;
}
