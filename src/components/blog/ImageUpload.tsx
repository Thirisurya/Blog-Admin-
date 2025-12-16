import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  onValidationError?: (error: string | null) => void;
  disabled?: boolean;
}

const MAX_SIZE_MB = 1;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

export const ImageUpload = ({ value, onChange, onValidationError, disabled = false }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Notify parent of validation errors
  useEffect(() => {
    onValidationError?.(uploadError);
  }, [uploadError, onValidationError]);

  const validateAndUpload = useCallback((file: File): boolean => {
    // Clear previous error
    setUploadError(null);

    // Validate file extension strictly
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

    // Validate MIME type strictly
    const hasValidType = ALLOWED_TYPES.includes(file.type);

    if (!hasValidExtension || !hasValidType) {
      const error = 'Only JPG and PNG images are allowed';
      setUploadError(error);
      // Notify parent immediately so form can block submission synchronously
      onValidationError?.(error);
      // Reset the file input so invalid files aren't left selected
      if (inputRef.current) inputRef.current.value = '';
      return false;
    }

    // Validate size strictly: block files larger than MAX_SIZE_BYTES (> 1MB)
    if (file.size > MAX_SIZE_BYTES) {
      const error = `Image size must be ${MAX_SIZE_MB}MB or less`;
      setUploadError(error);
      onValidationError?.(error);
      if (inputRef.current) inputRef.current.value = '';
      return false;
    }

    // Convert to base64 and set image on success
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;

      // Verify the data URL starts with expected image type
      if (!result.startsWith('data:image/jpeg') && !result.startsWith('data:image/png')) {
        const error = 'Invalid image format detected';
        setUploadError(error);
        onValidationError?.(error);
        if (inputRef.current) inputRef.current.value = '';
        return;
      }

      // Success: clear error, notify parent and set image
      setUploadError(null);
      onValidationError?.(null);
      onChange(result);
    };
    reader.onerror = () => {
      const error = 'Failed to read the image file';
      setUploadError(error);
      onValidationError?.(error);
      if (inputRef.current) inputRef.current.value = '';
    };
    reader.readAsDataURL(file);

    return true;
  }, [onChange, onValidationError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndUpload(file);
    }
  }, [validateAndUpload, disabled]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
    // Reset input to allow re-selecting the same file
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [validateAndUpload]);

  const handleRemove = useCallback(() => {
    onChange(null);
    setUploadError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onChange]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-3 right-3 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { 
            e.preventDefault(); 
            if (!disabled) setIsDragging(true); 
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={handleClick}
          className={cn(
            "relative h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-colors",
            disabled 
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer",
            !disabled && isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-muted/50",
            uploadError && "border-destructive"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            isDragging ? "bg-primary/10" : "bg-muted"
          )}>
            {isDragging ? (
              <Upload className="w-6 h-6 text-primary" />
            ) : (
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {isDragging ? 'Drop your image here' : 'Click or drag to upload'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG or PNG, max {MAX_SIZE_MB}MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {uploadError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
