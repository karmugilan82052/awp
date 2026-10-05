/**
 * Central Reactive Store for AgriWaste Marketplace
 * Supports persistent LocalStorage state, reactive subscriptions, and simulated REST APIs.
 */

import {
  INITIAL_CATEGORIES,
  INITIAL_LISTINGS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_COMPLAINTS,
  SUSTAINABILITY_METRICS
} from "./initialData.js";
import { generateId, deepClone } from "../utils/helpers.js";

const STORAGE_KEY = "AGRIWASTE_STATE_V4";

class Store {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load local state:", e);
    }

    return {
      currentRole: "farmer", // farmer | buyer | admin
      currentUserId: "usr-farmer-1",
      categories: [...INITIAL_CATEGORIES],
      listings: [...INITIAL_LISTINGS],
      users: [...INITIAL_USERS],
      orders: [...INITIAL_ORDERS],
      conversations: [...INITIAL_CONVERSATIONS],
      notifications: [...INITIAL_NOTIFICATIONS],
      reviews: [...INITIAL_REVIEWS],
      complaints: [...INITIAL_COMPLAINTS],
      cart: [],
      favorites: ["LST-1001", "LST-1002", "LST-1003"],
      sustainability: { ...SUSTAINABILITY_METRICS }
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (e) {
        console.error("Store listener error:", e);
      }
    }
  }

  // ==========================================
  // CURRENT USER & ROLE MANAGEMENT
  // ==========================================
  getCurrentRole() {
    return this.state.currentRole;
  }

  setCurrentRole(role, userId = null) {
    this.state.currentRole = role;
    if (userId) {
      this.state.currentUserId = userId;
    } else {
      if (role === "farmer") this.state.currentUserId = "usr-farmer-1";
      else if (role === "buyer") this.state.currentUserId = "usr-buyer-1";
      else if (role === "admin") this.state.currentUserId = "usr-admin-1";
    }
    this.saveState();
  }

  getCurrentUser() {
    const user = this.state.users.find(u => u.id === this.state.currentUserId);
    if (user) return deepClone(user);
    // Fallback based on role
    const fallback = this.state.users.find(u => u.role === this.state.currentRole) || this.state.users[0];
    return deepClone(fallback);
  }

  updateCurrentUser(userData) {
    const user = this.state.users.find(u => u.id === this.state.currentUserId);
    if (user) {
      Object.assign(user, userData);
      this.saveState();
    }
  }

  // ==========================================
  // LISTINGS
  // ==========================================
  getListings(filters = {}) {
    let result = [...this.state.listings];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        l =>
          l.title.toLowerCase().includes(q) ||
          l.categoryName.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          (l.description && l.description.toLowerCase().includes(q)) ||
          (l.crop && l.crop.toLowerCase().includes(q))
      );
    }

    if (filters.category && filters.category !== "all") {
      result = result.filter(l => l.category === filters.category);
    }

    if (filters.state && filters.state !== "all") {
      result = result.filter(l => l.state === filters.state);
    }

    if (filters.maxPrice) {
      result = result.filter(l => l.price <= filters.maxPrice);
    }

    if (filters.minQty) {
      result = result.filter(l => l.quantity >= filters.minQty);
    }

    if (filters.qualityGrade && filters.qualityGrade !== "all") {
      result = result.filter(l => l.qualityGrade && l.qualityGrade.includes(filters.qualityGrade));
    }

    if (filters.status) {
      result = result.filter(l => l.status === filters.status);
    } else if (!filters.includeAllStatuses) {
      // By default show approved active listings
      result = result.filter(l => l.status === "Approved" || l.status === "Active");
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "qty-desc":
          result.sort((a, b) => b.quantity - a.quantity);
          break;
        case "rating-desc":
          result.sort((a, b) => (b.seller?.rating || 0) - (a.seller?.rating || 0));
          break;
        case "distance-asc":
          result.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
          break;
        case "newest":
        default:
          result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
      }
    }

    return deepClone(result);
  }

  getListingById(id) {
    const l = this.state.listings.find(item => item.id === id);
    return l ? deepClone(l) : null;
  }

  createListing(listingData) {
    const currentUser = this.getCurrentUser();
    const catObj = this.state.categories.find(c => c.id === listingData.category) || this.state.categories[0];

    const newListing = {
      id: generateId("LST"),
      title: listingData.title || `${listingData.crop || "Agri Waste"} (${listingData.state || "India"})`,
      category: listingData.category,
      categoryName: catObj.name,
      crop: listingData.crop || catObj.name,
      quantity: parseFloat(listingData.quantity) || 1,
      unit: listingData.unit || "Tons",
      price: parseFloat(listingData.price) || 2000,
      priceUnit: `Per ${listingData.unit ? listingData.unit.slice(0, -1) : "Ton"}`,
      minOrderQty: parseFloat(listingData.minOrderQty) || 1,
      availableQty: parseFloat(listingData.quantity) || 1,
      condition: listingData.condition || "Dry",
      moisture: listingData.moisture || "12%",
      qualityGrade: listingData.qualityGrade || "Grade A",
      packaging: listingData.packaging || "Standard Packaging",
      harvestDate: listingData.harvestDate || new Date().toISOString().split("T")[0],
      expiryDate: listingData.expiryDate || "2027-03-01",
      pickupAvailability: listingData.pickupAvailability || "Immediate Pickup",
      loadingAssistance: listingData.loadingAssistance || "Yes",
      storageType: listingData.storageType || "Covered Shed",
      location: `${listingData.district || "District"}, ${listingData.state || "State"}`,
      district: listingData.district || "District",
      state: listingData.state || "State",
      pincode: listingData.pincode || "110001",
      distanceKm: Math.floor(Math.random() * 40) + 5,
      lat: parseFloat(listingData.lat) || 28.6139,
      lng: parseFloat(listingData.lng) || 77.209,
      description: listingData.description || "",
      images: listingData.images && listingData.images.length > 0 ? listingData.images : [catObj.image],
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        farmName: currentUser.farmName || currentUser.name,
        avatar: currentUser.avatar,
        rating: currentUser.rating || 4.8,
        reviewsCount: currentUser.reviewsCount || 1,
        verified: true,
        phone: currentUser.phone
      },
      status: "Approved", // Auto-approved for smooth demonstration
      isApproved: true,
      views: 1,
      createdAt: new Date().toISOString().split("T")[0],
      featured: false
    };

    this.state.listings.unshift(newListing);
    this.addNotification({
      type: "listing",
      title: "New Listing Published",
      message: `Your listing '${newListing.title}' is now live on the marketplace.`,
      icon: "check-circle",
      link: `#waste/${newListing.id}`
    });
    this.saveState();
    return newListing;
  }

  updateListing(id, updatedData) {
    const idx = this.state.listings.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.state.listings[idx] = { ...this.state.listings[idx], ...updatedData };
      this.saveState();
      return deepClone(this.state.listings[idx]);
    }
    return null;
  }

  deleteListing(id) {
    this.state.listings = this.state.listings.filter(l => l.id !== id);
    this.saveState();
  }

  approveListing(id) {
    const listing = this.state.listings.find(l => l.id === id);
    if (listing) {
      listing.status = "Approved";
      listing.isApproved = true;
      this.addNotification({
        type: "listing",
        title: "Listing Approved by Admin",
        message: `Listing '${listing.title}' has been approved and published.`,
        icon: "check-circle",
        link: `#waste/${listing.id}`
      });
      this.saveState();
    }
  }

  rejectListing(id, reason = "Inadequate quality specifications") {
    const listing = this.state.listings.find(l => l.id === id);
    if (listing) {
      listing.status = "Rejected";
      listing.isApproved = false;
      listing.rejectReason = reason;
      this.addNotification({
        type: "listing",
        title: "Listing Needs Revision",
        message: `Listing '${listing.title}' was rejected: ${reason}`,
        icon: "alert-triangle",
        link: `#waste/${listing.id}`
      });
      this.saveState();
    }
  }

  // ==========================================
  // CART
  // ==========================================
  getCart() {
    return deepClone(this.state.cart || []);
  }

  addToCart(listing, quantity = null) {
    if (!this.state.cart) this.state.cart = [];
    const qty = quantity !== null ? parseFloat(quantity) : listing.minOrderQty || 1;
    const existing = this.state.cart.find(item => item.listingId === listing.id);

    if (existing) {
      existing.quantity += qty;
    } else {
      this.state.cart.push({
        id: generateId("CART"),
        listingId: listing.id,
        listingTitle: listing.title,
        category: listing.category,
        categoryName: listing.categoryName,
        image: listing.images && listing.images[0] ? listing.images[0] : "",
        quantity: qty,
        unit: listing.unit || "Tons",
        unitPrice: listing.price,
        seller: listing.seller,
        location: listing.location,
        distanceKm: listing.distanceKm || 25
      });
    }

    this.saveState();
  }

  updateCartQty(listingId, newQty) {
    if (!this.state.cart) return;
    const item = this.state.cart.find(i => i.listingId === listingId);
    if (item) {
      if (newQty <= 0) {
        this.removeFromCart(listingId);
      } else {
        item.quantity = parseFloat(newQty);
        this.saveState();
      }
    }
  }

  removeFromCart(listingId) {
    if (!this.state.cart) return;
    this.state.cart = this.state.cart.filter(i => i.listingId !== listingId);
    this.saveState();
  }

  clearCart() {
    this.state.cart = [];
    this.saveState();
  }

  getCartCalculations() {
    const items = this.state.cart || [];
    let subtotal = 0;
    let totalTons = 0;
    let maxDistance = 15;

    items.forEach(item => {
      subtotal += item.quantity * item.unitPrice;
      totalTons += item.quantity;
      if (item.distanceKm > maxDistance) maxDistance = item.distanceKm;
    });

    // Dynamic Freight Logistics calculation: ₹500 base + ₹35/km + ₹120/ton
    const transportationFee = items.length > 0 ? Math.round(500 + maxDistance * 35 + totalTons * 120) : 0;
    const platformFee = Math.round(subtotal * 0.02); // 2% platform fee
    const taxGst = Math.round(subtotal * 0.05); // 5% GST on bio-waste transport
    const totalAmount = subtotal + transportationFee + platformFee + taxGst;

    return {
      items,
      subtotal,
      totalTons,
      transportationFee,
      platformFee,
      taxGst,
      totalAmount
    };
  }

  // ==========================================
  // ORDERS & PAYMENTS
  // ==========================================
  getOrders(filters = {}) {
    let result = [...this.state.orders];
    const currentUser = this.getCurrentUser();

    if (this.state.currentRole === "farmer") {
      result = result.filter(o => o.seller.id === currentUser.id);
    } else if (this.state.currentRole === "buyer") {
      result = result.filter(o => o.buyer.id === currentUser.id);
    }
    // Admin sees all orders

    if (filters.status && filters.status !== "all") {
      result = result.filter(o => o.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.listingTitle.toLowerCase().includes(q) ||
          o.seller.name.toLowerCase().includes(q) ||
          o.buyer.name.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return deepClone(result);
  }

  getOrderById(id) {
    const o = this.state.orders.find(item => item.id === id);
    return o ? deepClone(o) : null;
  }

  createOrder(orderData) {
    const currentUser = this.getCurrentUser();
    const orderId = generateId("AGW");
    const now = new Date();

    const newOrder = {
      id: orderId,
      listingId: orderData.listingId || "LST-1001",
      listingTitle: orderData.listingTitle || "Agricultural Waste",
      category: orderData.category || "paddy-straw",
      quantity: orderData.quantity || 5.0,
      unit: orderData.unit || "Tons",
      unitPrice: orderData.unitPrice || 4000,
      subtotal: orderData.subtotal || 20000,
      transportationFee: orderData.transportationFee || 2500,
      platformFee: orderData.platformFee || 400,
      taxGst: orderData.taxGst || 1000,
      totalAmount: orderData.totalAmount || 23900,
      status: "Payment Confirmed",
      statusStep: 2,
      paymentStatus: "Paid (Secured in Escrow)",
      paymentMethod: orderData.paymentMethod || "UPI",
      transactionId: `TXN-${orderId}-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: now.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      pickupDate: new Date(now.getTime() + 86400000 * 2).toLocaleDateString("en-IN", { dateStyle: "medium" }),
      estimatedDelivery: new Date(now.getTime() + 86400000 * 3).toLocaleDateString("en-IN", { dateStyle: "medium" }),
      seller: orderData.seller || {
        id: "usr-farmer-1",
        name: "Ramesh Patel",
        farmName: "GreenFarm Agro",
        phone: "+91 98765 43210",
        pickupAddress: "Farm Gate, Pollachi, Tamil Nadu"
      },
      buyer: {
        id: currentUser.id,
        name: currentUser.name,
        company: currentUser.companyName || currentUser.farmName || currentUser.name,
        phone: currentUser.phone || "+91 98450 67890",
        deliveryAddress: orderData.deliveryAddress || currentUser.location || "Industrial Hub, Bengaluru"
      },
      logistics: {
        carrier: "Kisan FastFreight Logistics",
        driverName: "Surinder Kumar",
        driverPhone: "+91 98412 77889",
        vehicleNumber: `TN-${Math.floor(10 + Math.random() * 80)}-AG-${Math.floor(1000 + Math.random() * 9000)}`,
        currentLocation: "Order confirmed, preparing dispatch route",
        lat: 11.0168,
        lng: 76.9558
      },
      timeline: [
        { step: "Order Placed", time: "Just now", completed: true },
        { step: "Payment Confirmed", time: "Just now", completed: true, active: true },
        { step: "Seller Accepted", time: "Pending seller action", completed: false },
        { step: "Pickup Scheduled", time: "Est. 2 days", completed: false },
        { step: "Waste Collected", time: "Pending", completed: false },
        { step: "In Transit", time: "Pending", completed: false },
        { step: "Delivered", time: "Est. 3 days", completed: false },
        { step: "Completed", time: "Pending delivery confirmation", completed: false }
      ]
    };

    this.state.orders.unshift(newOrder);

    // Update sustainability metrics
    this.state.sustainability.totalWasteReusedTons += Math.round(newOrder.quantity);
    this.state.sustainability.co2EmissionsAvoidedTons += Math.round(newOrder.quantity * 0.7);

    // Notify seller
    this.addNotification({
      type: "order",
      title: "New Order Received!",
      message: `${currentUser.name} placed Order #${newOrder.id} for ${newOrder.quantity} ${newOrder.unit} (₹${newOrder.totalAmount.toLocaleString("en-IN")}).`,
      icon: "shopping-bag",
      link: `#orders/${newOrder.id}`
    });

    this.clearCart();
    this.saveState();
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus, trackingNotes = "") {
    const order = this.state.orders.find(o => o.id === orderId);
    if (!order) return null;

    const stages = [
      "Order Placed",
      "Payment Confirmed",
      "Seller Accepted",
      "Pickup Scheduled",
      "Waste Collected",
      "In Transit",
      "Delivered",
      "Completed",
      "Cancelled"
    ];

    order.status = newStatus;
    const stageIdx = stages.indexOf(newStatus) + 1;
    order.statusStep = stageIdx;

    if (trackingNotes && order.logistics) {
      order.logistics.currentLocation = trackingNotes;
    }

    // Update timeline
    order.timeline = order.timeline.map((item, idx) => {
      if (idx + 1 < stageIdx) {
        return { ...item, completed: true, active: false };
      } else if (idx + 1 === stageIdx) {
        return { ...item, completed: true, active: true, time: "Updated just now" };
      } else {
        return { ...item, completed: false, active: false };
      }
    });

    if (newStatus === "Completed") {
      order.paymentStatus = "Settled to Seller Escrow";
    }

    this.addNotification({
      type: "transit",
      title: `Order #${order.id} Updated`,
      message: `Status changed to: ${newStatus}. ${trackingNotes}`,
      icon: newStatus === "Completed" ? "check-circle" : "truck",
      link: `#orders/${order.id}`
    });

    this.saveState();
    return deepClone(order);
  }

  // ==========================================
  // REVIEWS
  // ==========================================
  getReviews() {
    return deepClone(this.state.reviews || []);
  }

  getReviewsBySellerId(sellerId) {
    return deepClone((this.state.reviews || []).filter(r => r.sellerId === sellerId));
  }

  addReview(reviewData) {
    const currentUser = this.getCurrentUser();
    const newRev = {
      id: generateId("REV"),
      orderId: reviewData.orderId || "AGW-GENERAL",
      sellerId: reviewData.sellerId,
      sellerName: reviewData.sellerName || "Verified Farmer",
      buyerId: currentUser.id,
      buyerName: `${currentUser.name} (${currentUser.companyName || "Buyer"})`,
      overallRating: parseFloat(reviewData.overallRating) || 5,
      qualityRating: parseFloat(reviewData.qualityRating) || 5,
      communicationRating: parseFloat(reviewData.communicationRating) || 5,
      deliveryRating: parseFloat(reviewData.deliveryRating) || 5,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      comment: reviewData.comment || "Great experience working with this seller.",
      wasteType: reviewData.wasteType || "Agri Biomass",
      helpfulCount: 0
    };

    if (!this.state.reviews) this.state.reviews = [];
    this.state.reviews.unshift(newRev);

    // Update seller rating
    const seller = this.state.users.find(u => u.id === reviewData.sellerId);
    if (seller) {
      seller.reviewsCount = (seller.reviewsCount || 0) + 1;
      seller.rating = 4.9;
    }

    this.saveState();
    return newRev;
  }

  // ==========================================
  // COMPLAINTS & DISPUTES
  // ==========================================
  getComplaints() {
    return deepClone(this.state.complaints || []);
  }

  createComplaint(complaintData) {
    const currentUser = this.getCurrentUser();
    const newComplaint = {
      id: generateId("CMP"),
      orderId: complaintData.orderId,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      targetUserId: complaintData.targetUserId || "usr-farmer-1",
      targetUserName: complaintData.targetUserName || "Seller",
      complaintType: complaintData.complaintType || "Quality Issue",
      description: complaintData.description,
      attachment: complaintData.attachment || "evidence_document.pdf",
      status: "Open",
      adminResponse: "Ticket received. Admin dispute arbitration team is reviewing the matter.",
      createdAt: new Date().toISOString().split("T")[0],
      resolvedDate: null
    };

    if (!this.state.complaints) this.state.complaints = [];
    this.state.complaints.unshift(newComplaint);

    this.addNotification({
      type: "complaint",
      title: `Dispute Ticket #${newComplaint.id} Opened`,
      message: `Your complaint for Order #${newComplaint.orderId} is being arbitrated.`,
      icon: "shield-alert",
      link: "#admin-complaints"
    });

    this.saveState();
    return newComplaint;
  }

  resolveComplaint(complaintId, adminResponse, newStatus = "Resolved") {
    const complaint = this.state.complaints.find(c => c.id === complaintId);
    if (complaint) {
      complaint.status = newStatus;
      complaint.adminResponse = adminResponse;
      complaint.resolvedDate = new Date().toISOString().split("T")[0];
      this.saveState();
    }
  }

  // ==========================================
  // CHAT / MESSAGING
  // ==========================================
  getConversations() {
    return deepClone(this.state.conversations || []);
  }

  sendMessage(convId, text, isSender = true) {
    let conv = this.state.conversations.find(c => c.id === convId);
    const currentUser = this.getCurrentUser();

    if (!conv) {
      conv = {
        id: convId || generateId("conv"),
        otherUserId: "usr-buyer-1",
        otherUserName: "Industrial Buyer",
        otherUserRole: "Buyer",
        otherUserAvatar: "IB",
        listingId: "LST-1001",
        listingTitle: "Agri Biomass Inquiry",
        lastMessage: text,
        lastTimestamp: "Just now",
        unreadCount: 0,
        online: true,
        messages: []
      };
      this.state.conversations.unshift(conv);
    }

    const newMsg = {
      id: generateId("msg"),
      senderId: isSender ? currentUser.id : conv.otherUserId,
      senderName: isSender ? currentUser.name : conv.otherUserName,
      text: text,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      isSender: isSender
    };

    conv.messages.push(newMsg);
    conv.lastMessage = text;
    conv.lastTimestamp = "Just now";

    this.saveState();
    return newMsg;
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  getNotifications() {
    return deepClone(this.state.notifications || []);
  }

  addNotification(notifData) {
    if (!this.state.notifications) this.state.notifications = [];
    const notif = {
      id: generateId("notif"),
      type: notifData.type || "system",
      title: notifData.title,
      message: notifData.message,
      time: "Just now",
      unread: true,
      icon: notifData.icon || "bell",
      link: notifData.link || "#"
    };
    this.state.notifications.unshift(notif);
    this.saveState();
  }

  markNotificationRead(id) {
    const notif = this.state.notifications.find(n => n.id === id);
    if (notif) {
      notif.unread = false;
      this.saveState();
    }
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach(n => (n.unread = false));
    this.saveState();
  }

  // ==========================================
  // USERS & MODERATION
  // ==========================================
  getUsers(role = null) {
    let users = [...this.state.users];
    if (role && role !== "all") {
      users = users.filter(u => u.role === role);
    }
    return deepClone(users);
  }

  getUserById(id) {
    const u = this.state.users.find(user => user.id === id);
    return u ? deepClone(u) : null;
  }

  verifyUser(id, field = "identity") {
    const user = this.state.users.find(u => u.id === id);
    if (user && user.verified) {
      user.verified[field] = true;
      this.saveState();
    }
  }

  suspendUser(id) {
    const user = this.state.users.find(u => u.id === id);
    if (user) {
      user.isSuspended = !user.isSuspended;
      this.saveState();
    }
  }

  // ==========================================
  // CATEGORIES
  // ==========================================
  getCategories() {
    return deepClone(this.state.categories || []);
  }

  addCategory(categoryData) {
    const newCat = {
      id: categoryData.id || generateId("cat").toLowerCase(),
      name: categoryData.name,
      group: categoryData.group || "Crop Residues",
      count: "0 Tons",
      listingsCount: 0,
      icon: categoryData.icon || "sprout",
      description: categoryData.description || "",
      image: categoryData.image || "/images/waste/paddy-straw.jpg",
      applications: categoryData.applications || [],
      storageGuidelines: categoryData.storageGuidelines || "Store in dry well-ventilated sheds.",
      transportGuidelines: categoryData.transportGuidelines || "Standard bale transport."
    };
    this.state.categories.push(newCat);
    this.saveState();
    return newCat;
  }

  deleteCategory(id) {
    this.state.categories = this.state.categories.filter(c => c.id !== id);
    this.saveState();
  }

  // ==========================================
  // SUSTAINABILITY
  // ==========================================
  getSustainabilityMetrics() {
    return deepClone(this.state.sustainability);
  }

  // ==========================================
  // RESET TO DEFAULT SEED DATA
  // ==========================================
  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    this.notify();
  }
}

export const store = new Store();
