import React from 'react';
import { Particles } from '@/components/ui/particles';
import { LineShadowText } from '@/components/ui/line-shadow-text';
import { BorderBeam } from '@/components/ui/border-beam';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-[#090909] to-[#151515] px-6">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0 z-0 opacity-40"
        quantity={150}
        ease={100}
        color="#ffffff"
        refresh
      />

      {/* Content Section - Centered */}
      <div className="relative z-10 text-center max-w-5xl mx-auto flex-1 flex items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="py-16"
        >
          <p className="bg-[#2a2a2a] text-xs md:text-sm text-gray-300 px-4 py-2 rounded-full inline-block mb-4">
            ✨ Introducing Magic UI Template →
          </p>

          <LineShadowText className="text-4xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
            Magic UI is the new way
          </LineShadowText>
          <h1 className="text-3xl md:text-6xl font-light text-gray-300 mb-6 italic">
            to build landing pages.
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Beautifully designed, animated components and templates built with Tailwind CSS, React, and Framer Motion.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white hover:bg-gray-200 text-black font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md"
          >
            Get Started for Free →
          </motion.button>
        </motion.div>
      </div>
    
      {/* Image Section - Positioned at bottom with partial visibility */}
      <div className="relative w-full max-w-4xl mx-auto h-[70vh] min-h-[400px]">
        <BorderBeam size={250} duration={12} delay={9} />
        <div className="absolute bottom-0 left-0 w-full h-full rounded-lg overflow-hidden">
          <Image
            src="/images/Banner.png"
            alt="Magic UI Preview"
            fill
            className="object-cover object-top"
           
          />
        </div>
      </div>
    </section>
  );
}