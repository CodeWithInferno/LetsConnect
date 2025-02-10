"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Contribute({ className = "" }) {
  return (
    <motion.section
      id="contribute"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`py-24 sm:py-32 bg-gradient-to-b from-[#0d0d0d] to-[#151515] text-white ${className}`}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
          Contribute to Let's Connect
        </h2>
        <p className="mb-8 text-lg">
          Help us build a platform where project managers and contributors come together to achieve amazing results. Your support keeps us growing and improving.
        </p>
        <Button
          variant="default"
          className="px-8 py-4 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700"
          asChild
        >
          <a href="https://www.patreon.com/" target="_blank" rel="noopener noreferrer">
            Support on Patreon
          </a>
        </Button>
      </div>
    </motion.section>
  );
}
