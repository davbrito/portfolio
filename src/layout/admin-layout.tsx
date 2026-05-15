import { AdminHeader } from "@/components/admin/admin-header";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <AdminHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-8">{children}</main>
    </>
  );
}