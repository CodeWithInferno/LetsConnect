"use client";

import Image from "next/image";
import { TextReveal } from "@/components/magicui/text-reveal";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedBeamMultipleOutputDemo } from "./animatedBeam"; // Beam component for index 1
import MoleculeNetwork from "./molecule-network"; // For "Expand Your Network"
import SkillCollage from "./SkillCollage"; // For "Showcase Your Expertise"
import Kanban from "./Kanban"; // For "Stay Organized & Efficient"
import BullseyeTarget from "./BullseyeTarget"; // For "Get Noticed by Industry Leaders"

const features = [
  {
    title: "Find the Right People Instantly",
    description:
      "AI-powered matching connects you with the best collaborators based on your skills and interests.",
    image: "/card.png",
  },
  {
    title: "Work on Meaningful Projects",
    description:
      "Join projects that align with your passion and contribute effectively to something impactful.",
    image: "/images/projects.svg", // Not used here
  },
  {
    title: "Expand Your Network",
    description:
      "Meet like-minded professionals, freelancers, and entrepreneurs who share your vision.",
    image: "/images/networking.svg", // Replaced by MoleculeNetwork
  },
  {
    title: "Showcase Your Expertise",
    description:
      "Build your profile, highlight your skills, and make a name for yourself in your industry.",
    image: "/images/profile.svg", // Replaced by SkillCollage
  },
  {
    title: "Stay Organized & Efficient",
    description:
      "Manage tasks, track progress, and communicate seamlessly—all within one platform.",
    image: "/images/organization.svg", // Replaced by Kanban board
  },
  {
    title: "Get Noticed by Industry Leaders",
    description:
      "Stand out from the crowd and unlock opportunities you wouldn't find anywhere else.",
    image: "/images/opportunities.svg", // Replaced by BullseyeTarget
  },
];

export function FeatureList() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Common interactive card styling with transparency.
  const interactiveCardClass =
    "w-full h-[400px] rounded-xl shadow-lg bg-white/20 dark:bg-transparent";

  return (
    <div>
      {/* Feature List Section */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Why Use Let's Connect?
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Unlock Opportunities. Build Your Network.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Whether you're a project manager or a contributor, Let's Connect helps you find the right people, work on impactful projects, and grow your career.
            </p>
          </div>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ rotateY: index % 2 === 0 ? -10 : 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mb-32 group perspective"
            >
              <div
                className={`relative flex flex-col lg:flex-row gap-8 items-center transform transition-transform duration-300 ${
                  index % 2 === 0 ? "" : "lg:flex-row-reverse"
                }`}
              >
                <div className="flex-1">
                  <TextReveal text={`${feature.title} ${feature.description}`} />
                </div>
                <motion.div className="flex-1 w-full transform group-hover:rotate-y-6 transition-transform duration-300">
                  {index === 1 ? (
                    <AnimatedBeamMultipleOutputDemo className={interactiveCardClass} />
                  ) : index === 2 ? (
                    <MoleculeNetwork className={interactiveCardClass} />
                  ) : index === 3 ? (
                    <SkillCollage className={interactiveCardClass} />
                  ) : index === 4 ? (
                    <Kanban className={interactiveCardClass} />
                  ) : index === 5 ? (
                    // For "Get Noticed by Industry Leaders," render BullseyeTarget.
                    <BullseyeTarget className={interactiveCardClass} />
                  ) : (
                    <div className={interactiveCardClass}>
                      <Image
                        src={feature.image || "/placeholder.svg"}
                        alt={feature.title}
                        width={600}
                        height={400}
                        className="rounded-xl"
                      />
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
