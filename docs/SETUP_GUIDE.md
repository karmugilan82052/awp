# Setup & Installation Guide — Smart Agri Waste Marketplace

## 1. Prerequisites

- **Node.js:** v18.0.0 or higher (Tested with Node v24.16.0)
- **NPM:** v9.0.0 or higher
- **Modern Web Browser:** Chrome, Edge, Firefox, or Safari with JavaScript enabled

---

## 2. Quick Start (Frontend & Interactive Application)

Clone or open the workspace root directory in your terminal:

```bash
# 1. Verify dependencies are installed
npm install

# 2. Start the high-speed Vite development server
npm run dev
```

The application will launch immediately at:
`http://localhost:5173`

---

## 3. Running the Node.js / Express REST API Backend

To run the standalone Express backend server:

```bash
# 1. Start the Express backend server
node backend/src/server.js
```

Backend will start on `http://localhost:5000`.

---

## 4. Running Automated Tests

Run the backend and algorithms test suite:

```bash
node backend/tests/api.test.js
```

Expected output:
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

## 5. Building for Production

To create an optimized production build:

```bash
npm run build
```

The compiled assets will be created in `dist/`.
