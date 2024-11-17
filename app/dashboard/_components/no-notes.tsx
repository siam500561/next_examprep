import { Plus } from "lucide-react";
import Link from "next/link";

export default function NoNotes() {
  return (
    <div className="flex-1 rounded-xl flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-primary/[0.03] to-primary/[0.08] group hover:from-primary/[0.05] hover:to-primary/[0.09] transition-all">
      <div className="relative">
        {/* Decorative circles */}
        <div className="absolute -left-12 -top-12 w-24 h-24 rounded-full border border-primary/20 group-hover:scale-110 transition-transform" />
        <div className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full border border-primary/10 group-hover:scale-110 transition-transform" />

        {/* Main content */}
        <div className="relative flex flex-col items-center gap-6 p-8">
          <Link
            href="/dashboard/create"
            className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all"
          >
            <Plus className="h-8 w-8 text-primary/60 group-hover:text-primary/80" />
          </Link>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-primary/80">
              Start Your Learning Journey
            </h3>
            <p className="text-muted-foreground text-sm max-w-[400px]">
              Create your first exam note and begin organizing your study
              materials effectively
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
