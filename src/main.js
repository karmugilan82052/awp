/**
 * AgriWaste Marketplace — Main Application Entry Point & Client Router
 */

import Chart from "chart.js/auto";
import confetti from "canvas-confetti";
import { store } from "./store/state.js";
import { showToast } from "./components/Toast.js";
import { renderNavbar } from "./components/Navbar.js";
import { renderFooter } from "./components/Footer.js";
import { renderAIAssistantModal } from "./components/AIAssistantModal.js";
import { renderNotificationPanel } from "./components/NotificationPanel.js";
import { renderChatModal } from "./components/ChatWindow.js";
import { renderRatingModal } from "./components/RatingModal.js";
import { renderComplaintModal } from "./components/ComplaintModal.js";

// Pages
import { renderHomePage } from "./pages/Home.js";
import { renderMarketplacePage } from "./pages/Marketplace.js";
import { renderWasteDetailsPage } from "./pages/WasteDetails.js";
import { renderSellWastePage } from "./pages/SellWaste.js";
import { renderCartPage } from "./pages/Cart.js";
import { renderCheckoutPage } from "./pages/Checkout.js";
import { renderOrdersPage } from "./pages/Orders.js";
import { renderOrderDetailsPage } from "./pages/OrderDetails.js";
import { renderChatPage } from "./pages/Chat.js";
import { renderFarmerDashboardPage } from "./pages/FarmerDashboard.js";
import { renderBuyerDashboardPage } from "./pages/BuyerDashboard.js";
import { renderAdminDashboardPage } from "./pages/AdminDashboard.js";
import { renderSustainabilityPage } from "./pages/Sustainability.js";
import { renderProfilePage } from "./pages/Profile.js";
import { renderLoginPage } from "./pages/Login.js";
import { renderRegisterPage } from "./pages/Register.js";

// Services
import { classifyAgriWasteImage, getAIAssistantResponse } from "./services/aiService.js";
import { initializeMap, addListingMarkers } from "./services/mapService.js";
import { exportToCSV, printTaxInvoice } from "./services/exportService.js";

class App {
  constructor() {
    this.appContainer = document.getElementById("app");
    this.modalRoot = document.getElementById("modal-root");
    this.init();
  }

  init() {
    // Listen to hash changes for client-side navigation
    window.addEventListener("hashchange", () => this.render());

    // Subscribe to store updates
    store.subscribe(() => {
      this.render();
    });

    // Initial render
    this.render();
  }

  parseHash() {
    const rawHash = window.location.hash.slice(1) || "/";
    const [pathPart, queryPart] = rawHash.split("?");
    const path = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;

    const params = {};
    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
    }

