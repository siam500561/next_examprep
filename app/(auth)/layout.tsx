import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="h-dvh grid place-content-center">{children}</div>;
}
