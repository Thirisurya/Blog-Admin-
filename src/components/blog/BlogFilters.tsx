import { Search, Filter, X } from 'lucide-react';
import { FilterState, CATEGORIES } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BlogFiltersProps {
  filters: FilterState;
  onUpdateFilters: (filters: Partial<FilterState>) => void;
}

export const BlogFilters = ({ filters, onUpdateFilters }: BlogFiltersProps) => {
  const hasActiveFilters = filters.search || filters.category || filters.status;

  const clearFilters = () => {
    onUpdateFilters({ search: '', category: '', status: '' });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-medium text-card-foreground">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title or author..."
            value={filters.search}
            onChange={(e) => onUpdateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Category */}
        <Select
          value={filters.category}
          onValueChange={(value) => onUpdateFilters({ category: value === 'all' ? '' : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(value) => onUpdateFilters({ status: value === 'all' ? '' : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
