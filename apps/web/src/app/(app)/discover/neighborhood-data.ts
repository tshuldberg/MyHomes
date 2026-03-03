export type Neighborhood = {
  name: string;
  city: string;
  story: string;
  storyCount: number;
  tags: string[];
};

export const neighborhoods: Neighborhood[] = [
  {
    name: "Temescal",
    city: "Oakland, CA",
    story:
      "We wave at each other on morning walks. The farmers market on Sundays is where we all catch up. Kids ride bikes until the streetlights come on.",
    storyCount: 8,
    tags: ["Walkable", "Community gardens", "Family-friendly"],
  },
  {
    name: "Sellwood",
    city: "Portland, OR",
    story:
      "Every block has a little free library. The antique shops have been here longer than most of us. You can walk to the river in ten minutes.",
    storyCount: 12,
    tags: ["Yard-friendly", "Walkable", "Local shops"],
  },
  {
    name: "Bernal Heights",
    city: "San Francisco, CA",
    story:
      "The hill is our living room. On clear days you can see both bridges. Neighbors leave lemons on each other's stoops. It's a village inside a city.",
    storyCount: 15,
    tags: ["Quiet streets", "Close to nature", "Diverse community"],
  },
  {
    name: "Montrose",
    city: "Houston, TX",
    story:
      "This is where Houston gets weird in the best way. Murals everywhere, front-yard art installations, and a coffee shop on every corner.",
    storyCount: 6,
    tags: ["Arts & culture", "Diverse community", "Walkable"],
  },
];

export function slugifyNeighborhood(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getNeighborhoodHref(name: string): string {
  return `/discover/${slugifyNeighborhood(name)}`;
}

export function findNeighborhoodBySlug(slug: string): Neighborhood | undefined {
  return neighborhoods.find((neighborhood) => slugifyNeighborhood(neighborhood.name) === slug);
}