    return { path, params };
  }

  render() {
    const { path, params } = this.parseHash();

    let pageHtml = "";

    // Route matching
    if (path === "/" || path === "") {
      pageHtml = renderHomePage();
    } else if (path === "/marketplace") {
      pageHtml = renderMarketplacePage(params);
    } else if (path.startsWith("/waste/")) {
      const listingId = path.split("/waste/")[1];
      pageHtml = renderWasteDetailsPage(listingId);
    } else if (path === "/sell-waste") {
      pageHtml = renderSellWastePage();
    } else if (path === "/cart") {
      pageHtml = renderCartPage();
    } else if (path === "/checkout") {
      pageHtml = renderCheckoutPage();
    } else if (path === "/orders") {
      pageHtml = renderOrdersPage(params);
    } else if (path.startsWith("/orders/")) {
      const orderId = path.split("/orders/")[1];
      pageHtml = renderOrderDetailsPage(orderId);
    } else if (path === "/chat") {
      pageHtml = renderChatPage(params);
    } else if (path.startsWith("/farmer")) {
      let subtab = path.replace(/^\/farmer-?/, "").replace(/^\//, "");
      if (!subtab || subtab === "dashboard" || subtab === "farmer") subtab = "overview";
      pageHtml = renderFarmerDashboardPage(subtab);
    } else if (path.startsWith("/buyer")) {
      let subtab = path.replace(/^\/buyer-?/, "").replace(/^\//, "");
      if (!subtab || subtab === "dashboard" || subtab === "buyer") subtab = "overview";
      pageHtml = renderBuyerDashboardPage(subtab);
    } else if (path.startsWith("/admin")) {
      let subtab = path.replace(/^\/admin-?/, "").replace(/^\//, "");
      if (!subtab || subtab === "dashboard" || subtab === "admin") subtab = "overview";
      pageHtml = renderAdminDashboardPage(subtab);
    } else if (path === "/sustainability") {
      pageHtml = renderSustainabilityPage();
    } else if (path === "/profile") {
      pageHtml = renderProfilePage();
    } else if (path === "/login") {
      pageHtml = renderLoginPage();
    } else if (path === "/register") {
      pageHtml = renderRegisterPage();
    } else {
      pageHtml = renderHomePage();
    }

    // Combine Shell
    this.appContainer.innerHTML = `
      ${renderNavbar(path)}
      ${pageHtml}
      ${renderFooter()}
      ${renderAIAssistantModal()}
      ${renderNotificationPanel()}
    `;

    // Initialize interactive behaviors
    this.attachEventListeners(path, params);
    this.initCharts(path);
    this.initMaps(path, params);
    window.scrollTo(0, 0);
  }

  attachEventListeners(path, params) {
    // 1. Role Switcher Dropdown & 1-Click Demo
    const roleBtn = document.getElementById("btn-role-dropdown");
    const roleMenu = document.getElementById("role-dropdown-menu");
    if (roleBtn && roleMenu) {
      roleBtn.addEventListener("click", e => {
        e.stopPropagation();
        roleMenu.style.display = roleMenu.style.display === "block" ? "none" : "block";
      });
      document.addEventListener("click", () => {
        if (roleMenu) roleMenu.style.display = "none";
      });
    }

    const signoutBtn = document.getElementById("btn-user-signout");
    if (signoutBtn) {
      signoutBtn.addEventListener("click", () => {
        store.logout();
        showToast("Logged out successfully. You are now browsing as a guest.", "info");
        window.location.hash = "#/";
      });
    }

    // 2. AI Assistant Drawer Toggle
    const openAIBtn = document.getElementById("btn-open-ai-assistant");
    const closeAIBtn = document.getElementById("btn-close-ai-drawer");
    const aiDrawer = document.getElementById("ai-assistant-drawer");

    if (openAIBtn && aiDrawer) {
      openAIBtn.addEventListener("click", () => {
        aiDrawer.style.display = "flex";
      });
    }
    if (closeAIBtn && aiDrawer) {
      closeAIBtn.addEventListener("click", () => {
        aiDrawer.style.display = "none";
      });
    }

    // 3. Notifications Panel Toggle (Only open when clicked/touched)
    const notifBtn = document.getElementById("btn-toggle-notifications");
    const notifPanel = document.getElementById("notification-panel");
    const closeNotifBtn = document.getElementById("btn-close-notif-panel");
    const markAllReadBtn = document.getElementById("btn-mark-all-read");

    if (notifBtn && notifPanel) {
      notifBtn.addEventListener("click", e => {
        e.stopPropagation();
        const isOpen = notifPanel.style.display === "flex";
        notifPanel.style.display = isOpen ? "none" : "flex";
      });

      if (closeNotifBtn) {
        closeNotifBtn.addEventListener("click", e => {
          e.stopPropagation();
          notifPanel.style.display = "none";
        });
      }

      // Close when touching/clicking anywhere outside
      document.addEventListener("click", e => {
        if (notifPanel && !notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
          notifPanel.style.display = "none";
        }
      });
    }

    if (markAllReadBtn) {
      markAllReadBtn.addEventListener("click", e => {
        e.stopPropagation();
        store.markAllNotificationsRead();
        showToast("All notifications marked as read", "info");
      });
    }

    document.querySelectorAll(".notif-item").forEach(item => {
      item.addEventListener("click", () => {
        const id = item.dataset.id;
        const link = item.dataset.link;
        store.markNotificationRead(id);
        if (notifPanel) notifPanel.style.display = "none";
        if (link && link !== "#") {
          window.location.hash = link;
        }
      });
    });

    // AI Form & Quick Queries
    const aiForm = document.getElementById("ai-query-form");
    const aiInput = document.getElementById("ai-query-input");
    const aiMessages = document.getElementById("ai-chat-messages");

    const sendAIQuery = queryText => {
      if (!queryText.trim() || !aiMessages) return;
      // User message
      const userDiv = document.createElement("div");
      userDiv.style.cssText = "align-self:flex-end; background:#16a34a; color:white; padding:10px 14px; border-radius:14px 14px 2px 14px; font-size:13px; max-width:80%;";
      userDiv.innerText = queryText;
      aiMessages.appendChild(userDiv);

      // AI Response
      const res = getAIAssistantResponse(queryText);
      setTimeout(() => {
        const botDiv = document.createElement("div");
        botDiv.style.cssText = "align-self:flex-start; background:#ffffff; color:#1e293b; padding:12px 16px; border-radius:14px 14px 14px 2px; font-size:13px; line-height:1.6; border:1px solid #e2e8f0; box-shadow:0 2px 6px rgba(0,0,0,0.04); max-width:85%;";
        botDiv.innerHTML = res.text.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        aiMessages.appendChild(botDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
      }, 400);

      aiMessages.scrollTop = aiMessages.scrollHeight;
    };

    if (aiForm && aiInput) {
      aiForm.addEventListener("submit", e => {
        e.preventDefault();
        const text = aiInput.value;
        aiInput.value = "";
        sendAIQuery(text);
      });
    }

    document.querySelectorAll(".ai-quick-query").forEach(btn => {
      btn.addEventListener("click", () => {
        sendAIQuery(btn.dataset.query);
      });
    });


    // 4. Hero Search
    const heroBtn = document.getElementById("btn-hero-search");
    const heroInput = document.getElementById("hero-search-input");
    const heroState = document.getElementById("hero-state-select");
    if (heroBtn && heroInput) {
      heroBtn.addEventListener("click", () => {
        const q = encodeURIComponent(heroInput.value.trim());
        const st = heroState ? heroState.value : "all";
        window.location.hash = `#marketplace?search=${q}&state=${st}`;
      });
    }

    // 5. Marketplace Filter Panel Listeners
    const applyFiltersBtn = document.getElementById("btn-apply-filters");
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener("click", () => {
        const searchVal = document.getElementById("filter-search-input")?.value || "";
        const catVal = document.getElementById("filter-category-select")?.value || "all";
        const stateVal = document.getElementById("filter-state-select")?.value || "all";
        const priceVal = document.getElementById("filter-price-slider")?.value || 10000;
        const qtyVal = document.getElementById("filter-qty-slider")?.value || 0;
        const sortVal = document.getElementById("marketplace-sort-select")?.value || "newest";

        window.location.hash = `#marketplace?search=${encodeURIComponent(searchVal)}&category=${catVal}&state=${stateVal}&maxPrice=${priceVal}&minQty=${qtyVal}&sortBy=${sortVal}`;
      });
    }

    const priceSlider = document.getElementById("filter-price-slider");
    const priceLabel = document.getElementById("label-max-price");
    if (priceSlider && priceLabel) {
      priceSlider.addEventListener("input", e => {
        priceLabel.innerText = `₹${parseInt(e.target.value, 10).toLocaleString("en-IN")}`;
      });
    }

    const qtySlider = document.getElementById("filter-qty-slider");
    const qtyLabel = document.getElementById("label-min-qty");
    if (qtySlider && qtyLabel) {
      qtySlider.addEventListener("input", e => {
        qtyLabel.innerText = `${e.target.value} Tons`;
      });
    }

    const sortSelect = document.getElementById("marketplace-sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", e => {
        const currentHash = window.location.hash;
        const url = new URL(`http://localhost/${currentHash.slice(1)}`);
        url.searchParams.set("sortBy", e.target.value);
        window.location.hash = `#${url.pathname.slice(1)}${url.search}`;
      });
    }

    // View toggles (grid, list, map)
    document.querySelectorAll(".btn-view-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        const { path, params } = this.parseHash();
        params.view = view;
        const qs = new URLSearchParams(params).toString();
        window.location.hash = `#${path.slice(1)}?${qs}`;
      });
    });

    // Reset Filters
    const resetFiltersBtn = document.getElementById("btn-reset-filters") || document.getElementById("btn-clear-empty-filters");
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", () => {
        window.location.hash = "#marketplace";
      });
    }

    // Pagination buttons
    document.querySelectorAll(".btn-pagination").forEach(btn => {
      btn.addEventListener("click", () => {
        const page = btn.dataset.page;
        const { path, params } = this.parseHash();
        params.page = page;
        const qs = new URLSearchParams(params).toString();
        window.location.hash = `#${path.slice(1)}?${qs}`;
      });
    });

    // 6. Quick Add to Cart & Buy Now (Strictly Buyer Exclusive)
    document.querySelectorAll(".btn-quick-add-cart").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const currentRole = store.getCurrentRole();
        if (currentRole !== "buyer") {
          showToast("Access Restricted: Only verified Industrial Buyers can purchase products. Please log in as Buyer.", "error");
          return;
        }

        const id = btn.dataset.id;
        const listing = store.getListingById(id);
        if (listing) {
          store.addToCart(listing, listing.minOrderQty || 1);
          showToast(`Added ${listing.minOrderQty || 1} ${listing.unit} of '${listing.title}' to cart!`, "success");
        }
      });
    });

    // Details Page Action Buttons
    const detailsAddCartBtn = document.getElementById("btn-details-add-cart");
    const detailsBuyNowBtn = document.getElementById("btn-details-buy-now");
    const detailsQtyInput = document.getElementById("details-qty-input");
    const detailsSubtotalCalc = document.getElementById("details-subtotal-calc");

    if (detailsQtyInput && detailsSubtotalCalc && path.startsWith("/waste/")) {
      const listingId = path.split("/waste/")[1];
      const listing = store.getListingById(listingId);
      if (listing) {
        detailsQtyInput.addEventListener("input", e => {
          const qty = parseFloat(e.target.value) || 1;
          detailsSubtotalCalc.innerText = `₹${(qty * listing.price).toLocaleString("en-IN")}`;
        });
      }
    }

    if (detailsAddCartBtn) {
      detailsAddCartBtn.addEventListener("click", () => {
        const currentRole = store.getCurrentRole();
        if (currentRole !== "buyer") {
          showToast("Access Restricted: Only verified Industrial Buyers can purchase products. Please log in as Buyer.", "error");
          return;
        }
        const listingId = detailsAddCartBtn.dataset.id;
        const listing = store.getListingById(listingId);
        const qty = parseFloat(detailsQtyInput?.value) || listing.minOrderQty || 1;
        store.addToCart(listing, qty);
        showToast(`Added ${qty} ${listing.unit} to procurement cart!`, "success");
      });
    }

    if (detailsBuyNowBtn) {
      detailsBuyNowBtn.addEventListener("click", () => {
        const currentRole = store.getCurrentRole();
        if (currentRole !== "buyer") {
          showToast("Access Restricted: Only verified Industrial Buyers can purchase products. Please log in as Buyer.", "error");
          return;
        }
        const listingId = detailsBuyNowBtn.dataset.id;
        const listing = store.getListingById(listingId);
        const qty = parseFloat(detailsQtyInput?.value) || listing.minOrderQty || 1;
        store.clearCart();
        store.addToCart(listing, qty);
        window.location.hash = "#checkout";
      });
    }

    // Gallery Thumbnails
    document.querySelectorAll(".gallery-thumb").forEach(thumb => {
      thumb.addEventListener("click", () => {
        const mainImg = document.getElementById("main-gallery-image");
        if (mainImg) {
          mainImg.src = thumb.dataset.src;
          document.querySelectorAll(".gallery-thumb").forEach(t => (t.style.border = "2px solid #e2e8f0"));
          thumb.style.border = "2px solid #16a34a";
        }
      });
    });

    // 7. Cart Quantity & Remove Controls
    document.querySelectorAll(".btn-cart-qty-inc").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const item = store.getCart().find(i => i.listingId === id);
        if (item) store.updateCartQty(id, item.quantity + 1);
      });
    });

    document.querySelectorAll(".btn-cart-qty-dec").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const item = store.getCart().find(i => i.listingId === id);
        if (item) store.updateCartQty(id, Math.max(0.5, item.quantity - 1));
      });
    });

    document.querySelectorAll(".btn-cart-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        store.removeFromCart(btn.dataset.id);
        showToast("Item removed from cart", "info");
      });
    });

    const clearCartBtn = document.getElementById("btn-clear-cart");
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => {
        store.clearCart();
        showToast("Cart cleared", "info");
      });
    }

    // 8. Checkout Submission & Confetti
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", e => {
        e.preventDefault();
        const calc = store.getCartCalculations();
        const company = document.getElementById("input-checkout-company")?.value;
        const address = document.getElementById("input-checkout-address")?.value;
        const phone = document.getElementById("input-checkout-phone")?.value;
        const selectedPayment = document.querySelector('input[name="payment-method"]:checked')?.value || "UPI";

        const newOrder = store.createOrder({
          listingId: calc.items[0]?.listingId,
          listingTitle: calc.items[0]?.listingTitle,
          category: calc.items[0]?.category,
          quantity: calc.totalTons,
          unit: "Tons",
          unitPrice: calc.items[0]?.unitPrice,
          subtotal: calc.subtotal,
          transportationFee: calc.transportationFee,
          platformFee: calc.platformFee,
          taxGst: calc.taxGst,
          totalAmount: calc.totalAmount,
          paymentMethod: selectedPayment,
          deliveryAddress: address,
          seller: calc.items[0]?.seller
        });

        // Trigger celebratory confetti
        if (typeof confetti === "function") {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }

        showToast(`Order #${newOrder.id} successfully placed & secured in escrow!`, "success");
        window.location.hash = `#orders/${newOrder.id}`;
      });
    }

    // 9. AI Classifier in Sell Waste
    const aiClassifyTrigger = document.getElementById("btn-trigger-ai-classifier");
    if (aiClassifyTrigger) {
      aiClassifyTrigger.addEventListener("click", async () => {
        aiClassifyTrigger.innerText = "⏳ Analyzing with Deep Learning Model...";
        aiClassifyTrigger.disabled = true;

        const result = await classifyAgriWasteImage("paddy-straw");

        // Fill form fields
        const titleInput = document.getElementById("input-listing-title");
        const catSelect = document.getElementById("input-listing-category");
        const priceInput = document.getElementById("input-listing-price");
        const moistureInput = document.getElementById("input-listing-moisture");
        const banner = document.getElementById("ai-classification-result");
        const previewGrid = document.getElementById("image-preview-grid");

        if (titleInput) titleInput.value = result.recommendedTitle;
        if (catSelect) catSelect.value = result.categoryId;
        if (priceInput) priceInput.value = result.suggestedPrice;
        if (moistureInput) moistureInput.value = result.moistureEstimate;

        if (previewGrid) {
          previewGrid.style.display = "grid";
          previewGrid.innerHTML = `
            <div style="position:relative; border-radius:8px; overflow:hidden; border:2px solid #16a34a;">
              <img src="/images/waste/${result.categoryId || 'paddy-straw'}.jpg" style="width:100%; height:80px; object-fit:cover;" />
              <span style="position:absolute; bottom:2px; right:2px; background:#16a34a; color:white; font-size:9px; padding:1px 4px; border-radius:4px;">AI Analyzed</span>
            </div>
          `;
        }

        if (banner) {
          banner.style.display = "block";
          document.getElementById("ai-detected-name").innerText = result.categoryName;
          document.getElementById("ai-confidence-badge").innerText = `${result.confidence} Confidence`;
          document.getElementById("ai-price-suggestion").innerHTML = `Suggested Market Price: <strong>${result.suggestedPriceRange} / Ton</strong>`;
          document.getElementById("ai-apps-suggestion").innerText = `Top Uses: ${result.topApplications.join(", ")}`;
        }

        aiClassifyTrigger.innerText = "✓ AI Classified Successfully";
        showToast(`AI identified: ${result.categoryName} (${result.confidence} confidence)`, "success");
      });
    }

    // Sell Waste Form Submit
    const sellWasteForm = document.getElementById("sell-waste-form");
    if (sellWasteForm) {
      sellWasteForm.addEventListener("submit", e => {
        e.preventDefault();
        const title = document.getElementById("input-listing-title")?.value;
        const category = document.getElementById("input-listing-category")?.value;
        const qty = document.getElementById("input-listing-qty")?.value;
        const unit = document.getElementById("input-listing-unit")?.value;
        const price = document.getElementById("input-listing-price")?.value;
        const moisture = document.getElementById("input-listing-moisture")?.value;
        const grade = document.getElementById("input-listing-grade")?.value;
        const pkg = document.getElementById("input-listing-pkg")?.value;
        const loading = document.getElementById("input-listing-loading")?.value;
        const storage = document.getElementById("input-listing-storage")?.value;
        const state = document.getElementById("input-listing-state")?.value;
        const district = document.getElementById("input-listing-district")?.value;
        const pincode = document.getElementById("input-listing-pincode")?.value;
        const desc = document.getElementById("input-listing-desc")?.value;

        const newListing = store.createListing({
          title,
          category,
          quantity: qty,
          unit,
          price,
          moisture,
          qualityGrade: grade,
          packaging: pkg,
          loadingAssistance: loading,
          storageType: storage,
          state,
          district,
          pincode,
          description: desc
        });

        showToast("Your agricultural waste listing has been published!", "success");
        window.location.hash = `#waste/${newListing.id}`;
      });
    }

    // 10. Order Status Advance Simulator Triggers
    document.querySelectorAll(".btn-advance-status").forEach(btn => {
      btn.addEventListener("click", () => {
        const orderId = btn.dataset.orderId;
        const targetStatus = btn.dataset.status;
        store.updateOrderStatus(orderId, targetStatus, `Checkpoint: Driver logged ${targetStatus}`);
        showToast(`Order #${orderId} status advanced to: ${targetStatus}`, "success");
      });
    });

    // 11. Tax Invoice Print Action
    const printInvoiceBtn = document.getElementById("btn-print-tax-invoice");
    if (printInvoiceBtn) {
      printInvoiceBtn.addEventListener("click", () => {
        const order = store.getOrderById(printInvoiceBtn.dataset.id);
        printTaxInvoice(order);
      });
    }

    // 12. Rating Modal Open / Close / Submit
    const openReviewBtn = document.getElementById("btn-open-review-modal");
    if (openReviewBtn) {
      openReviewBtn.addEventListener("click", () => {
        const order = store.getOrderById(openReviewBtn.dataset.orderId);
        this.modalRoot.innerHTML = renderRatingModal(order);
        this.attachModalListeners();
      });
    }

    // 13. Dispute / Complaint Modal Open
    const openDisputeBtn = document.getElementById("btn-open-dispute-modal");
    if (openDisputeBtn) {
      openDisputeBtn.addEventListener("click", () => {
        const order = store.getOrderById(openDisputeBtn.dataset.id);
        this.modalRoot.innerHTML = renderComplaintModal(order);
        this.attachModalListeners();
      });
    }

    // 14. Contact Seller -> Chat Modal Open
    const contactSellerBtn = document.getElementById("btn-details-contact-seller");
    if (contactSellerBtn) {
      contactSellerBtn.addEventListener("click", () => {
        const listing = store.getListingById(contactSellerBtn.dataset.listingId);
        const conv = {
          id: "conv-1",
          otherUserId: listing.seller?.id || "usr-farmer-1",
          otherUserName: listing.seller?.name || "Farmer",
          otherUserRole: "Farmer / Seller",
          otherUserAvatar: listing.seller?.avatar || "S",
          listingId: listing.id,
          listingTitle: `${listing.title} (${listing.quantity} ${listing.unit})`,
          messages: [
            { id: "m1", text: `Namaste! I am inquiring regarding your listing '${listing.title}' priced at ₹${listing.price}/Ton. Is it available for immediate dispatch?`, isSender: true, timestamp: "Just now" }
          ]
        };
        this.modalRoot.innerHTML = renderChatModal(conv);
        this.attachModalListeners();
      });
    }

    // 15. Admin CSV Export Action
    const adminCsvBtn = document.getElementById("btn-export-admin-csv");
    if (adminCsvBtn) {
      adminCsvBtn.addEventListener("click", () => {
        const listingsData = store.getListings({ includeAllStatuses: true }).map(l => ({
          ListingID: l.id,
          Title: l.title,
          Category: l.categoryName,
          QuantityTons: l.quantity,
          PricePerTon: l.price,
          Location: l.location,
          Seller: l.seller?.name,
          Status: l.status,
          CreatedAt: l.createdAt
        }));
        exportToCSV("AgriWaste_Platform_Listings_Report", listingsData);
        showToast("Admin CSV report exported successfully!", "success");
      });
    }

    document.querySelectorAll(".btn-export-specific-report").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        if (type === "farmers") {
          const farmersData = store.getUsers("farmer").map(f => ({
            FarmerID: f.id,
            Name: f.name,
            FarmName: f.farmName,
            Location: f.location,
            Phone: f.phone,
            TotalEarnings: f.totalEarnings
          }));
          exportToCSV("AgriWaste_Farmers_Directory", farmersData);
        } else if (type === "orders") {
          const ordersData = store.getOrders().map(o => ({
            OrderID: o.id,
            Listing: o.listingTitle,
            Buyer: o.buyer.name,
            Seller: o.seller.name,
            Tons: o.quantity,
            TotalPaid: o.totalAmount,
            Status: o.status
          }));
          exportToCSV("AgriWaste_Orders_Procurement_Log", ordersData);
        }
        showToast("Report exported successfully!", "success");
      });
    });

    // Admin Reset Demo Data
    const resetStateBtn = document.getElementById("btn-reset-demo-state");
    if (resetStateBtn) {
      resetStateBtn.addEventListener("click", () => {
        if (confirm("Reset marketplace state to default initial Indian agri dataset?")) {
          store.resetToDefaults();
          showToast("State reset to initial seed data!", "success");
        }
      });
    }

    // Main Chat Message Sending
    const mainChatForm = document.getElementById("main-chat-form");
    const mainChatInput = document.getElementById("main-chat-input");
    if (mainChatForm && mainChatInput) {
      mainChatForm.addEventListener("submit", e => {
        e.preventDefault();
        const convId = mainChatForm.dataset.convId;
        const text = mainChatInput.value.trim();
        if (text) {
          store.sendMessage(convId, text, true);
          mainChatInput.value = "";
          showToast("Message sent to buyer/seller", "success");
        }
      });
    }

    // Profile Form Save
    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
      profileForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("profile-name")?.value;
        const company = document.getElementById("profile-company")?.value;
        const location = document.getElementById("profile-location")?.value;
        store.updateCurrentUser({ name, companyName: company, farmName: company, location });
        showToast("Profile details updated successfully!", "success");
      });
    }

    // ==========================================
    // Enhanced Login Page Interactive Logic
    // ==========================================
    const roleTabs = document.querySelectorAll(".btn-role-tab");
    const loginEmailInput = document.getElementById("login-email");
    const loginPhoneInput = document.getElementById("login-phone");
    const personaBadgeIcon = document.getElementById("persona-badge-icon");
    const personaBadgeTitle = document.getElementById("persona-badge-title");
    const personaBadgeOrg = document.getElementById("persona-badge-org");
    const personaBadgeAccess = document.getElementById("persona-badge-access");
    const btnLoginText = document.getElementById("btn-login-text");

    let activeSelectedRole = store.getCurrentRole() || "farmer";

    if (roleTabs.length > 0) {
      roleTabs.forEach(tab => {
        tab.addEventListener("click", () => {
          const role = tab.dataset.role;
          activeSelectedRole = role;
          const email = tab.dataset.email;
          const phone = tab.dataset.phone;
          const name = tab.dataset.name;
          const entity = tab.dataset.entity;

          // Update active styles
          roleTabs.forEach(t => {
            const isTarget = t === tab;
            t.classList.toggle("active-role-card", isTarget);
            if (t.dataset.role === "farmer") {
              t.style.background = isTarget ? "#f0fdf4" : "#ffffff";
              t.style.border = isTarget ? "2px solid #16a34a" : "1.5px solid #e2e8f0";
              t.style.boxShadow = isTarget ? "0 4px 12px rgba(22,163,74,0.12)" : "none";
            } else if (t.dataset.role === "buyer") {
              t.style.background = isTarget ? "#f0f9ff" : "#ffffff";
              t.style.border = isTarget ? "2px solid #0284c7" : "1.5px solid #e2e8f0";
              t.style.boxShadow = isTarget ? "0 4px 12px rgba(2,132,199,0.12)" : "none";
            } else if (t.dataset.role === "admin") {
              t.style.background = isTarget ? "#faf5ff" : "#ffffff";
              t.style.border = isTarget ? "2px solid #7c3aed" : "1.5px solid #e2e8f0";
              t.style.boxShadow = isTarget ? "0 4px 12px rgba(124,58,237,0.12)" : "none";
            }
          });

          // Auto-fill fields
          if (loginEmailInput) loginEmailInput.value = email;
          if (loginPhoneInput) loginPhoneInput.value = phone;

          // Update Persona Summary Card
          if (personaBadgeTitle) personaBadgeTitle.textContent = `${name} (${role.toUpperCase()})`;
          if (personaBadgeOrg) personaBadgeOrg.textContent = entity;
          if (personaBadgeIcon) {
            personaBadgeIcon.textContent = role === "farmer" ? "🧑‍🌾" : role === "buyer" ? "🏭" : "🛡️";
          }
          if (personaBadgeAccess) {
            if (role === "farmer") {
              personaBadgeAccess.textContent = "Direct Escrow Seller";
              personaBadgeAccess.style.background = "#dcfce7";
              personaBadgeAccess.style.color = "#15803d";
            } else if (role === "buyer") {
              personaBadgeAccess.textContent = "Verified Procurement Hub";
              personaBadgeAccess.style.background = "#e0f2fe";
              personaBadgeAccess.style.color = "#0369a1";
            } else {
              personaBadgeAccess.textContent = "Full System Compliance Admin";
              personaBadgeAccess.style.background = "#f3e8ff";
              personaBadgeAccess.style.color = "#7c3aed";
            }
          }

          if (btnLoginText) {
            btnLoginText.textContent = `Sign In as ${role === 'farmer' ? 'Farmer (Ramesh Patel)' : role === 'buyer' ? 'Buyer (AgroFeed)' : 'Admin (Dr. Amit Verma)'}`;
          }

          store.setCurrentRole(role);
          showToast(`Persona loaded: ${name} (${role.toUpperCase()})`, "info");
        });
      });
    }

    // Toggle Password Visibility
    const btnTogglePwd = document.getElementById("btn-toggle-pwd");
    const loginPwdInput = document.getElementById("login-password");
    if (btnTogglePwd && loginPwdInput) {
      btnTogglePwd.addEventListener("click", () => {
        if (loginPwdInput.type === "password") {
          loginPwdInput.type = "text";
          btnTogglePwd.textContent = "🙈";
        } else {
          loginPwdInput.type = "password";
          btnTogglePwd.textContent = "👁️";
        }
      });
    }

    // Password strength reactive feedback
    if (loginPwdInput) {
      loginPwdInput.addEventListener("input", () => {
        const val = loginPwdInput.value;
        const bar = document.getElementById("pwd-strength-bar");
        const txt = document.getElementById("pwd-strength-text");
        if (!bar || !txt) return;

        if (val.length === 0) {
          bar.style.width = "0%";
          txt.textContent = "Enter password";
          txt.style.color = "#94a3b8";
        } else if (val.length < 6) {
          bar.style.width = "30%";
          bar.style.background = "#ef4444";
          txt.textContent = "Weak (Minimum 6 characters)";
          txt.style.color = "#ef4444";
        } else if (val.length < 10) {
          bar.style.width = "70%";
          bar.style.background = "#f59e0b";
          txt.textContent = "Medium Security";
          txt.style.color = "#d97706";
        } else {
          bar.style.width = "100%";
          bar.style.background = "#22c55e";
          txt.textContent = "256-Bit Strong Encrypted";
          txt.style.color = "#16a34a";
        }
      });
    }

    // Auth Tabs Switcher (Email vs Kisan OTP)
    const tabAuthEmail = document.getElementById("tab-auth-email");
    const tabAuthOtp = document.getElementById("tab-auth-otp");
    const emailForm = document.getElementById("login-form");
    const otpForm = document.getElementById("login-otp-form");

    if (tabAuthEmail && tabAuthOtp && emailForm && otpForm) {
      tabAuthEmail.addEventListener("click", () => {
        tabAuthEmail.style.borderBottom = "2.5px solid #16a34a";
        tabAuthEmail.style.color = "#15803d";
        tabAuthEmail.style.fontWeight = "800";
        tabAuthOtp.style.borderBottom = "2.5px solid transparent";
        tabAuthOtp.style.color = "#64748b";
        tabAuthOtp.style.fontWeight = "700";
        emailForm.style.display = "block";
        otpForm.style.display = "none";
      });

      tabAuthOtp.addEventListener("click", () => {
        tabAuthOtp.style.borderBottom = "2.5px solid #16a34a";
        tabAuthOtp.style.color = "#15803d";
        tabAuthOtp.style.fontWeight = "800";
        tabAuthEmail.style.borderBottom = "2.5px solid transparent";
        tabAuthEmail.style.color = "#64748b";
        tabAuthEmail.style.fontWeight = "700";
        otpForm.style.display = "block";
        emailForm.style.display = "none";
      });
    }

    // OTP Send Demo Simulation
    const btnSendOtp = document.getElementById("btn-send-otp");
    if (btnSendOtp) {
      btnSendOtp.addEventListener("click", () => {
        const phone = document.getElementById("login-phone")?.value || "+91 98765 43210";
        showToast(`OTP Code sent to ${phone}: 123456 (Valid for 10m)`, "success");
        btnSendOtp.disabled = true;
        let countdown = 30;
        btnSendOtp.textContent = `Resend in ${countdown}s`;
        const interval = setInterval(() => {
          countdown--;
          if (countdown > 0) {
            btnSendOtp.textContent = `Resend in ${countdown}s`;
          } else {
            clearInterval(interval);
            btnSendOtp.disabled = false;
            btnSendOtp.textContent = "Send OTP";
          }
        }, 1000);
      });
    }

    // OTP digit auto focus navigation
    const otpDigits = document.querySelectorAll(".otp-digit");
    otpDigits.forEach((digit, idx) => {
      digit.addEventListener("keyup", e => {
        if (e.key >= "0" && e.key <= "9") {
          if (idx < otpDigits.length - 1) {
            otpDigits[idx + 1].focus();
          }
        } else if (e.key === "Backspace") {
          if (idx > 0 && !digit.value) {
            otpDigits[idx - 1].focus();
          }
        }
      });
    });

    // Passkey WebAuthn Login Simulation
    const btnWebAuthn = document.getElementById("btn-webauthn-login");
    if (btnWebAuthn) {
      btnWebAuthn.addEventListener("click", () => {
        showToast("Biometric / Security Key Verified! Signing in...", "success");
        setTimeout(() => {
          store.setCurrentRole(activeSelectedRole);
          if (activeSelectedRole === "farmer") window.location.hash = "#farmer-dashboard";
          else if (activeSelectedRole === "buyer") window.location.hash = "#buyer-dashboard";
          else window.location.hash = "#admin-dashboard";
        }, 600);
      });
    }

    // Forgot Password Trigger
    const btnForgot = document.getElementById("btn-forgot-pwd");
    if (btnForgot) {
      btnForgot.addEventListener("click", e => {
        e.preventDefault();
        const email = document.getElementById("login-email")?.value || "ramesh@greenfarmagro.in";
        showToast(`Password reset link and OTP sent to ${email}`, "info");
      });
    }

    // Login & Register Form Submissions
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", e => {
        e.preventDefault();
        store.setCurrentRole(activeSelectedRole);
        const user = store.getCurrentUser();
        showToast(`Welcome back, ${user?.name || 'Verified User'}! Successfully signed in.`, "success");
        if (activeSelectedRole === "farmer") window.location.hash = "#farmer-dashboard";
        else if (activeSelectedRole === "buyer") window.location.hash = "#buyer-dashboard";
        else if (activeSelectedRole === "admin") window.location.hash = "#admin-dashboard";
      });
    }

    const loginOtpForm = document.getElementById("login-otp-form");
    if (loginOtpForm) {
      loginOtpForm.addEventListener("submit", e => {
        e.preventDefault();
        store.setCurrentRole(activeSelectedRole);
        const user = store.getCurrentUser();
        showToast(`Mobile OTP Verified! Welcome ${user?.name || 'Farmer'}.`, "success");
        if (activeSelectedRole === "farmer") window.location.hash = "#farmer-dashboard";
        else if (activeSelectedRole === "buyer") window.location.hash = "#buyer-dashboard";
        else if (activeSelectedRole === "admin") window.location.hash = "#admin-dashboard";
      });
    }

    const regForm = document.getElementById("register-form");
    if (regForm) {
      regForm.addEventListener("submit", e => {
        e.preventDefault();
        const role = document.querySelector('input[name="register-role"]:checked')?.value || "farmer";
        store.setCurrentRole(role);
        showToast("Account created successfully!", "success");
        window.location.hash = role === "farmer" ? "#farmer-dashboard" : "#buyer-dashboard";
      });
    }

    // ==========================================
    // Dashboard & Admin Action Handlers
    // ==========================================
    // 1. Delete Listing
    document.querySelectorAll(".btn-delete-listing").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        if (confirm("Are you sure you want to remove this agricultural waste listing?")) {
          store.deleteListing(id);
          showToast("Listing deleted successfully.", "info");
        }
      });
    });

    // 2. Admin Approve Listing
    document.querySelectorAll(".btn-admin-approve").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const id = btn.dataset.id;
        store.approveListing(id);
        showToast("Listing approved & published to national exchange!", "success");
      });
    });

    // 3. Admin Reject Listing
    document.querySelectorAll(".btn-admin-reject").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const id = btn.dataset.id;
        const reason = prompt("Enter quality specification reason for rejection:", "Moisture exceeds 18% threshold");
        if (reason) {
          store.rejectListing(id, reason);
          showToast("Listing rejected and revision notice sent to farmer.", "info");
        }
      });
    });

    // 4. Toggle User Suspension
    document.querySelectorAll(".btn-toggle-suspend").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const id = btn.dataset.id;
        store.suspendUser(id);
        showToast("Stakeholder account access updated.", "info");
      });
    });

    // 5. Admin Resolve Dispute
    document.querySelectorAll(".btn-resolve-dispute").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const id = btn.dataset.id;
        store.resolveComplaint(id, "Arbitration complete: 100% Escrow released to aggrieved party.", "Resolved");
        showToast("Dispute arbitration ticket marked as Resolved.", "success");
      });
    });

    // 6. Farmer Mark Order Ready
    document.querySelectorAll(".btn-farmer-accept-order").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const id = btn.dataset.id;
        store.updateOrderStatus(id, "Pickup Scheduled", "Biomass baled & ready at farm shed");
        showToast(`Order #${id} marked as Baled & Scheduled for Transport!`, "success");
      });
    });

    // 7. Buyer Confirm Delivery & Release Escrow
    document.querySelectorAll(".btn-buyer-confirm-delivery").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const id = btn.dataset.id;
        store.updateOrderStatus(id, "Completed", "Delivery verified at plant weighbridge. Escrow released.");
        if (typeof confetti === "function") {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
        showToast(`Delivery confirmed for Order #${id}! Escrow funds released to farmer.`, "success");
      });
    });

    // 8. Farmer Request Escrow Payout
    const btnRequestPayout = document.getElementById("btn-request-payout");
    if (btnRequestPayout) {
      btnRequestPayout.addEventListener("click", () => {
        if (typeof confetti === "function") {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
        }
        showToast("Payout Request Initiated: ₹2,84,500 transferred via IMPS/DBT to linked SBI account.", "success");
      });
    }
  }

  attachModalListeners() {
    // Close modal triggers
    const closeChatBtn = document.getElementById("btn-close-chat-modal");
    const closeRatingBtn = document.getElementById("btn-close-rating-modal");
    const closeComplaintBtn = document.getElementById("btn-close-complaint-modal");

    const closeModal = () => {
      this.modalRoot.innerHTML = "";
    };

    if (closeChatBtn) closeChatBtn.addEventListener("click", closeModal);
    if (closeRatingBtn) closeRatingBtn.addEventListener("click", closeModal);
    if (closeComplaintBtn) closeComplaintBtn.addEventListener("click", closeModal);

    // Star Rating Clickers
    document.querySelectorAll(".star-btn").forEach(star => {
      star.addEventListener("click", () => {
        const val = parseInt(star.dataset.val, 10);
        document.getElementById("input-overall-rating").value = val;
        document.querySelectorAll(".star-btn").forEach((s, idx) => {
          s.style.color = idx < val ? "#eab308" : "#cbd5e1";
        });
      });
    });

    // Rating Submit
    const ratingForm = document.getElementById("rating-form");
    if (ratingForm) {
      ratingForm.addEventListener("submit", e => {
        e.preventDefault();
        const orderId = ratingForm.dataset.orderId;
        const sellerId = ratingForm.dataset.sellerId;
        const sellerName = ratingForm.dataset.sellerName;
        const overall = document.getElementById("input-overall-rating")?.value || 5;
        const quality = document.getElementById("input-quality-rating")?.value || 5;
        const comment = document.getElementById("input-review-text")?.value;

        store.addReview({
          orderId,
          sellerId,
          sellerName,
          overallRating: overall,
          qualityRating: quality,
          comment
        });

        closeModal();
        showToast("Thank you! Your verified seller review has been posted.", "success");
      });
    }

    // Complaint Submit
    const complaintForm = document.getElementById("complaint-form");
    if (complaintForm) {
      complaintForm.addEventListener("submit", e => {
        e.preventDefault();
        const orderId = complaintForm.dataset.orderId;
        const type = document.getElementById("input-complaint-type")?.value;
        const desc = document.getElementById("input-complaint-desc")?.value;

        store.createComplaint({
          orderId,
          complaintType: type,
          description: desc
        });

        closeModal();
        showToast("Dispute ticket opened. Admin arbitration is reviewing the evidence.", "info");
      });
    }

    // Modal Chat Form
    const modalChatForm = document.getElementById("chat-modal-form");
    const modalChatInput = document.getElementById("chat-modal-input");
    if (modalChatForm && modalChatInput) {
      modalChatForm.addEventListener("submit", e => {
        e.preventDefault();
        const text = modalChatInput.value.trim();
        if (text) {
          store.sendMessage("conv-1", text, true);
          modalChatInput.value = "";
          showToast("Message sent to seller", "success");
          closeModal();
        }
      });
    }
  }

  initCharts(path) {
    if (typeof Chart === "undefined") return;

    // 1. Farmer Revenue & Category Charts
    const farmerRevCanvas = document.getElementById("farmer-revenue-chart");
    if (farmerRevCanvas) {
      new Chart(farmerRevCanvas, {
        type: "bar",
        data: {
          labels: ["Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              label: "Biomass Revenue (₹)",
              data: [35000, 48000, 62000, 78000, 94500],
              backgroundColor: "#16a34a",
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    const farmerCatCanvas = document.getElementById("farmer-category-chart");
    if (farmerCatCanvas) {
      new Chart(farmerCatCanvas, {
        type: "doughnut",
        data: {
          labels: ["Paddy Straw", "Sugarcane Bagasse", "Wheat Straw", "Cow Dung"],
          datasets: [
            {
              data: [42, 28, 18, 12],
              backgroundColor: ["#16a34a", "#22c55e", "#eab308", "#d97706"]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    // 2. Buyer Spending Chart
    const buyerSpendCanvas = document.getElementById("buyer-spending-chart");
    if (buyerSpendCanvas) {
      new Chart(buyerSpendCanvas, {
        type: "line",
        data: {
          labels: ["Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              label: "Procurement Spend (₹)",
              data: [120000, 185000, 240000, 310000, 420000],
              borderColor: "#0284c7",
              backgroundColor: "rgba(2, 132, 199, 0.1)",
              fill: true,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    // 3. Admin Volume & State Leaderboard Charts
    const adminVolCanvas = document.getElementById("admin-volume-chart");
    if (adminVolCanvas) {
      new Chart(adminVolCanvas, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              label: "Trading Volume (Tons)",
              data: [1800, 2400, 3100, 3900, 4800, 5600, 7100, 9450],
              borderColor: "#16a34a",
              backgroundColor: "rgba(22, 163, 74, 0.15)",
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    const adminStateCanvas = document.getElementById("admin-state-chart");
    if (adminStateCanvas) {
      new Chart(adminStateCanvas, {
        type: "bar",
        data: {
          labels: ["Punjab", "Maharashtra", "Tamil Nadu", "Haryana", "Gujarat"],
          datasets: [
            {
              label: "Tons Traded",
              data: [9450, 6800, 5600, 4900, 4100],
              backgroundColor: ["#15803d", "#16a34a", "#22c55e", "#86efac", "#bbf7d0"],
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    // 4. Sustainability Burning Mitigation Chart
    const burnCanvas = document.getElementById("sustainability-burning-chart");
    if (burnCanvas) {
      new Chart(burnCanvas, {
        type: "bar",
        data: {
          labels: ["Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              label: "Open Burning Incidents Avoided",
              data: [210, 340, 520, 780, 1090],
              backgroundColor: "#d97706",
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    const splitCanvas = document.getElementById("sustainability-split-chart");
    if (splitCanvas) {
      new Chart(splitCanvas, {
        type: "doughnut",
        data: {
          labels: ["Bio-Energy Pellets", "Bio-CNG Gas", "Paper & Packaging", "Cattle Fodder", "Compost"],
          datasets: [
            {
              data: [35, 25, 18, 12, 10],
              backgroundColor: ["#16a34a", "#0284c7", "#eab308", "#9333ea", "#10b981"]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  initMaps(path, params) {
    // 1. Marketplace GIS Map
    if (path === "/marketplace" && params.view === "map") {
      setTimeout(() => {
        const map = initializeMap("marketplace-leaflet-map", [20.5937, 78.9629], 5);
        if (map) {
          const listings = store.getListings(params);
          addListingMarkers(map, listings, listing => {
            window.location.hash = `#waste/${listing.id}`;
          });
        }
      }, 100);
    }

    // 2. Waste Details Map
    if (path.startsWith("/waste/")) {
      const listingId = path.split("/waste/")[1];
      const listing = store.getListingById(listingId);
      if (listing && listing.lat && listing.lng) {
        setTimeout(() => {
          const map = initializeMap("details-leaflet-map", [listing.lat, listing.lng], 10);
          if (map) {
            addListingMarkers(map, [listing]);
          }
        }, 100);
      }
    }
  }
}

// Instantiate App
new App();
