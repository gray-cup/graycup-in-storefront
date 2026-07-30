// Auto-generated from india_economy.xlsx (GSDP by state, GDP/population by city).
// Regenerate via the one-off script if the source data changes; do not hand-edit rankings.

export type EconomicTier = "high" | "low"; // default product sort direction for this state/city

export type IndiaState = {
  state: string;
  stateSlug: string;
  gsdpRank?: number;
  tier: EconomicTier;
};

export type IndiaCity = {
  city: string;
  citySlug: string;
  stateSlug: string;
  cityGdpRank?: number;
  tier: EconomicTier;
};

export const INDIA_STATES: IndiaState[] = [
  { state: "Maharashtra", stateSlug: "maharashtra", gsdpRank: 1, tier: "high" },
  { state: "Tamil Nadu", stateSlug: "tamil-nadu", gsdpRank: 2, tier: "high" },
  { state: "Uttar Pradesh", stateSlug: "uttar-pradesh", gsdpRank: 3, tier: "high" },
  { state: "Karnataka", stateSlug: "karnataka", gsdpRank: 4, tier: "high" },
  { state: "Gujarat", stateSlug: "gujarat", gsdpRank: 5, tier: "high" },
  { state: "West Bengal", stateSlug: "west-bengal", gsdpRank: 6, tier: "high" },
  { state: "Rajasthan", stateSlug: "rajasthan", gsdpRank: 7, tier: "high" },
  { state: "Telangana", stateSlug: "telangana", gsdpRank: 8, tier: "high" },
  { state: "Andhra Pradesh", stateSlug: "andhra-pradesh", gsdpRank: 9, tier: "high" },
  { state: "Madhya Pradesh", stateSlug: "madhya-pradesh", gsdpRank: 10, tier: "high" },
  { state: "Kerala", stateSlug: "kerala", gsdpRank: 11, tier: "high" },
  { state: "Delhi", stateSlug: "delhi", gsdpRank: 12, tier: "high" },
  { state: "Haryana", stateSlug: "haryana", gsdpRank: 13, tier: "high" },
  { state: "Bihar", stateSlug: "bihar", gsdpRank: 14, tier: "high" },
  { state: "Odisha", stateSlug: "odisha", gsdpRank: 15, tier: "high" },
  { state: "Punjab", stateSlug: "punjab", gsdpRank: 16, tier: "low" },
  { state: "Assam", stateSlug: "assam", gsdpRank: 17, tier: "low" },
  { state: "Chhattisgarh", stateSlug: "chhattisgarh", gsdpRank: 18, tier: "low" },
  { state: "Jharkhand", stateSlug: "jharkhand", gsdpRank: 19, tier: "low" },
  { state: "Uttarakhand", stateSlug: "uttarakhand", gsdpRank: 20, tier: "low" },
  { state: "Jammu and Kashmir", stateSlug: "jammu-and-kashmir", gsdpRank: 21, tier: "low" },
  { state: "Himachal Pradesh", stateSlug: "himachal-pradesh", gsdpRank: 22, tier: "low" },
  { state: "Goa", stateSlug: "goa", gsdpRank: 23, tier: "low" },
  { state: "Tripura", stateSlug: "tripura", gsdpRank: 24, tier: "low" },
  { state: "Chandigarh", stateSlug: "chandigarh", gsdpRank: 25, tier: "low" },
  { state: "Meghalaya", stateSlug: "meghalaya", gsdpRank: 26, tier: "low" },
  { state: "Sikkim", stateSlug: "sikkim", gsdpRank: 27, tier: "low" },
  { state: "Puducherry", stateSlug: "puducherry", gsdpRank: 28, tier: "low" },
  { state: "Nagaland", stateSlug: "nagaland", gsdpRank: undefined, tier: "low" },
  { state: "Arunachal Pradesh", stateSlug: "arunachal-pradesh", gsdpRank: undefined, tier: "low" },
  { state: "Manipur", stateSlug: "manipur", gsdpRank: undefined, tier: "low" },
  { state: "Mizoram", stateSlug: "mizoram", gsdpRank: undefined, tier: "low" },
];

