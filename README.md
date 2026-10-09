# 🌾 Smart Agri Waste Marketplace System

[![Platform](https://img.shields.io/badge/Platform-B2B%20Bio--Exchange-16a34a.svg)](https://github.com)
[![Status](https://img.shields.io/badge/Status-Production--Ready-15803d.svg)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A complete, production-grade **Smart Agricultural Waste Marketplace System** that connects **farmers/agricultural waste sellers** with **industrial buyers, recyclers, and processors** (biomass power, compost manufacturers, compressed bio-gas [CBG / SATAT], cattle feed, tree-free paper, and molded eco-packaging).

The platform eliminates agricultural waste burning and open-field dumping by providing a digital marketplace equipped with **AI Waste Classification**, **Multi-Factor Buyer Recommendations**, **GIS Geospatial Farm Mapping**, **Escrow Secured Checkout**, **9-Stage Order Tracking**, **Dispute Arbitration**, and **Sustainability Carbon Analytics**.

---

## 🌟 Key Features

### 🧑‍🌾 1. Farmer / Seller Module
- **AI Auto-Classification:** Upload photos to automatically identify waste category, estimated moisture percentage, and market price benchmarks.
- **Listing Management:** Add, edit, delete, or mark listings out-of-stock with specifications (moisture, quality grade, packaging, MOQ, harvest date).
- **Incoming Orders Desk:** Accept buyer orders with 1-click status updates and live logistics fleet tracking.
- **Escrow Earnings:** Track payouts, weighbridge reconciliation slips, and bank settlements.
- **Direct Chat:** 1-on-1 messaging with industrial buyers with active listing context.

### 🏭 2. Industrial Buyer / Recycler Module
- **Faceted Marketplace:** Filter 50+ listings by crop residue category, Indian state/district, price ceiling, minimum tons, and quality grade.
- **Multi-View Catalog:** Toggle between **Grid Cards**, **List Rows**, and **GIS Leaflet Map** with interactive pins.
- **Procurement Cart & Dynamic Logistics:** Real-time freight calculations based on road distance (km) and biomass tonnage.
- **Multi-Method Escrow Checkout:** Simulated payment via **UPI QR Code**, **Credit/Debit Card**, **Net Banking**, **AgroWallet**, or **Cash on Delivery**.
- **9-Stage Live Order Timeline:** Step-by-step shipment tracking with simulated driver checkpoints.
- **Reviews & Ratings:** 5-star multi-criteria seller evaluations (Quality, Communication, Delivery).

### 🛡️ 3. Administrator Console
- **Executive Platform Health:** Real-time KPIs for farmers, buyers, total volume, escrow value, and commission revenue.
- **Listing Moderation Queue:** Approve or reject farmer submissions with feedback.
- **User KYC Verification:** Verify Aadhaar, GSTIN, and land ownership status.
- **Dispute Arbitration Desk:** Review buyer/seller dispute tickets and issue resolution notes.
- **Category & Waste-to-Product Rules:** Add new agricultural residues and define high-value conversion pathways.
- **Standardized Reports Export:** 1-click CSV/Excel report generation for regulatory and tax compliance.

### 🤖 4. AI & Smart Bio-Economy Services
- **AI Waste Classifier:** Image-based classification determining category, moisture range, and top applications.
- **Smart Buyer Recommendation:** Scoring formula balancing waste compatibility (30%), proximity distance (25%), quantity match (20%), price match (15%), and buyer history (10%).
- **AI Smart Assistant Chatbot:** Natural language advisor answering queries on crop residue monetization, government subsidies, and market prices.
- **Sustainability Hub:** Real-time carbon burning mitigation accounting (Tons CO₂ avoided, trees equivalent saved, and state leaderboards).

---

## 🗂️ Predefined Agricultural Residue Categories

1. **Crop Residues:** Paddy / Rice Straw, Wheat Straw, Sugarcane Bagasse, Cotton Stalks, Groundnut Shells, Coconut Husk & Shells, Banana Pseudo-Stem Fiber, Maize Stalks & Cobs, Areca Nut Sheaths.
2. **Fruit & Vegetable Waste:** Wholesale Market Organic Scrap, Citrus Peels, Vegetable Stems.
3. **Animal & Organic Waste:** Aged Cow Dung Manure, Poultry Droppings, Biogas Slurry.
4. **Other Residues:** Timber Sawdust, Rice Husk & Silica Ash, Coffee Husk.

---

## 🛠️ Technology Stack

- **Frontend:** Modular ES6 / React Architecture, Tailwind & Modern Design System CSS, [Leaflet](https://leafletjs.com/) for GIS mapping, [Chart.js](https://www.chartjs.org/) for data visualization, [Lucide](https://lucide.dev/) icons, [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti).
- **Tooling & Build:** [Vite](https://vitejs.dev/) with hot module replacement.
- **Backend:** Node.js, Express.js REST APIs, JWT Authentication, Role-Based Access Control (RBAC).
- **Database Architecture:** MongoDB & Relational Schemas with comprehensive seed datasets.

---

## 🚀 Quick Start Guide

### 1. Run the Frontend & Interactive Application

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

Open your browser at:
`http://localhost:5173`

---

### 2. Run the Node.js / Express REST API Backend

```bash
# Start the Express REST API backend server
node backend/src/server.js
```

Backend will run on: `http://localhost:5000`

---

### 3. Run the Automated Test Suite

```bash
node backend/tests/api.test.js
```

Output:
```
=========================================
🧪 STARTING AGRIWASTE SYSTEM TEST SUITE
=========================================

✅ PASS: JWT Token Generation
✅ PASS: AI Classifier Execution
✅ PASS: AI Classifier Category Match
✅ PASS: AI Confidence Score Output
✅ PASS: AI Recommended Market Price Calculation
✅ PASS: AI Assistant Query Intent Match (Paddy)
✅ PASS: AI Assistant Query Intent Match (Bagasse)
✅ PASS: Haversine Distance Calculation (40 km)
✅ PASS: Smart Recommendation Engine Count
✅ PASS: Smart Recommendation Ranking Order
✅ PASS: Smart Recommendation Compatibility Score > 70%
✅ PASS: Initial Waste Listings Count (Found 51, Target >= 50)

=========================================
📊 TEST SUMMARY: 12 Passed, 0 Failed
=========================================
```

---

## ⚡ Instant 1-Click Demo Logins

| Role | Profile | Location | Demo Highlights |
| :--- | :--- | :--- | :--- |
| **🧑‍🌾 Farmer** | Ramesh Patel *(GreenFarm Agro)* | Pollachi, Tamil Nadu | Manage 12.5T Paddy Straw listing, approve incoming buyer orders, review earnings. |
| **🏭 Buyer** | Rajesh Sharma *(AgroFeed Ltd)* | Coimbatore, Tamil Nadu | Procurement cart, checkout with UPI QR code, live shipment tracking. |
| **🛡️ Admin** | Vikram Malhotra *(Super Admin)* | New Delhi | Moderate pending listings, arbitrate disputes, export CSV reports. |

*(Switch roles anytime using the top navigation bar dropdown or on the `#login` screen)*

---

## 📚 Documentation Index

- [Project Overview](docs/PROJECT_OVERVIEW.md)
- [Database Schema Reference](docs/DATABASE_SCHEMA.md)
- [REST API Specification](docs/API_DOCUMENTATION.md)
- [Setup & Installation Guide](docs/SETUP_GUIDE.md)
- [User Guide (Farmers & Buyers)](docs/USER_GUIDE.md)
- [Administrator Guide](docs/ADMIN_GUIDE.md)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
