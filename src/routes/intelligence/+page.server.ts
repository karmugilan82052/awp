/**
 * SvelteKit Server Load function for Waste Intelligence Page
 */

import {
  calculateQualityScore,
  calculateSuitabilityScore,
  determineRecommendedApplications,
  estimateWasteValue,
  calculateEnvironmentalImpact,
  findAggregatedSupply
} from "../../lib/server/wasteIntelligence.ts";
import { findTopMatchesForListing } from "../../lib/server/buyerMatching.ts";

export async function load({ fetch }: any) {
  try {
    // In SvelteKit environment, fetch listings and buyers from store/API
    const resListings = await fetch("/api/waste");
    const listingsData = await resListings.json();
    const listings = listingsData.data || [];

    const enrichedListings = listings.map((l: any) => {
      const quality = calculateQualityScore(l);
      const suitability = calculateSuitabilityScore(l);
      const recommendations = determineRecommendedApplications(l);
      const valueOpt = estimateWasteValue(l);
      const envImpact = calculateEnvironmentalImpact(l.quantity || 1, l.category);

      return {
        ...l,
        quality,
        suitability,
        recommendations,
        valueOpt,
        envImpact
      };
    });

    return {
      success: true,
      listings: enrichedListings
    };
  } catch (err) {
    return {
      success: false,
      listings: [],
      error: String(err)
    };
  }
}
