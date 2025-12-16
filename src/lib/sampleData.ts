import { Blog, CATEGORIES } from './types';

const generateId = () => Math.random().toString(36).substring(2, 15);

const authors = [
  'Sarah Johnson',
  'Michael Chen',
  'Emily Davis',
  'James Wilson',
  'Amanda Martinez',
];

const sampleBlogData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>[] = [
  {
    title: 'Getting Started with React 19: New Features Explained',
    description: 'Explore the groundbreaking features in React 19, including the new compiler, server components improvements, and enhanced concurrent rendering capabilities that will transform how you build web applications.',
    category: 'Technology',
    author: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    publishDate: '2025-01-15',
    status: 'published',
  },
  {
    title: 'The Ultimate Guide to Remote Work Productivity',
    description: 'Master the art of working from home with proven strategies for maintaining focus, establishing boundaries, and achieving peak productivity in a remote environment.',
    category: 'Lifestyle',
    author: 'Emily Davis',
    image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&q=80',
    publishDate: '2025-01-12',
    status: 'published',
  },
  {
    title: 'Building Scalable APIs with Node.js and TypeScript',
    description: 'Learn best practices for creating robust, type-safe APIs using Node.js and TypeScript. Covers authentication, validation, error handling, and database integration.',
    category: 'Technology',
    author: 'Michael Chen',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
    publishDate: '2025-01-10',
    status: 'published',
  },
  {
    title: 'Top 10 Marketing Strategies for 2025',
    description: 'Discover the most effective marketing strategies to grow your business in 2025. From AI-powered personalization to influencer partnerships and sustainable branding.',
    category: 'Business',
    author: 'Amanda Martinez',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    publishDate: '2025-01-08',
    status: 'published',
  },
  {
    title: 'Mastering Tailwind CSS: Advanced Techniques',
    description: 'Take your Tailwind CSS skills to the next level with advanced configuration, custom plugins, and optimization strategies for production-ready applications.',
    category: 'Technology',
    author: 'James Wilson',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    publishDate: '2025-01-05',
    status: 'published',
  },
  {
    title: 'Healthy Eating Habits for Busy Professionals',
    description: 'Quick and nutritious meal prep ideas, smart snacking strategies, and mindful eating practices designed for professionals with demanding schedules.',
    category: 'Health',
    author: 'Emily Davis',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    publishDate: '2025-01-03',
    status: 'published',
  },
  {
    title: 'Introduction to Machine Learning with Python',
    description: 'A beginner-friendly guide to machine learning concepts, algorithms, and practical implementation using Python and popular libraries like scikit-learn and TensorFlow.',
    category: 'Technology',
    author: 'Michael Chen',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
    publishDate: '2025-01-01',
    status: 'draft',
  },
  {
    title: 'Startup Funding: A Complete Guide for Entrepreneurs',
    description: 'Navigate the world of startup funding from bootstrapping to Series A. Learn about pitch decks, investor relations, valuation strategies, and equity management.',
    category: 'Business',
    author: 'Amanda Martinez',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
    publishDate: '2023-12-28',
    status: 'published',
  },
  {
    title: 'Minimalist Living: Declutter Your Life',
    description: 'Transform your living space and mindset with practical minimalism. Tips for organizing, letting go of excess, and finding joy in simplicity.',
    category: 'Lifestyle',
    author: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80',
    publishDate: '2023-12-25',
    status: 'published',
  },
  {
    title: 'Understanding Microservices Architecture',
    description: 'Deep dive into microservices design patterns, communication protocols, containerization with Docker, and orchestration with Kubernetes for modern applications.',
    category: 'Technology',
    author: 'James Wilson',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    publishDate: '2023-12-22',
    status: 'draft',
  },
  {
    title: 'Mental Health and Mindfulness in the Digital Age',
    description: 'Combat digital overwhelm with practical mindfulness techniques, screen time management, and mental health strategies for our connected world.',
    category: 'Health',
    author: 'Emily Davis',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    publishDate: '2023-12-20',
    status: 'published',
  },
  {
    title: 'E-commerce Trends Shaping the Future of Retail',
    description: 'Explore emerging e-commerce technologies, customer experience innovations, and omnichannel strategies that are reshaping the retail landscape.',
    category: 'Business',
    author: 'Amanda Martinez',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    publishDate: '2023-12-18',
    status: 'published',
  },
  {
    title: 'Travel Photography: Capturing Memorable Moments',
    description: 'Essential tips for travel photography including gear recommendations, composition techniques, lighting tips, and post-processing workflows for stunning results.',
    category: 'Lifestyle',
    author: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&q=80',
    publishDate: '2023-12-15',
    status: 'draft',
  },
];

export const generateSampleBlogs = (): Blog[] => {
  const now = new Date();
  
  return sampleBlogData.map((data, index) => ({
    id: generateId(),
    ...data,
    createdAt: new Date(now.getTime() - index * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - index * 12 * 60 * 60 * 1000).toISOString(),
    deletedAt: null,
  }));
};

export const SAMPLE_DATA_KEY = 'blog_admin_sample_loaded';
