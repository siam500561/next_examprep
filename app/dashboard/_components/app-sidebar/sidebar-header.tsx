import Image from "next/image";

export function AppSidebarHeader() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/globe.svg" alt="ExamPrep Logo" width={20} height={20} />
      <span className="font-semibold">ExamPrep</span>
    </div>
  );
}
