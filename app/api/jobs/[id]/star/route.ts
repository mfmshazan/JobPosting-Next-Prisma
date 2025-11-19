import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const jobId = params.id;

    // Check if already starred using raw SQL
    const existingStarred = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "StarredJob" 
      WHERE "userId" = ${user.id} AND "jobId" = ${jobId}
    `;

    if (existingStarred.length > 0) {
      // Unstar the job
      await prisma.$executeRaw`
        DELETE FROM "StarredJob" 
        WHERE "userId" = ${user.id} AND "jobId" = ${jobId}
      `;

      return NextResponse.json({ starred: false });
    } else {
      // Star the job
      await prisma.$executeRaw`
        INSERT INTO "StarredJob" ("id", "userId", "jobId", "starredAt")
        VALUES (gen_random_uuid(), ${user.id}, ${jobId}, NOW())
      `;

      return NextResponse.json({ starred: true });
    }
  } catch (error) {
    console.error("Error starring job:", error);
    return NextResponse.json(
      { error: "Failed to star job" },
      { status: 500 }
    );
  }
}
