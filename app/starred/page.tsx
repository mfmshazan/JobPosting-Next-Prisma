import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function StarredJobsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  // Get starred jobs using raw SQL
  const starredJobs = await prisma.$queryRaw<
    Array<{
      id: string;
      userId: string;
      jobId: string;
      starredAt: Date;
      jobTitle: string;
      jobCompany: string;
      jobLocation: string;
      jobType: string;
      jobSalary: string | null;
      jobPostedAt: Date;
      applicationCount: bigint;
    }>
  >`
    SELECT 
      sj.id,
      sj."userId",
      sj."jobId",
      sj."starredAt",
      j.title as "jobTitle",
      j.company as "jobCompany",
      j.location as "jobLocation",
      j.type as "jobType",
      j.salary as "jobSalary",
      j."postedAt" as "jobPostedAt",
      COALESCE(COUNT(a.id), 0) as "applicationCount"
    FROM "StarredJob" sj
    INNER JOIN "Job" j ON sj."jobId" = j.id
    LEFT JOIN "Application" a ON j.id = a."jobId"
    WHERE sj."userId" = ${user.id}
    GROUP BY sj.id, sj."userId", sj."jobId", sj."starredAt", 
             j.title, j.company, j.location, j.type, j.salary, j."postedAt"
    ORDER BY sj."starredAt" DESC
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Starred Jobs</h1>
          <p className="text-gray-600">
            {starredJobs.length} {starredJobs.length === 1 ? "job" : "jobs"} saved
          </p>
        </div>

        {starredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <svg
              className="w-20 h-20 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No starred jobs yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start saving jobs you're interested in!
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#6C5DD3] hover:bg-[#5B4BC2] text-white rounded-lg transition-all duration-200"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {starredJobs.map((starred) => (
              <Link
                key={starred.id}
                href={`/jobs/${starred.jobId}`}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#6C5DD3]/30 group"
              >
                {/* Company Logo */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6C5DD3] to-[#8B7FE8] flex items-center justify-center text-white font-bold text-lg">
                    {starred.jobCompany[0]}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Saved {formatDistanceToNow(new Date(starred.starredAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Job Info */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#6C5DD3] transition-colors">
                  {starred.jobTitle}
                </h3>
                <p className="text-gray-600 font-medium mb-4">{starred.jobCompany}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-[#6C5DD3]">
                    {starred.jobType}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    📍 {starred.jobLocation}
                  </span>
                </div>

                {starred.jobSalary && (
                  <p className="text-sm font-semibold text-gray-900 mb-4">
                    {starred.jobSalary}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Posted {formatDistanceToNow(new Date(starred.jobPostedAt), { addSuffix: true })}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Number(starred.applicationCount)} applicants
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
