import {prisma} from "@/lib/prisma"
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function JobPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {

    const jobId = (await params).id

    const job = await prisma.job.findUnique({
        where:{ id:jobId },
        include:{ postedBy:true }
    });

    if(!job){
        notFound()
    }

    return (
        <div>
            <div>
                <div>
                    <Link
                    href={"/jobs"}
                    className="">Back to Jobs
                    </Link>
                    <h1 className="">{job.title}</h1>
                    <p className="">{job.company}</p>
                    <div className="">
                        <span>Posted by {job.postedBy.name}</span>
                        <span className=""></span>
                        <span>
                            {formatDistanceToNow(new Date(job.postedAt), {addSuffix:true})}
                        </span>
                    </div>
                </div>

                <div className="">
                    <h2 className="">Job Description</h2>
                    <div className="">
                        {job.description}
                    </div>
                </div>

                <div className="">
                    <ApplyButton jobId={job.id}/>
                </div>
            </div>
        </div>
    )
}