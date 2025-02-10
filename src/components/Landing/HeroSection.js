"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useStarfield } from "@/hooks/useStarfield";
import { ArrowRight } from "lucide-react";
import { MarqueeDemo } from "./marquee";
import WaveDivider from "./WaveDivider";
import PurposeCodeComparison from "./PurposeCodeComparison";

export default function HeroSection() {
  // Create a ref for the container that wraps all hero content.
  const containerRef = useRef(null);
  // Pass the container ref to the starfield hook.
  const canvasRef = useStarfield(containerRef);

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center overflow-hidden bg-black px-6 sm:px-8"
    >
      {/* Starfield Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: "black" }}
      />

      {/* Hero Content */}
      <section className="relative z-10 px-4 pt-16 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-float mb-8">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/50">
                ✨ Now in Public Beta
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
                Connect. Collaborate. Create.
              </span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              A platform where contributors and project managers unite to build, learn, and grow together.
              <span className="text-purple-600">
                {" "}
                Find projects, gain experience, and showcase your skills.
              </span>
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:scale-105 transition-transform duration-300 shadow-lg">
                Get Started Free
              </button>
              <a
                href="#demo"
                className="group flex items-center gap-2 px-8 py-4 text-gray-300 hover:text-white transition-colors"
              >
                Watch demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Insert the Code Comparison component between the hero content and marquee */}
        <div className="mt-12">
          <PurposeCodeComparison />
        </div>

        {/* Marquee Section */}
        <div className="mt-12">
          <MarqueeDemo />
        </div>
      </section>

    </section>
  );
}
