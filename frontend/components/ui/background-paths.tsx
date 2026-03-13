"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function BackgroundPaths({ children }: { children?: ReactNode }) {
  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full text-neutral-200 dark:text-neutral-800 opacity-60"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.path
              key={i}
              d={`M-500 ${100 + i * 100} C ${0 + i * 200} ${500 - i * 50}, ${500 - i * 100} ${0 + i * 150}, ${1000 + i * 50} ${500 + i * 100} C ${1500 - i * 100} ${1000 - i * 50}, 2000 ${500}, 2500 ${500 + i * 50}`}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ pathLength: 0, pathOffset: 1 }}
              animate={{ pathLength: 1, pathOffset: 0 }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
