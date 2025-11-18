import { prisma } from "@/lib/prisma"

export default async function JobsPage({searchParams,
}:{
    searchParams : Promise<{[key: string] : string | string[] | undefined}>
}) {

    const {q, type, location} = await searchParams;
    const query = q as string | undefined
    const searchType = type as string | undefined
    const searchLocation = location as string | undefined
    const jobs = await prisma.job.findMany({

        where:{
            AND:[
                query? {
                    OR:[
                    {title: {contains:query, mode: "insensitive"}},
                    {company: {contains:query, mode: "insensitive"}},
                    {description: {contains:query, mode: "insensitive"}},
                ]
                }
                :{},

                type? {type: searchType}: {},
                searchLocation ? {location: {contains: searchLocation, mode:"insensitive"}} : {}
            ],
        },
        include: {
            postedBy: {
                select: {
                    name: true,
                }
            }
        },
        orderBy: {
            postedAt: 'desc'
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Search Section */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Find Your Next Job</h1>
                    <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input 
                            type="text"
                            name="q"
                            placeholder="Job title or keyword"
                            className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-4 py-2 bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <select 
                            name="type" 
                            className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>

                        <input 
                            type="text"
                            name="location"
                            placeholder="Location"
                            className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-4 py-2 bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                    {jobs.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No jobs posted yet</p>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div 
                                key={job.id}
                                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start gap-6">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            {job.title}
                                        </h2>
                                        <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                                            {job.company}
                                        </p>
                                        <div className="flex flex-wrap gap-3 mb-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                                📍 {job.location}
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                                💼 {job.type}
                                            </span>
                                            {job.salary && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                                    💰 {job.salary}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                                            {job.description}
                                        </p>

                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            Posted by {job.postedBy?.name || 'Anonymous'} • {new Date(job.postedAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors whitespace-nowrap">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}