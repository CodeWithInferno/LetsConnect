import React, { useRef } from "react";
import { Particles } from "@/components/ui/particles";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { AnimatedBeam } from "@/components/animated-beam";
import { motion } from "framer-motion";
import { MarqueeDemo } from "./marquee";
import WaveDivider from "./WaveDivider";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-transparent px-6">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0 z-0 opacity-40"
        quantity={3000}
        ease={100}
        color="#ffffff"
        refresh
      />

      <section className="relative px-4 pt-20 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-float mb-8">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-100/80 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 backdrop-blur-sm">
                ✨ Now in Public Beta
              </span>
            </div>

            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
                Connect. Collaborate. Create.
              </span>
            </h1>

            <p className="mt-8 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              A platform where contributors and project managers unite to build,
              learn, and grow together.
              <span className="text-purple-600 dark:text-purple-400">
                {" "}
                Find projects, gain experience, and showcase your skills.
              </span>
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg hover:shadow-purple-500/30 backdrop-blur-sm">
                Get Started Free
              </button>
              <a
                href="#demo"
                className="group flex items-center gap-2 px-8 py-4 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Watch demo
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Hero Content (e.g., Marquee) */}
      <MarqueeDemo />

      {/* Wave transition divider */}
      <WaveDivider />
    </section>
  );
}
