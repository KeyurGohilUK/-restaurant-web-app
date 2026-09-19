export type GalleryCategory = 'food';

export const galleryCategories = [
  { id: 'food', name: 'Food' },
] as const satisfies readonly { id: GalleryCategory; name: string }[];

const imageBase = 'https://masalamunchbyshreejifood.com/cf-cgi/resource-types/menu-items';

export const galleryItems = [
  {
    id: 'samosa-chaat',
    category: 'food',
    title: 'Samosa Chaat',
    alt: 'Samosa Chaat served by Masala Munch by Shreeji Food',
    image: `${imageBase}/80737_5e36d4a5c76d8c7eaa2c4c225006a14a.png`,
  },
  {
    id: 'dal-tadka',
    category: 'food',
    title: 'Dal Tadka',
    alt: 'Dal Tadka served by Masala Munch by Shreeji Food',
    image: `${imageBase}/80737_990ebbecee36d18a55224018ab28f4ae.png`,
  },
  {
    id: 'mattar-paneer',
    category: 'food',
    title: 'Mattar Paneer',
    alt: 'Mattar Paneer served by Masala Munch by Shreeji Food',
    image: `${imageBase}/80737_408f704a2a68de3a2edeba8567bb95e2.png`,
  },
  {
    id: 'indori-kachori-chaat',
    category: 'food',
    title: 'Indori Kachori Chaat',
    alt: 'Indori Kachori Chaat served by Masala Munch by Shreeji Food',
    image: `${imageBase}/80737_9d8cfe28dbc56353c35b8d521fec8be8.png`,
  },
  {
    id: 'dahi-puri',
    category: 'food',
    title: 'Dahi Puri',
    alt: 'Dahi Puri served by Masala Munch by Shreeji Food',
    image: `${imageBase}/80737_8affe8409c84df4b26f060d59211218f.png`,
  },
  {
    id: 'paneer-bhurji',
    category: 'food',
    title: 'Paneer Bhurji',
    alt: 'Paneer Bhurji served by Masala Munch by Shreeji Food',
    image: `${imageBase}/80737_58924d1ccaa7a37b90d990a611b9a600.png`,
  },
] as const;

export const galleryAssetNote =
  'Food images are sourced from the restaurant’s existing website. Venue, catering and event photos will be added when approved assets are available.';
