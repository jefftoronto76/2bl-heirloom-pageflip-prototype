export type PageType = 'text' | 'photo' | 'mixed';
export type LayoutMode = 'flip' | 'slide';
export type PageFormat = 'book' | 'landscape';

export interface Page {
  pageNumber: number;
  type: PageType;
  content: string;
  imageUrl?: string;
  caption?: string;
}
