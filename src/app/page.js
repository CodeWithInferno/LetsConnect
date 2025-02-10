"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import Navbar from "@/components/Landing/Navbar";
import HeroSection from "@/components/Landing/HeroSection";
import CardGrid from "@/components/Landing/card";
import FeatureSections from "@/components/Landing/FeatureSection";

export default function Home() {
  const { user } = useUser();

  return (
    <>
      <div className="bg-gradient-to-b from-[#090909] to-[#151515]">
        <Navbar />
        <HeroSection />
        <CardGrid />
        <FeatureSections />
      </div>
    </>
  );
}
