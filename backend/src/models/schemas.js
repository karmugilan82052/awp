/**
 * MongoDB / Relational Schema Definitions for Smart Agri Waste Marketplace & Intelligence System
 */

export const UserSchema = {
  id: "String (Primary Key)",
  name: "String (Required)",
  email: "String (Unique, Required)",
  passwordHash: "String (Required)",
  role: "Enum: ['FARMER', 'BUYER', 'ADMIN']",
  phone: "String",
  farmName: "String",
  companyName: "String",
  gstin: "String",
  location: "String",
  state: "String",
  district: "String",
  pincode: "String",
  lat: "Number",
  lng: "Number",
  verified: {
    phone: "Boolean",
    email: "Boolean",
    identity: "Boolean",
    gst: "Boolean"
  },
  rating: "Number",
  reviewsCount: "Number",
  totalEarnings: "Number",
  totalPurchases: "Number",
  isSuspended: "Boolean",
  createdAt: "Date"
};

export const WasteListingSchema = {
  id: "String (Primary Key)",
  title: "String (Required)",
  category: "String (Ref: waste_categories)",
  crop: "String",
  description: "String",
  quantity: "Number (Required)",
  unit: "String (Tons, Quintals)",
  price: "Number (Required)",
  priceUnit: "String",
  minOrderQty: "Number",
  availableQty: "Number",

  // Extended Advanced Intelligence Fields
  moisture: "String",
  moisture_level: "String",
  qualityGrade: "String",
  quality_grade: "String",
  harvest_age: "String / Number",
  contamination_level: "String (Low, Medium, High)",
  storage_condition: "String (Covered Shed, Silo, Baled, Open Air)",
  processing_level: "String (Raw, Chopped, Baled, Pelletized)",
  intended_use: "String",

  packaging: "String",
  storageType: "String",
  loadingAssistance: "String",
  harvestDate: "Date",
  expiryDate: "Date",
  images: ["String (URLs)"],
  sellerId: "String (Ref: users)",
  location: "String",
  district: "String",
  state: "String",
  pincode: "String",
  lat: "Number",
  lng: "Number",
  status: "Enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected', 'Sold', 'Expired']",
  isApproved: "Boolean",
  views: "Number",
  createdAt: "Date"
};

export const WasteRecommendationSchema = {
  id: "String (Primary Key)",
  waste_id: "String (Ref: waste_listings)",
  application_name: "String",
  suitability_score: "Number (0-100)",
  reason: "String",
  estimated_value: "Number",
  created_at: "Date"
};

export const BuyerMatchSchema = {
  id: "String (Primary Key)",
  waste_id: "String (Ref: waste_listings)",
  buyer_id: "String (Ref: users)",
  match_score: "Number (0-100)",
  waste_compatibility: "Number",
  quantity_score: "Number",
  quality_score: "Number",
  distance_score: "Number",
  price_score: "Number",
  created_at: "Date"
};

export const AggregatedSupplySchema = {
  id: "String (Primary Key)",
  wasteCategory: "String",
  participatingListingIds: ["String"],
  totalQuantity: "Number",
  averageQualityScore: "Number",
  approximateLocation: "String",
  buyerId: "String",
  aggregationScore: "Number",
  createdAt: "Date"
};

export const EnvironmentalImpactSchema = {
  id: "String (Primary Key)",
  waste_id: "String (Ref: waste_listings)",
  wasteDivertedKg: "Number",
  co2AvoidedKg: "Number",
  methanePreventedKg: "Number",
  pm25PreventedKg: "Number",
  treesEquivalent: "Number",
  created_at: "Date"
};

export const OrderSchema = {
  id: "String (Primary Key)",
  listingId: "String (Ref: waste_listings)",
  listingTitle: "String",
  category: "String",
  quantity: "Number",
  unit: "String",
  unitPrice: "Number",
  subtotal: "Number",
  transportationFee: "Number",
  platformFee: "Number",
  taxGst: "Number",
  totalAmount: "Number",
  sellerId: "String (Ref: users)",
  buyerId: "String (Ref: users)",
  deliveryAddress: "String",
  pickupAddress: "String",
  status: "Enum: ['Order Placed', 'Payment Confirmed', 'Seller Accepted', 'Pickup Scheduled', 'Waste Collected', 'In Transit', 'Delivered', 'Completed', 'Cancelled']",
  paymentStatus: "Enum: ['Pending', 'Processing', 'Paid', 'Refunded', 'Settled']",
  paymentMethod: "Enum: ['UPI', 'Card', 'Net Banking', 'Wallet', 'Cash on Delivery']",
  transactionId: "String",
  logistics: {
    carrier: "String",
    driverName: "String",
    driverPhone: "String",
    vehicleNumber: "String",
    currentLocation: "String"
  },
  createdAt: "Date"
};

export const ReviewSchema = {
  id: "String (Primary Key)",
  orderId: "String (Ref: orders)",
  sellerId: "String (Ref: users)",
  buyerId: "String (Ref: users)",
  overallRating: "Number (1-5)",
  qualityRating: "Number (1-5)",
  communicationRating: "Number (1-5)",
  deliveryRating: "Number (1-5)",
  comment: "String",
  wasteType: "String",
  createdAt: "Date"
};

export const ComplaintSchema = {
  id: "String (Primary Key)",
  orderId: "String (Ref: orders)",
  userId: "String (Ref: users)",
  targetUserId: "String (Ref: users)",
  complaintType: "String",
  description: "String",
  attachment: "String",
  status: "Enum: ['Open', 'Under Review', 'Resolved', 'Closed']",
  adminResponse: "String",
  createdAt: "Date",
  resolvedDate: "Date"
};
