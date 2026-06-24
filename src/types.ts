export interface Product {
  id: string;
  gujaratiName: string;
  englishName: string;
  price: number; // Base price for the base unit (KG or DOZEN)
  baseUnit: 'KG' | 'DOZEN';
  availableUnits: ('KG' | 'GRAM' | 'DOZEN')[];
  category: string; // 'Leafy' | 'Root' | 'Seasonal' | 'Organic' | 'Fruits'
  badge: string;
  emoji: string;
  bgColor: string;
  benefit?: string;
}

export interface Profile {
  name: string;
  phone: string;
  address: string;
}

export interface CartItem {
  id: string; // product id
  quantity: number;
  unit: 'KG' | 'GRAM' | 'DOZEN';
}

export interface HistoricalOrder {
  id: string;
  date: string;
  items: {
    productId: string;
    gujaratiName: string;
    englishName: string;
    emoji: string;
    quantity: number;
    unit: 'KG' | 'GRAM' | 'DOZEN';
    price: number;
    cost: number;
  }[];
  totalCost: number;
}

