import { Github, Heart, Twitter } from 'lucide-react';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Made with love message */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
            <span>by developers, for developers</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="https://github.com/Rajesh-Royal/CommitKing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Github className="w-4 h-4 mr-2" />
              <span className="text-sm">View Source</span>
            </Link>

            <Link
              href="https://twitter.com/Raj_896"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Twitter className="w-4 h-4 mr-2" />
              <span className="text-sm">Follow Creator</span>
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} CommitKings. Building the future of
            developer community, one vote at a time.
          </div>
        </div>
      </div>
    </footer>
  );
}
