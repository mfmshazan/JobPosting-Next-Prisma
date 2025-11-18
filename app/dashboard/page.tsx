import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const [applications, postedJobs] = await Promise.all([
        // Applications by the user
        prisma.application.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                job: {
                    include: { postedBy: true }
                }
            },
            orderBy: { appliedAt: "desc" }
        }),

        // Jobs posted by the user 
        prisma.job.findMany({
            where: {
                postedById: session.user.id
            },
            include: {
                _count: {
                    select: { applications: true }
                }
            },
            orderBy: {
                postedAt: "desc"
            }
        })
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Welcome back, {session.user.name || 'User'}!</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border-l-4 border-indigo-500 transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.1s'}}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Posted Jobs</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{postedJobs.length}</p>
                            </div>
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Applications</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {postedJobs.reduce((sum, job) => sum + job._count.applications, 0)}
                                </p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.3s'}}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">My Applications</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{applications.length}</p>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posted Jobs Section */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Posted Jobs</h2>
                        <Link 
                            href="/jobs/post"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Post New Job
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {postedJobs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't posted any jobs yet.</p>
                                <Link 
                                    href="/jobs/post"
                                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Post your first job →
                                </Link>
                            </div>
                        ) : (
                            postedJobs.map((job, index) => (
                                <div 
                                    key={job.id}
                                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-md animate-slide-up"
                                    style={{animationDelay: `${0.5 + index * 0.1}s`}}
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{job.title}</h3>
                                            <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">{job.company}</p>
                                            <div className="flex flex-wrap gap-3 mb-3">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                    📍 {job.location}
                                                </span>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                                    💼 {job.type}
                                                </span>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                                    ⏰ {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-lg mb-3">
                                                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{job._count.applications}</p>
                                                <p className="text-xs text-green-600 dark:text-green-500">Applications</p>
                                            </div>
                                            <Link 
                                                href={`/jobs/${job.id}`}
                                                className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                            >
                                                View Details
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* My Applications Section */}
                {applications.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-slide-up" style={{animationDelay: '0.6s'}}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Applications</h2>
                        <div className="space-y-4">
                            {applications.map((app, index) => (
                                <div 
                                    key={app.id}
                                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-md animate-slide-up"
                                    style={{animationDelay: `${0.7 + index * 0.1}s`}}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{app.job.title}</h3>
                                            <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">{app.job.company}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                                    Status: {app.status}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    Applied {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                        <Link 
                                            href={`/jobs/${app.job.id}`}
                                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                        >
                                            View Job
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
