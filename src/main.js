/**
 * AgriWaste Marketplace — Main Application Entry Point & Client Router
 */

/* global Chart, confetti */

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
      const subtab = path.replace("/farmer-", "").replace("/farmer/", "").replace("/farmer", "overview");
      pageHtml = renderFarmerDashboardPage(subtab);
    } else if (path.startsWith("/buyer")) {
      const subtab = path.replace("/buyer-", "").replace("/buyer/", "").replace("/buyer", "overview");
      pageHtml = renderBuyerDashboardPage(subtab);
    } else if (path.startsWith("/admin")) {
      const subtab = path.replace("/admin-", "").replace("/admin/", "").replace("/admin", "overview");
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

    document.querySelectorAll(".role-select-option, .btn-demo-login").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetRole = btn.dataset.role;
        store.setCurrentRole(targetRole);
        showToast(`Switched role to: ${targetRole.toUpperCase()}`, "success");
        if (targetRole === "farmer") window.location.hash = "#farmer-dashboard";
        else if (targetRole === "buyer") window.location.hash = "#buyer-dashboard";
        else if (targetRole === "admin") window.location.hash = "#admin-dashboard";
      });
    });

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

    // 3. Notifications Panel Toggle
    const notifBtn = document.getElementById("btn-toggle-notifications");
    const notifPanel = document.getElementById("notification-panel");
    if (notifBtn && notifPanel) {
      notifBtn.addEventListener("click", e => {
        e.stopPropagation();
        notifPanel.style.display = notifPanel.style.display === "flex" ? "none" : "flex";
      });
      document.addEventListener("click", () => {
        if (notifPanel) notifPanel.style.display = "none";
      });
    }

    const markAllReadBtn = document.getElementById("btn-mark-all-read");
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener("click", () => {
        store.markAllNotificationsRead();
        showToast("All notifications marked as read", "info");
      });
    }

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

    // 6. Quick Add to Cart & Buy Now
    document.querySelectorAll(".btn-quick-add-cart").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
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
        const listingId = detailsAddCartBtn.dataset.id;
        const listing = store.getListingById(listingId);
        const qty = parseFloat(detailsQtyInput?.value) || listing.minOrderQty || 1;
        store.addToCart(listing, qty);
        showToast(`Added ${qty} ${listing.unit} to procurement cart!`, "success");
      });
    }

    if (detailsBuyNowBtn) {
      detailsBuyNowBtn.addEventListener("click", () => {
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

    // Login & Register Form Submissions
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", e => {
        e.preventDefault();
        showToast("Signed in successfully!", "success");
        window.location.hash = "#farmer-dashboard";
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
