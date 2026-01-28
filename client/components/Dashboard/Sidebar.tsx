'use client'; // Required for usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    return (
        <aside className="hidden lg:flex w-64 bg-slate-950 border-r border-slate-800 h-screen sticky top-0 flex-col p-8">
            <div className="mb-12">
                <h1 className="text-2xl font-black text-white tracking-tighter">
                    EXPEL<span className="text-emerald-500">AI</span>
                </h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">v3.0 Flash</p>
            </div>

            <nav className="space-y-4 flex-1">
                <NavLink href="/" label="📊 Dashboard" />
                <NavLink href="/scan" label="🔍 AI Scanner" />
                <NavLink href="/history" label="📜 Field History" />
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">System Online</p>
                </div>
            </div>
        </aside>
    );
}

function NavLink({ href, label }: { href: string; label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`block p-4 rounded-2xl font-bold transition-all text-sm border ${isActive
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
                }`}
        >
            {label}
        </Link>
    );
}