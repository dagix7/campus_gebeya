import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-coffee-900 dark:text-coffee-400 mb-2 font-serif">CampusGebeya</h3>
            <p className="text-gray-600 dark:text-gray-400">A student-only marketplace for university students in Addis Ababa</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><Link href="/" className="hover:text-coffee-700 dark:hover:text-coffee-400 transition-colors">Home</Link></li>
              <li><Link href="/dashboard" className="hover:text-coffee-700 dark:hover:text-coffee-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/listings/new" className="hover:text-coffee-700 dark:hover:text-coffee-400 transition-colors">Sell</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><Link href="/about" className="hover:text-coffee-700 dark:hover:text-coffee-400 transition-colors">About Us</Link></li>
              <li><a href="mailto:support@campusgebeya.com" className="hover:text-coffee-700 dark:hover:text-coffee-400 transition-colors">Contact</a></li>
              <li><a href="https://t.me/campusgebeya" target="_blank" rel="noopener noreferrer" className="hover:text-coffee-700 dark:hover:text-coffee-400 transition-colors">Telegram</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} CampusGebeya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
