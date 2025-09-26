import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-12 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-red-100 p-4">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
      </div>
      
      <h3 className="mb-2 text-lg font-semibold text-red-900">
        Oops! Something went wrong
      </h3>
      
      <p className="mb-6 max-w-md text-sm text-red-700">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          className="border-red-300 bg-white text-red-700 hover:bg-red-50"
        >
          <ApperIcon name="RefreshCw" className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;