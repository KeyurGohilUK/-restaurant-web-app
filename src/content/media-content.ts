const publicAsset = (filename: string) => `/restaurant-web-app/${filename}`;

export const imagePlaceholder = publicAsset('placeholder-restaurant-light.svg');

export const restaurantMedia = {
  hero: {
    src: 'https://masalamunchbyshreejifood.com/cf-cgi/families/43185/resource-types/background.png?fit=cover&format=auto&height=2160&quality=90&width=3840',
    alt: 'Indian dishes, rice and naan from the existing Masala Munch website',
  },
  catering: {
    src: publicAsset('catering-food-spread.jpg.jpeg'),
    alt: 'Indian dishes arranged for catering and events at Masala Munch by Shreeji Food',
  },
  menuImages: {
    'Sev Puri': publicAsset('images/menu/sev-puri.webp'),
    'Pani Puri (6)': publicAsset('images/menu/pani-puri.webp'),
    'Samosa Chaat': publicAsset('images/menu/samosa-chaat.webp'),
    Bhel: publicAsset('images/menu/bhel.webp'),
    'Indori Kachori Chaat': publicAsset('images/menu/indori-kachori-chaat.webp'),
    'Cheese Chutney': publicAsset('images/menu/cheese-chutney.webp'),
    'Bun Maska': publicAsset('images/menu/bun-maska.webp'),
    'Cheese Grill Sandwich': publicAsset('images/menu/cheese-grill-sandwich.webp'),
    'Mumbai Green Sandwich': publicAsset('images/menu/mumbai-green-sandwich.webp'),
    'Mumbai Grill Sandwich': publicAsset('images/menu/mumbai-grill-sandwich.webp'),
    'Vada Pav': publicAsset('images/menu/vada-pav.webp'),
    'Amul Cheese Vada Pav': publicAsset('images/menu/amul-cheese-vada-pav.webp'),
    'Pav Bhaji': publicAsset('images/menu/pav-bhaji.webp'),
    'Amul Cheese Pav Bhaji': publicAsset('images/menu/amul-cheese-pav-bhaji.webp'),
    Dabeli: publicAsset('images/menu/dabeli.webp'),
    'Amul Cheese Dabeli': publicAsset('images/menu/amul-cheese-dabeli.webp'),
    'Paneer Tikka Masala': publicAsset('images/menu/paneer-tikka-masala.webp'),
    'Mattar Paneer': publicAsset('images/menu/mattar-paneer.webp'),
    'Paneer Bhurji': publicAsset('images/menu/paneer-bhurji.webp'),
    'Dal Fry': publicAsset('images/menu/dal-fry.webp'),
    'Dal Tadka': publicAsset('images/menu/dal-tadka.webp'),
  },
} as const;

export type MediaMenuItemName = keyof typeof restaurantMedia.menuImages;

export const getMenuImage = (name: string) =>
  restaurantMedia.menuImages[name as MediaMenuItemName] ?? imagePlaceholder;
