'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ThemeToggle } from '@/components/ThemeToggle';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { user } = useUser();

  return (
    <>
    <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      
      <div className="text-center mt-10">
        {user ? (
          <>
            <p className="text-2xl font-semibold">
              Welcome, <span className="dark:text-blue-400 text-blue-600">{user.name}</span>
            </p>
            <a href="/dashboard" className="text-blue-500 dark:text-blue-400 underline mt-4 block">
              Go to Dashboard
            </a>
            <a href="/api/auth/logout" className="text-red-500 dark:text-red-400 underline mt-4 block">
              Logout
            </a>
          </>
        ) : (
          <a
            href="/api/auth/login?returnTo=/dashboard"
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white dark:text-gray-900 rounded-lg shadow-lg transition-all hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Login
          </a>
        )}
      </div>

      <div className="mt-10">
        <ThemeToggle />
      </div>
    </div>
    </>
  );
}
