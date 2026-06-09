export type MenuItem = {
  name: string;
  price: string;
  description: string;
  image?: string;
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
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Masala Maggi",
    price: "Rs. 89",
    description: "Comforting noodles tossed with vegetables and cafe spices.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Grilled Sandwich",
    price: "Rs. 119",
    description: "Toasted bread layered with cheese, veggies, and chutney.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Classic Cold Coffee",
    price: "Rs. 129",
    description: "Creamy chilled coffee blended for a refreshing first sip.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80"
  },
];

export const menuCategories: MenuCategory[] = [
  {
    title: "Coffee",
    label: "Coffee",
    items: [
      { name: "Espresso", price: "Rs. 79", description: "A bold, concentrated shot for true coffee lovers.", image: "https://images.unsplash.com/photo-1510701114205-0c723e0c120a?auto=format&fit=crop&w=600&q=80" },
      { name: "Cappuccino", price: "Rs. 119", description: "Rich espresso, steamed milk, and soft foam.", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80" },
      { name: "Cafe Latte", price: "Rs. 129", description: "Smooth milk coffee with a gentle roasted finish.", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    title: "Tea",
    label: "Tea",
    items: [
      { name: "Masala Chai", price: "Rs. 49", description: "Classic Indian tea simmered with fresh spices.", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80" },
      { name: "Ginger Tea", price: "Rs. 59", description: "Warm, bright tea with a fresh ginger kick.", image: "https://images.unsplash.com/photo-1594631252845-29fc4586d517?auto=format&fit=crop&w=600&q=80" },
      { name: "Green Tea", price: "Rs. 69", description: "Light and calming tea for a quiet pause.", image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    title: "Snacks",
    label: "Snacks",
    items: [
      { name: "Veg Sandwich", price: "Rs. 99", description: "Fresh vegetables, cheese, and house spread.", image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=600&q=80" },
      { name: "Cheese Toast", price: "Rs. 89", description: "Crisp toast with melted cheese and herbs.", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80" },
      { name: "Homemade Cookies", price: "Rs. 69", description: "Freshly baked cookies made in small batches.", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    title: "Maggi / Fast Food",
    label: "Fast Food",
    items: [
      { name: "Plain Maggi", price: "Rs. 69", description: "Simple, nostalgic, and ready in minutes.", image: "https://images.unsplash.com/photo-1626804475315-993d0fdfed64?auto=format&fit=crop&w=600&q=80" },
      { name: "Cheese Maggi", price: "Rs. 99", description: "Creamy noodles topped with melted cheese.", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80" },
      { name: "Veg Burger", price: "Rs. 119", description: "Crispy patty, fresh veggies, and house sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    title: "Cold Drinks",
    label: "Cold Drinks",
    items: [
      { name: "Cold Coffee", price: "Rs. 129", description: "Chilled coffee blended with milk and ice cream.", image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80" },
      { name: "Iced Tea", price: "Rs. 99", description: "Refreshing tea with lemon and a clean finish.", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80" },
      { name: "Fresh Lime Soda", price: "Rs. 79", description: "Sparkling lime drink served sweet, salted, or mixed.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" },
    ],
  },
];
