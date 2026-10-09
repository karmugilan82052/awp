# Project Overview — Smart Agri Waste Marketplace System

## 1. Executive Summary

The **Smart Agri Waste Marketplace System** is a full-featured B2B circular economy platform connecting agricultural waste sellers/farmers with industrial buyers, recyclers, and processors across India. The platform facilitates the aggregation, smart AI classification, quality assurance, logistics matching, escrow payment settlement, and dispute resolution for agricultural residues such as **Paddy Straw, Wheat Straw, Sugarcane Bagasse, Coconut Shells & Coir, Cotton Stalks, Groundnut Shells, Banana Pseudo-Stem Fiber, and Animal Manure**.

---

## 2. Core Objectives

- **Eliminate Stubble Burning:** Provide farmers with a seamless digital marketplace to sell crop residues instead of burning them in open fields.
- **Supply Bioeconomy Feedstock:** Deliver consistent, verified agricultural waste supplies to biomass power stations, compressed bio-gas (CBG / SATAT) refiners, molded pulp tableware manufacturers, and cattle feed processors.
- **Smart AI Categorization & Pricing:** Automated identification of crop waste properties, moisture levels, quality grading, and market price benchmarks from photos.
- **Escrow-Secured Transactions:** Protect farmers and buyers through weighbridge verification milestones and dispute arbitration.
- **Sustainability Impact Tracking:** Measure real-time metric tons of crop burning mitigated, CO₂ emissions prevented, and farmer income created.

---

## 3. Key Actors & User Roles

| Role | Target Users | Key Capabilities |
| :--- | :--- | :--- |
| **Farmer / Producer** | Individual Farmers, Farmer Producer Organizations (FPOs), Cooperative Societies | List agricultural waste, AI auto-classification, set MOQ & pricing, accept orders, track transport pickup, receive bank settlements. |
| **Buyer / Recycler** | Biomass Energy Plants, Paper Mills, Bio-CNG Refiners, Cattle Silage Plants, Composters | Search & filter by distance/moisture, 1-click cart procurement, escrow checkout, real-time GPS fleet tracking, rating & reviews. |
| **System Administrator** | Platform Governance, Arbitrators, Quality Inspectors | Listing moderation (Approve/Reject), User KYC verification, Escrow management, Dispute resolution desk, Report export. |

---

## 4. Architectural Highlights

- **Dual-Engine Architecture:** Vite-powered reactive ES6 frontend with interactive GIS Leaflet mapping, Chart.js visualizations, Canvas-Confetti, and simulated REST APIs for zero-dependency local evaluation.
- **Node.js & Express REST Backend:** Modular controllers, JWT authentication middleware with role-based access control (RBAC), and MongoDB schemas.
- **Multi-Factor Recommendation Algorithm:** Calculates buyer-seller compatibility score based on waste type, proximity distance, quantity, price, and history.
- **Deep AI Integration:** Modular image classification service predicting waste category, moisture range, and top high-value industrial applications.
