
export interface BannerAd {
  id: string;
  imageUrl: string;
  companyName: string;
  description: string;
}

export interface ClassifiedAd {
  id: string;
  title: string;
  price: string;
  category: string;
  imageUrl: string;
  location: string;
  aiHighlight?: string;
}

export enum DisplayMode {
  SPLIT = 'SPLIT',
  FULL_BANNER = 'FULL_BANNER',
  FULL_CLASSIFIED = 'FULL_CLASSIFIED'
}

export interface AppState {
  banners: BannerAd[];
  classifieds: ClassifiedAd[];
  isLoading: boolean;
  currentDisplayIndex: number;
}
