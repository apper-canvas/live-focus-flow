import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Loading = ({ className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            {/* Checkbox skeleton */}
            <div className="mt-1 h-5 w-5 rounded bg-gray-200 shimmer" />
            
            <div className="min-w-0 flex-1 space-y-3">
              {/* Title skeleton */}
              <div className="h-5 w-3/4 rounded bg-gray-200 shimmer" />
              
              {/* Description skeleton */}
              <div className="h-4 w-full rounded bg-gray-200 shimmer" />
              <div className="h-4 w-2/3 rounded bg-gray-200 shimmer" />
              
              {/* Bottom section skeleton */}
              <div className="flex items-center justify-between pt-2">
                <div className="h-6 w-20 rounded-full bg-gray-200 shimmer" />
                <div className="h-4 w-16 rounded bg-gray-200 shimmer" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Loading indicator */}
      <div className="flex justify-center py-8">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.1s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
          <span className="ml-2 text-sm">Loading tasks...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;