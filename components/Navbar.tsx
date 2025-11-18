"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react";
import { logout } from "@/lib/auth";

export default function Navbar() {

    const { data: session } = useSession();
    return (
        <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="Job Portal"
                            width={40}
                            height={40}
                            className="rounded"
                        />
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            Job Board
                        </span>
                    </Link>

                    <div className="hidden sm:flex items-center gap-8">
                        <Link href="/jobs" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium">
                            Jobs
                        </Link>
                        {session ? (
                            <>
                                <Link href="/jobs/post" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium">
                                    Post Job
                                </Link>
                                <Link href="/dashboard" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium">
                                    Dashboard
                                </Link>

                                <button
                                    onClick={() => logout()}
                                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-md font-medium transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link href="/auth/signin" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-200 font-medium hover:shadow-lg transform hover:scale-105">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}