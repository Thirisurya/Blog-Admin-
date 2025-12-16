export interface Blog {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  image: string | null;
  publishDate: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface BlogFormData {
  title: string;
  description: string;
  category: string;
  author: string;
  image: string | null;
  publishDate: string;
  status: 'draft' | 'published';
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

export interface FilterState {
  search: string;
  category: string;
  status: string;
}

export const CATEGORIES = [
  'Technology',
  'Business',
  'Design',
  'Marketing',
  'Development',
  'Lifestyle',
] as const;

export const SOFT_DELETE_DAYS = 7;
