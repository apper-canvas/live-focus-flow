import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found",
  description = "There are no items to display right now.",
  actionText,
  onAction,
  icon = "Inbox",
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 text-center",
        className
      )}
    >
      <div className="mb-6 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
        <ApperIcon name={icon} className="h-12 w-12 text-primary" />
      </div>
      
      <h3 className="mb-3 text-xl font-semibold text-gray-900">
        {title}
      </h3>
      
      <p className="mb-8 max-w-md text-gray-600">
        {description}
      </p>
      
      {actionText && onAction && (
        <Button
          onClick={onAction}
          className="gradient-primary"
        >
          <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
          {actionText}
        </Button>
      )}
      
      {/* Decorative elements */}
      <div className="absolute -z-10 opacity-50">
        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/5 to-secondary/5" />
      </div>
    </motion.div>
  );
};

export default Empty;