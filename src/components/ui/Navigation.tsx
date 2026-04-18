"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, TreePine, Utensils, Gamepad2 } from "lucide-react";

const navItems = [
  { name: "Ruang Tamu", path: "/", icon: Home },
  { name: "Taman", path: "/garden", icon: TreePine },
  { name: "Dapur", path: "/kitchen", icon: Utensils },
  { name: "Main", path: "/playroom", icon: Gamepad2 },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-auto max-w-lg">
      <div className="sketch-border bg-white/90 backdrop-blur-md px-4 md:px-6 py-3 flex gap-2 md:gap-6 justify-between md:justify-center items-center shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive
                  ? "text-[var(--color-sketch-black)] scale-110"
                  : "text-gray-400 hover:text-gray-600 hover:scale-105"
              )}
            >
              <Icon
                size={24}
                className={cn(isActive && "fill-[var(--color-watercolor-blue)] opacity-50")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-sm font-bold tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
