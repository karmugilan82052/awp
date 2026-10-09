/**
 * WasteDetails Page Component
 */

import { store } from "../store/state.js";
import { INITIAL_CATEGORIES } from "../store/initialData.js";
import { formatINR } from "../utils/formatters.js";
import { getRecommendedBuyersForListing } from "../services/recommendationEngine.js";

export function renderWasteDetailsPage(listingId) {
  const listing = store.getListingById(listingId);
  const currentRole = store.getCurrentRole();
  const isBuyer = currentRole === "buyer";

  if (!listing) {
    return `
      <div style="padding:80px 20px; text-align:center; font-family:'Plus Jakarta Sans', sans-serif;">
        <h2 style="font-family:'Outfit', sans-serif; font-size:24px; color:#0f172a; margin-bottom:12px;">Listing Not Found</h2>
        <p style="color:#64748b; margin-bottom:20px;">The requested agricultural waste listing ID '${listingId}' does not exist or has expired.</p>
        <a href="#marketplace" style="background:#16a34a; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:700;">Back to Marketplace</a>
      </div>
    `;
  }

  const catObj = INITIAL_CATEGORIES.find(c => c.id === listing.category) || INITIAL_CATEGORIES[0];
  const recommendedBuyers = getRecommendedBuyersForListing(listing, 4);
  const images = listing.images && listing.images.length > 0 ? listing.images : [catObj.image];

  return `
    <div class="page-waste-details" style="padding:40px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:85vh;">
      <div class="container" style="max-width:1280px; margin:0 auto;">
        
        <!-- Breadcrumbs -->
        <div style="font-size:13px; color:#64748b; margin-bottom:20px;">
          <a href="#/" style="color:#16a34a; text-decoration:none;">Home</a> / 
          <a href="#marketplace" style="color:#16a34a; text-decoration:none;">Marketplace</a> / 
          <a href="#marketplace?category=${listing.category}" style="color:#16a34a; text-decoration:none;">${listing.categoryName}</a> / 
          <span style="color:#0f172a; font-weight:600;">${listing.title}</span>
        </div>

        <!-- Main Layout (2 Columns) -->
        <div style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:32px; align-items:start;" class="waste-details-grid">
          
          <!-- Left Column: Gallery, Technical Specs, Suitable Uses, Map -->
          <div>
            
            <!-- Image Gallery -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:16px; margin-bottom:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <div style="height:380px; width:100%; border-radius:12px; overflow:hidden; margin-bottom:12px; background:#f1f5f9;">
                <img id="main-gallery-image" src="${images[0]}" alt="${listing.title}" style="width:100%; height:100%; object-fit:cover;" />
              </div>
              <div style="display:flex; gap:10px; overflow-x:auto;">
                ${images
                  .map(
                    (img, idx) => `
                  <img src="${img}" class="gallery-thumb ${idx === 0 ? "active" : ""}" data-src="${img}" style="width:72px; height:56px; border-radius:8px; object-fit:cover; cursor:pointer; border:2px solid ${
                      idx === 0 ? "#16a34a" : "#e2e8f0"
                    };" />
                `
                  )
                  .join("")}
              </div>
            </div>

            <!-- Agricultural Technical Specifications -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; margin-bottom:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; color:#0f172a; margin-bottom:16px; border-bottom:1px solid #f0f6f0; padding-bottom:10px;">
                🌾 Technical Biomass Specifications
              </h3>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-size:13px; margin-bottom:20px;">
                <div><span style="color:#64748b; display:block;">Crop / Feedstock:</span> <strong style="color:#0f172a;">${listing.crop || listing.categoryName}</strong></div>
                <div><span style="color:#64748b; display:block;">Moisture Content:</span> <strong style="color:#16a34a;">${listing.moisture || "12%"} (Low Moisture)</strong></div>
                <div><span style="color:#64748b; display:block;">Quality / Grade:</span> <strong style="color:#0f172a;">${listing.qualityGrade || "Grade A (Clean)"}</strong></div>
                <div><span style="color:#64748b; display:block;">Packaging Form:</span> <strong style="color:#0f172a;">${listing.packaging || "Standard Packing"}</strong></div>
                <div><span style="color:#64748b; display:block;">Harvest / Collection Date:</span> <strong style="color:#0f172a;">${listing.harvestDate || "August 2026"}</strong></div>
                <div><span style="color:#64748b; display:block;">Loading Assistance:</span> <strong style="color:#16a34a;">${listing.loadingAssistance || "Yes (Tractor Loader)"}</strong></div>
                <div><span style="color:#64748b; display:block;">Storage Condition:</span> <strong style="color:#0f172a;">${listing.storageType || "Elevated Covered Shed"}</strong></div>
                <div><span style="color:#64748b; display:block;">Pickup Availability:</span> <strong style="color:#0f172a;">${listing.pickupAvailability || "Immediate"}</strong></div>
              </div>

              <h4 style="font-size:14px; font-weight:700; color:#0f172a; margin-bottom:8px;">Seller Description</h4>
              <p style="font-size:14px; color:#475569; line-height:1.6; background:#f8fafc; padding:14px; border-radius:10px; border:1px solid #f1f5f9;">
                ${listing.description || "Clean crop residue suitable for bio-pelletization, cattle feed, or composting."}
              </p>
            </div>

            <!-- Smart Waste-to-Product Suggested Applications -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; margin-bottom:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;">
                <span style="font-size:20px;">💡</span>
                <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0;">
                  Recommended Industrial Applications
                </h3>
              </div>
              <p style="font-size:13px; color:#64748b; margin-bottom:16px;">
                Based on laboratory biomass properties of ${catObj.name}, here are the highest value-added commercial transformations:
              </p>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                ${(catObj.applications || [])
                  .map(
                    app => `
                  <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:12px;">
                    <strong style="font-size:13px; color:#14532d; display:block;">${app.name}</strong>
                    <div style="display:flex; justify-content:space-between; font-size:11px; color:#16a34a; margin-top:4px;">
                      <span>Industry: ${app.industry}</span>
                      <span style="font-weight:700;">Demand: ${app.demand}</span>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <!-- Interactive Map Location -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0;">
                  📍 Farm Gate Location & Logistics
                </h3>
                <span style="font-size:12px; color:#16a34a; font-weight:700;">${listing.distanceKm || 15} km from your plant</span>
              </div>
              <p style="font-size:13px; color:#475569; margin-bottom:14px;">
                Exact Pickup Gate: <strong>${listing.location}</strong> (Pincode: ${listing.pincode || "642001"})
              </p>
              <div id="details-leaflet-map" style="height:260px; width:100%; border-radius:12px; overflow:hidden; border:1px solid #cbd5e1;"></div>
            </div>

          </div>

          <!-- Right Column: Pricing & Purchase Card, Seller Profile, Recommended Buyers -->
          <div>
            
            <!-- Pricing & Action Card -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; margin-bottom:24px; box-shadow:0 4px 15px rgba(15,61,33,0.06); position:sticky; top:90px;">
              
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
                <div>
                  <span style="background:#f0fdf4; color:#16a34a; font-size:11px; font-weight:800; padding:4px 10px; border-radius:12px; border:1px solid #bbf7d0; display:inline-block; margin-bottom:6px;">
                    ${listing.categoryName}
                  </span>
                  <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:800; color:#0f172a; line-height:1.2;">
                    ${listing.title}
                  </h2>
                </div>
              </div>

              <!-- Price Box -->
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span style="font-size:12px; color:#64748b; display:block;">Unit Price</span>
                    <span style="font-family:'Outfit', sans-serif; font-size:32px; font-weight:800; color:#16a34a;">${formatINR(listing.price)}</span>
                    <span style="font-size:12px; color:#64748b;">${listing.priceUnit || "Per Ton"}</span>
                  </div>
                  <div style="text-align:right;">
                    <span style="font-size:12px; color:#64748b; display:block;">Available Quantity</span>
                    <span style="font-size:18px; font-weight:800; color:#0f172a;">${listing.quantity} ${listing.unit}</span>
                    <span style="font-size:11px; color:#94a3b8; display:block;">Min Order: ${listing.minOrderQty || 1} ${listing.unit}</span>
                  </div>
                </div>
              </div>

              <!-- Quantity Selector -->
              <div style="margin-bottom:20px;">
                <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:6px;">Order Quantity (Tons)</label>
                <div style="display:flex; align-items:center; gap:10px;">
                  <input type="number" id="details-qty-input" min="${listing.minOrderQty || 1}" max="${listing.quantity}" value="${listing.minOrderQty || 1}" step="0.5" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:15px; font-weight:700; font-family:'Plus Jakarta Sans', sans-serif;" />
                  <span style="font-weight:700; color:#475569;">${listing.unit}</span>
                </div>
              </div>

              <!-- Calculated Total Preview -->
              <div style="display:flex; justify-content:space-between; font-size:14px; color:#475569; margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid #f1f5f9;">
                <span>Estimated Subtotal:</span>
                <strong id="details-subtotal-calc" style="font-size:18px; color:#0f172a;">${formatINR((listing.minOrderQty || 1) * listing.price)}</strong>
              </div>

              <!-- Action Buttons -->
              <div style="display:flex; flex-direction:column; gap:10px;">
                ${
                  isBuyer
                    ? `
                  <button id="btn-details-buy-now" data-id="${listing.id}" style="width:100%; background:#16a34a; color:white; border:none; padding:15px; border-radius:12px; font-size:16px; font-weight:800; cursor:pointer; box-shadow:0 6px 16px rgba(22,163,74,0.3); transition:all 0.2s;">
                    ⚡ Buy Now (Instant Escrow Checkout)
                  </button>
                  <button id="btn-details-add-cart" data-id="${listing.id}" style="width:100%; background:#f0fdf4; color:#16a34a; border:1.5px solid #bbf7d0; padding:13px; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s;">
                    🛒 Add to Procurement Cart
                  </button>
                `
                    : `
                  <div style="background:#fffbeb; border:1.5px solid #fde68a; border-radius:12px; padding:16px; text-align:center;">
                    <div style="font-size:22px; margin-bottom:4px;">🔒</div>
                    <strong style="color:#92400e; font-size:15px; display:block; margin-bottom:4px;">Buyer-Exclusive Procurement</strong>
                    <p style="color:#78350f; font-size:13px; margin:0 0 12px 0; line-height:1.4;">Only verified Industrial Buyers & Refiners are authorized to purchase agricultural waste products.</p>
                    <a href="#login" style="display:inline-block; background:#d97706; color:white; padding:9px 18px; border-radius:8px; font-weight:800; font-size:13.5px; text-decoration:none; box-shadow:0 3px 8px rgba(217,119,6,0.25);">
                      Sign In as Buyer to Purchase →
                    </a>
                  </div>
                `
                }
                <button id="btn-details-contact-seller" data-seller-id="${listing.seller?.id}" data-listing-id="${listing.id}" style="width:100%; background:#ffffff; color:#334155; border:1.5px solid #cbd5e1; padding:12px; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                  💬 Contact Farmer Directly
                </button>
              </div>

              <div style="margin-top:16px; font-size:12px; color:#64748b; text-align:center;">
                🔒 100% Escrow Protection • 3-Stage Weighbridge Verification
              </div>

            </div>

            <!-- Verified Seller Card -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:20px; margin-bottom:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <h4 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#0f172a; margin-bottom:12px;">
                🧑‍🌾 Verified Farmer / Producer
              </h4>

              <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
                <div style="width:48px; height:48px; border-radius:50%; background:#dcfce7; color:#15803d; font-weight:800; font-size:18px; display:flex; align-items:center; justify-content:center;">
                  ${listing.seller?.avatar || "S"}
                </div>
                <div>
                  <h4 style="font-size:16px; font-weight:700; color:#0f172a; margin:0;">${listing.seller?.name}</h4>
                  <span style="font-size:12px; color:#64748b;">${listing.seller?.farmName || "Farm Producer FPO"}</span>
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px; margin-bottom:14px; background:#f8fafc; padding:10px; border-radius:8px;">
                <div>Rating: <strong style="color:#eab308;">★ ${listing.seller?.rating || 4.8}</strong> (${listing.seller?.reviewsCount || 24} reviews)</div>
                <div>Status: <strong style="color:#16a34a;">✓ KYC Verified</strong></div>
              </div>

              <a href="#reviews?seller=${listing.seller?.id}" style="font-size:12px; color:#16a34a; font-weight:700; text-decoration:none;">
                View All Reviews for this Seller →
              </a>
            </div>

            <!-- Smart AI Recommended Buyers for this Waste -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:20px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                <span style="font-size:16px;">✨</span>
                <h4 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#0f172a; margin:0;">
                  Smart Recommended Buyers
                </h4>
              </div>
              <p style="font-size:12px; color:#64748b; margin-bottom:14px;">
                Industries actively purchasing ${listing.categoryName}:
              </p>

              <div style="display:flex; flex-direction:column; gap:10px;">
                ${recommendedBuyers
                  .map(
                    b => `
                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="font-size:13px; color:#0f172a; display:block;">${b.companyName || b.name}</strong>
                      <span style="font-size:11px; color:#64748b;">${b.industry} • 📍 ${b.distanceKm} km away</span>
                    </div>
                    <span style="background:#dcfce7; color:#15803d; font-size:10px; font-weight:800; padding:2px 8px; border-radius:12px;">${b.matchScore}% Match</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  `;
}
