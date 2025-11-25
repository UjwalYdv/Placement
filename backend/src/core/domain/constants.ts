//
//  constants.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

export const COMPLIANCE_CONSTANTS = {
  TARGET_INTENSITY_2025: 89.3368, // gCO2e/MJ (2% below 91.16)
  BASELINE_INTENSITY: 91.16, // gCO2e/MJ
  ENERGY_CONVERSION_FACTOR: 41000, // MJ per tonne of fuel
  REDUCTION_PERCENTAGE_2025: 0.02,
};

export const VESSEL_TYPES = [
  'Container',
  'BulkCarrier',
  'Tanker',
  'RoRo',
  'Passenger',
] as const;

export const FUEL_TYPES = [
  'HFO',
  'LNG',
  'MGO',
  'Methanol',
  'Hydrogen',
] as const;
