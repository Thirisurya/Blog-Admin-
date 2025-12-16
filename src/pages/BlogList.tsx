import { Link } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { useBlogs } from '@/hooks/useBlogs';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogFilters } from '@/components/blog/BlogFilters';
import { Pagination } from '@/components/blog/Pagination';
import { useToast } from '@/hooks/use-toast';

export const BlogList = () => {
  const {
    blogs,
    allBlogs,
    totalPages,
    pagination,
    filters,
    softDeleteBlog,
    setCurrentPage,
    setItemsPerPage,
    updateFilters,
  } = useBlogs();
  
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    softDeleteBlog(id);
    toast({
      title: 'Blog moved to trash',
      description: 'The blog will be permanently deleted after 7 days.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Blogs</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your blog posts
          </p>
        </div>
        <Link
          to="/blogs/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Blog
        </Link>
      </div>

      {/* Filters */}
      <BlogFilters filters={filters} onUpdateFilters={updateFilters} />

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            No blogs found
          </h3>
          <p className="text-muted-foreground mb-6">
            {allBlogs.length === 0
              ? "Get started by creating your first blog post."
              : "Try adjusting your filters to find what you're looking for."}
          </p>
          {allBlogs.length === 0 && (
            <Link
              to="/blogs/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Create Blog
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={totalPages}
            itemsPerPage={pagination.itemsPerPage}
            totalItems={allBlogs.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </>
      )}
    </div>
  );
};
