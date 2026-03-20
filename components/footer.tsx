export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-blue-600 mb-2">CampusGebeya</h3>
            <p className="text-gray-600 dark:text-gray-400">A student-only marketplace for university students in Addis Ababa</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a></li>
              <li><a href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</a></li>
              <li><a href="/listings/new" className="hover:text-blue-600 dark:hover:text-blue-400">Sell</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><a href="mailto:support@campusgebeya.com" className="hover:text-blue-600 dark:hover:text-blue-400">Contact Us</a></li>
              <li><a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
              <li><a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2026 CampusGebeya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
