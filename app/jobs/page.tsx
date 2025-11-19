import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import StarButton from "@/components/StarButton";

export default async function JobsPage({searchParams,
}:{
    searchParams : Promise<{[key: string] : string | string[] | undefined}>
}) {

    const session = await auth();
    
    // Get current user if logged in
    let currentUser = null;
    if (session?.user?.email) {
        currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
    }

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

    // Get starred job IDs for current user
    let starredJobIds: string[] = [];
    if (currentUser) {
        const starredJobs = await prisma.$queryRaw<Array<{ jobId: string }>>`
            SELECT "jobId" FROM "StarredJob" WHERE "userId" = ${currentUser.id}
        `;
        starredJobIds = starredJobs.map((s: any) => s.jobId);
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Showing {jobs.length} Job Results</h1>
                    <p className="text-gray-600">Explore thousands of job opportunities</p>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input 
                            type="text"
                            name="q"
                            placeholder="Search company, title..."
                            defaultValue={query}
                            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent"
                        />

                        <select 
                            name="type"
                            defaultValue={searchType}
                            className="w-full rounded-lg border border-gray-200 px-4 py-3 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent"
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
                            defaultValue={searchLocation}
                            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent"
                        />

                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#6C5DD3] hover:bg-[#5B4BC2] text-white rounded-lg text-sm font-medium transition-all duration-200"
                        >
                            🔍 Search
                        </button>
                    </form>
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.length === 0 ? (
                        <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
                            <p className="text-gray-500 text-lg">No jobs found</p>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div 
                                key={job.id}
                                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#6C5DD3]/30 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6C5DD3] to-[#8B7FE8] flex items-center justify-center text-white font-bold text-lg">
                                            {job.company.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">{job.company}</p>
                                        </div>
                                    </div>
                                    {session && (
                                        <StarButton 
                                            jobId={job.id} 
                                            initialStarred={starredJobIds.includes(job.id)}
                                        />
                                    )}
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#6C5DD3] transition-colors">
                                    {job.title}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-[#6C5DD3]">
                                        {job.type}
                                    </span>
                                    {job.salary && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                            {job.salary}
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {job.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {job.location}
                                    </div>
                                    <button className="text-[#6C5DD3] hover:text-[#5B4BC2] text-sm font-medium">
                                        Apply →
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