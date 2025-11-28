"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, TrendingUp, Zap, Activity, Lock, ShieldCheck, Search } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import GlobalSearch from "./GlobalSearch";

const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Macro", path: "/?filter=macro", icon: TrendingUp },
    { name: "Infra", path: "/?filter=infra", icon: Zap },
    { name: "Strategy", path: "/?filter=strategy", icon: Activity },
    { name: "Tax/Life", path: "/?filter=life", icon: Lock },
    { name: "Tech", path: "/?filter=tech", icon: ShieldCheck },
];

export default function Sidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get("filter");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <aside className="fixed left-0 top-0 h-full w-16 md:w-20 bg-protoss-bg border-r border-protoss-border flex flex-col items-center py-6 z-50">
                {/* Logo / Brand Icon */}
                <div className="mb-8">
                    <div className="w-8 h-8 rounded bg-protoss-accent-blue/20 flex items-center justify-center border border-protoss-accent-blue/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                        <div className="w-3 h-3 bg-protoss-accent-blue rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Search Trigger */}
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="mb-6 p-2 rounded-lg text-slate-500 hover:text-protoss-accent-blue hover:bg-protoss-card transition-all duration-300 group flex flex-col items-center justify-center gap-1"
                >
                    <Search className="w-6 h-6" />
                    <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">Search</span>
                </button>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-6 w-full px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        // Active logic:
                        // 1. If path is exactly "/" and no filter, Home is active
                        // 2. If path is "/" and filter matches, that item is active
                        // 3. If path starts with /report, no sidebar item is strictly active (or maybe Home?)

                        let isActive = false;
                        if (item.path === "/" && !item.path.includes("filter")) {
                            isActive = pathname === "/" && !currentFilter;
                        } else if (item.path.includes("filter")) {
                            const itemFilter = item.path.split("=")[1];
                            isActive = currentFilter === itemFilter;
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={clsx(
                                    "group flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-300 hover:bg-protoss-card",
                                    isActive ? "text-protoss-accent-blue" : "text-slate-500 hover:text-protoss-text"
                                )}
                            >
                                <Icon className={clsx("w-6 h-6 transition-transform group-hover:scale-110", isActive && "drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]")} />
                                <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity absolute left-16 bg-protoss-card px-2 py-1 rounded border border-protoss-border whitespace-nowrap z-50 pointer-events-none">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto text-[10px] text-slate-600 font-mono rotate-180 writing-vertical-rl">
                    TAERI PAPA ARCHIVE v1.0
                </div>
            </aside>

            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
