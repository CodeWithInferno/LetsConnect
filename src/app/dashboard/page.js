'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoading && user) {
      const checkUserProfile = async () => {
        const res = await fetch('/api/user/check-profile');
        const data = await res.json();

        if (data.onboardingNeeded) {
          router.push('/onboarding');
        } else {
          setChecking(false);
        }
      };

      checkUserProfile();
    }
  }, [user, isLoading]);

  if (isLoading || checking) return <p>Loading...</p>;

  return (
    <>
          <Navbar/>
    
    <div className="p-8">

      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <a href="/api/auth/logout" className="block mt-4 text-red-500">
        Logout
      </a>
    </div>
    </>
  );
}
