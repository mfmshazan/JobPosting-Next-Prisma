import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import SearchBar from "@/components/SearchBar";
import StarButton from "@/components/StarButton";

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string; location?: string; type?: string };
}) {
  const session = await auth();
  
  // Get current user if logged in
  let currentUser = null;
  if (session?.user?.email) {
    currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
  }
  
  // Build search query
  const whereClause: any = {};
  
  if (searchParams.search) {
    whereClause.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { company: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }
  
  if (searchParams.location) {
    whereClause.location = { contains: searchParams.location, mode: 'insensitive' };
  }
  
  if (searchParams.type) {
    whereClause.type = searchParams.type;
  }

  // Fetch jobs from database
  const jobs = await prisma.job.findMany({
    where: whereClause,
    orderBy: {
      postedAt: 'desc'
    },
    take: 12,
    include: {
      _count: {
        select: { applications: true }
      }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Hero Section with Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center animate-fade-in mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 animate-slide-up">
            Find Your Dream Job
            <span className="block text-[#6C5DD3] mt-2">Today</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.1s'}}>
            Discover thousands of job opportunities with all the information you need.
          </p>
        </div>

        {/* Search Bar Component */}
        <SearchBar 
          initialSearch={searchParams.search} 
          initialLocation={searchParams.location}
          initialType={searchParams.type}
        />

        {/* Jobs Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {searchParams.search || searchParams.location || searchParams.type 
                  ? 'Search Results' 
                  : 'Latest Job Openings'}
              </h2>
              <p className="text-gray-600 mt-2">
                {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
              </p>
            </div>
            <Link
              href="/jobs"
              className="text-[#6C5DD3] hover:text-[#5B4BC2] font-medium flex items-center gap-2"
            >
              View All Jobs
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#6C5DD3] hover:bg-[#5B4BC2] text-white rounded-lg transition-all duration-200"
              >
                Clear Search
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job: any, index: number) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#6C5DD3]/30 group animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Company Logo */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6C5DD3] to-[#8B7FE8] flex items-center justify-center text-white font-bold text-lg">
                      {job.company[0]}
                    </div>
                    {session && (
                      <StarButton 
                        jobId={job.id} 
                        initialStarred={starredJobIds.includes(job.id)}
                      />
                    )}
                  </div>

                  {/* Job Info */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#6C5DD3] transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 font-medium mb-4">{job.company}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-[#6C5DD3]">
                      {job.type}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      📍 {job.location}
                    </span>
                  </div>

                  {job.salary && (
                    <p className="text-sm font-semibold text-gray-900 mb-4">
                      {job.salary}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                    </span>
                    <span className="text-xs text-gray-500">
                      {job._count.applications} applicants
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl p-12 shadow-xl animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-[#6C5DD3] mb-2">1000+</p>
              <p className="text-gray-600 text-lg">Active Jobs</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-green-600 mb-2">500+</p>
              <p className="text-gray-600 text-lg">Companies</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-purple-600 mb-2">5000+</p>
              <p className="text-gray-600 text-lg">Happy Users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
