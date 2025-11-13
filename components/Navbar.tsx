import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
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

                    <div className="hidden sm:flex items-center gap-4">
                        <Link href="/jobs" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">
                            Browse Jobs
                        </Link>
                        <Link href="/jobs/post" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">
                            Post Job
                        </Link>
                        <Link href="/dashboard" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">
                            Dashboard
                        </Link>
                                    <Link href="/auth/signin" className="text-sm bg-gray-900 text-white px-3 py-1 rounded-md hover:bg-gray-800 dark:bg-white dark:text-black">
                                        Sign In
                                    </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}