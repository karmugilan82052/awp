/**
 * WasteCard Component for Marketplace Listing Display
 */

import { formatINR } from "../utils/formatters.js";

export function renderWasteCard(listing, isListView = false) {
  const isApproved = listing.status === "Approved" || listing.status === "Active";
  const firstImage = listing.images && listing.images[0] ? listing.images[0] : "/images/waste/paddy-straw.jpg";

  if (isListView) {
    return `
      <div class="waste-card-list" style="background:#ffffff; border:1px solid #e2ece2; border-radius:14px; padding:16px; display:flex; gap:20px; align-items:center; box-shadow:0 2px 8px rgba(15,61,33,0.04); transition:all 0.2s;">
        <img src="${firstImage}" alt="${listing.title}" style="width:160px; height:120px; border-radius:10px; object-fit:cover; flex-shrink:0;" />
        
        <div style="flex-grow:1;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <span style="background:#f0fdf4; color:#16a34a; font-size:11px; font-weight:700; padding:3px 8px; border-radius:6px; border:1px solid #bbf7d0;">${listing.categoryName}</span>
            <span style="font-size:12px; color:#64748b;">📍 ${listing.location} (${listing.distanceKm || 15} km away)</span>
          </div>

          <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin-bottom:6px;">
            <a href="#waste/${listing.id}" style="color:inherit; text-decoration:none;">${listing.title}</a>
          </h3>

          <div style="display:flex; flex-wrap:wrap; gap:16px; font-size:12px; color:#475569; margin-bottom:8px;">
            <span><strong>Available:</strong> ${listing.quantity} ${listing.unit}</span>
            <span><strong>Moisture:</strong> ${listing.moisture || "12%"}</span>
            <span><strong>Grade:</strong> ${listing.qualityGrade || "Grade A"}</span>
            <span><strong>Seller:</strong> ${listing.seller.name} ⭐ ${listing.seller.rating || 4.8}</span>
          </div>
        </div>

        <div style="text-align:right; flex-shrink:0; min-width:140px;">
          <div style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:800; color:#16a34a; line-height:1;">
            ${formatINR(listing.price)}
          </div>
          <span style="font-size:11px; color:#64748b; display:block; margin-bottom:12px;">${listing.priceUnit || "Per Ton"}</span>

          <div style="display:flex; gap:8px; justify-content:flex-end;">
            <button class="btn-quick-add-cart" data-id="${listing.id}" title="Add to Cart" style="background:#f1f5f9; border:1px solid #cbd5e1; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:600; font-size:13px;">
              🛒
            </button>
            <a href="#waste/${listing.id}" style="background:#16a34a; color:white; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; text-decoration:none; display:inline-block;">
              View Details
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Grid Card
  return `
    <div class="waste-card" style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; overflow:hidden; box-shadow:0 2px 10px rgba(15,61,33,0.04); display:flex; flex-direction:column; transition:transform 0.2s, box-shadow 0.2s;">
      
      <!-- Image Container with Badges -->
      <div style="position:relative; height:180px; width:100%; overflow:hidden; background:#f1f5f9;">
        <img src="${firstImage}" alt="${listing.title}" style="width:100%; height:100%; object-fit:cover; transition:transform 0.3s ease;" class="card-img" />
        
        <span style="position:absolute; top:12px; left:12px; background:rgba(255,255,255,0.92); backdrop-filter:blur(6px); color:#16a34a; font-size:11px; font-weight:800; padding:4px 10px; border-radius:20px; border:1px solid #bbf7d0;">
          ${listing.categoryName}
        </span>

        <span style="position:absolute; top:12px; right:12px; background:rgba(15, 23, 42, 0.85); backdrop-filter:blur(6px); color:white; font-size:11px; font-weight:700; padding:4px 8px; border-radius:6px;">
          📍 ${listing.distanceKm || 15} km
        </span>
      </div>

      <!-- Card Body -->
      <div style="padding:16px; display:flex; flex-direction:column; flex-grow:1;">
        
        <!-- Location & Moisture Subtitle -->
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; color:#64748b; margin-bottom:6px;">
          <span>${listing.district || "District"}, ${listing.state || "State"}</span>
          <span>Moisture: <strong style="color:#0f172a;">${listing.moisture || "12%"}</strong></span>
        </div>

        <!-- Title -->
        <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#0f172a; line-height:1.3; margin-bottom:10px; height:42px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
          <a href="#waste/${listing.id}" style="color:inherit; text-decoration:none;">${listing.title}</a>
        </h3>

        <!-- Seller Info -->
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px; font-size:12px; color:#475569;">
          <div style="width:22px; height:22px; border-radius:50%; background:#dcfce7; color:#15803d; font-weight:800; font-size:10px; display:flex; align-items:center; justify-content:center;">
            ${listing.seller?.avatar || "S"}
          </div>
          <span style="font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:130px;">${listing.seller?.name || "Farmer"}</span>
          <span style="color:#eab308; font-weight:700;">★ ${listing.seller?.rating || 4.8}</span>
        </div>

        <!-- Price & Quantity Specs -->
        <div style="background:#f8fafc; padding:10px 12px; border-radius:10px; border:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <span style="font-size:11px; color:#64748b; display:block;">Price per Ton</span>
            <span style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:800; color:#16a34a;">${formatINR(listing.price)}</span>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11px; color:#64748b; display:block;">Available Qty</span>
            <span style="font-size:14px; font-weight:700; color:#0f172a;">${listing.quantity} ${listing.unit}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:flex; gap:8px; margin-top:auto;">
          <button class="btn-quick-add-cart" data-id="${listing.id}" title="Quick Add to Cart" style="background:#f1f5f9; border:1px solid #cbd5e1; padding:9px 12px; border-radius:8px; cursor:pointer; font-weight:700; font-size:14px; flex-shrink:0;">
            🛒
          </button>
          <a href="#waste/${listing.id}" style="background:#16a34a; color:white; padding:9px 14px; border-radius:8px; font-size:13px; font-weight:700; text-align:center; text-decoration:none; flex-grow:1;">
            View Details
          </a>
        </div>

      </div>

    </div>
  `;
}
