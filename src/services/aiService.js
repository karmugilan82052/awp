/**
 * AI Smart Agricultural Waste Classifier & Assistant Service
 * Provides automated waste identification, price intelligence, and intelligent query responses.
 */

import { INITIAL_CATEGORIES } from "../store/initialData.js";

// Pre-trained agricultural waste knowledge base
const CLASSIFICATION_MODELS = {
  "paddy-straw": {
    confidence: "97.4%",
    name: "Paddy / Rice Straw",
    crop: "Paddy (Rice Residue)",
    moistureRange: "10% - 14%",
    suggestedPriceMin: 3800,
    suggestedPriceMax: 4800,
    unit: "Per Ton",
    qualityGrade: "Grade A (Golden Dry)",
    storage: "Elevated platform under UV tarpaulins. Keep moisture under 14% to prevent microbial fermentation.",
    transport: "Machine-compressed 25kg square/round bales on flatbed trucks.",
    topApplications: ["Biomass Briquettes & Pellets", "Cattle Fodder Silage", "Mushroom Bedding", "Tree-Free Paper Pulp"]
  },
  "wheat-straw": {
    confidence: "96.8%",
    name: "Wheat Straw (Bhusa / Turi)",
    crop: "Wheat Crop Residue",
    moistureRange: "8% - 12%",
    suggestedPriceMin: 4800,
    suggestedPriceMax: 5600,
    unit: "Per Ton",
    qualityGrade: "Grade A Dust-Extracted",
    storage: "Dry enclosed godowns protected from moisture leaks and rodents.",
    transport: "High-density square bales (30kg) or loose high-side tipper.",
    topApplications: ["Dairy Cow Fodder", "Molded Pulp Eco-Packaging", "Cellulosic Bio-Ethanol", "Acoustic Insulation Panels"]
  },
  "sugarcane-bagasse": {
    confidence: "98.2%",
    name: "Sugarcane Bagasse",
    crop: "Sugarcane Mill Byproduct",
    moistureRange: "14% - 20%",
    suggestedPriceMin: 2000,
    suggestedPriceMax: 2600,
    unit: "Per Ton",
    qualityGrade: "Grade A Mill Crushed",
    storage: "Ventilated bunker yard with heat monitoring for large piles.",
    transport: "Bulk tippers with tarpaulin netting.",
    topApplications: ["Industrial Boiler Cogeneration", "Biodegradable Tableware", "Kraft Paper Boxes", "Bio-CNG Production"]
  },
  "coconut-husk-shell": {
    confidence: "98.7%",
    name: "Coconut Shells & Coir Husk",
    crop: "Coconut Palm Byproduct",
    moistureRange: "7% - 11%",
    suggestedPriceMin: 6500,
    suggestedPriceMax: 8500,
    unit: "Per Ton",
    qualityGrade: "Export Quality (Fixed Carbon >72%)",
    storage: "Dry shed floor storage; keep shells clean and unsoiled.",
    transport: "50kg gunny bags or compressed 5kg coir pith blocks on wooden pallets.",
    topApplications: ["Activated Carbon Water Purification", "Coir Hydroponic Grow Substrate", "Erosion Control Geotextiles", "Hookah Charcoal"]
  },
  "groundnut-shell": {
    confidence: "95.5%",
    name: "Groundnut Shells / Husks",
    crop: "Peanut Decortication Residue",
    moistureRange: "8% - 11%",
    suggestedPriceMin: 3200,
    suggestedPriceMax: 3800,
    unit: "Per Ton",
    qualityGrade: "Clean Decorticated",
    storage: "Enclosed grain silos or dry shed floor.",
    transport: "PP bags or bulk container tippers.",
    topApplications: ["White-Coal Briquettes (4200 kcal/kg)", "Furfural Solvents", "Poultry Floor Litter"]
  },
  "cotton-stalk": {
    confidence: "94.2%",
    name: "Cotton Stalks & Waste",
    crop: "Bt Cotton Stems",
    moistureRange: "10% - 15%",
    suggestedPriceMin: 2200,
    suggestedPriceMax: 2700,
    unit: "Per Ton",
    qualityGrade: "Field Bundled Woody Biomass",
    storage: "Dry outdoor stacks with waterproof sheeting.",
    transport: "Chipped or chopped form in tippers.",
    topApplications: ["Industrial Fuel Briquettes", "Particle Boards", "Mushroom Spawn Beds"]
  },
  "banana-waste": {
    confidence: "96.1%",
    name: "Banana Pseudo-Stem Fiber",
    crop: "Grand Naine Banana Harvest Residue",
    moistureRange: "30% - 45%",
    suggestedPriceMin: 3400,
    suggestedPriceMax: 4200,
    unit: "Per Ton",
    qualityGrade: "Fresh Harvest Stem",
    storage: "Process within 48 hours to preserve natural fibers and extract sap.",
    transport: "Open-body trucks directly from farm gate.",
    topApplications: ["Eco-Textile Yarn & Sanitary Pads", "Liquid Organic Sap Fertilizer", "Artisanal Handmade Paper"]
  },
  "animal-manure": {
    confidence: "97.9%",
    name: "Aged Cow Dung & Poultry Manure",
    crop: "Livestock & Dairy Manure",
    moistureRange: "18% - 25%",
    suggestedPriceMin: 1600,
    suggestedPriceMax: 2200,
    unit: "Per Ton",
    qualityGrade: "90-Day Aerobic Composted",
    storage: "Covered aerobic compost pit with drainage channel.",
    transport: "Tipper trucks with bottom leachate sealing.",
    topApplications: ["Compressed Bio-Gas (CBG)", "Enriched Vermicompost", "Cow Dung Pots & Eco-Logs"]
  }
};

