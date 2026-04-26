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

interface User {
  id: number;
  username: string;
  role: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (!response.ok) {
          router.push('/signin');
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        router.push('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const addBookmark = useCallback(async (url: string) => {
    try {
      new URL(url);
    } catch {
      alert('Invalid URL');
      return;
    }

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ops Bookmark</h1>
            <p className="text-gray-600 mb-2">Add and manage your bookmarks</p>
            {user && (
              <div className="text-sm text-gray-600">
                <p>Logged in as: <span className="font-medium">{user.username}</span></p>
                <p>Role: <span className="font-medium">{user.role}</span></p>
              </div>
            )}
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
          >
            Logout
          </Button>
        </div>
        
        <BookmarkInput onAdd={addBookmark} />
        <BookmarkList bookmarks={bookmarks} />
      </div>
    </main>
  );
}