export const INDIA_CITIES: IndiaCity[] = [
  { city: "Visakhapatnam", citySlug: "visakhapatnam", stateSlug: "andhra-pradesh", cityGdpRank: 11, tier: "high" },
  { city: "Amaravati-Vijayawada-Guntur", citySlug: "amaravati-vijayawada-guntur", stateSlug: "andhra-pradesh", cityGdpRank: 17, tier: "low" },
  { city: "Guntur", citySlug: "guntur", stateSlug: "andhra-pradesh", cityGdpRank: undefined, tier: "high" },
  { city: "Nellore", citySlug: "nellore", stateSlug: "andhra-pradesh", cityGdpRank: undefined, tier: "high" },
  { city: "Itanagar", citySlug: "itanagar", stateSlug: "arunachal-pradesh", cityGdpRank: undefined, tier: "low" },
  { city: "Guwahati", citySlug: "guwahati", stateSlug: "assam", cityGdpRank: undefined, tier: "low" },
  { city: "Silchar", citySlug: "silchar", stateSlug: "assam", cityGdpRank: undefined, tier: "low" },
  { city: "Patna", citySlug: "patna", stateSlug: "bihar", cityGdpRank: 24, tier: "low" },
  { city: "Gaya", citySlug: "gaya", stateSlug: "bihar", cityGdpRank: undefined, tier: "high" },
  { city: "Bhagalpur", citySlug: "bhagalpur", stateSlug: "bihar", cityGdpRank: undefined, tier: "high" },
  { city: "Muzaffarpur", citySlug: "muzaffarpur", stateSlug: "bihar", cityGdpRank: undefined, tier: "high" },
  { city: "Chandigarh", citySlug: "chandigarh", stateSlug: "chandigarh", cityGdpRank: 22, tier: "low" },
  { city: "Raipur", citySlug: "raipur", stateSlug: "chhattisgarh", cityGdpRank: 32, tier: "low" },
  { city: "Bhilai", citySlug: "bhilai", stateSlug: "chhattisgarh", cityGdpRank: undefined, tier: "low" },
  { city: "Korba", citySlug: "korba", stateSlug: "chhattisgarh", cityGdpRank: undefined, tier: "low" },
  { city: "Bilaspur", citySlug: "bilaspur", stateSlug: "chhattisgarh", cityGdpRank: undefined, tier: "low" },
  { city: "New Delhi", citySlug: "new-delhi", stateSlug: "delhi", cityGdpRank: 1, tier: "high" },
  { city: "South Delhi", citySlug: "south-delhi", stateSlug: "delhi", cityGdpRank: 1, tier: "high" },
  { city: "Gurugram", citySlug: "gurugram", stateSlug: "delhi", cityGdpRank: 1, tier: "high" },
  { city: "Noida", citySlug: "noida", stateSlug: "delhi", cityGdpRank: 1, tier: "high" },
  { city: "Panaji", citySlug: "panaji", stateSlug: "goa", cityGdpRank: undefined, tier: "low" },
  { city: "Ahmedabad", citySlug: "ahmedabad", stateSlug: "gujarat", cityGdpRank: 7, tier: "high" },
  { city: "Surat", citySlug: "surat", stateSlug: "gujarat", cityGdpRank: 9, tier: "high" },
  { city: "Vadodara", citySlug: "vadodara", stateSlug: "gujarat", cityGdpRank: 12, tier: "high" },
  { city: "Rajkot", citySlug: "rajkot", stateSlug: "gujarat", cityGdpRank: 18, tier: "low" },
  { city: "Rohtak", citySlug: "rohtak", stateSlug: "haryana", cityGdpRank: undefined, tier: "high" },
  { city: "Hisar", citySlug: "hisar", stateSlug: "haryana", cityGdpRank: undefined, tier: "high" },
  { city: "Panipat", citySlug: "panipat", stateSlug: "haryana", cityGdpRank: undefined, tier: "high" },
  { city: "Karnal", citySlug: "karnal", stateSlug: "haryana", cityGdpRank: undefined, tier: "high" },
  { city: "Shimla", citySlug: "shimla", stateSlug: "himachal-pradesh", cityGdpRank: undefined, tier: "low" },
  { city: "Srinagar", citySlug: "srinagar", stateSlug: "jammu-and-kashmir", cityGdpRank: undefined, tier: "low" },
  { city: "Jammu", citySlug: "jammu", stateSlug: "jammu-and-kashmir", cityGdpRank: undefined, tier: "low" },
  { city: "Dhanbad", citySlug: "dhanbad", stateSlug: "jharkhand", cityGdpRank: undefined, tier: "low" },
  { city: "Ranchi", citySlug: "ranchi", stateSlug: "jharkhand", cityGdpRank: undefined, tier: "low" },
  { city: "Jamshedpur", citySlug: "jamshedpur", stateSlug: "jharkhand", cityGdpRank: undefined, tier: "low" },
  { city: "Bokaro", citySlug: "bokaro", stateSlug: "jharkhand", cityGdpRank: undefined, tier: "low" },
  { city: "Bengaluru", citySlug: "bengaluru", stateSlug: "karnataka", cityGdpRank: 3, tier: "high" },
  { city: "Mangaluru", citySlug: "mangaluru", stateSlug: "karnataka", cityGdpRank: 35, tier: "low" },
  { city: "Mysuru", citySlug: "mysuru", stateSlug: "karnataka", cityGdpRank: 41, tier: "low" },
  { city: "Hubli-Dharwad", citySlug: "hubli-dharwad", stateSlug: "karnataka", cityGdpRank: 50, tier: "low" },
  { city: "Kochi", citySlug: "kochi", stateSlug: "kerala", cityGdpRank: 15, tier: "high" },
  { city: "Thrissur", citySlug: "thrissur", stateSlug: "kerala", cityGdpRank: 16, tier: "low" },
  { city: "Thiruvananthapuram", citySlug: "thiruvananthapuram", stateSlug: "kerala", cityGdpRank: 21, tier: "low" },
  { city: "Kollam", citySlug: "kollam", stateSlug: "kerala", cityGdpRank: 23, tier: "low" },
  { city: "Indore", citySlug: "indore", stateSlug: "madhya-pradesh", cityGdpRank: 31, tier: "low" },
  { city: "Bhopal", citySlug: "bhopal", stateSlug: "madhya-pradesh", cityGdpRank: 45, tier: "low" },
  { city: "Jabalpur", citySlug: "jabalpur", stateSlug: "madhya-pradesh", cityGdpRank: 47, tier: "low" },
  { city: "Gwalior", citySlug: "gwalior", stateSlug: "madhya-pradesh", cityGdpRank: undefined, tier: "high" },
  { city: "Mumbai", citySlug: "mumbai", stateSlug: "maharashtra", cityGdpRank: 2, tier: "high" },
  { city: "Pune", citySlug: "pune", stateSlug: "maharashtra", cityGdpRank: 8, tier: "high" },
  { city: "Nagpur", citySlug: "nagpur", stateSlug: "maharashtra", cityGdpRank: 13, tier: "high" },
  { city: "Nashik", citySlug: "nashik", stateSlug: "maharashtra", cityGdpRank: 20, tier: "low" },
  { city: "Imphal", citySlug: "imphal", stateSlug: "manipur", cityGdpRank: undefined, tier: "low" },
  { city: "Shillong", citySlug: "shillong", stateSlug: "meghalaya", cityGdpRank: undefined, tier: "low" },
  { city: "Aizawl", citySlug: "aizawl", stateSlug: "mizoram", cityGdpRank: undefined, tier: "low" },
  { city: "Kohima", citySlug: "kohima", stateSlug: "nagaland", cityGdpRank: undefined, tier: "low" },
  { city: "Bhubaneswar", citySlug: "bhubaneswar", stateSlug: "odisha", cityGdpRank: 26, tier: "low" },
  { city: "Cuttack", citySlug: "cuttack", stateSlug: "odisha", cityGdpRank: undefined, tier: "high" },
  { city: "Berhampur", citySlug: "berhampur", stateSlug: "odisha", cityGdpRank: undefined, tier: "high" },
  { city: "Rourkela", citySlug: "rourkela", stateSlug: "odisha", cityGdpRank: undefined, tier: "high" },
  { city: "Ozhukarai", citySlug: "ozhukarai", stateSlug: "puducherry", cityGdpRank: undefined, tier: "low" },
  { city: "Puducherry", citySlug: "puducherry", stateSlug: "puducherry", cityGdpRank: undefined, tier: "low" },
  { city: "Ludhiana", citySlug: "ludhiana", stateSlug: "punjab", cityGdpRank: 39, tier: "low" },
  { city: "Amritsar", citySlug: "amritsar", stateSlug: "punjab", cityGdpRank: undefined, tier: "low" },
  { city: "Jalandhar", citySlug: "jalandhar", stateSlug: "punjab", cityGdpRank: undefined, tier: "low" },
  { city: "Patiala", citySlug: "patiala", stateSlug: "punjab", cityGdpRank: undefined, tier: "low" },
  { city: "Jaipur", citySlug: "jaipur", stateSlug: "rajasthan", cityGdpRank: 14, tier: "high" },
  { city: "Jodhpur", citySlug: "jodhpur", stateSlug: "rajasthan", cityGdpRank: undefined, tier: "high" },
  { city: "Kota", citySlug: "kota", stateSlug: "rajasthan", cityGdpRank: undefined, tier: "high" },
  { city: "Bikaner", citySlug: "bikaner", stateSlug: "rajasthan", cityGdpRank: undefined, tier: "high" },
  { city: "Gangtok", citySlug: "gangtok", stateSlug: "sikkim", cityGdpRank: undefined, tier: "low" },
  { city: "Chennai", citySlug: "chennai", stateSlug: "tamil-nadu", cityGdpRank: 4, tier: "high" },
  { city: "Coimbatore", citySlug: "coimbatore", stateSlug: "tamil-nadu", cityGdpRank: 10, tier: "high" },
  { city: "Salem", citySlug: "salem", stateSlug: "tamil-nadu", cityGdpRank: 19, tier: "low" },
  { city: "Madurai", citySlug: "madurai", stateSlug: "tamil-nadu", cityGdpRank: 27, tier: "low" },
  { city: "Hyderabad", citySlug: "hyderabad", stateSlug: "telangana", cityGdpRank: 5, tier: "high" },
  { city: "Warangal", citySlug: "warangal", stateSlug: "telangana", cityGdpRank: undefined, tier: "high" },
  { city: "Nizamabad", citySlug: "nizamabad", stateSlug: "telangana", cityGdpRank: undefined, tier: "high" },
  { city: "Karimnagar", citySlug: "karimnagar", stateSlug: "telangana", cityGdpRank: undefined, tier: "high" },
  { city: "Agartala", citySlug: "agartala", stateSlug: "tripura", cityGdpRank: undefined, tier: "low" },
  { city: "Lucknow", citySlug: "lucknow", stateSlug: "uttar-pradesh", cityGdpRank: 25, tier: "low" },
  { city: "Agra", citySlug: "agra", stateSlug: "uttar-pradesh", cityGdpRank: 38, tier: "low" },
  { city: "Kanpur", citySlug: "kanpur", stateSlug: "uttar-pradesh", cityGdpRank: 43, tier: "low" },
  { city: "Meerut", citySlug: "meerut", stateSlug: "uttar-pradesh", cityGdpRank: 46, tier: "low" },
  { city: "Dehradun", citySlug: "dehradun", stateSlug: "uttarakhand", cityGdpRank: undefined, tier: "low" },
  { city: "Haridwar", citySlug: "haridwar", stateSlug: "uttarakhand", cityGdpRank: undefined, tier: "low" },
  { city: "Kolkata", citySlug: "kolkata", stateSlug: "west-bengal", cityGdpRank: 6, tier: "high" },
  { city: "Asansol", citySlug: "asansol", stateSlug: "west-bengal", cityGdpRank: 28, tier: "low" },
  { city: "Durgapur", citySlug: "durgapur", stateSlug: "west-bengal", cityGdpRank: undefined, tier: "high" },
  { city: "Siliguri", citySlug: "siliguri", stateSlug: "west-bengal", cityGdpRank: undefined, tier: "high" },
];

export function getStateBySlug(slug: string): IndiaState | undefined {
  return INDIA_STATES.find((s) => s.stateSlug === slug);
}

export function getCitiesByState(stateSlug: string): IndiaCity[] {
  return INDIA_CITIES.filter((c) => c.stateSlug === stateSlug);
}

export function getCity(stateSlug: string, citySlug: string): IndiaCity | undefined {
  return INDIA_CITIES.find((c) => c.stateSlug === stateSlug && c.citySlug === citySlug);
}

