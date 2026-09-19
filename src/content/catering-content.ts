export const cateringOccasions = [
  {
    id: 'celebrations',
    name: 'Celebrations',
    description: 'Birthdays, anniversaries and family gatherings that need easy-to-share Indian food.',
  },
  {
    id: 'community',
    name: 'Community events',
    description: 'Food for community gatherings and organised group events, planned directly with the restaurant.',
  },
  {
    id: 'workplace',
    name: 'Workplace & group meals',
    description: 'Advance food planning for teams, meetings and other larger group meals.',
  },
  {
    id: 'large-orders',
    name: 'Large orders',
    description: 'Larger collections and advance orders where quantities and timing need coordinating.',
  },
] as const;

export const cateringPlanningSteps = [
  'Tell us the date, approximate guest count and occasion.',
  'Share any preferred dishes and dietary or allergen requirements.',
  'Confirm availability, suitable menu options, quantities and collection arrangements directly with the restaurant.',
] as const;

export const cateringMenuIdeas = [
  {
    title: 'Street-food selection',
    description: 'Build around current street-food favourites and chaat for an informal sharing-style event.',
  },
  {
    title: 'Curry & sides',
    description: 'Plan a group meal around selected curries and suitable accompaniments from the current menu.',
  },
  {
    title: 'Mixed selection',
    description: 'Combine starters, street food and mains based on the occasion and guest count.',
  },
] as const;

export const cateringNotice =
  'Catering availability, menu suitability, quantities and pricing are confirmed directly with the restaurant. Please discuss allergies and dietary requirements before confirming an order.';
