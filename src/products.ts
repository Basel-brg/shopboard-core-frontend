import type { Product, CategoryType, SortOption } from './types';

export const PRODUCTS: readonly Product[] = [
  {
    id: 1,
    sku: 'SB-KEY-01',
    name: 'لوحة مفاتيح ميكانيكية لاسلكية',
    subtitle: 'Minimalist wireless mechanical keyboard',
    category: 'لوحات مفاتيح',
    price: 310,
    originalPrice: 380,
    rating: 4.9,
    reviewsCount: 140,
    description: 'لوحة مفاتيح ميكانيكية لاسلكية مدمجة 75% بأغطية مفاتيح PBT دافئة ومفاتيح خطية ناعمة قابلة للتبديل السريع.',
    specs: ['اتصال ثلاثي بلوتوث + 2.4GHz + سلكي', 'مفاتيح Hot-Swap مسبقة التشحيم', 'متوافقة مع Mac و Windows'],
    warranty: 'ضمان سنتين شامل',
    image: '/assets/products/keyboard.jpg',
    plateId: 'card-1',
    tag: 'الأعلى تقييماً'
  },
  {
    id: 2,
    sku: 'SB-AUDIO-02',
    name: 'سماعة استوديو ANC احترافية',
    subtitle: 'ANC-400m studio headphones',
    category: 'صوتيات المكتب',
    price: 389,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 124,
    description: 'سماعة رأس استوديو احترافية بعزل ضوضاء نشط هجين ومحركات صوتية مقاس 45 ملم لتركيز عميق طوال اليوم.',
    specs: ['عزل ضوضاء نشط ANC هجين', 'بطارية تدوم 40 ساعة', 'وسائد جلدية مريحة للاستخدام الطويل'],
    warranty: 'ضمان سنتين شامل',
    image: '/assets/products/headphones.jpg',
    plateId: 'card-2',
    tag: 'الأكثر مبيعاً'
  },
  {
    id: 3,
    sku: 'SB-LAMP-03',
    name: 'مصباح مكتب معماري نحاسي',
    subtitle: 'Architectural brass desk lamp',
    category: 'إضاءة المكتب',
    price: 275,
    originalPrice: 340,
    rating: 4.8,
    reviewsCount: 64,
    description: 'مصباح مكتب مفصلي من النحاس المصقول يمنح إضاءة دافئة خالية من الوميض ومريحة للعين أثناء ساعات العمل.',
    specs: ['نحاس مصقول مقاوم للأكسدة', 'إضاءة دافئة 3000K CRI 95+', 'ذراع مفصلي قابل للتوجيه'],
    warranty: 'ضمان سنتين شامل',
    image: '/assets/products/lamp.jpg',
    plateId: 'card-3',
    tag: 'إصدار أتيليه'
  },
  {
    id: 4,
    sku: 'SB-MOUSE-04',
    name: 'ماوس عمودي هندسي مريح',
    subtitle: 'Ergonomic vertical mouse',
    category: 'ملحقات التحكم',
    price: 220,
    originalPrice: 265,
    rating: 4.8,
    reviewsCount: 92,
    description: 'ماوس لاسلكي عمودي بزاوية مصممة هندسياً بـ 57 درجة لتقليل إجهاد المعصم مع عجلة تمرير معدنية دقيقة.',
    specs: ['مستشعر بصري 4000 DPI', 'عجلة تمرير من النحاس والألمنيوم', 'شحن سريع عبر منفذ USB-C'],
    warranty: 'ضمان سنتين شامل',
    image: '/assets/products/mouse.jpg',
    plateId: 'card-4',
    tag: 'تصميم هندسي'
  },
  {
    id: 5,
    sku: 'SB-ORG-05',
    name: 'منظم المكتب النحاسي',
    subtitle: 'Brass desk pen cup',
    category: 'تنظيم المكتب',
    price: 145,
    originalPrice: 180,
    rating: 4.9,
    reviewsCount: 53,
    description: 'وحدة تنظيم مكتبية أسطوانية من النحاس المصمت المصقول لحفظ الأقلام والأدوات الهندسية بثبات وأناقة.',
    specs: ['نحاس مصمت بوزن متوازن 420 جرام', 'قاعدة مبطنة بالفلين لحماية الخشب', 'تشطيب يدوي دافئ'],
    warranty: 'ضمان مدى الحياة ضد الصدأ',
    image: '/assets/products/brass-organizer.jpg',
    plateId: 'sidebar-featured',
    tag: 'قطعة مختارة'
  },
  {
    id: 6,
    sku: 'SB-STAND-06',
    name: 'حامل شاشة مكتبي من خشب البلوط',
    subtitle: 'Solid oak monitor riser shelf',
    category: 'تنظيم المكتب',
    price: 340,
    originalPrice: 410,
    rating: 4.9,
    reviewsCount: 78,
    description: 'رف شاشة مكتبي عريض من خشب البلوط الطبيعي مع مساحة سفلية مخصصة لتخزين لوحة المفاتيح والملحقات.',
    specs: ['خشب بلوط طبيعي معالج بالزيت', 'يتحمل وزن حتى 25 كجم', 'فتحة خلفية لتمرير الكابلات'],
    warranty: 'ضمان سنتين شامل',
    image: '/assets/products/monitor-stand.jpg',
    tag: 'وصل حديثاً'
  },
  {
    id: 7,
    sku: 'SB-DOCK-07',
    name: 'موزع منافذ Thunderbolt 4 الاحترافي',
    subtitle: '12-in-1 Aluminum Desktop Dock',
    category: 'ملحقات التحكم',
    price: 480,
    originalPrice: 560,
    rating: 4.8,
    reviewsCount: 47,
    description: 'محطة توصيل مكتبية متكاملة بهيكل ألمنيوم مؤكسد تدعم شاشتين 4K وشحن الحاسب المحمول بقدرة 96 واط.',
    specs: ['12 منفذاً احترافياً شاملاً SD 4.0', 'شحن PD بقدرة 96W', 'منفذ إيثرنت 2.5GbE فائق السرعة'],
    warranty: 'ضمان سنتين شامل',
    image: '/assets/products/dock.jpg',
    tag: 'أداء فائق'
  },
  {
    id: 8,
    sku: 'SB-MAT-08',
    name: 'لباد مكتب من الصوف الطبيعي والفلين',
    subtitle: 'Merino wool & cork desk mat',
    category: 'تنظيم المكتب',
    price: 125,
    originalPrice: 160,
    rating: 4.7,
    reviewsCount: 84,
    description: 'لباد مكتب واسع الملمس يعزل البرودة ويوفر سطحاً متوازناً لحركة الماوس وثبات لوحة المفاتيح.',
    specs: ['أبعاد واسعة 90 × 40 سم', 'قاعدة فلين طبيعي مانعة للانزلاق', 'مقاوم للتنسيل والبقع'],
    warranty: 'ضمان سنة شاملة',
    image: '/assets/products/desk-mat.jpg',
    tag: ''
  },
  {
    id: 9,
    sku: 'SB-PC-09',
    name: 'صندوق حاسب ألعاب Aorus الاحترافي',
    subtitle: 'Custom Aorus Tempered Glass Gaming PC',
    category: 'أجهزة ألعاب',
    price: 4850,
    originalPrice: 5400,
    rating: 5.0,
    reviewsCount: 38,
    description: 'كيسة حاسوب ألعاب احترافية بواجهة زجاجية مقساة وثلاث مراوح RGB أمامية متزامنة، مع دعم بطاقات الشاشة العملاقة وتبريد مائي متقدم.',
    specs: ['واجهة زجاجية شفافة Tempered Glass', '3 مراوح ARGB 120mm مدمجة', 'دعم لوحات ATX والتبريد السائل 360mm'],
    warranty: 'ضمان سنتين شامل',
    image: '/assets/products/pc-case.jpg',
    tag: 'الأعلى أداءً'
  },
  {
    id: 10,
    sku: 'SB-MON-10',
    name: 'شاشة ألعاب منحنية Gigabyte 34 بوصة',
    subtitle: 'Gigabyte G34WQC Ultrawide Curved Monitor',
    category: 'شاشات العرض',
    price: 2750,
    originalPrice: 3100,
    rating: 4.9,
    reviewsCount: 71,
    description: 'شاشة ألعاب فائقة العرض بدقة WQHD بمعدل تحديث 144Hz وانحناء 1500R لبيئة عمل وألعاب غامرة وواسعة.',
    specs: ['دقة WQHD (3440 x 1440) بمعدل 144Hz', 'انحناء 1500R وزاوية رؤية واسعة', 'حامل معدني متين قابل لتعديل الارتفاع'],
    warranty: 'ضمان ثلاث سنوات شامل',
    image: '/assets/products/curved-monitor.jpg',
    tag: 'سيت أب احترافي'
  }
];

export const CATEGORIES: readonly CategoryType[] = [
  'الكل',
  'أجهزة ألعاب',
  'شاشات العرض',
  'لوحات مفاتيح',
  'صوتيات المكتب',
  'إضاءة المكتب',
  'ملحقات التحكم',
  'تنظيم المكتب'
];

export function sortProducts(items: Product[], sortBy: SortOption): Product[] {
  const shallow = [...items];
  switch (sortBy) {
    case 'price-asc':
      return shallow.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return shallow.sort((a, b) => b.price - a.price);
    case 'rating':
      return shallow.sort((a, b) => b.rating - a.rating);
    case 'default':
    default:
      return shallow.sort((a, b) => {
        const indexA = PRODUCTS.findIndex((p) => p.id === a.id);
        const indexB = PRODUCTS.findIndex((p) => p.id === b.id);
        return indexA - indexB;
      });
  }
}
