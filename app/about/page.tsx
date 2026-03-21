import { Metadata } from "next";
import Link from "next/link";
import { Users, ShoppingBag, Shield, MessageCircle, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about CampusGebeya - the trusted student marketplace for Ethiopian university students.",
  openGraph: {
    title: "About | CampusGebeya",
    description: "Learn about CampusGebeya - the trusted student marketplace for Ethiopian university students.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-coffee-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-coffee-900 to-coffee-700 dark:from-coffee-800 dark:to-coffee-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">About CampusGebeya</h1>
          <p className="text-xl text-coffee-100 max-w-2xl mx-auto leading-relaxed">
            The trusted marketplace where Ethiopian university students buy, sell, and trade - all within their campus community.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
            CampusGebeya was created to solve a common problem faced by university students in Ethiopia - finding a safe,
            convenient place to buy and sell used items, find gigs, and connect with fellow students.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            Whether you&apos;re looking to sell your old textbooks, find freelance work, or discover great deals on
            electronics and dorm essentials, CampusGebeya makes it easy to connect with trusted sellers and buyers
            within your university community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-6 text-center">
            <div className="w-14 h-14 bg-coffee-100 dark:bg-coffee-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-coffee-600 dark:text-coffee-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Student-Only</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Exclusively for university students, ensuring a trusted community of buyers and sellers.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-6 text-center">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Safe & Secure</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Campus-based transactions mean you can meet in safe, familiar locations.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-6 text-center">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Easy to Use</h3>
            <p className="text-gray-600 dark:text-gray-400">
              List items in seconds and connect directly with buyers via Telegram.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
            Have questions, feedback, or need support? We&apos;d love to hear from you!
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="https://t.me/campusgebeya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl transition shadow-md hover:shadow-lg"
            >
              <MessageCircle size={24} />
              <div>
                <p className="font-bold">Telegram</p>
                <p className="text-sm opacity-90">@campusgebeya</p>
              </div>
            </a>

            <a
              href="mailto:support@campusgebeya.com"
              className="flex items-center gap-4 p-4 bg-coffee-900 dark:bg-coffee-700 hover:bg-coffee-800 dark:hover:bg-coffee-600 text-white rounded-xl transition shadow-md hover:shadow-lg"
            >
              <Mail size={24} />
              <div>
                <p className="font-bold">Email</p>
                <p className="text-sm opacity-90">support@campusgebeya.com</p>
              </div>
            </a>
          </div>
        </div>

        {/* Supported Campuses */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Supported Campuses</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            We currently support the following universities in Addis Ababa:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "AAU 4-Kilo",
              "AAU 5-Kilo",
              "AAU 6-Kilo",
              "BiT",
              "ASTU",
            ].map((campus) => (
              <div key={campus} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <MapPin size={18} className="text-coffee-600 dark:text-coffee-400" />
                <span className="font-medium text-gray-900 dark:text-gray-100">{campus}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
            More campuses coming soon!
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block bg-coffee-900 dark:bg-coffee-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-coffee-800 dark:hover:bg-coffee-600 transition shadow-md hover:shadow-lg text-lg"
          >
            Start Browsing Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
