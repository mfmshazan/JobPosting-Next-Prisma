"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StarButtonProps {
  jobId: string;
  initialStarred: boolean;
  className?: string;
}

export default function StarButton({ jobId, initialStarred, className = "" }: StarButtonProps) {
  const [isStarred, setIsStarred] = useState(initialStarred);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    try {
      const response = await fetch(`/api/jobs/${jobId}/star`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setIsStarred(data.starred);
        router.refresh();
      } else {
        if (response.status === 401) {
          router.push("/auth/signin");
        }
      }
    } catch (error) {
      console.error("Error starring job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleStar}
      disabled={isLoading}
      className={`transition-colors ${className} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      title={isStarred ? "Remove from starred" : "Add to starred"}
    >
      <svg
        className={`w-6 h-6 ${isStarred ? "fill-[#6C5DD3] text-[#6C5DD3]" : "text-gray-400 hover:text-[#6C5DD3]"}`}
        fill={isStarred ? "currentColor" : "none"}
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
    </button>
  );
}
