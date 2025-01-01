import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-500 dark:text-red-400">
          404
        </h1>
        <h2 className="text-4xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-300 dark:bg-red-600 dark:hover:bg-red-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
