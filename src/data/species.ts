export type SpeciesMathDefaults = {
  population: number;
  femalePercentage: number;
  birthsPerCycle: number;
  birthCycleYears: number;
  lifespan: number;
  ageAtFirstBirth: number;
  declineRate: number;
};

export type Species = {
  slug: string;
  name: string;
  scientificName: string;
  emoji: string;
  summary: string;
  region: string;
  defaultInputs: SpeciesMathDefaults;
};

export const SPECIES_LIST: Species[] = [
  {
    slug: "koala",
    name: "Koala",
    scientificName: "Phascolarctos cinereus",
    emoji: "🧸",
    summary: "Tree-dwelling marsupials facing habitat loss and climate-driven bushfires.",
    region: "Eastern Australia",
    defaultInputs: {
      population: 92000,
      femalePercentage: 0.52,
      birthsPerCycle: 1,
      birthCycleYears: 1,
      lifespan: 15,
      ageAtFirstBirth: 3,
      declineRate: -0.06,
    },
  },
  {
    slug: "hawksbill-sea-turtle",
    name: "Hawksbill Sea Turtle",
    scientificName: "Eretmochelys imbricata",
    emoji: "🐢",
    summary: "Coral reef guardians threatened by illegal shell trade and warming seas.",
    region: "Tropical reefs worldwide",
    defaultInputs: {
      population: 25000,
      femalePercentage: 0.55,
      birthsPerCycle: 160,
      birthCycleYears: 3,
      lifespan: 40,
      ageAtFirstBirth: 20,
      declineRate: -0.08,
    },
  },
  {
    slug: "snow-leopard",
    name: "Snow Leopard",
    scientificName: "Panthera uncia",
    emoji: "🐆",
    summary: "Mountain ghosts losing prey and range to climate change.",
    region: "Himalaya & Central Asia",
    defaultInputs: {
      population: 4000,
      femalePercentage: 0.48,
      birthsPerCycle: 2,
      birthCycleYears: 2,
      lifespan: 18,
      ageAtFirstBirth: 4,
      declineRate: -0.03,
    },
  },
  {
    slug: "sumatran-orangutan",
    name: "Sumatran Orangutan",
    scientificName: "Pongo abelii",
    emoji: "🦧",
    summary: "Forest engineers endangered by palm oil expansion.",
    region: "Sumatra, Indonesia",
    defaultInputs: {
      population: 14600,
      femalePercentage: 0.5,
      birthsPerCycle: 1,
      birthCycleYears: 6,
      lifespan: 45,
      ageAtFirstBirth: 15,
      declineRate: -0.07,
    },
  },
  {
    slug: "black-rhino",
    name: "Black Rhino",
    scientificName: "Diceros bicornis",
    emoji: "🦏",
    summary: "Iconic grazer recovering slowly but still targeted by poaching.",
    region: "Eastern & Southern Africa",
    defaultInputs: {
      population: 6100,
      femalePercentage: 0.49,
      birthsPerCycle: 1,
      birthCycleYears: 2.5,
      lifespan: 40,
      ageAtFirstBirth: 7,
      declineRate: -0.02,
    },
  },
];

export const getSpeciesBySlug = (slug: string) =>
  SPECIES_LIST.find((species) => species.slug === slug);



