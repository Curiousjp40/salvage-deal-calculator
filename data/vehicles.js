// Vehicle segments and the make/model catalog used across the calculators.
// baseValue is a rough typical new-vehicle price for the segment, used as
// the starting point before depreciation, trim, and mileage adjustments.

export const SEGMENTS = {
  'economy-car': { label: 'Economy Car', baseValue: 21000 },
  'compact-sedan': { label: 'Compact Sedan', baseValue: 24000 },
  'midsize-sedan': { label: 'Midsize Sedan', baseValue: 29000 },
  'luxury-sedan': { label: 'Luxury Sedan', baseValue: 52000 },
  'sports-car': { label: 'Sports Car', baseValue: 45000 },
  'compact-suv': { label: 'Compact SUV', baseValue: 30000 },
  'midsize-suv': { label: 'Midsize SUV', baseValue: 38000 },
  'fullsize-suv': { label: 'Full-Size SUV', baseValue: 58000 },
  'luxury-suv': { label: 'Luxury SUV', baseValue: 68000 },
  minivan: { label: 'Minivan', baseValue: 36000 },
  'compact-truck': { label: 'Compact Truck', baseValue: 32000 },
  'fullsize-truck': { label: 'Full-Size Truck', baseValue: 48000 },
  'hd-truck': { label: 'Heavy-Duty Truck', baseValue: 62000 },
  ev: { label: 'Electric Vehicle', baseValue: 45000 },
  van: { label: 'Cargo / Passenger Van', baseValue: 42000 },
};

// Small value premium applied to hybrid-variant entries: hybrids cost more
// new and tend to hold value slightly better than their gas counterparts.
export const HYBRID_PREMIUM = 1.08;

