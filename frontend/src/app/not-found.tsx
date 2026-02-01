'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8">
                <span className="text-4xl text-blue-600">📍</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">404 - Page Not Found</h1>
            <p className="text-slate-600 max-w-md mb-8">
                Oops! The page you are looking for doesn't exist or has been moved.
                Please check the URL or return to the dashboard.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Go to Home
                </Link>
            </div>
            <p className="mt-12 text-slate-400 text-sm">
                HealthStock Enterprise v1.0.0
            </p>
        </div>
    );
}
