'use client';

import { Bookmark } from '@/app/page';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Empty } from '@/components/ui/empty';

interface BookmarkListProps {
  bookmarks: Bookmark[];
}

export default function BookmarkList({ bookmarks }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <Empty
        icon="BookmarkIcon"
        title="No bookmarks yet"
        description="Add your first bookmark to get started"
      />
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {bookmark.title || 'Loading...'}
              </p>
              <p className="text-sm text-gray-500 truncate mt-1">
                {bookmark.url}
              </p>
            </div>
            <div className="flex-shrink-0">
              {bookmark.status === 'loading' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading
                </Badge>
              )}
              {bookmark.status === 'loaded' && (
                <Badge variant="outline" className="flex items-center gap-1 text-green-700 border-green-200 bg-green-50">
                  <CheckCircle2 className="w-3 h-3" />
                  Loaded
                </Badge>
              )}
              {bookmark.status === 'failed' && (
                <Badge variant="outline" className="flex items-center gap-1 text-red-700 border-red-200 bg-red-50">
                  <XCircle className="w-3 h-3" />
                  Failed
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
