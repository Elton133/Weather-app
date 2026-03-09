/** Map ISO 3166-1 alpha-2 country codes to display names */
const COUNTRY_NAMES = {
  AU: "Australia", US: "United States", GB: "United Kingdom", UK: "United Kingdom",
  CN: "China", IL: "Israel", IN: "India", JP: "Japan", DE: "Germany", FR: "France",
  CA: "Canada", BR: "Brazil", RU: "Russia", KR: "South Korea", ES: "Spain",
  IT: "Italy", MX: "Mexico", ID: "Indonesia", NL: "Netherlands", SA: "Saudi Arabia",
  ZA: "South Africa", TR: "Turkey", PL: "Poland", AR: "Argentina", EG: "Egypt",
};

export function getCountryName(code) {
  if (!code) return "";
  return COUNTRY_NAMES[code.toUpperCase()] || code;
}

/** Wind direction from degrees (0 = N, 90 = E, etc.) */
const DIRS = ["N", "N-E", "E", "S-E", "S", "S-W", "W", "N-W"];
export function windDegToDirection(deg) {
  if (deg == null) return "";
  const i = Math.round(((deg % 360) / 45)) % 8;
  return DIRS[i];
}
