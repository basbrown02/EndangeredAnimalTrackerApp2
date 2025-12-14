/**
 * EAI (Endangered Animal Index) Calculator
 * 
 * Score ranges from 0-1000:
 * - 0-250: Recovering / Low risk
 * - 251-500: Unstable / Moderate risk  
 * - 501-750: High risk / Needs action
 * - 751-1000: Critical / Racing toward extinction
 * 
 * The score measures how endangered a species is based on whether
 * reproduction can outpace the current decline rate.
 */

export type MathInputs = {
  population: number;
  femalePopulation: number;
  birthsPerCycle: number;
  birthCycleYears: number;
  lifespan: number;
  ageAtFirstBirth: number;
  declineRate: number; // Negative value e.g. -0.06 for 6% decline
};

export type EaiResult = {
  score: number;
  verdict: string;
  lifetimeBabiesPerFemale: number;
  tippingPointLabel: string;
  annualBirthRate: number;
  annualDeclineRate: number;
  canRecover: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function calculateEai(inputs: MathInputs): EaiResult {
  // Step 1: Calculate reproductive capacity
  const reproductiveYears = Math.max(
    inputs.lifespan - inputs.ageAtFirstBirth,
    1
  );

  // Babies one female can have in her lifetime
  const lifetimeBabiesPerFemale =
    (inputs.birthsPerCycle * reproductiveYears) / inputs.birthCycleYears;

  // Babies per female per year
  const annualBabiesPerFemale = inputs.birthsPerCycle / inputs.birthCycleYears;

  // What percentage of the population are breeding females?
  // Based on what fraction of their life they spend in reproductive years
  const reproductiveFraction = reproductiveYears / inputs.lifespan;
  const breedingFemalePercent = 
    (inputs.femalePopulation / inputs.population) * reproductiveFraction;

  // Annual birth rate as percentage of total population
  // This is: (breeding females) * (babies per female per year) / (total population)
  // Simplified: breedingFemalePercent * annualBabiesPerFemale / survival factor
  // Most babies don't survive to adulthood - use a survival estimate
  const survivalRate = getSurvivalRate(inputs.birthsPerCycle);
  const annualBirthRate = breedingFemalePercent * annualBabiesPerFemale * survivalRate;

  // Step 2: Get the decline rate (as positive percentage)
  const annualDeclineRate = Math.abs(inputs.declineRate);

  // Step 3: Calculate the danger score
  // If decline > births → species declining → higher danger score
  // If births > decline → species recovering → lower danger score
  
  // Net change rate (negative = declining, positive = growing)
  const netChangeRate = annualBirthRate - annualDeclineRate;
  
  // Can the species recover?
  const canRecover = netChangeRate > 0;

  // Calculate a danger score from 0-1000
  // The more decline exceeds reproduction, the higher the score
  let dangerScore: number;
  
  if (netChangeRate >= 0.05) {
    // Strong recovery: 0-100
    dangerScore = clamp(100 - (netChangeRate * 1000), 0, 100);
  } else if (netChangeRate >= 0) {
    // Slight recovery: 100-250
    dangerScore = clamp(250 - (netChangeRate * 3000), 100, 250);
  } else if (netChangeRate >= -0.03) {
    // Slight decline: 250-500
    dangerScore = clamp(250 + (Math.abs(netChangeRate) * 8000), 250, 500);
  } else if (netChangeRate >= -0.08) {
    // Moderate decline: 500-750
    dangerScore = clamp(500 + ((Math.abs(netChangeRate) - 0.03) * 5000), 500, 750);
  } else {
    // Severe decline: 750-1000
    dangerScore = clamp(750 + ((Math.abs(netChangeRate) - 0.08) * 2500), 750, 1000);
  }

  const score = Math.round(dangerScore);

  // Step 4: Generate labels based on score
  const tippingPointLabel =
    score >= 751
      ? "Critical: racing toward extinction"
      : score >= 501
        ? "High risk: needs rapid action"
        : score >= 251
          ? "Unstable: track closely"
          : "Recovering: momentum turning positive";

  const verdict =
    score >= 751
      ? "Mathematically heading to extinction without intervention."
      : score >= 501
        ? "Severe pressure — urgent protection needed."
        : score >= 251
          ? "Worrying trend but recoverable with coordinated action."
          : "Showing signs of recovery — keep supporting their habitat.";

  return {
    score,
    verdict,
    lifetimeBabiesPerFemale: Number(lifetimeBabiesPerFemale.toFixed(1)),
    tippingPointLabel,
    annualBirthRate: Number((annualBirthRate * 100).toFixed(2)),
    annualDeclineRate: Number((annualDeclineRate * 100).toFixed(2)),
    canRecover,
  };
}

/**
 * Estimate survival rate based on number of offspring.
 * Species that have many babies (like turtles with 100+ eggs) have very low survival.
 * Species that have few babies (like orangutans with 1) have higher survival.
 */
function getSurvivalRate(birthsPerCycle: number): number {
  if (birthsPerCycle >= 100) {
    // Sea turtles, fish - very few survive
    return 0.001; // 0.1% survival
  } else if (birthsPerCycle >= 20) {
    // Frogs, some reptiles
    return 0.01; // 1% survival
  } else if (birthsPerCycle >= 5) {
    // Small mammals, birds
    return 0.1; // 10% survival
  } else if (birthsPerCycle >= 2) {
    // Medium mammals
    return 0.3; // 30% survival
  } else {
    // Large mammals, apes - few babies but most survive
    return 0.6; // 60% survival
  }
}
