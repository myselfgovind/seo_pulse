export interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url?: string;
  tags: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface FeedState {
  items: NewsItem[];
  groundingSources: GroundingSource[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

export enum SEOSource {
  GOOGLE = 'Google Search Central',
  SEMRUSH = 'Semrush Blog',
  AHREFS = 'Ahrefs Blog',
  MOZ = 'Moz Blog',
  SEJ = 'Search Engine Journal',
  SEL = 'Search Engine Land'
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fullMark: number;
}