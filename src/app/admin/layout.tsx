"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { GlassCard } from "@/components/ui/GlassCard";
import { LayoutDashboard, ShoppingCart, Users, Package, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <aside className="w-64 border-r border-glass-border bg-card/50 backdrop-blur-xl p-6 hidden md:block">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-8 w-8 rounded-lg premium-gradient" />
            <span className="font-bold text-xl tracking-tight">Vidhav<span className="text-primary italic">Admin</span></span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "group-hover:text-white")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-auto w-full">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {navItems.find(i => i.href === pathname)?.name || "Admin"}
              </h1>
              <p className="text-zinc-400 text-sm mt-1">Manage your platform ecosystem.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <GlassCard className="py-2 px-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-primary/40">
                  AD
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight">Admin User</p>
                  <p className="text-[10px] text-zinc-500">Principal Architect</p>
                </div>
              </GlassCard>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
