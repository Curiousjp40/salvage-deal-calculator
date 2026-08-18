import { MAKES, modelsForMake } from '../data/vehicles';

const OTHER_MAKE = '__other__';
const NHTSA_ENDPOINT = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues';
const MIN_SUPPORTED_YEAR = 1990;

// Rough segment guess from NHTSA's BodyClass/FuelTypePrimary text, used
// only when the decoded make/model isn't in our own catalog.
function guessSegmentFromBody(bodyClass = '', fuelType = '') {
  const body = (bodyClass || '').toLowerCase();
  const fuel = (fuelType || '').toLowerCase();
  if (fuel.includes('electric')) return 'ev';
  if (body.includes('minivan')) return 'minivan';
  if (body.includes('van')) return 'van';
  if (body.includes('pickup')) return 'fullsize-truck';
  if (body.includes('sport utility') || body.includes('multi-purpose')) return 'midsize-suv';
  if (body.includes('convertible') || body.includes('coupe')) return 'sports-car';
  if (body.includes('hatchback')) return 'compact-sedan';
  if (body.includes('sedan') || body.includes('saloon')) return 'midsize-sedan';
  return 'midsize-sedan';
}

// Case-insensitive exact match, falling back to a loose prefix match (VIN
// decodes sometimes append trim text to the model, e.g. "F-150 XLT").
function findCatalogMatch(list, target) {
  if (!target) return null;
  const norm = target.trim().toLowerCase();
  if (!norm) return null;
  const exact = list.find((item) => item.toLowerCase() === norm);
  if (exact) return exact;
  const partial = list.find(
    (item) => norm.startsWith(item.toLowerCase()) || item.toLowerCase().startsWith(norm)
  );
  return partial || null;
}

/**
 * Decode a VIN via NHTSA's free public vPIC API and translate the result
 * into a patch for VehicleSelector's value shape, plus the raw decoded
 * fields for display.
 *
 * Returns `{ error }` for a VIN that's malformed or couldn't be decoded.
 * Throws only on a network/HTTP failure.
 */
export async function decodeVin(vin) {
  const cleanVin = (vin || '').trim().toUpperCase();
  if (cleanVin.length !== 17) {
    return { error: 'VINs are 17 characters — check for typos.' };
  }

  const res = await fetch(`${NHTSA_ENDPOINT}/${cleanVin}?format=json`);
  if (!res.ok) {
    throw new Error(`VIN lookup failed (${res.status})`);
  }
  const data = await res.json();
  const result = data?.Results?.[0];

  if (!result || !result.Make) {
    return { error: "Couldn't decode that VIN — double-check it and try again." };
  }

  const decodedMake = result.Make.trim();
  const decodedModel = (result.Model || '').trim();
  const decodedYear = result.ModelYear ? Number(result.ModelYear) : null;
  const decodedTrim = [result.Trim, result.Trim2].filter(Boolean).join(' ').trim() || null;

  const patch = {};
  const matchedMake = findCatalogMatch(MAKES, decodedMake);

  if (matchedMake) {
    const matchedModel = findCatalogMatch(modelsForMake(matchedMake), decodedModel);
    if (matchedModel) {
      patch.make = matchedMake;
      patch.model = matchedModel;
      patch.segment = '';
    } else {
      // Make is in our catalog but this particular model isn't — fall back
      // to a free-text "Other" entry with a guessed segment.
      patch.make = OTHER_MAKE;
      patch.model = decodedModel ? `${decodedMake} ${decodedModel}` : decodedMake;
      patch.segment = guessSegmentFromBody(result.BodyClass, result.FuelTypePrimary);
    }
  } else {
    patch.make = OTHER_MAKE;
    patch.model = decodedModel ? `${decodedMake} ${decodedModel}` : decodedMake;
    patch.segment = guessSegmentFromBody(result.BodyClass, result.FuelTypePrimary);
  }

  const currentYear = new Date().getFullYear();
  let yearNote = null;
  if (decodedYear && decodedYear >= MIN_SUPPORTED_YEAR && decodedYear <= currentYear + 1) {
    patch.year = decodedYear;
  } else if (decodedYear) {
    yearNote = `Decoded model year (${decodedYear}) is outside the supported range — set it manually.`;
  }

  return {
    patch,
    yearNote,
    info: {
      year: decodedYear,
      make: decodedMake,
      model: decodedModel,
      trim: decodedTrim,
      bodyClass: result.BodyClass || null,
      driveType: result.DriveType || null,
      engineCylinders: result.EngineCylinders || null,
      fuelType: result.FuelTypePrimary || null,
      plantCountry: result.PlantCountry || null,
    },
  };
}
