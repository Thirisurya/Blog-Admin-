import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { Blog, BlogFormData, CATEGORIES } from '@/lib/types';
import { useFormChange } from '@/hooks/useFormChange';
import { ImageUpload } from './ImageUpload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface BlogFormProps {
  blog?: Blog;
  onSubmit: (data: BlogFormData) => void;
  isEditing?: boolean;
}

interface ValidationErrors {
  title?: string;
  description?: string;
  category?: string;
  author?: string;
  publishDate?: string;
  status?: string;
  image?: string;
}

const getInitialFormData = (blog?: Blog): BlogFormData => ({
  title: blog?.title || '',
  description: blog?.description || '',
  category: blog?.category || '',
  author: blog?.author || '',
  image: blog?.image || null,
  publishDate: blog?.publishDate || new Date().toISOString().split('T')[0],
  status: blog?.status || 'draft',
});

export const BlogForm = ({ blog, onSubmit, isEditing = false }: BlogFormProps) => {
  const navigate = useNavigate();
  const initialData = useMemo(() => getInitialFormData(blog), [blog]);
  const { formData, hasChanges, updateField } = useFormChange(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Validate a single field
  const validateField = useCallback((field: keyof ValidationErrors, value: unknown): string | undefined => {
    switch (field) {
      case 'title':
        if (!String(value || '').trim()) return 'Title is required';
        if (String(value).length > 100) return 'Title must be less than 100 characters';
        return undefined;
      case 'description':
        if (!String(value || '').trim()) return 'Description is required';
        if (String(value).length > 500) return 'Description must be less than 500 characters';
        return undefined;
      case 'category':
        if (!value) return 'Category is required';
        return undefined;
      case 'author':
        if (!String(value || '').trim()) return 'Author is required';
        if (String(value).length > 50) return 'Author must be less than 50 characters';
        return undefined;
      case 'publishDate':
        if (!value) return 'Publish date is required';
        return undefined;
      case 'status':
        if (!value || !['draft', 'published'].includes(String(value))) return 'Status is required';
        return undefined;
      case 'image':
        // Image is required: if missing, return required error; otherwise show upload validation error (if any)
        if (!value) return 'Featured image is required';
        return imageError || undefined;
      default:
        return undefined;
    }
  }, [imageError]);

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    newErrors.title = validateField('title', formData.title);
    newErrors.description = validateField('description', formData.description);
    newErrors.category = validateField('category', formData.category);
    newErrors.author = validateField('author', formData.author);
    newErrors.publishDate = validateField('publishDate', formData.publishDate);
    newErrors.status = validateField('status', formData.status);
    
    // Include image error if exists
    if (imageError) {
      newErrors.image = imageError;
    }

    // Filter out undefined values
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, v]) => v !== undefined)
    ) as ValidationErrors;

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  }, [formData, imageError, validateField]);

  // Validate on field change when touched
  const validateTouchedField = useCallback((field: keyof ValidationErrors) => {
    const error = validateField(field, formData[field as keyof BlogFormData]);
    setErrors(prev => {
      if (error) {
        return { ...prev, [field]: error };
      }
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, [formData, validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;

    // Mark all fields as touched
    const allFields = new Set(['title', 'description', 'category', 'author', 'publishDate', 'status']);
    setTouched(allFields);
    
    // Validate all fields including image
    if (!validateAll()) {
      return;
    }

    // Prevent submission if there's an image validation error
    if (imageError) {
      setErrors(prev => ({ ...prev, image: imageError }));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate async operation (in case onSubmit is async)
      await Promise.resolve(onSubmit(formData));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field: keyof ValidationErrors) => {
    setTouched(prev => new Set([...prev, field]));
    validateTouchedField(field);
  };

  const handleFieldChange = <K extends keyof BlogFormData>(field: K, value: BlogFormData[K]) => {
    updateField(field, value);
    
    // Clear error for this field when user starts typing (if touched)
    if (touched.has(field)) {
      // Delay validation to use updated value
      setTimeout(() => validateTouchedField(field as keyof ValidationErrors), 0);
    }
  };

  const handleImageChange = (value: string | null) => {
    updateField('image', value);
    // Clear image error when a valid image is uploaded
    if (value) {
      setImageError(null);
      setErrors(prev => {
        const { image: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleImageError = (error: string | null) => {
    setImageError(error);
    if (error) {
      setErrors(prev => ({ ...prev, image: error }));
    } else {
      setErrors(prev => {
        const { image: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const getFieldError = (field: keyof ValidationErrors) => {
    return touched.has(field) ? errors[field] : undefined;
  };

  // Disable save if:
  // - Editing mode and no changes made
  // - Currently submitting
  // - Has image validation error
  const canSave = (isEditing ? hasChanges : true) && !isSubmitting && !imageError && Boolean(formData.image);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Blogs</span>
        </button>
        <Button
          type="submit"
          disabled={!canSave}
          className={cn(
            "flex items-center gap-2",
            !canSave && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditing ? 'Save Changes' : 'Create Blog'}
            </>
          )}
        </Button>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <h3 className="font-semibold text-lg text-card-foreground">Blog Details</h3>
            
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                placeholder="Enter blog title"
                disabled={isSubmitting}
                className={cn(getFieldError('title') && "border-destructive")}
              />
              {getFieldError('title') && (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{getFieldError('title')}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                placeholder="Enter blog description"
                rows={5}
                disabled={isSubmitting}
                className={cn(getFieldError('description') && "border-destructive")}
              />
              <div className="flex justify-between">
                {getFieldError('description') ? (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span>{getFieldError('description')}</span>
                  </div>
                ) : (
                  <span />
                )}
                <span className="text-xs text-muted-foreground">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <ImageUpload
                value={formData.image}
                onChange={handleImageChange}
                onValidationError={handleImageError}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <h3 className="font-semibold text-lg text-card-foreground">Publishing</h3>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'published') => handleFieldChange('status', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={cn(getFieldError('status') && "border-destructive")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError('status') && (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{getFieldError('status')}</span>
                </div>
              )}
            </div>

            {/* Publish Date */}
            <div className="space-y-2">
              <Label htmlFor="publishDate">Publish Date *</Label>
              <Input
                id="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={(e) => handleFieldChange('publishDate', e.target.value)}
                onBlur={() => handleBlur('publishDate')}
                disabled={isSubmitting}
                className={cn(getFieldError('publishDate') && "border-destructive")}
              />
              {getFieldError('publishDate') && (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{getFieldError('publishDate')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <h3 className="font-semibold text-lg text-card-foreground">Meta</h3>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleFieldChange('category', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={cn(getFieldError('category') && "border-destructive")}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError('category') && (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{getFieldError('category')}</span>
                </div>
              )}
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleFieldChange('author', e.target.value)}
                onBlur={() => handleBlur('author')}
                placeholder="Enter author name"
                disabled={isSubmitting}
                className={cn(getFieldError('author') && "border-destructive")}
              />
              {getFieldError('author') && (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{getFieldError('author')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
