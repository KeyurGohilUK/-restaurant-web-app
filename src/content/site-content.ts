export const restaurant = {
  name: 'Masala Munch by Shreeji Food',
  shortName: 'Masala Munch',
  tagline: 'Indian street food, chaat and comfort classics in Bristol.',
  address: '664 Fishponds Rd, Bristol BS16 3HJ',
  phoneDisplay: '07733 849772',
  phoneHref: 'tel:+447733849772',
  mapHref: 'https://www.google.com/maps/search/?api=1&query=664+Fishponds+Rd+Bristol+BS16+3HJ',
} as const;

export const openingHours = [
  { day: 'Monday', hours: '17:00–22:00' },
  { day: 'Tuesday', hours: 'Closed' },
  { day: 'Wednesday', hours: '17:00–22:00' },
  { day: 'Thursday', hours: '17:00–22:00' },
  { day: 'Friday', hours: '17:00–22:00' },
  { day: 'Saturday', hours: '12:00–22:00' },
  { day: 'Sunday', hours: '12:00–22:00' },
] as const;

export const featuredDishes = [
  {
    name: 'Samosa Chaat',
    description: 'Crisp samosa, chickpea curry, yogurt, chutneys and sev.',
  },
  {
    name: 'Indori Kachori Chaat',
    description: 'Crisp kachori layered with potatoes, yogurt, chutneys and pomegranate.',
  },
  {
    name: 'Paneer Frankie',
    description: 'Marinated paneer with salad, sauces and cheese in a street-food wrap.',
  },
] as const;

export const reviewCategories = ['Restaurant', 'Catering', 'Events', 'Large orders'] as const;
