"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import Link from "next/link"

export default function ApplyButton({ jobId }: { jobId: string }) {

    const { data: session, status } = useSession()
    const router = useRouter()
    const [errorMessage, setErrorMesssage] = useState<string>("")
    const [applicationStatus, setApplicationStatus] = useState<"idle" | "success" | "error">("idle")
    const handleApply = () => {

        setApplicationStatus("idle");
        setErrorMesssage("");

        if (!session) {
            router.push("/auth/signin");
            return
        }

        try {
            const response = fetch(`/api/jobs/${jobId}/apply`, {
                method: "POST",
            });
            setApplicationStatus("success");
        }
        catch (error) {
            if (error instanceof Error) {
                setErrorMesssage(error.message);
            } else {
                setErrorMesssage("Fail to apply for this job");
            }
            setApplicationStatus("error");
        }
    }

    if (status === "loading") {
        return <button disabled>Loading...</button>
    }

    if (applicationStatus === "success") {
        return (
            <div>
                <p>You have successfully applied for this job.</p>,
                <Link href="/dashboard">View your application</Link>
            </div>
        )
    }
    return (
        <>
            <button onClick={handleApply}>
                Apply for this position
            </button>
            {applicationStatus === "error" && (
                <p>{errorMessage}</p>
            )}
        </>
    )
}