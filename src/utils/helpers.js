/**
 * General Helper Utilities
 */

/**
 * Calculates distance in Kilometers between two lat/lng points using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Generates a unique ID with custom prefix
 */
export function generateId(prefix = "ID") {
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${timestamp}${randomStr}`;
}

/**
 * Simple debounce function for search inputs
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generates Star Rating HTML string
 */
export function renderStars(rating = 5, size = 16) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  let stars = "";
  for (let i = 0; i < fullStars; i++) {
    stars += `<span style="color:#eab308; font-size:${size}px;">★</span>`;
  }
  if (hasHalf) {
    stars += `<span style="color:#eab308; font-size:${size}px;">★</span>`;
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += `<span style="color:#cbd5e1; font-size:${size}px;">★</span>`;
  }
  return stars;
}

/**
 * Deep clones an object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Validates Email Address
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates Indian Phone Number
 */
export function isValidPhone(phone) {
  const cleaned = phone.replace(/[^\d]/g, "");
  return cleaned.length >= 10;
}
