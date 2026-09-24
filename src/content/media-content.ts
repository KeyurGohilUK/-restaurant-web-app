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
    'Bun Maska and Chai': publicAsset('images/menu/bun-maska-and-chai.webp'),
    'Vada Pav and Chai': publicAsset('images/menu/vada-pav-and-chai.webp'),
    'Chana Salad (Black)': publicAsset('images/menu/chana-salad-black.webp'),
    'Sweetcorn Salad': publicAsset('images/menu/sweetcorn-salad.webp'),
    'Sev Puri': publicAsset('images/menu/sev-puri.webp'),
    'Dahi Puri': publicAsset('images/menu/dahi-puri.webp'),
    'Pani Puri (6)': publicAsset('images/menu/pani-puri.webp'),
    'Samosa Chaat': publicAsset('images/menu/samosa-chaat.webp'),
    Bhel: publicAsset('images/menu/bhel.webp'),
    'Ragada Patties': publicAsset('images/menu/ragada-patties.webp'),
    'Indori Kachori Chaat': publicAsset('images/menu/indori-kachori-chaat.webp'),
    'Raj Kachori Chaat': publicAsset('images/menu/raj-kachori-chaat.webp'),
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
    'Steam Rice': publicAsset('images/menu/steam-rice.webp'),
    'Jeera Rice': publicAsset('images/menu/jeera-rice.webp'),
    'Indian Masala Chai': publicAsset('images/menu/indian-masala-chai.webp'),
    'Filter Coffee': publicAsset('images/menu/filter-coffee.webp'),
    'Salted Lassi': publicAsset('images/menu/salted-lassi.webp'),
    'Sweet Lassi': publicAsset('images/menu/sweet-lassi.webp'),
    'Mango Lassi': publicAsset('images/menu/mango-lassi.webp'),
    'Limbu Soda': publicAsset('images/menu/limbu-soda.webp'),
    Shrikhand: publicAsset('images/menu/shrikhand.webp'),
    'Gulab Jamun (3)': publicAsset('images/menu/gulab-jamun-3.webp'),
  },
} as const;

export type MediaMenuItemName = keyof typeof restaurantMedia.menuImages;

export const getMenuImage = (name: string) =>
  restaurantMedia.menuImages[name as MediaMenuItemName] ?? imagePlaceholder;
