'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import BookmarkInput from '@/components/BookmarkInput';
import BookmarkList from '@/components/BookmarkList';

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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/signin');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      router.push('/signin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/signin');
  };

  const addBookmark = async (url: string) => {
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
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <p>Loading...</p>
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
            <p className="text-gray-600 mb-4">Add and manage your bookmarks</p>
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
