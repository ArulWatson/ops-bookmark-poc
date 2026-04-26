'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BookmarkInputProps {
  onAdd: (url: string) => void;
}

export default function BookmarkInput({ onAdd }: BookmarkInputProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    onAdd(url);
    setUrl('');
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Enter URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !url.trim()}>
          {isLoading ? 'Adding...' : 'Add Bookmark'}
        </Button>
      </div>
    </form>
  );
}
