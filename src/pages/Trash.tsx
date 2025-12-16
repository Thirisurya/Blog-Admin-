import { Trash2, AlertTriangle } from 'lucide-react';
import { useBlogs } from '@/hooks/useBlogs';
import { DeletedBlogCard } from '@/components/blog/DeletedBlogCard';
import { useToast } from '@/hooks/use-toast';
import { SOFT_DELETE_DAYS } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Trash = () => {
  const { deletedBlogs, restoreBlog, permanentDeleteBlog } = useBlogs();
  const { toast } = useToast();

  const handleRestore = (id: string) => {
    restoreBlog(id);
    toast({
      title: 'Blog restored',
      description: 'The blog has been restored successfully.',
    });
  };

  const handlePermanentDelete = (id: string) => {
    permanentDeleteBlog(id);
    toast({
      title: 'Blog permanently deleted',
      description: 'The blog has been permanently removed.',
      variant: 'destructive',
    });
  };

  const handleEmptyTrash = () => {
    deletedBlogs.forEach((blog) => permanentDeleteBlog(blog.id));
    toast({
      title: 'Trash emptied',
      description: 'All deleted blogs have been permanently removed.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trash</h1>
          <p className="text-muted-foreground mt-1">
            Deleted blogs are permanently removed after {SOFT_DELETE_DAYS} days
          </p>
        </div>
        {deletedBlogs.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium text-sm">
                <Trash2 className="w-4 h-4" />
                Empty Trash
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Empty Trash?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {deletedBlogs.length} blogs in trash. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleEmptyTrash}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground">Auto-deletion enabled</p>
          <p className="text-sm text-muted-foreground mt-1">
            Deleted blogs are automatically and permanently removed after {SOFT_DELETE_DAYS} days.
            Restore them before that time to keep them.
          </p>
        </div>
      </div>

      {/* Deleted Blogs List */}
      {deletedBlogs.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Trash is empty
          </h3>
          <p className="text-muted-foreground">
            Deleted blogs will appear here for {SOFT_DELETE_DAYS} days before being permanently removed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deletedBlogs.map((blog) => (
            <DeletedBlogCard
              key={blog.id}
              blog={blog}
              onRestore={handleRestore}
              onPermanentDelete={handlePermanentDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
