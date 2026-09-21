export const imagePlaceholder = '/placeholder-restaurant-light.svg';

export const restaurantMedia = {
  hero: {
    src: 'https://masalamunchbyshreejifood.com/cf-cgi/families/43185/resource-types/background.png?fit=cover&format=auto&height=2160&quality=90&width=3840',
    alt: 'Indian dishes, rice and naan from the existing Masala Munch website',
  },
  catering: {
    src: '/catering-food-spread.jpg.jpeg',
    alt: 'Indian dishes arranged for catering and events at Masala Munch by Shreeji Food',
  },
  menuImages: {
    'Samosa Chaat': 'https://masalamunchbyshreejifood.com/cf-cgi/resource-types/menu-items/80737_5e36d4a5c76d8c7eaa2c4c225006a14a.png',
    'Dal Tadka': 'https://masalamunchbyshreejifood.com/cf-cgi/resource-types/menu-items/80737_990ebbecee36d18a55224018ab28f4ae.png',
    'Mattar Paneer': 'https://masalamunchbyshreejifood.com/cf-cgi/resource-types/menu-items/80737_408f704a2a68de3a2edeba8567bb95e2.png',
    'Indori Kachori Chaat': 'https://masalamunchbyshreejifood.com/cf-cgi/resource-types/menu-items/80737_9d8cfe28dbc56353c35b8d521fec8be8.png',
    'Dahi Puri': 'https://masalamunchbyshreejifood.com/cf-cgi/resource-types/menu-items/80737_8affe8409c84df4b26f060d59211218f.png',
    'Paneer Bhurji': 'https://masalamunchbyshreejifood.com/cf-cgi/resource-types/menu-items/80737_58924d1ccaa7a37b90d990a611b9a600.png',
  },
} as const;

export type MediaMenuItemName = keyof typeof restaurantMedia.menuImages;

export const getMenuImage = (name: string) =>
  restaurantMedia.menuImages[name as MediaMenuItemName] ?? imagePlaceholder;
