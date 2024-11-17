"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Category } from "./create-onboarding";

interface CategorySelectorProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export function CategorySelector({
  categories,
  onSelect,
}: CategorySelectorProps) {
  // Separate the first category from the rest
  const [firstCategory, ...restCategories] = categories;

  return (
    <div className="mt-8 space-y-4">
      {/* First card - full width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <button
          onClick={() => onSelect(firstCategory)}
          className={cn(
            "w-full px-6 py-4 rounded-xl border border-gray-200",
            "hover:border-primary/20 hover:bg-primary/5",
            "transition-all duration-200",
            "flex items-center justify-center gap-3",
            "h-[100px]"
          )}
        >
          <span className="text-3xl">{firstCategory.icon}</span>
          <h3 className="font-medium">{firstCategory.title}</h3>
        </button>
      </motion.div>

      {/* Grid for remaining cards */}
      <div className="grid grid-cols-2 gap-4">
        {restCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
          >
            <button
              onClick={() => onSelect(category)}
              className={cn(
                "w-full px-6 py-4 rounded-xl border border-gray-200",
                "hover:border-primary/20 hover:bg-primary/5",
                "transition-all duration-200",
                "flex items-center justify-center gap-3",
                "h-[100px]"
              )}
            >
              <span className="text-3xl">{category.icon}</span>
              <h3 className="font-medium">{category.title}</h3>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
