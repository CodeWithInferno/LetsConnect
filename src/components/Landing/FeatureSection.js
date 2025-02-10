import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TextReveal } from '@/components/magicui/text-reveal';

const features = [
  {
    title: 'Innovative Collaboration',
    description: 'Transform the way your team works together with our cutting-edge collaboration tools. Experience seamless communication and enhanced productivity like never before.',
    image: '/Calendar.png'
  },
  {
    title: 'Effortless Project Management',
    description: 'Take control of your projects with our intuitive management system. From planning to execution, we make it simple to deliver outstanding results on time.',
    image: '/project-management.jpg'
  },
  {
    title: 'Real-Time Feedback',
    description: 'Get instant insights and feedback to make informed decisions quickly. Our real-time analytics help you stay ahead of the curve and adapt to changes seamlessly.',
    image: '/feedback.jpg'
  },
  {
    title: 'Community-Driven Growth',
    description: 'Join a thriving community of innovators and creators. Share knowledge, learn from others, and grow together in our collaborative ecosystem.',
    image: '/community.jpg'
  },
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const FeatureSections = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#090909] via-[#101010] to-[#151515] text-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        {features.map((feature, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInVariants}
              className={`
                flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} 
                items-center gap-16 mb-40 last:mb-0
              `}
            >
              {/* Image Side */}
              <motion.div 
                className="md:w-1/2 order-2 md:order-none"
                variants={imageVariants}
              >
                <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    layout="fill"
                    objectFit="cover"
                    className="transform transition-all duration-700 hover:scale-110"
                  />
                </div>
              </motion.div>
              
              {/* Text Side */}
              <div className="md:w-1/2 max-w-xl order-1 md:order-none flex flex-col gap-4">
                <TextReveal 
                  text={feature.title} 
                  className="text-5xl font-bold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent" 
                />
                <TextReveal 
                  text={feature.description} 
                  className="text-xl text-gray-300 leading-relaxed" 
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureSections;