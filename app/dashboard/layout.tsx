import { AppSidebar } from "./_components/app-sidebar/app-sidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 h-dvh">
      <AppSidebar />
      {children}
    </div>
  );
}
