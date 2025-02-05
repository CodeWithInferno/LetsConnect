'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { ThemeToggle } from '@/components/ThemeToggle';
import Navbar from '@/components/Landing/Navbar';
import HeroSection from '@/components/Landing/HeroSection';

export default function Home() {
  const { user } = useUser();

  return (
    <>
      <Navbar />
      <HeroSection  />
    </>
  );
}
