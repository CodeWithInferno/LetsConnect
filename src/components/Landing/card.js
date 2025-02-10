import React from 'react';
import { Globe } from "@/components/ui/globe";
import Image from "next/image";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative group flex flex-col justify-between overflow-hidden rounded-xl bg-[#161616] hover:bg-[#1c1c1c] p-6 sm:p-8 transition-all duration-300 min-h-[320px] hover:scale-[1.02] w-full"
    >
      {/* Calendar Background */}
      <Image
        src="/Calendar.png"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
      />
      
      <div className="relative z-10">
        <div className="mb-4 h-12 w-12 text-gray-400 group-hover:text-gray-300 transition-colors transform group-hover:rotate-6 duration-300">
          {icon}
        </div>
      </div>
      
      <div className="relative z-10 mt-auto">
        <h3 className="text-xl sm:text-2xl text-gray-100 font-medium mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{title}</h3>
        <p className="text-gray-400 text-sm sm:text-base group-hover:text-gray-300 transition-colors">
          {description}
        </p>
      </div>
      
      <div className="absolute inset-0 rounded-xl border border-gray-800 group-hover:border-gray-700 transition-colors duration-300" />
    </motion.div>
  );
};

const GlobeCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative col-span-1 md:col-span-2 flex flex-col justify-between overflow-hidden rounded-xl bg-[#090909] shadow-lg dark:bg-[#0f0f0f] dark:border dark:border-[rgba(255,255,255,0.1)] p-8 lg:p-10 min-h-[400px] hover:scale-[1.01] transition-transform duration-300 w-full"
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
        <Globe 
          className="absolute -top-32 right-[-20%] w-[140%] h-[140%] opacity-60 transition-opacity duration-300 dark:opacity-40 group-hover:opacity-80" 
        />
      </div>

      <div className="relative z-10 flex flex-col gap-4 mt-auto">
        <div className="flex items-center gap-3">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 group-hover:scale-95 transition-transform duration-300"
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
          <h3 className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            Production Observability
          </h3>
        </div>
        <p className="text-gray-400 text-lg sm:text-xl max-w-[90%] sm:max-w-[80%] leading-relaxed">
          Collect production data (errors, performance) and see it in your IDE for real-time insights.
        </p>
      </div>
    </motion.div>
  );
};

const CardGrid = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-transparent to-[#0a0a0a] text-white py-12 sm:py-24 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 sm:gap-3 mb-12 sm:mb-20">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400"
          >
            What's in LetsConnect?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-gray-400 text-base sm:text-xl"
          >
            Everything you need to build amazing open-source projects.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              }
              title="Open-Source Your Vision"
              description="Post your project ideas for free and gather contributors from around the world."
            />

            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              }
              title="Contribute & Grow"
              description="Collaborate on real projects, gain hands-on experience, and build a strong résumé."
            />

            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/>
                  <line x1="16" y1="8" x2="2" y2="22"/>
                </svg>
              }
              title="Seamless Scheduling"
              description="Stay organized with calendar-based task management and milestone tracking."
            />
          </div>

          <GlobeCard />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              }
              title="Community & Networking"
              description="Join a thriving community, get recognized for your contributions, and connect with innovators."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardGrid;
