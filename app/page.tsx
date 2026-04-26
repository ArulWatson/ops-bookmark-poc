'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BookmarkInput from '@/components/BookmarkInput';
import BookmarkList from '@/components/BookmarkList';
import { Button } from '@/components/ui/button';

export interface Bookmark {
  id: string;
  url: string;
  title: string | null;
  status: 'loading' | 'loaded' | 'failed';
}

export default function Home() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('auth');
    if (!auth) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    router.push('/login');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const addBookmark = useCallback(async (url: string) => {
    // Validate URL
    try {
      new URL(url);
    } catch {
      alert('Invalid URL');
      return;
    }

    // Check for duplicates
    if (bookmarks.some((b) => b.url === url)) {
      alert('This URL is already bookmarked');
      return;
    }

    const id = Math.random().toString(36).substring(7);
    const newBookmark: Bookmark = {
      id,
      url,
      title: null,
      status: 'loading',
    };

    setBookmarks((prev) => [newBookmark, ...prev]);

    // Fetch title
    try {
      const response = await fetch('/api/fetch-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch title');
      }

      const data = await response.json();

      setBookmarks((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, title: data.title, status: 'loaded' }
            : b
        )
      );
    } catch (error) {
      setBookmarks((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, status: 'failed' }
            : b
        )
      );
    }
  }, [bookmarks]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ops Bookmark</h1>
            <p className="text-gray-600">Add and manage your bookmarks</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
        
        <BookmarkInput onAdd={addBookmark} />
        <BookmarkList bookmarks={bookmarks} />
      </div>
    </main>
  );
}
