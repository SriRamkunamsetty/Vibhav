"use client";

import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import React from "react";

export const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
  },
  float: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  magnetic: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  },
};

export const MotionProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  );
};

export const FadeIn = ({ children, ...props }: HTMLMotionProps<"div">) => (
  <motion.div {...animations.fadeIn} {...props}>
    {children}
  </motion.div>
);

export const Floating = ({ children, ...props }: HTMLMotionProps<"div">) => (
  <motion.div {...animations.float} {...props}>
    {children}
  </motion.div>
);