export const VEHICLES = [
  // Ford
  { make: 'Ford', model: 'F-150', segment: 'fullsize-truck' },
  { make: 'Ford', model: 'F-250', segment: 'hd-truck' },
  { make: 'Ford', model: 'Ranger', segment: 'compact-truck' },
  { make: 'Ford', model: 'Explorer', segment: 'midsize-suv' },
  { make: 'Ford', model: 'Escape', segment: 'compact-suv' },
  { make: 'Ford', model: 'Escape Hybrid', segment: 'compact-suv', hybridPremium: HYBRID_PREMIUM },
  { make: 'Ford', model: 'Edge', segment: 'midsize-suv' },
  { make: 'Ford', model: 'Expedition', segment: 'fullsize-suv' },
  { make: 'Ford', model: 'Bronco', segment: 'midsize-suv' },
  { make: 'Ford', model: 'Bronco Sport', segment: 'compact-suv' },
  { make: 'Ford', model: 'Mustang', segment: 'sports-car' },
  { make: 'Ford', model: 'Focus', segment: 'compact-sedan' },
  { make: 'Ford', model: 'Fusion', segment: 'midsize-sedan' },
  { make: 'Ford', model: 'Fusion Hybrid', segment: 'midsize-sedan', hybridPremium: HYBRID_PREMIUM },
  { make: 'Ford', model: 'Maverick', segment: 'compact-truck' },
  { make: 'Ford', model: 'Maverick Hybrid', segment: 'compact-truck', hybridPremium: HYBRID_PREMIUM },
  { make: 'Ford', model: 'Transit', segment: 'van' },

  // Chevrolet
  { make: 'Chevrolet', model: 'Silverado 1500', segment: 'fullsize-truck' },
  { make: 'Chevrolet', model: 'Silverado 2500HD', segment: 'hd-truck' },
  { make: 'Chevrolet', model: 'Colorado', segment: 'compact-truck' },
  { make: 'Chevrolet', model: 'Equinox', segment: 'compact-suv' },
  { make: 'Chevrolet', model: 'Trailblazer', segment: 'compact-suv' },
  { make: 'Chevrolet', model: 'Tahoe', segment: 'fullsize-suv' },
  { make: 'Chevrolet', model: 'Suburban', segment: 'fullsize-suv' },
  { make: 'Chevrolet', model: 'Malibu', segment: 'midsize-sedan' },
  { make: 'Chevrolet', model: 'Camaro', segment: 'sports-car' },
  { make: 'Chevrolet', model: 'Spark', segment: 'economy-car' },
  { make: 'Chevrolet', model: 'Bolt EV', segment: 'ev' },

  // GMC
  { make: 'GMC', model: 'Sierra 1500', segment: 'fullsize-truck' },
  { make: 'GMC', model: 'Sierra 2500HD', segment: 'hd-truck' },
  { make: 'GMC', model: 'Canyon', segment: 'compact-truck' },
  { make: 'GMC', model: 'Terrain', segment: 'compact-suv' },
  { make: 'GMC', model: 'Acadia', segment: 'midsize-suv' },
  { make: 'GMC', model: 'Yukon', segment: 'fullsize-suv' },

  // Ram
  { make: 'Ram', model: '1500', segment: 'fullsize-truck' },
  { make: 'Ram', model: '2500', segment: 'hd-truck' },
  { make: 'Ram', model: 'ProMaster', segment: 'van' },
  { make: 'Ram', model: 'ProMaster City', segment: 'van' },

  // Toyota
  { make: 'Toyota', model: 'Camry', segment: 'midsize-sedan' },
  { make: 'Toyota', model: 'Camry Hybrid', segment: 'midsize-sedan', hybridPremium: HYBRID_PREMIUM },
  { make: 'Toyota', model: 'Corolla', segment: 'compact-sedan' },
  { make: 'Toyota', model: 'Yaris', segment: 'economy-car' },
  { make: 'Toyota', model: 'Prius', segment: 'compact-sedan' },
  { make: 'Toyota', model: 'RAV4', segment: 'compact-suv' },
  { make: 'Toyota', model: 'RAV4 Hybrid', segment: 'compact-suv', hybridPremium: HYBRID_PREMIUM },
  { make: 'Toyota', model: 'Highlander', segment: 'midsize-suv' },
  { make: 'Toyota', model: 'Highlander Hybrid', segment: 'midsize-suv', hybridPremium: HYBRID_PREMIUM },
  { make: 'Toyota', model: '4Runner', segment: 'midsize-suv' },
  { make: 'Toyota', model: 'Land Cruiser', segment: 'fullsize-suv' },
  { make: 'Toyota', model: 'Tacoma', segment: 'compact-truck' },
  { make: 'Toyota', model: 'Tundra', segment: 'fullsize-truck' },
  { make: 'Toyota', model: 'Sienna', segment: 'minivan' },

  // Honda
  { make: 'Honda', model: 'Civic', segment: 'compact-sedan' },
  { make: 'Honda', model: 'Fit', segment: 'economy-car' },
  { make: 'Honda', model: 'Accord', segment: 'midsize-sedan' },
  { make: 'Honda', model: 'Accord Hybrid', segment: 'midsize-sedan', hybridPremium: HYBRID_PREMIUM },
  { make: 'Honda', model: 'CR-V', segment: 'compact-suv' },
  { make: 'Honda', model: 'CR-V Hybrid', segment: 'compact-suv', hybridPremium: HYBRID_PREMIUM },
  { make: 'Honda', model: 'HR-V', segment: 'compact-suv' },
  { make: 'Honda', model: 'Pilot', segment: 'midsize-suv' },
  { make: 'Honda', model: 'Ridgeline', segment: 'compact-truck' },
  { make: 'Honda', model: 'Odyssey', segment: 'minivan' },

  // Nissan
  { make: 'Nissan', model: 'Versa', segment: 'economy-car' },
  { make: 'Nissan', model: 'Sentra', segment: 'compact-sedan' },
  { make: 'Nissan', model: 'Altima', segment: 'midsize-sedan' },
  { make: 'Nissan', model: 'Rogue', segment: 'compact-suv' },
  { make: 'Nissan', model: 'Murano', segment: 'midsize-suv' },
  { make: 'Nissan', model: 'Pathfinder', segment: 'midsize-suv' },
  { make: 'Nissan', model: 'Frontier', segment: 'compact-truck' },
  { make: 'Nissan', model: 'Titan', segment: 'fullsize-truck' },
  { make: 'Nissan', model: 'Leaf', segment: 'ev' },

  // Jeep
  { make: 'Jeep', model: 'Renegade', segment: 'compact-suv' },
  { make: 'Jeep', model: 'Compass', segment: 'compact-suv' },
  { make: 'Jeep', model: 'Cherokee', segment: 'compact-suv' },
  { make: 'Jeep', model: 'Grand Cherokee', segment: 'midsize-suv' },
  { make: 'Jeep', model: 'Wrangler', segment: 'midsize-suv' },
  { make: 'Jeep', model: 'Gladiator', segment: 'compact-truck' },

  // Dodge
  { make: 'Dodge', model: 'Charger', segment: 'midsize-sedan' },
  { make: 'Dodge', model: 'Challenger', segment: 'sports-car' },
  { make: 'Dodge', model: 'Journey', segment: 'compact-suv' },
  { make: 'Dodge', model: 'Durango', segment: 'midsize-suv' },

  // Subaru
  { make: 'Subaru', model: 'Impreza', segment: 'compact-sedan' },
  { make: 'Subaru', model: 'Legacy', segment: 'midsize-sedan' },
  { make: 'Subaru', model: 'Crosstrek', segment: 'compact-suv' },
  { make: 'Subaru', model: 'Forester', segment: 'compact-suv' },
  { make: 'Subaru', model: 'Outback', segment: 'midsize-suv' },
  { make: 'Subaru', model: 'Ascent', segment: 'midsize-suv' },

  // Hyundai
  { make: 'Hyundai', model: 'Accent', segment: 'economy-car' },
  { make: 'Hyundai', model: 'Elantra', segment: 'compact-sedan' },
  { make: 'Hyundai', model: 'Sonata', segment: 'midsize-sedan' },
  { make: 'Hyundai', model: 'Sonata Hybrid', segment: 'midsize-sedan', hybridPremium: HYBRID_PREMIUM },
  { make: 'Hyundai', model: 'Venue', segment: 'compact-suv' },
  { make: 'Hyundai', model: 'Tucson', segment: 'compact-suv' },
  { make: 'Hyundai', model: 'Tucson Hybrid', segment: 'compact-suv', hybridPremium: HYBRID_PREMIUM },
  { make: 'Hyundai', model: 'Santa Fe', segment: 'midsize-suv' },
  { make: 'Hyundai', model: 'Palisade', segment: 'fullsize-suv' },
  { make: 'Hyundai', model: 'Ioniq 5', segment: 'ev' },

  // Kia
  { make: 'Kia', model: 'Rio', segment: 'economy-car' },
  { make: 'Kia', model: 'Forte', segment: 'compact-sedan' },
  { make: 'Kia', model: 'Optima', segment: 'midsize-sedan' },
  { make: 'Kia', model: 'Soul', segment: 'compact-suv' },
  { make: 'Kia', model: 'Niro', segment: 'compact-suv', hybridPremium: HYBRID_PREMIUM },
  { make: 'Kia', model: 'Sportage', segment: 'compact-suv' },
  { make: 'Kia', model: 'Sorento', segment: 'midsize-suv' },
  { make: 'Kia', model: 'Sorento Hybrid', segment: 'midsize-suv', hybridPremium: HYBRID_PREMIUM },
  { make: 'Kia', model: 'Telluride', segment: 'fullsize-suv' },
  { make: 'Kia', model: 'EV6', segment: 'ev' },

  // Mazda
  { make: 'Mazda', model: 'Mazda3', segment: 'compact-sedan' },
  { make: 'Mazda', model: 'Mazda6', segment: 'midsize-sedan' },
  { make: 'Mazda', model: 'CX-30', segment: 'compact-suv' },
  { make: 'Mazda', model: 'CX-5', segment: 'compact-suv' },
  { make: 'Mazda', model: 'CX-9', segment: 'midsize-suv' },
  { make: 'Mazda', model: 'MX-5 Miata', segment: 'sports-car' },

  // Volkswagen
  { make: 'Volkswagen', model: 'Golf', segment: 'compact-sedan' },
  { make: 'Volkswagen', model: 'Jetta', segment: 'compact-sedan' },
  { make: 'Volkswagen', model: 'Passat', segment: 'midsize-sedan' },
  { make: 'Volkswagen', model: 'Tiguan', segment: 'compact-suv' },
  { make: 'Volkswagen', model: 'Atlas', segment: 'midsize-suv' },
  { make: 'Volkswagen', model: 'ID.4', segment: 'ev' },

  // BMW
  { make: 'BMW', model: '3 Series', segment: 'luxury-sedan' },
  { make: 'BMW', model: '5 Series', segment: 'luxury-sedan' },
  { make: 'BMW', model: 'X1', segment: 'luxury-suv' },
  { make: 'BMW', model: 'X3', segment: 'luxury-suv' },
  { make: 'BMW', model: 'X5', segment: 'luxury-suv' },

  // Mercedes-Benz
  { make: 'Mercedes-Benz', model: 'C-Class', segment: 'luxury-sedan' },
  { make: 'Mercedes-Benz', model: 'E-Class', segment: 'luxury-sedan' },
  { make: 'Mercedes-Benz', model: 'GLA', segment: 'luxury-suv' },
  { make: 'Mercedes-Benz', model: 'GLC', segment: 'luxury-suv' },
  { make: 'Mercedes-Benz', model: 'GLE', segment: 'luxury-suv' },

  // Audi
  { make: 'Audi', model: 'A4', segment: 'luxury-sedan' },
  { make: 'Audi', model: 'A6', segment: 'luxury-sedan' },
  { make: 'Audi', model: 'Q3', segment: 'luxury-suv' },
  { make: 'Audi', model: 'Q5', segment: 'luxury-suv' },
  { make: 'Audi', model: 'Q7', segment: 'luxury-suv' },

  // Lexus
  { make: 'Lexus', model: 'IS', segment: 'luxury-sedan' },
  { make: 'Lexus', model: 'ES', segment: 'luxury-sedan' },
  { make: 'Lexus', model: 'ES Hybrid', segment: 'luxury-sedan', hybridPremium: HYBRID_PREMIUM },
  { make: 'Lexus', model: 'NX', segment: 'luxury-suv' },
  { make: 'Lexus', model: 'RX', segment: 'luxury-suv' },
  { make: 'Lexus', model: 'RX Hybrid', segment: 'luxury-suv', hybridPremium: HYBRID_PREMIUM },
  { make: 'Lexus', model: 'GX', segment: 'luxury-suv' },

  // Chrysler
  { make: 'Chrysler', model: '300', segment: 'midsize-sedan' },
  { make: 'Chrysler', model: 'Pacifica', segment: 'minivan' },

  // Buick
  { make: 'Buick', model: 'Encore', segment: 'compact-suv' },
  { make: 'Buick', model: 'Envision', segment: 'compact-suv' },
  { make: 'Buick', model: 'Enclave', segment: 'midsize-suv' },

  // Cadillac
  { make: 'Cadillac', model: 'CT5', segment: 'luxury-sedan' },
  { make: 'Cadillac', model: 'XT4', segment: 'luxury-suv' },
  { make: 'Cadillac', model: 'XT5', segment: 'luxury-suv' },
  { make: 'Cadillac', model: 'Escalade', segment: 'luxury-suv' },

  // Lincoln
  { make: 'Lincoln', model: 'Corsair', segment: 'luxury-suv' },
  { make: 'Lincoln', model: 'Aviator', segment: 'luxury-suv' },
  { make: 'Lincoln', model: 'Navigator', segment: 'luxury-suv' },

  // Tesla
  { make: 'Tesla', model: 'Model 3', segment: 'ev' },
  { make: 'Tesla', model: 'Model Y', segment: 'ev' },
  { make: 'Tesla', model: 'Model S', segment: 'ev' },
  { make: 'Tesla', model: 'Model X', segment: 'ev' },

  // Mitsubishi
  { make: 'Mitsubishi', model: 'Mirage', segment: 'economy-car' },
  { make: 'Mitsubishi', model: 'Outlander Sport', segment: 'compact-suv' },
  { make: 'Mitsubishi', model: 'Outlander', segment: 'compact-suv' },
  { make: 'Mitsubishi', model: 'Eclipse Cross', segment: 'compact-suv' },

  // Volvo
  { make: 'Volvo', model: 'S60', segment: 'luxury-sedan' },
  { make: 'Volvo', model: 'XC40', segment: 'luxury-suv' },
  { make: 'Volvo', model: 'XC60', segment: 'luxury-suv' },
  { make: 'Volvo', model: 'XC90', segment: 'luxury-suv' },
];

export const MAKES = Array.from(new Set(VEHICLES.map((v) => v.make))).sort();

export function modelsForMake(make) {
  return VEHICLES.filter((v) => v.make === make)
    .map((v) => v.model)
    .sort();
}

export function segmentFor(make, model) {
  const match = VEHICLES.find((v) => v.make === make && v.model === model);
  return match ? match.segment : null;
}

export function hybridPremiumFor(make, model) {
  const match = VEHICLES.find((v) => v.make === make && v.model === model);
  return match?.hybridPremium || 1;
}
