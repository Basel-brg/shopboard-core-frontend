export interface Product {
  id: number;
  sku: string;
  name: string;
  subtitle?: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  specs?: string[];
  warranty?: string;
  image: string;
  plateId?: string;
  tag?: string;
  tone?: string;
  artwork?: string;
  stock?: number;
}

export type CategoryType =
  | 'الكل'
  | 'أجهزة ألعاب'
  | 'شاشات العرض'
  | 'لوحات مفاتيح'
  | 'صوتيات المكتب'
  | 'إضاءة المكتب'
  | 'ملحقات التحكم'
  | 'تنظيم المكتب'
  | string;

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';
