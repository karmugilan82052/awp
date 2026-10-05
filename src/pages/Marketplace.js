/**
 * Marketplace Catalog Page Component
 */

import { store } from "../store/state.js";
import { renderFilterPanel } from "../components/FilterPanel.js";
import { renderWasteCard } from "../components/WasteCard.js";
import { initializeMap, addListingMarkers } from "../services/mapService.js";

export function renderMarketplacePage(searchParams = {}) {
  const filters = {
    search: searchParams.search || "",
    category: searchParams.category || "all",
    state: searchParams.state || "all",
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : 10000,
    minQty: searchParams.minQty ? parseFloat(searchParams.minQty) : 0,
    sortBy: searchParams.sortBy || "newest"
  };

  const allFilteredListings = store.getListings(filters);
  const totalCount = allFilteredListings.length;
  const currentPage = parseInt(searchParams.page || "1", 10);
  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedListings = allFilteredListings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const isListView = searchParams.view === "list";
  const isMapView = searchParams.view === "map";

  return `
    <div class="page-marketplace" style="padding:40px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:80vh;">
      <div class="container" style="max-width:1380px; margin:0 auto;">
        
        <!-- Marketplace Breadcrumb & Header -->
        <div style="margin-bottom:28px;">
          <div style="font-size:12px; color:#64748b; margin-bottom:6px;">
            <a href="#/" style="color:#16a34a; text-decoration:none;">Home</a> / <span style="color:#0f172a; font-weight:600;">Marketplace</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px;">
            <div>
              <h1 style="font-family:'Outfit', sans-serif; font-size:32px; font-weight:800; color:#0f172a; margin:0;">
                Agricultural Waste Marketplace
              </h1>
              <p style="font-size:14px; color:#64748b; margin-top:4px;">
                Discover, evaluate, and purchase verified biomass and agricultural residues across India.
              </p>
            </div>
            <a href="#sell-waste" style="background:#16a34a; color:white; padding:10px 20px; border-radius:10px; font-size:14px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
              <span>+</span> Sell Your Crop Waste
            </a>
          </div>
        </div>

        <!-- Main Marketplace Layout (Sidebar + Results) -->
        <div style="display:grid; grid-template-columns:300px 1fr; gap:30px; align-items:start;" class="marketplace-grid-layout">
          
          <!-- Left Sidebar Filters -->
          <aside class="marketplace-sidebar">
            ${renderFilterPanel(filters)}
          </aside>

          <!-- Right Content Area -->
          <main class="marketplace-main">
            
            <!-- Controls Bar: Results Count, Sort, View Switcher -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:14px; padding:14px 20px; display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:16px; box-shadow:0 2px 6px rgba(15,61,33,0.03);">
              
              <div style="font-size:14px; color:#475569;">
                Showing <strong style="color:#0f172a;">${paginatedListings.length}</strong> of <strong style="color:#0f172a;">${totalCount}</strong> listings
                ${filters.category !== "all" ? ` in <span style="color:#16a34a; font-weight:700;">${filters.category}</span>` : ""}
              </div>

              <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                
                <!-- Sort Dropdown -->
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:12px; font-weight:700; color:#64748b;">Sort:</span>
                  <select id="marketplace-sort-select" style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; font-family:'Plus Jakarta Sans', sans-serif; background:#ffffff; outline:none;">
                    <option value="newest" ${filters.sortBy === "newest" ? "selected" : ""}>Newest Listings</option>
                    <option value="price-asc" ${filters.sortBy === "price-asc" ? "selected" : ""}>Price: Low to High</option>
                    <option value="price-desc" ${filters.sortBy === "price-desc" ? "selected" : ""}>Price: High to Low</option>
                    <option value="qty-desc" ${filters.sortBy === "qty-desc" ? "selected" : ""}>Quantity: High to Low</option>
                    <option value="rating-desc" ${filters.sortBy === "rating-desc" ? "selected" : ""}>Seller Rating</option>
                    <option value="distance-asc" ${filters.sortBy === "distance-asc" ? "selected" : ""}>Nearest to Me</option>
                  </select>
                </div>

                <!-- View Switcher (Grid / List / Map) -->
                <div style="display:flex; background:#f1f5f9; padding:3px; border-radius:8px;">
                  <button class="btn-view-toggle ${!isListView && !isMapView ? "active" : ""}" data-view="grid" title="Grid View" style="border:none; background:${
    !isListView && !isMapView ? "#ffffff" : "transparent"
  }; color:${!isListView && !isMapView ? "#16a34a" : "#64748b"}; padding:5px 10px; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer;">
                    ⊞ Grid
                  </button>
                  <button class="btn-view-toggle ${isListView ? "active" : ""}" data-view="list" title="List View" style="border:none; background:${
    isListView ? "#ffffff" : "transparent"
  }; color:${isListView ? "#16a34a" : "#64748b"}; padding:5px 10px; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer;">
                    ☰ List
                  </button>
                  <button class="btn-view-toggle ${isMapView ? "active" : ""}" data-view="map" title="GIS Map View" style="border:none; background:${
    isMapView ? "#ffffff" : "transparent"
  }; color:${isMapView ? "#16a34a" : "#64748b"}; padding:5px 10px; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer;">
                    🗺️ Map
                  </button>
                </div>

              </div>

            </div>

            <!-- GIS Map Container (When Map View Active) -->
            ${
              isMapView
                ? `
              <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:16px; margin-bottom:24px; box-shadow:0 4px 12px rgba(15,61,33,0.06);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <h4 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#0f172a; margin:0;">
                    📍 Geospatial Crop Residue Map
                  </h4>
                  <span style="font-size:12px; color:#16a34a; font-weight:600;">Interactive Farm Locations</span>
                </div>
                <div id="marketplace-leaflet-map" style="height:460px; width:100%; border-radius:12px; overflow:hidden;"></div>
              </div>
            `
                : ""
            }

            <!-- Listings Container -->
            ${
              totalCount === 0
                ? `
              <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:60px 20px; text-align:center;">
                <div style="font-size:48px; margin-bottom:12px;">🌾</div>
                <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; color:#0f172a; margin-bottom:6px;">No waste listings match your filters</h3>
                <p style="font-size:14px; color:#64748b; margin-bottom:20px;">Try adjusting the category, price range, or state location.</p>
                <button id="btn-clear-empty-filters" style="background:#16a34a; color:white; border:none; padding:10px 20px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;">
                  Reset All Filters
                </button>
              </div>
            `
                : isListView
                ? `
              <div style="display:flex; flex-direction:column; gap:16px;">
                ${paginatedListings.map(l => renderWasteCard(l, true)).join("")}
              </div>
            `
                : `
              <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:24px;">
                ${paginatedListings.map(l => renderWasteCard(l, false)).join("")}
              </div>
            `
            }

            <!-- Pagination -->
            ${
              totalPages > 1
                ? `
              <div style="display:flex; justify-content:center; align-items:center; gap:8px; margin-top:40px;">
                <button class="btn-pagination" data-page="${currentPage - 1}" ${
                    currentPage === 1 ? "disabled" : ""
                  } style="padding:8px 14px; border:1px solid #cbd5e1; border-radius:8px; background:#ffffff; font-size:13px; font-weight:600; cursor:${
                    currentPage === 1 ? "not-allowed" : "pointer"
                  }; opacity:${currentPage === 1 ? "0.5" : "1"};">
                  ← Previous
                </button>

                ${Array.from({ length: totalPages }, (_, i) => i + 1)
                  .map(
                    p => `
                  <button class="btn-pagination ${p === currentPage ? "active" : ""}" data-page="${p}" style="width:38px; height:38px; border-radius:8px; border:1px solid ${
                      p === currentPage ? "#16a34a" : "#cbd5e1"
                    }; background:${p === currentPage ? "#16a34a" : "#ffffff"}; color:${
                      p === currentPage ? "#ffffff" : "#0f172a"
                    }; font-weight:700; font-size:13px; cursor:pointer;">
                    ${p}
                  </button>
                `
                  )
                  .join("")}

                <button class="btn-pagination" data-page="${currentPage + 1}" ${
                    currentPage === totalPages ? "disabled" : ""
                  } style="padding:8px 14px; border:1px solid #cbd5e1; border-radius:8px; background:#ffffff; font-size:13px; font-weight:600; cursor:${
                    currentPage === totalPages ? "not-allowed" : "pointer"
                  }; opacity:${currentPage === totalPages ? "0.5" : "1"};">
                  Next →
                </button>
              </div>
            `
                : ""
            }

          </main>

        </div>

      </div>
    </div>
  `;
}