/**
 * Simulates Deep Learning Image Classification
 */
export async function classifyAgriWasteImage(imageFileOrUrl) {
  // Simulate network latency for realistic AI inference
  await new Promise(resolve => setTimeout(resolve, 800));

  let matchedCategory = "paddy-straw";
  if (typeof imageFileOrUrl === "string") {
    const lower = imageFileOrUrl.toLowerCase();
    if (lower.includes("bagasse") || lower.includes("sugarcane")) matchedCategory = "sugarcane-bagasse";
    else if (lower.includes("wheat")) matchedCategory = "wheat-straw";
    else if (lower.includes("coconut") || lower.includes("coir")) matchedCategory = "coconut-husk-shell";
    else if (lower.includes("groundnut") || lower.includes("nut")) matchedCategory = "groundnut-shell";
    else if (lower.includes("cotton")) matchedCategory = "cotton-stalk";
    else if (lower.includes("banana")) matchedCategory = "banana-waste";
    else if (lower.includes("manure") || lower.includes("dung") || lower.includes("cow")) matchedCategory = "animal-manure";
  } else {
    // Pick based on random high-confidence match
    const keys = Object.keys(CLASSIFICATION_MODELS);
    matchedCategory = keys[Math.floor(Math.random() * keys.length)];
  }

  const modelData = CLASSIFICATION_MODELS[matchedCategory] || CLASSIFICATION_MODELS["paddy-straw"];
  const catObj = INITIAL_CATEGORIES.find(c => c.id === matchedCategory) || INITIAL_CATEGORIES[0];

  return {
    success: true,
    categoryId: matchedCategory,
    categoryName: catObj.name,
    crop: modelData.crop,
    confidence: modelData.confidence,
    recommendedTitle: `Verified High-Yield ${modelData.name}`,
    suggestedPrice: Math.round((modelData.suggestedPriceMin + modelData.suggestedPriceMax) / 2),
    suggestedPriceRange: `₹${modelData.suggestedPriceMin.toLocaleString("en-IN")} - ₹${modelData.suggestedPriceMax.toLocaleString("en-IN")}`,
    unit: modelData.unit,
    moistureEstimate: modelData.moistureRange,
    qualityGrade: modelData.qualityGrade,
    storageRequirements: modelData.storage,
    transportRequirements: modelData.transport,
    topApplications: modelData.topApplications
  };
}

