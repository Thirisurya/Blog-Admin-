import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Blog, BlogFormData, PaginationState, FilterState, SOFT_DELETE_DAYS } from '@/lib/types';
import { generateSampleBlogs, SAMPLE_DATA_KEY } from '@/lib/sampleData';

const STORAGE_KEYS = {
  blogs: 'blog_admin_blogs',
  pagination: 'blog_admin_pagination',
  filters: 'blog_admin_filters',
};

const generateId = () => Math.random().toString(36).substring(2, 15);

const getStoredData = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStoredData = <T,>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getInitialBlogs = (): Blog[] => {
  const stored = getStoredData<Blog[]>(STORAGE_KEYS.blogs, []);
  const sampleLoaded = localStorage.getItem(SAMPLE_DATA_KEY);
  
  if (stored.length === 0 && !sampleLoaded) {
    const sampleBlogs = generateSampleBlogs();
    localStorage.setItem(SAMPLE_DATA_KEY, 'true');
    setStoredData(STORAGE_KEYS.blogs, sampleBlogs);
    return sampleBlogs;
  }
  
  return stored;
};

interface BlogContextType {
  blogs: Blog[];
  allBlogs: Blog[];
  deletedBlogs: Blog[];
  totalPages: number;
  pagination: PaginationState;
  filters: FilterState;
  createBlog: (data: BlogFormData) => Blog;
  updateBlog: (id: string, data: Partial<BlogFormData>) => void;
  softDeleteBlog: (id: string) => void;
  restoreBlog: (id: string) => void;
  permanentDeleteBlog: (id: string) => void;
  getBlogById: (id: string) => Blog | undefined;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>(getInitialBlogs);
  
  const [pagination, setPagination] = useState<PaginationState>(() =>
    getStoredData<PaginationState>(STORAGE_KEYS.pagination, {
      currentPage: 1,
      itemsPerPage: 5,
    })
  );
  
  const [filters, setFilters] = useState<FilterState>(() =>
    getStoredData<FilterState>(STORAGE_KEYS.filters, {
      search: '',
      category: '',
      status: '',
    })
  );

  // Auto-purge soft deleted blogs after SOFT_DELETE_DAYS
  useEffect(() => {
    const now = new Date();
    const purgedBlogs = blogs.filter((blog) => {
      if (!blog.deletedAt) return true;
      const deletedDate = new Date(blog.deletedAt);
      const daysSinceDeleted = Math.floor(
        (now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceDeleted < SOFT_DELETE_DAYS;
    });
    
    if (purgedBlogs.length !== blogs.length) {
      setBlogs(purgedBlogs);
    }
  }, [blogs]);

  // Persist to localStorage
  useEffect(() => {
    setStoredData(STORAGE_KEYS.blogs, blogs);
  }, [blogs]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.pagination, pagination);
  }, [pagination]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.filters, filters);
  }, [filters]);

  // Filter blogs (exclude soft deleted)
  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((blog) => !blog.deletedAt)
      .filter((blog) => {
        const matchesSearch =
          !filters.search ||
          blog.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          blog.author.toLowerCase().includes(filters.search.toLowerCase());
        
        const matchesCategory =
          !filters.category || blog.category === filters.category;
        
        const matchesStatus =
          !filters.status || blog.status === filters.status;
        
        return matchesSearch && matchesCategory && matchesStatus;
      });
  }, [blogs, filters]);

  // Paginated blogs
  const paginatedBlogs = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    return filteredBlogs.slice(startIndex, startIndex + pagination.itemsPerPage);
  }, [filteredBlogs, pagination]);

  const totalPages = Math.ceil(filteredBlogs.length / pagination.itemsPerPage);

  const createBlog = useCallback((data: BlogFormData) => {
    const newBlog: Blog = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    setBlogs((prev) => [newBlog, ...prev]);
    return newBlog;
  }, []);

  const updateBlog = useCallback((id: string, data: Partial<BlogFormData>) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === id
          ? { ...blog, ...data, updatedAt: new Date().toISOString() }
          : blog
      )
    );
  }, []);

  const softDeleteBlog = useCallback((id: string) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === id
          ? { ...blog, deletedAt: new Date().toISOString() }
          : blog
      )
    );
  }, []);

  const restoreBlog = useCallback((id: string) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === id ? { ...blog, deletedAt: null } : blog
      )
    );
  }, []);

  const permanentDeleteBlog = useCallback((id: string) => {
    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
  }, []);

  const getBlogById = useCallback(
    (id: string) => blogs.find((blog) => blog.id === id),
    [blogs]
  );

  const setCurrentPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const setItemsPerPage = useCallback((items: number) => {
    setPagination({ currentPage: 1, itemsPerPage: items });
  }, []);

  const updateFiltersHandler = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  const deletedBlogs = useMemo(
    () => blogs.filter((blog) => blog.deletedAt),
    [blogs]
  );

  const value: BlogContextType = {
    blogs: paginatedBlogs,
    allBlogs: filteredBlogs,
    deletedBlogs,
    totalPages,
    pagination,
    filters,
    createBlog,
    updateBlog,
    softDeleteBlog,
    restoreBlog,
    permanentDeleteBlog,
    getBlogById,
    setCurrentPage,
    setItemsPerPage,
    updateFilters: updateFiltersHandler,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
};
