"use client"

import { FormEvent } from "react";

export default function PostJobPage() {

    const handleSubmit  = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const data = {
            title: formData.get("title"),
            company: formData.get("company"),
            location: formData.get("location"),
            type: formData.get("type"),
            description: formData.get("description"),
            salary: formData.get("salary")
        }

        try{
            const response = await fetch("/api/jobs", {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json", 
                },
                body: JSON.stringify(data)
            })
            
            if (response.ok) {
                window.location.href = "/jobs"
            } else {
                const error = await response.json()
                alert(error.message || "Failed to post job")
            }
        }
        catch(error){
            console.log(error)
        }
    }
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Post a job</h1>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                    <div className="col-span-1">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            className="w-full rounded-md border border-gray-200 px-3 py-2 bg-transparent text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                        />
                    </div>

                    <div className="col-span-1">
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                            type="text"
                            name="company"
                            id="company"
                            required
                            className="w-full rounded-md border border-gray-200 px-3 py-2 bg-transparent text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Job type</label>
                        <select
                            name="type"
                            id="type"
                            required
                            className="w-full rounded-md border border-gray-200 px-3 py-2 bg-transparent text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                        >
                            <option value="">Select a type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            required
                            className="w-full rounded-md border border-gray-200 px-3 py-2 bg-transparent text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                        />
                    </div>

                    <div>
                        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary (optional)</label>
                        <input
                            type="text"
                            name="salary"
                            id="salary"
                            placeholder="e.g. $50,000 - $80,000"
                            className="w-full rounded-md border border-gray-200 px-3 py-2 bg-transparent text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            rows={6}
                            required
                            className="w-full rounded-md border border-gray-200 px-3 py-2 bg-transparent text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] resize-none"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-5 py-2 bg-[#6C5DD3] hover:bg-[#5B4BC2] text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                        >
                            Post Job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