/**
 * AI Smart Assistant Knowledge Dispatcher
 */
export function getAIAssistantResponse(query) {
  const q = (query || "").toLowerCase().trim();

  if (q.includes("paddy") || q.includes("rice straw") || q.includes("parali")) {
    return {
      text: `🌾 **Paddy Straw Insights:**\n\n- **Market Rate:** ₹4,000 - ₹4,800 per Ton (Baled, Moisture <12%)\n- **Key Applications:** Biomass briquetting, cattle fodder, mushroom beds, and tree-free paper.\n- **Top Buyers:** Biomass power plants (e.g., EcoPellets), dairy cooperatives, and paper mills.\n- **Storage Advice:** Store in covered sheds on elevated wooden pallets to avoid moisture pickup.\n\n💡 *Tip: We have 42 active verified buyers currently seeking paddy straw near Punjab, Haryana, and Tamil Nadu!*`
    };
  }

  if (q.includes("bagasse") || q.includes("sugarcane")) {
    return {
      text: `🌿 **Sugarcane Bagasse Insights:**\n\n- **Market Rate:** ₹2,000 - ₹2,500 per Ton (Mill-crushed dry basis)\n- **Key Applications:** Industrial boiler fuel, molded compostable tableware, kraft paper, and Bio-CNG.\n- **Top Buyers:** Cogeneration power plants, eco-packaging manufacturers (e.g., ChuGreen), and paper mills.\n- **High Value Conversion:** Bagasse thermoformed plates sell at a 4x margin compared to raw combustion!`
    };
  }

  if (q.includes("coconut") || q.includes("coir") || q.includes("shell")) {
    return {
      text: `🥥 **Coconut Residue & Shells:**\n\n- **Market Rate:** ₹6,800 - ₹8,500 per Ton for high-carbon shells; ₹7,000/Ton for 5kg coir pith blocks.\n- **Top Applications:** Activated carbon water/air purification filters, export-grade hydroponics, and geotextiles.\n- **Top Buyers:** Activated carbon exporters in Thoothukudi & Kochi, global nursery suppliers.`
    };
  }

  if (q.includes("compost") || q.includes("dung") || q.includes("manure") || q.includes("fertilizer")) {
    return {
      text: `🌱 **Organic Waste & Manure:**\n\n- **Market Rate:** ₹1,700 - ₹2,400 per Ton for 90-day aged cow dung.\n- **Best suited for:** Compressed Bio-Gas (SATAT initiative), vermicomposting, organic orchard fertilization.\n- **Government Incentive:** Subsidies are available under the GOBARdhan scheme for setting up farm-level CBG digesters.`
    };
  }

  if (q.includes("how to sell") || q.includes("list") || q.includes("earn") || q.includes("price")) {
    return {
      text: `📝 **How to Sell Agricultural Waste on AgriWaste:**\n\n1. Click **'Sell Agri Waste'** in the top navigation.\n2. Upload photos of your crop residue.\n3. Our **AI Auto-Classifier** will instantly determine the category, quality grade, and recommended price.\n4. Set your available tons and pickup location.\n5. Verified industrial buyers will place orders with secured escrow payments!`
    };
  }

  return {
    text: `🤖 **AgriWaste AI Assistant:**\n\nI can assist you with:\n- **Market price benchmarks** for 12+ crop residues (Paddy straw, bagasse, coir, cotton stalks, etc.)\n- **Waste-to-product transformation** opportunities (Bio-CNG, paper, briquettes, cattle feed)\n- **Finding nearest industrial buyers & transport freight estimates**\n- **Safe storage and moisture testing standards**\n\nTry asking: *"Where can I sell paddy straw?"* or *"What can coconut husk be used for?"*`
  };
}
