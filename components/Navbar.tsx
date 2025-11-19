"use client"

import Link from "next/link"
import { useSession } from "next-auth/react";
import { logout } from "@/lib/auth";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#5B4BC2] to-[#6C5DD3] text-white shadow-2xl z-50 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-[#6C5DD3] font-bold text-xl">J</span>
                    </div>
                    <span className="text-xl font-bold text-white">
                        Jobio
                    </span>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                <Link 
                    href="/dashboard" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive('/dashboard') 
                            ? 'bg-white/20 text-white shadow-lg' 
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-medium">Dashboard</span>
                </Link>

                <Link 
                    href="/jobs" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive('/jobs') 
                            ? 'bg-white/20 text-white shadow-lg' 
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="font-medium">Search Job</span>
                </Link>

                {session && (
                    <>
                        <Link 
                            href="/jobs/post" 
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive('/jobs/post') 
                                    ? 'bg-white/20 text-white shadow-lg' 
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="font-medium">Applications</span>
                        </Link>

                        <Link 
                            href="/jobs/post" 
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                pathname.includes('/post') 
                                    ? 'bg-white/20 text-white shadow-lg' 
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="font-medium">Message</span>
                        </Link>

                        <Link 
                            href="/starred" 
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive('/starred') 
                                    ? 'bg-white/20 text-white shadow-lg' 
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span className="font-medium">Starred</span>
                        </Link>
                    </>
                )}
            </nav>

            {/* User Profile / Auth */}
            <div className="p-4 border-t border-white/10">
                {session ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="text-white font-semibold">
                                    {session.user?.name?.[0] || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {session.user?.name || 'User'}
                                </p>
                                <p className="text-xs text-white/60 truncate">
                                    {session.user?.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                ) : (
                    <Link 
                        href="/auth/signin" 
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#6C5DD3] rounded-lg hover:bg-white/90 transition-all duration-200 font-medium shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign In</span>
                    </Link>
                )}
            </div>
        </aside>
    );
}