import { useParams, useNavigate } from 'react-router-dom';
import { useBlogs } from '@/hooks/useBlogs';
import { BlogForm } from '@/components/blog/BlogForm';
import { BlogFormData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBlogById, createBlog, updateBlog } = useBlogs();
  const { toast } = useToast();

  const blog = id ? getBlogById(id) : undefined;
  const isEditing = Boolean(id);

  // If editing but blog not found
  if (isEditing && !blog) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Blog not found</h2>
        <p className="text-muted-foreground mb-6">
          The blog you're looking for doesn't exist or has been deleted.
        </p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  const handleSubmit = (data: BlogFormData) => {
    if (isEditing && id) {
      updateBlog(id, data);
      toast({
        title: 'Blog updated',
        description: '✔ Your changes have been saved successfully.',
      });
    } else {
      createBlog(data);
      toast({
        title: 'Blog created',
        description: '✔ Your new blog post has been created successfully.',
      });
    }
    navigate('/blogs');
  };

  return (
    <div>
      <BlogForm
        blog={blog}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />
    </div>
  );
};
