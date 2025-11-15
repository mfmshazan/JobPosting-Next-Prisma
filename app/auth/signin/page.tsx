export default function signInPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-2xl">
                    <div className="flex flex-col items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sign in</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Continue with GitHub to access the Job Board</p>
                    </div>

                    <div className="mt-6">
                        <a
                            href="/api/auth/signin/github"
                            className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-95"
                        >
                            <svg  width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.468-2.381 1.236-3.221-.123-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.653.242 2.874.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.62-5.48 5.92.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                            <span>Continue with GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}