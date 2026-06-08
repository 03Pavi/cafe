export type MenuItem = {
  name: string;
  price: string;
  description: string;
};

export type MenuCategory = {
  title: string;
  label: string;
  items: MenuItem[];
};

export const bestSellers: MenuItem[] = [
  {
    name: "Signature Coffee",
    price: "Rs. 99",
    description: "Freshly brewed house coffee with a smooth caramel finish.",
  },
  {
    name: "Masala Maggi",
    price: "Rs. 89",
    description: "Comforting noodles tossed with vegetables and cafe spices.",
  },
  {
    name: "Grilled Sandwich",
    price: "Rs. 119",
    description: "Toasted bread layered with cheese, veggies, and chutney.",
  },
  {
    name: "Classic Cold Coffee",
    price: "Rs. 129",
    description: "Creamy chilled coffee blended for a refreshing first sip.",
  },
];

export const menuCategories: MenuCategory[] = [
  {
    title: "Coffee",
    label: "Coffee",
    items: [
      { name: "Espresso", price: "Rs. 79", description: "A bold, concentrated shot for true coffee lovers." },
      { name: "Cappuccino", price: "Rs. 119", description: "Rich espresso, steamed milk, and soft foam." },
      { name: "Cafe Latte", price: "Rs. 129", description: "Smooth milk coffee with a gentle roasted finish." },
    ],
  },
  {
    title: "Tea",
    label: "Tea",
    items: [
      { name: "Masala Chai", price: "Rs. 49", description: "Classic Indian tea simmered with fresh spices." },
      { name: "Ginger Tea", price: "Rs. 59", description: "Warm, bright tea with a fresh ginger kick." },
      { name: "Green Tea", price: "Rs. 69", description: "Light and calming tea for a quiet pause." },
    ],
  },
  {
    title: "Snacks",
    label: "Snacks",
    items: [
      { name: "Veg Sandwich", price: "Rs. 99", description: "Fresh vegetables, cheese, and house spread." },
      { name: "Cheese Toast", price: "Rs. 89", description: "Crisp toast with melted cheese and herbs." },
      { name: "Homemade Cookies", price: "Rs. 69", description: "Freshly baked cookies made in small batches." },
    ],
  },
  {
    title: "Maggi / Fast Food",
    label: "Fast Food",
    items: [
      { name: "Plain Maggi", price: "Rs. 69", description: "Simple, nostalgic, and ready in minutes." },
      { name: "Cheese Maggi", price: "Rs. 99", description: "Creamy noodles topped with melted cheese." },
      { name: "Veg Burger", price: "Rs. 119", description: "Crispy patty, fresh veggies, and house sauce." },
    ],
  },
  {
    title: "Cold Drinks",
    label: "Cold Drinks",
    items: [
      { name: "Cold Coffee", price: "Rs. 129", description: "Chilled coffee blended with milk and ice cream." },
      { name: "Iced Tea", price: "Rs. 99", description: "Refreshing tea with lemon and a clean finish." },
      { name: "Fresh Lime Soda", price: "Rs. 79", description: "Sparkling lime drink served sweet, salted, or mixed." },
    ],
  },
];
