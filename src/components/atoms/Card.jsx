import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  children, 
  className,
  hover = true,
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      whileHover={hover ? { y: -2, boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)" } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-white rounded-lg shadow-card-rest overflow-hidden transition-shadow duration-200",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = "Card";

export default Card;