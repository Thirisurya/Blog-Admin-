import { Blog } from '@/lib/types';
import { Calendar, User, Edit2, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  blog: Blog;
  onDelete: (id: string) => void;
}

export const BlogCard = ({ blog, onDelete }: BlogCardProps) => {
  const formattedDate = new Date(blog.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Eye className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge 
            variant={blog.status === 'published' ? 'default' : 'secondary'}
            className={cn(
              blog.status === 'published' && 'bg-success hover:bg-success/90'
            )}
          >
            {blog.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {blog.category}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-lg text-card-foreground line-clamp-1 mb-2">
          {blog.title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {blog.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <Link
            to={`/blogs/${blog.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={() => onDelete(blog.id)}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
