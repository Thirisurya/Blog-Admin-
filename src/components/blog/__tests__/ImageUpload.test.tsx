import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ImageUpload } from '../ImageUpload';

const MAX_SIZE_BYTES = 1 * 1024 * 1024;

describe('ImageUpload', () => {
  let originalFileReader: any;

  beforeAll(() => {
    originalFileReader = (global as any).FileReader;
  });

  afterAll(() => {
    (global as any).FileReader = originalFileReader;
  });

  test('blocks files larger than 1MB and calls onValidationError', async () => {
    const onChange = vi.fn();
    const onValidationError = vi.fn();

    const { container } = render(
      <ImageUpload value={null} onChange={onChange} onValidationError={onValidationError} />
    );

    const input = container.querySelector('input[type=file]') as HTMLInputElement;
    // create a large file (>1MB)
    const largeContent = new Uint8Array(MAX_SIZE_BYTES + 10).fill(0);
    const largeFile = new File([largeContent], 'large.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(onValidationError).toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  test('accepts valid PNG and calls onChange with data URL', async () => {
    const onChange = vi.fn();
    const onValidationError = vi.fn();

    // Mock FileReader to return a data URL
    (global as any).FileReader = class {
      onload: any = null;
      onerror: any = null;
      readAsDataURL(_file: any) {
        if (this.onload) {
          this.onload({ target: { result: 'data:image/png;base64,AAA' } });
        }
      }
    } as any;

    const { container } = render(
      <ImageUpload value={null} onChange={onChange} onValidationError={onValidationError} />
    );

    const input = container.querySelector('input[type=file]') as HTMLInputElement;
    const smallFile = new File([new Uint8Array([0, 1, 2])], 'small.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [smallFile] } });

    await waitFor(() => {
      expect(onValidationError).toHaveBeenCalledWith(null);
      expect(onChange).toHaveBeenCalledWith('data:image/png;base64,AAA');
    });
  });
});
