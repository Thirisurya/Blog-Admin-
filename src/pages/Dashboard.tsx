import { FileText, Eye, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogs } from '@/hooks/useBlogs';
import { CATEGORIES } from '@/lib/types';
import { cn } from '@/lib/utils';

export const Dashboard = () => {
  const { allBlogs, deletedBlogs } = useBlogs();

  const totalBlogs = allBlogs.length;
  const publishedBlogs = allBlogs.filter((b) => b.status === 'published').length;
  const draftBlogs = allBlogs.filter((b) => b.status === 'draft').length;
  const trashedBlogs = deletedBlogs.length;

  const stats = [
    { label: 'Total Blogs', value: totalBlogs, icon: FileText, color: 'bg-primary/10 text-primary' },
    { label: 'Published', value: publishedBlogs, icon: Eye, color: 'bg-success/10 text-success' },
    { label: 'Drafts', value: draftBlogs, icon: Edit2, color: 'bg-warning/10 text-warning' },
    { label: 'Trashed', value: trashedBlogs, icon: Trash2, color: 'bg-destructive/10 text-destructive' },
  ];

  const categoryStats = CATEGORIES.map((category) => ({
    name: category,
    count: allBlogs.filter((b) => b.category === category).length,
  })).sort((a, b) => b.count - a.count);

  const recentBlogs = allBlogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your blog management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-5 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-card-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Blogs */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-card-foreground">Recent Blogs</h2>
            <Link
              to="/blogs"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentBlogs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No blogs yet. Create your first blog!
              </div>
            ) : (
              recentBlogs.map((blog) => (
                <div key={blog.id} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-card-foreground line-clamp-1">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {blog.author} • {blog.category}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium',
                      blog.status === 'published'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {blog.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-card rounded-xl border border-border shadow-card">
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold text-card-foreground">Categories</h2>
          </div>
          <div className="p-4 space-y-3">
            {categoryStats.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">{category.name}</span>
                <span className="text-sm text-muted-foreground">{category.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <h2 className="font-semibold text-card-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/blogs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            <Edit2 className="w-4 h-4" />
            Create New Blog
          </Link>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm"
          >
            <FileText className="w-4 h-4" />
            Manage Blogs
          </Link>
          <Link
            to="/trash"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm"
          >
            <Trash2 className="w-4 h-4" />
            View Trash
          </Link>
        </div>
      </div>
    </div>
  );
};
