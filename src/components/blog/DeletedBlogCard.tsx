import { Blog, SOFT_DELETE_DAYS } from '@/lib/types';
import { Undo2, Trash2, Clock } from 'lucide-react';

interface DeletedBlogCardProps {
  blog: Blog;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
}

export const DeletedBlogCard = ({ blog, onRestore, onPermanentDelete }: DeletedBlogCardProps) => {
  const deletedDate = new Date(blog.deletedAt!);
  const now = new Date();
  const daysSinceDeleted = Math.floor(
    (now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = SOFT_DELETE_DAYS - daysSinceDeleted;

  return (
    <div className="bg-card rounded-xl border border-border p-4 opacity-75 hover:opacity-100 transition-opacity">
      <div className="flex items-start gap-4">
        {/* Image */}
        <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
          {blog.image ? (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Clock className="w-8 h-8 opacity-20" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-card-foreground line-clamp-1">
            {blog.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
            {blog.description}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {daysRemaining > 0
                ? `Permanently deleted in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`
                : 'Will be deleted soon'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRestore(blog.id)}
            className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            <Undo2 className="w-4 h-4" />
            Restore
          </button>
          <button
            onClick={() => onPermanentDelete(blog.id)}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
