export type MenuItem = {
  name: string;
  price: string;
  description: string;
  popular?: true;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: readonly MenuItem[];
};

export const menuCategories: readonly MenuCategory[] = [
  {
    id: 'combos',
    name: 'Combos',
    items: [
      { name: 'Bun Maska and Chai', price: '£5.15', description: 'Buttered bun served with warming Indian chai.' },
      { name: 'Vada Pav and Chai', price: '£5.15', description: 'Mumbai-style vada pav paired with hot chai.' },
    ],
  },
  {
    id: 'salad',
    name: 'Salad',
    items: [
      { name: 'Chana Salad (Black)', price: '£5.20', description: 'Black chickpeas with fresh vegetables and a bright, spiced dressing.' },
      { name: 'Sweetcorn Salad', price: '£3.90', description: 'Sweetcorn, crisp vegetables, lime and savoury spices.' },
    ],
  },
  {
    id: 'chaat',
    name: 'Chaat',
    items: [
      { name: 'Sev Puri', price: '£5.20', description: 'Crisp puris with potato, chutneys and crunchy sev.', popular: true },
      { name: 'Dahi Puri', price: '£5.20', description: 'Crisp puris filled with potato, chickpeas, yogurt and chutneys.' },
      { name: 'Pani Puri (6)', price: '£3.90', description: 'Six crisp puris with spiced filling and tangy pani.' },
      { name: 'Samosa Chaat', price: '£6.50', description: 'Samosa, chickpea curry, yogurt, chutneys and sev.' },
      { name: 'Bhel', price: '£5.20', description: 'A light, crunchy Mumbai-style chaat.' },
      { name: 'Ragada Patties', price: '£6.50', description: 'Potato patties served with white-pea ragada and chutneys.' },
      { name: 'Indori Kachori Chaat', price: '£6.50', description: 'Crisp kachori layered with yogurt, chutneys and colourful toppings.' },
      { name: 'Raj Kachori Chaat', price: '£6.50', description: 'Large crisp kachori filled and finished with yogurt and chutneys.' },
    ],
  },
  {
    id: 'sandwich-special',
    name: 'Sandwich Special',
    items: [
      { name: 'Cheese Chutney', price: '£3.90', description: 'Cheese and green chutney in a simple toasted sandwich.' },
      { name: 'Bun Maska', price: '£2.60', description: 'Soft bun generously spread with butter.' },
      { name: 'Cheese Grill Sandwich', price: '£3.90', description: 'Toasted cheese sandwich with Mumbai-style chutney.' },
      { name: 'Mumbai Green Sandwich', price: '£6.50', description: 'Fresh vegetable sandwich with green chutney and masala.' },
      { name: 'Mumbai Grill Sandwich', price: '£7.80', description: 'A larger grilled Mumbai-style vegetable sandwich.' },
    ],
  },
  {
    id: 'mumbai-special',
    name: 'Mumbai Special',
    items: [
      { name: 'Vada Pav', price: '£3.25', description: 'Spiced potato vada in a soft pav with chutney.' },
      { name: 'Butter Vada Pav', price: '£3.90', description: 'Classic vada pav finished with butter.' },
      { name: 'Amul Cheese Vada Pav', price: '£4.55', description: 'Vada pav topped with Amul cheese.' },
      { name: 'Samosa Pav', price: '£3.90', description: 'Crisp samosa served inside a soft pav with chutneys.' },
      { name: 'Pav Bhaji', price: '£7.80', description: 'Spiced mashed vegetable bhaji with toasted pav.' },
      { name: 'Amul Cheese Pav Bhaji', price: '£9.10', description: 'Pav bhaji finished with Amul cheese.' },
      { name: 'Dabeli', price: '£3.25', description: 'Gujarati spiced potato filling in pav with chutneys and garnish.' },
      { name: 'Amul Cheese Dabeli', price: '£4.55', description: 'Dabeli topped with Amul cheese.' },
    ],
  },
  {
    id: 'punjabi-curries',
    name: 'North India Curries',
    items: [
      { name: 'Paneer Tikka Masala', price: '£9.05', description: 'Paneer in a rich tomato-based masala gravy.', popular: true },
      { name: 'Mattar Paneer', price: '£7.75', description: 'Paneer and green peas in a gently spiced gravy.', popular: true },
      { name: 'Paneer Frankie', price: '£7.50', description: 'Marinated paneer, salad, sauces and cheese in a wrap.' },
      { name: 'Paneer Bhurji', price: '£8.45', description: 'Crumbled paneer cooked with onion, tomato and spices.', popular: true },
      { name: 'Dal Fry', price: '£5.15', description: 'Cooked lentils finished with a savoury tempering.' },
      { name: 'Dal Tadka', price: '£5.85', description: 'Lentils finished with an aromatic hot tadka.' },
      { name: 'Steam Rice', price: '£2.60', description: 'Light steamed long-grain rice.' },
      { name: 'Jeera Rice', price: '£3.25', description: 'Rice flavoured with toasted cumin and aromatics.' },
    ],
  },
  {
    id: 'drink',
    name: 'Drink',
    items: [
      { name: 'Indian Masala Chai', price: '£3.25', description: 'Milky Indian tea brewed with warming spices.' },
      { name: 'Filter Coffee', price: '£3.25', description: 'Strong South Indian-style filter coffee with milk.' },
      { name: 'Salted Lassi', price: '£3.25', description: 'Cooling yogurt drink with salt and roasted cumin.' },
      { name: 'Sweet Lassi', price: '£3.25', description: 'Sweet, creamy yogurt drink with cardamom.' },
      { name: 'Mango Lassi', price: '£5.20', description: 'Creamy mango and yogurt drink.' },
      { name: 'Limbu Soda', price: '£2.60', description: 'Fresh lime, soda and Indian-style seasoning.' },
      { name: 'Masala Chaas', price: '£2.60', description: 'Light spiced buttermilk with cumin and seasoning.' },
    ],
  },
  {
    id: 'sweet',
    name: 'Sweet',
    items: [
      { name: 'Shrikhand', price: '£3.90', description: 'Thick strained yogurt dessert with cardamom and saffron notes.' },
      { name: 'Gulab Jamun (3)', price: '£3.85', description: 'Three soft milk-solid dumplings in fragrant sugar syrup.' },
    ],
  },
] as const;

export const menuItemCount = menuCategories.reduce((total, category) => total + category.items.length, 0);
