export type MenuSectionKey = 'bebidas' | 'brunch' | 'comida' | 'panaderia';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  tag?: string;
  available: boolean;
  image?: string;
  imagePosition?: string;
  imageZoom?: number;
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
  imagePosition?: string;
  imageZoom?: number;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  position?: string;
  zoom?: number;
}

export interface BrandConfig {
  name: string;
  tagline: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroPosition?: string;
  heroZoom?: number;
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
  galleryPhotos?: GalleryPhoto[];
  adminPin: string;
}

export interface CateringConfig {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imagePosition?: string;
  imageZoom?: number;
  highlights: string[];
  packages: CateringPackage[];
  ctaText: string;
}

export interface WholesaleConfig {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imagePosition?: string;
  imageZoom?: number;
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
