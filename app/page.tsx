'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];
        
        if (token) {
          router.push('/dashboard');
        } else {
          router.push('/signin');
        }
      } catch (error) {
        router.push('/signin');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </main>
  );
}
