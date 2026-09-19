export const externalRatings = [
  {
    id: 'google',
    platform: 'Google',
    rating: 5,
    reviewCount: 75,
    scale: 5,
    href: 'https://www.google.com/maps/search/?api=1&query=Masala+Munch+by+Shreeji+Food+664+Fishponds+Rd+Bristol+BS16+3HJ',
    checkedDate: '19 September 2026',
  },
  {
    id: 'deliveroo',
    platform: 'Deliveroo',
    rating: 4.6,
    reviewCount: 32,
    scale: 5,
    href: 'https://deliveroo.co.uk/menu/Bristol/speedwell-and-hillfields/masala-munch-by-shreeji-food-664-fishponds-road',
    checkedDate: '19 September 2026',
  },
] as const;

export const reviewGroups = [
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Everyday visits, street-food favourites and the overall restaurant experience.',
  },
  {
    id: 'catering',
    name: 'Catering',
    description: 'Feedback from catered celebrations, gatherings and group food orders.',
  },
  {
    id: 'events',
    name: 'Events',
    description: 'Customer feedback from birthdays, community events and other occasions.',
  },
  {
    id: 'large-orders',
    name: 'Large orders',
    description: 'Feedback focused on larger collections, group meals and advance orders.',
  },
] as const;

export type ReviewGroupId = (typeof reviewGroups)[number]['id'];

export const verifiedTestimonials: readonly {
  id: string;
  category: ReviewGroupId;
  quote: string;
  customerName: string;
  source: string;
  sourceHref?: string;
}[] = [];
