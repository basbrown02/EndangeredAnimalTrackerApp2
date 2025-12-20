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
  characterImage?: string;
  nickname?: string;
  status?: "Vulnerable" | "Endangered" | "Critically Endangered";
};

export const SPECIES_LIST: Species[] = [
  {
    slug: "snow-leopard",
    name: "Snow Leopard",
    scientificName: "Panthera uncia",
    emoji: "🐆",
    summary: "Mountain ghosts losing prey and range to climate change.",
    region: "Himalaya & Central Asia",
    characterImage: "/animalcharacters/snow-leopard.png",
    nickname: "Leo",
    status: "Vulnerable",
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
    slug: "hawksbill-sea-turtle",
    name: "Hawksbill Sea Turtle",
    scientificName: "Eretmochelys imbricata",
    emoji: "🐢",
    summary: "Coral reef guardians threatened by illegal shell trade and warming seas.",
    region: "Tropical reefs worldwide",
    characterImage: "/animalcharacters/turtle.png",
    nickname: "Nemo",
    status: "Endangered",
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
    slug: "mountain-gorilla",
    name: "Mountain Gorilla",
    scientificName: "Gorilla beringei beringei",
    emoji: "🦍",
    summary: "Gentle giants making a slow comeback from near extinction.",
    region: "Central Africa",
    characterImage: "/animalcharacters/gorilla.png",
    nickname: "Kong",
    status: "Endangered",
    defaultInputs: {
      population: 1063,
      femalePercentage: 0.48,
      birthsPerCycle: 1,
      birthCycleYears: 4,
      lifespan: 40,
      ageAtFirstBirth: 10,
      declineRate: -0.02,
    },
  },
  {
    slug: "bengal-tiger",
    name: "Bengal Tiger",
    scientificName: "Panthera tigris tigris",
    emoji: "🐅",
    summary: "Majestic predator losing habitat to human expansion.",
    region: "India & Southeast Asia",
    characterImage: "/animalcharacters/tiger.png",
    nickname: "Indi",
    status: "Endangered",
    defaultInputs: {
      population: 2500,
      femalePercentage: 0.49,
      birthsPerCycle: 3,
      birthCycleYears: 2.5,
      lifespan: 15,
      ageAtFirstBirth: 4,
      declineRate: -0.04,
    },
  },
  {
    slug: "koala",
    name: "Koala",
    scientificName: "Phascolarctos cinereus",
    emoji: "🧸",
    summary: "Tree-dwelling marsupials facing habitat loss and climate-driven bushfires.",
    region: "Eastern Australia",
    characterImage: "/animalcharacters/koala.png",
    nickname: "Lucy",
    status: "Vulnerable",
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
];

export const getSpeciesBySlug = (slug: string) =>
  SPECIES_LIST.find((species) => species.slug === slug);



