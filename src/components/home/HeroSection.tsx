"use client";

import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <span className="pb-4 sm:ml-0.5 text-sm font-medium uppercase text-neutral-500">
        Sustainability & Quality
      </span>
      <h1 className="text-4xl md:text-5xl font-semibold text-black pt-2 max-w-xl">
        Specialty & Commercial Coffee & Tea, Delivered to Your Door
      </h1>
      <p className="text-lg text-neutral-700 mt-4 max-w-2xl">
        Discover sustainably sourced, ethically traded coffee and tea.
        From single-origin beans to artisanal loose leaf, every cup
        tells a story of quality and care.
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="pt-5 flex flex-row gap-4"
      >
        <Link to="#products">
          <Button variant="default" size="sm">
            Shop Now
          </Button>
        </Link>
        <Link to="/cart">
          <Button variant="outline" size="sm">
            View Cart
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
