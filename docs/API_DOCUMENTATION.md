# REST API Documentation — Smart Agri Waste Marketplace

Base URL: `http://localhost:5000/api`

All authenticated endpoints require an HTTP header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication APIs

### Register New User
- **Method:** `POST`
- **Path:** `/api/auth/register`
- **Body:**
```json
{
  "name": "Gurpreet Singh",
  "email": "gurpreet@amritfarms.in",
  "password": "Password@123",
  "role": "FARMER",
  "phone": "+91 98120 55443",
  "farmName": "Amrit Dairy & Organic Farms",
  "location": "Karnal, Haryana"
}
```
- **Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOi...",
  "user": { "id": "usr-farmer-...", "name": "Gurpreet Singh", "role": "farmer" }
}
```

### User Login / 1-Click Demo Switch
- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Body:**
```json
{
  "email": "ramesh@greenfarmagro.in",
  "role": "farmer"
}
```

---

## 2. Waste Listings APIs

### List All Waste Listings
- **Method:** `GET`
- **Path:** `/api/waste`
- **Query Parameters:**
  - `category`: Filter by category ID (e.g. `paddy-straw`)
  - `state`: Filter by Indian State (e.g. `Punjab`)
  - `search`: Keyword text query
  - `maxPrice`: Numeric maximum price ceiling
  - `minQty`: Minimum available tons
- **Response (200):**
```json
{
  "success": true,
  "count": 51,
  "data": [
    {
      "id": "LST-1001",
      "title": "Premium Dry Paddy Straw Bales",
      "category": "paddy-straw",
      "price": 4200,
      "quantity": 12.5,
      "unit": "Tons",
      "location": "Pollachi, Tamil Nadu",
      "status": "Approved"
    }
  ]
}
```

### Get Listing Details by ID
- **Method:** `GET`
- **Path:** `/api/waste/:id`

### Create Waste Listing
- **Method:** `POST`
- **Path:** `/api/waste`
- **Headers:** `Authorization: Bearer <TOKEN>` (FARMER / ADMIN)

---

## 3. Orders & Escrow Fulfillment

### List Orders
- **Method:** `GET`
- **Path:** `/api/orders`
- **Headers:** `Authorization: Bearer <TOKEN>`

### Create New Escrow Order
- **Method:** `POST`
- **Path:** `/api/orders`
- **Body:**
```json
{
  "listingId": "LST-1001",
  "listingTitle": "Premium Dry Paddy Straw Bales",
  "quantity": 5.0,
  "unitPrice": 4200,
  "subtotal": 21000,
  "transportationFee": 2400,
  "platformFee": 420,
  "taxGst": 1050,
  "totalAmount": 24870,
  "paymentMethod": "UPI"
}
```

### Update Order Status
- **Method:** `PUT`
- **Path:** `/api/orders/:id/status`
- **Body:**
```json
{
  "status": "In Transit",
  "notes": "Driver checked in at toll plaza"
}
```

---

## 4. AI Classifier & Recommendations

### AI Image Waste Classification
- **Method:** `POST`
- **Path:** `/api/ai/classify`
- **Body:**
```json
{
  "imageUrl": "https://example.com/uploaded_crop_straw.jpg"
}
```
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "categoryId": "paddy-straw",
    "categoryName": "Paddy / Rice Straw",
    "confidence": "97.4%",
    "recommendedTitle": "Verified High-Yield Paddy / Rice Straw",
    "suggestedPriceRange": "₹3,800 - ₹4,800 / Ton",
    "moistureEstimate": "10% - 14%",
    "topApplications": ["Biomass Briquettes", "Cattle Fodder", "Mushroom Bedding"]
  }
}
```

### Get Smart Recommended Buyers for Listing
- **Method:** `GET`
- **Path:** `/api/recommendations/:wasteId`
