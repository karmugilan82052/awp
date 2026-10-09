/**
 * Buyer-Waste Matching Engine Module
 * Compares waste listings with registered buyer profiles and requirements
 * to compute normalized Buyer Match Scores and generate match table entries.
 */

import {
  calculateBuyerMatchScore as computeMatchScore,
  type BuyerMatchResult
} from "./wasteIntelligence.ts";

export { calculateBuyerMatchScore } from "./wasteIntelligence.ts";

/**
 * Finds top matching buyer profiles for a specific waste listing
 */
export function findTopMatchesForListing(
  listing: any,
  buyerProfiles: any[],
  limit: number = 5
): BuyerMatchResult[] {
  if (!listing || !buyerProfiles || buyerProfiles.length === 0) return [];

  const matches: BuyerMatchResult[] = buyerProfiles.map(buyer => {
    // Map buyer profile to buyer requirement structure if needed
    const buyerReq = {
      id: buyer.id,
      name: buyer.name,
      companyName: buyer.companyName || buyer.farmName || buyer.name,
      preferredCategory: buyer.preferredCategory || buyer.category || listing.category,
      preferredCrop: buyer.preferredCrop || buyer.crop,
      requiredQty: buyer.requiredQty || buyer.minQuantity || 10,
      maxPrice: buyer.maxPrice || listing.price * 1.2,
      distanceKm: buyer.distanceKm || listing.distanceKm || 30
    };

    return computeMatchScore(listing, buyerReq);
  });

  matches.sort((a, b) => b.match_score - a.match_score);
  return matches.slice(0, limit);
}

/**
 * Finds top matching waste listings for a specific buyer
 */
export function findTopListingsForBuyer(
  buyerProfile: any,
  allListings: any[],
  limit: number = 10
): BuyerMatchResult[] {
  if (!buyerProfile || !allListings || allListings.length === 0) return [];

  const buyerReq = {
    id: buyerProfile.id,
    name: buyerProfile.name,
    companyName: buyerProfile.companyName || buyerProfile.farmName || buyerProfile.name,
    preferredCategory: buyerProfile.preferredCategory || buyerProfile.category,
    preferredCrop: buyerProfile.preferredCrop,
    requiredQty: buyerProfile.requiredQty || buyerProfile.minQuantity || 10,
    maxPrice: buyerProfile.maxPrice || 3500,
    distanceKm: buyerProfile.distanceKm || 30
  };

  const matches: BuyerMatchResult[] = allListings.map(listing => computeMatchScore(listing, buyerReq));

  matches.sort((a, b) => b.match_score - a.match_score);
  return matches.slice(0, limit);
}
