"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative group flex flex-col justify-between overflow-hidden rounded-xl bg-[#161616] hover:bg-[#1c1c1c] p-6 sm:p-8 transition-all duration-300 min-h-[320px] hover:scale-[1.02] w-full"
    >
      {/* Background Image */}
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
        <h3 className="text-xl sm:text-2xl text-gray-100 font-medium mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-gray-400 text-sm sm:text-base group-hover:text-gray-300 transition-colors">
          {description}
        </p>
      </div>
      
      <div className="absolute inset-0 rounded-xl border border-gray-800 group-hover:border-gray-700 transition-colors duration-300" />
    </motion.div>
  );
};

export default FeatureCard;
