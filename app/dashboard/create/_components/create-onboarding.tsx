"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CategorySelector } from "./category-selector";
import { CreateForm } from "./create-form";
export type Category = {
  id: string;
  title: string;
  icon: string;
};

const categories: Category[] = [
  {
    id: "exam",
    title: "Exam",
    icon: "👨‍🎓",
  },
  {
    id: "interview",
    title: "Job Interview",
    icon: "💼",
  },
  {
    id: "practice",
    title: "Practice",
    icon: "📝",
  },
  {
    id: "coding",
    title: "Coding Prep",
    icon: "👨‍💻",
  },
  {
    id: "other",
    title: "Other",
    icon: "📚",
  },
];

export function CreateOnboarding() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStep(2);
  };

  return (
    <div className="mt-8">
      {step === 1 && (
        <CategorySelector
          categories={categories}
          onSelect={handleCategorySelect}
        />
      )}

      {step === 2 && selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CreateForm category={selectedCategory} onBack={() => setStep(1)} />
        </motion.div>
      )}
    </div>
  );
}
