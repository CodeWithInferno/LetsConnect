import React from 'react';
import { Globe } from "@/components/ui/globe";
import Image from "next/image"; // Ensure you're using Next.js

// Default Glassmorphic Card Component
const GlassmorphicCard = () => {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)] dark:bg-[#0f0f0f] dark:border dark:border-[rgba(255,255,255,0.1)] dark:shadow-[0_-20px_80px_-20px_#ffffff1f_inset] p-6">
      {/* Card Icon */}
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        className="h-12 w-12 mb-1 origin-left transform transition-all duration-300 ease-in-out group-hover:scale-75 group-hover:text-[var(--color-one)] text-neutral-700"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7.5 0C7.77614 0 8 0.223858 8 0.5V1.80687C10.6922 2.0935 12.8167 4.28012 13.0068 7H14.5C14.7761 7 15 7.22386 15 7.5C15 7.77614 14.7761 8 14.5 8H12.9888C12.7094 10.6244 10.6244 12.7094 8 12.9888V14.5C8 14.7761 7.77614 15 7.5 15C7.22386 15 7 14.7761 7 14.5V13.0068C4.28012 12.8167 2.0935 10.6922 1.80687 8H0.5C0.223858 8 0 7.77614 0 7.5C0 7.22386 0.223858 7 0.5 7H1.78886C1.98376 4.21166 4.21166 1.98376 7 1.78886V0.5C7 0.223858 7.22386 0 7.5 0Z" />
      </svg>
      {/* Card Content */}
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
        Card Title
      </h3>
      <p className="max-w-lg text-neutral-500 dark:text-neutral-400">
        Card description placeholder text.
      </p>
    </div>
  );
};

// Enhanced Globe Card Component with text aligned bottom-left
const GlobeCard = () => {
  return (
    <div className="group relative col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-xl bg-[#090909] shadow-lg dark:bg-[#0f0f0f] dark:border dark:border-[rgba(255,255,255,0.1)] p-8 min-h-[400px]">
      
      {/* Globe Background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
        <Globe 
          className="absolute -top-32 right-[-20%] w-[140%] h-[140%] opacity-60 transition-opacity duration-300 dark:opacity-40" 
        />
      </div>

      {/* Content - Moved to Bottom Left */}
      <div className="relative z-10 flex flex-col gap-4 mt-auto">
        <div className="flex items-center gap-3">
          <svg
            className="w-10 h-10 text-purple-400 group-hover:scale-95 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.5 12a7.5 7.5 0 0115 0m-15 0a7.5 7.5 0 1015 0M4.5 12a7.5 7.5 0 0115 0m-15 0a7.5 7.5 0 1015 0"
            />
          </svg>
          <h3 className="text-2xl font-semibold text-white">
            Production Observability
          </h3>
        </div>
        <p className="text-gray-400 text-lg max-w-[80%]">
          Collect production application data (errors, performance) and see it in your IDE.
        </p>
      </div>
    </div>
  );
};

// Calendar Card Component with Glassmorphic Effect
const CalendarCard = () => {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-[rgba(255,255,255,0.1)] backdrop-blur-lg shadow-lg border border-[rgba(255,255,255,0.2)] dark:border-[rgba(255,255,255,0.1)] p-6 min-h-[350px]">
      {/* Background Image */}
      <Image
        src="/Calendar.png"
        alt="Calendar Component"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 w-full h-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold text-white">Seamless Scheduling</h3>
        <p className="text-gray-300 text-lg">
          Stay organized with intuitive calendar integration for effortless project planning.
        </p>
      </div>
    </div>
  );
};

// CardGrid Component with correct layout
const CardGrid = () => {
  return (
    <div className="relative flex min-w-full max-w-screen-xl flex-col gap-8 px-6 py-28 bg-gradient-to-b from-[#151515] to-[#090909]">
      {/* Header */}
      <div className="relative z-10 mx-auto max-w-5xl text-center flex flex-col lg:flex-row items-center lg:items-end gap-3">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          What's in Million?
        </h2>
        <p className="text-xl leading-8 text-gray-400">
          Everything you need to optimize your React website.
        </p>
      </div>
      
      {/* Grid of Cards */}
      <div className="relative z-10 grid w-full grid-cols-3 gap-6 mt-5">
        <GlassmorphicCard />
        <GlassmorphicCard />
        <CalendarCard /> {/* New Calendar Card */}
        <GlobeCard />
        <GlassmorphicCard />

      </div>
    </div>
  );
};

export default CardGrid;
