export const restaurant = {
  name: 'Masala Munch by Shreeji Food',
  shortName: 'Masala Munch',
  tagline: 'Indian street food, chaat and comfort classics in Bristol.',
  address: 'Masala Munch by Shreeji Food, Fishponds Rd, Bristol BS16 3HJ',
  locationAddress: '664 Fishponds Rd, Bristol BS16 3HJ',
  phoneDisplay: '07733 849772',
  phoneHref: 'tel:+447733849772',
  mapQuery: 'Masala Munch by Shreeji Food, 664 Fishponds Rd, Bristol BS16 3HJ',
  mapHref:
    'https://www.google.com/maps/search/?api=1&query=Masala+Munch+by+Shreeji+Food%2C+664+Fishponds+Rd%2C+Bristol+BS16+3HJ',
} as const;

export const navigationItems = ['Home', 'About', 'Menu', 'Dietary', 'Catering', 'Reviews', 'Contact'] as const;

export const openingHours = [
  { day: 'Monday', hours: '17:00–22:00' },
  { day: 'Tuesday', hours: 'Closed' },
  { day: 'Wednesday', hours: '17:00–22:00' },
  { day: 'Thursday', hours: '17:00–22:00' },
  { day: 'Friday', hours: '17:00–22:00' },
  { day: 'Saturday', hours: '14:00–22:00' },
  { day: 'Sunday', hours: '17:00–22:00' },
] as const;

export const reviewCategories = ['Restaurant', 'Catering', 'Events', 'Large orders'] as const;
