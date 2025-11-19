import { auth } from "@/auth"
import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request,
    { params }: { params: { id: string } }
) {

    const session = await auth()

    if (!session?.user || !session.user.id) {
        return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    try {
        const { id } = await params;
        const job = await prisma.job.findUnique({
            where: { id }
        })

        if(!job){
            return new NextResponse("Job not found", { status: 404 })
        }

        const existingApplication = await prisma.application.findFirst({
            where: {
                jobId: job.id,
                userId: session.user.id
            }
        })
        if(existingApplication){
            return new NextResponse("You have already applied for this job", { status: 400 })
        }

        const application = await prisma.application.create({
            data: {
                jobId: job.id,
                userId: session.user.id,
                status: "PENDING"
            },
        });

        return NextResponse.json(application)
    }
    catch (error) {
        return new NextResponse("Internal server error", { status: 500 })
    }
}

export async function GET(request: Request) {

    try {
        const jobs = await prisma.job.findMany({
            orderBy: {
                postedAt: "desc"
            }
        })
        return NextResponse.json(jobs)
    }
    catch (error) {
        console.log("Error in creating job", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}
