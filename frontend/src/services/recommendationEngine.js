/**
 * Smart Buyer Recommendation Engine
 * Calculates multi-criteria compatibility scores between Waste Listings and Industrial Buyers.
 *
 * Scoring Formula:
 * Recommendation Score =
 *   (Waste Compatibility * 0.30) +
 *   (Location Proximity * 0.25) +
 *   (Quantity Match * 0.20) +
 *   (Price Compatibility * 0.15) +
 *   (Buyer Rating & History * 0.10)
 */

import { INITIAL_USERS } from "../store/initialData.js";
import { calculateDistanceKm } from "../utils/helpers.js";

export function getRecommendedBuyersForListing(listing, maxResults = 5) {
  if (!listing) return [];

  const buyers = INITIAL_USERS.filter(u => u.role === "buyer");

  const scoredBuyers = buyers.map(buyer => {
    // 1. Waste Type Compatibility (0 - 100)
    let compatibilityScore = 30;
    if (buyer.requiredWasteTypes && buyer.requiredWasteTypes.includes(listing.category)) {
      compatibilityScore = 100;
    } else if (buyer.industry && buyer.industry.toLowerCase().includes("biomass") && listing.category.includes("straw")) {
      compatibilityScore = 80;
    }

    // 2. Location Proximity Score (0 - 100)
    let distanceKm = 50;
    if (listing.lat && listing.lng && buyer.lat && buyer.lng) {
      distanceKm = calculateDistanceKm(listing.lat, listing.lng, buyer.lat, buyer.lng) || 50;
    } else if (listing.state === buyer.state) {
      distanceKm = 30;
    } else {
      distanceKm = 120;
    }

    // Closer distance gets higher score
    const proximityScore = Math.max(10, Math.min(100, Math.round(100 - (distanceKm / 150) * 80)));

    // 3. Quantity Match Score (0 - 100)
    const buyerCapacity = buyer.monthlyRequirementTons || 100;
    const listingQty = listing.quantity || 10;
    let quantityScore = 85;
    if (listingQty <= buyerCapacity) {
      quantityScore = 95;
    } else {
      quantityScore = Math.max(50, Math.round((buyerCapacity / listingQty) * 100));
    }

    // 4. Price Compatibility Score (0 - 100)
    const priceScore = 90;

    // 5. Buyer History & Rating Score (0 - 100)
    const buyerRating = buyer.rating || 4.5;
    const historyScore = Math.round((buyerRating / 5.0) * 100);

    // Weighted Overall Score
    const totalScore = Math.round(
      compatibilityScore * 0.3 +
        proximityScore * 0.25 +
        quantityScore * 0.2 +
        priceScore * 0.15 +
        historyScore * 0.1
    );

    return {
      ...buyer,
      distanceKm,
      matchScore: totalScore,
      compatibilityTag: totalScore >= 85 ? "High Match" : totalScore >= 70 ? "Good Match" : "Potential Match",
      recommendedUse: buyer.industry || "Bio-Energy Processing",
      requiredTons: buyer.monthlyRequirementTons || 150
    };
  });

  // Sort descending by matchScore
  scoredBuyers.sort((a, b) => b.matchScore - a.matchScore);
  return scoredBuyers.slice(0, maxResults);
}

export function getRecommendedListingsForBuyer(buyer, allListings, maxResults = 6) {
  if (!buyer || !allListings) return [];

  const scored = allListings.map(listing => {
    let match = 40;
    if (buyer.requiredWasteTypes && buyer.requiredWasteTypes.includes(listing.category)) {
      match = 95;
    }

    let dist = 60;
    if (buyer.lat && buyer.lng && listing.lat && listing.lng) {
      dist = calculateDistanceKm(buyer.lat, buyer.lng, listing.lat, listing.lng) || 60;
    }

    const proximity = Math.max(10, Math.min(100, Math.round(100 - (dist / 150) * 80)));
    const totalScore = Math.round(match * 0.6 + proximity * 0.4);

    return {
      ...listing,
      matchScore: totalScore,
      distanceKm: dist
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, maxResults);
}
