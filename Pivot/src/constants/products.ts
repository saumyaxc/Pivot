export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  condition: string;
  sustainability: number;
  category: string;
  styleTags: string[];
  image: string;
  seller: string;
};

export const products: Product[] = [
  {
    id: 'linen-shirt',
    name: 'Relaxed linen shirt',
    brand: 'Éthique Studio',
    price: 38,
    originalPrice: 92,
    condition: 'Like new',
    sustainability: 94,
    category: 'Tops',
    styleTags: ['minimal', 'soft & natural', 'classic'],
    image:
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=85',
    seller: 'Maya R.',
  },
  {
    id: 'everyday-tote',
    name: 'Everyday leather tote',
    brand: 'Cuyana',
    price: 84,
    originalPrice: 248,
    condition: 'Excellent',
    sustainability: 89,
    category: 'Accessories',
    styleTags: ['minimal', 'classic'],
    image:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85',
    seller: 'Elena P.',
  },
  {
    id: 'denim-jacket',
    name: 'Vintage denim jacket',
    brand: 'Levi’s',
    price: 56,
    originalPrice: 120,
    condition: 'Very good',
    sustainability: 91,
    category: 'Outerwear',
    styleTags: ['vintage', 'streetwear', 'classic'],
    image:
      'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85',
    seller: 'Sophie L.',
  },
  {
    id: 'knit-sweater',
    name: 'Soft wool crewneck',
    brand: 'Armedangels',
    price: 62,
    originalPrice: 145,
    condition: 'Like new',
    sustainability: 97,
    category: 'Knitwear',
    styleTags: ['soft & natural', 'minimal'],
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85',
    seller: 'Noor A.',
  },
  {
    id: 'summer-dress',
    name: 'Sunday midi dress',
    brand: 'Reformation',
    price: 74,
    originalPrice: 218,
    condition: 'Excellent',
    sustainability: 88,
    category: 'Dresses',
    styleTags: ['classic', 'playful'],
    image:
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=85',
    seller: 'Claire D.',
  },
  {
    id: 'crossbody-bag',
    name: 'Mini crossbody bag',
    brand: 'Matt & Nat',
    price: 48,
    originalPrice: 110,
    condition: 'Very good',
    sustainability: 93,
    category: 'Accessories',
    styleTags: ['minimal', 'streetwear'],
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
    seller: 'Iris W.',
  },
];

export const categories = ['All', 'Tops', 'Dresses', 'Outerwear', 'Knitwear', 'Accessories'];

export function getProduct(id: string | undefined) {
  return products.find((product) => product.id === id);
}
