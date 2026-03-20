'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import ThemeToggle from "./theme-toggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription?.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsMenuOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            CampusGebeya
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`transition-colors ${isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`transition-colors ${isActive('/dashboard') ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
                  aria-current={isActive('/dashboard') ? 'page' : undefined}
                >
                  Dashboard
                </Link>
                <Link
                  href="/listings/new"
                  className={`transition-colors ${isActive('/listings/new') ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
                  aria-current={isActive('/listings/new') ? 'page' : undefined}
                >
                  Sell
                </Link>
              </>
            )}
          </div>

          {/* Auth Actions & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {!loading && !user && (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={24} className="dark:text-gray-300" /> : <Menu size={24} className="dark:text-gray-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav id="mobile-menu" role="navigation" aria-label="Mobile navigation" className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className={`block py-2 transition-colors ${isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
              aria-current={isActive('/') ? 'page' : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`block py-2 transition-colors ${isActive('/dashboard') ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
                  aria-current={isActive('/dashboard') ? 'page' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/listings/new"
                  className={`block py-2 transition-colors ${isActive('/listings/new') ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
                  aria-current={isActive('/listings/new') ? 'page' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sell
                </Link>
              </>
            )}
            {!loading && !user && (
              <>
                <Link
                  href="/auth/login"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 py-2"
              >
                Logout
              </button>
            )}
          </nav>
        )}
      </div>
    </nav>
  );
}
