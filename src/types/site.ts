export type MenuSectionKey = 'bebidas' | 'brunch' | 'comida' | 'panaderia';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  tag?: string;
  available: boolean;
}

export interface CateringPackage {
  id: string;
  name: string;
  people: string;
  price: string;
  details: string;
}

export interface WholesaleProduct {
  id: string;
  name: string;
  minOrder: string;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  badge: string;
  description: string;
  active: boolean;
}

export interface QuadrantCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  target: string;
  image: string;
}

export interface BrandConfig {
  name: string;
  tagline: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  marqueeText: string;
  storyTitle: string;
  storyText: string;
  address: string;
  city: string;
  hours: string;
  instagramHandle: string;
  instagramUrl: string;
  whatsappNumber: string;
  petFriendlyNote: string;
  galleryImages: string[];
  adminPin: string;
}

export interface CateringConfig {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  highlights: string[];
  packages: CateringPackage[];
  ctaText: string;
}

export interface WholesaleConfig {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  benefits: string[];
  products: WholesaleProduct[];
  ctaText: string;
}

export interface SiteData {
  version: number;
  updatedAt: string;
  brand: BrandConfig;
  quadrants?: QuadrantCard[];
  menu: Record<MenuSectionKey, MenuItem[]>;
  catering: CateringConfig;
  mayoreo: WholesaleConfig;
  novedades: NewsItem[];
}
