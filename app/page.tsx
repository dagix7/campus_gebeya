import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CAMPUS_OPTIONS, CATEGORY_OPTIONS } from "@/lib/utils";
import { Search } from "lucide-react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; campus?: string; search?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("listings").select("*").eq("status", "Active");

  if (params.category) {
    query = query.eq("category", params.category);
  }
  if (params.campus) {
    // Note: campus is stored in the profile, so we'll need to filter after joining
  }
  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
  }

  const { data: listingsData, error } = await query;
  const listings = listingsData || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">CampusGebeya</h1>
          <p className="text-lg text-blue-100 mb-8">
            The marketplace where students buy, sell, and hustle
          </p>

          {/* Search Bar */}
          <div className="flex flex-col gap-4 md:flex-row md:gap-2">
            <form className="flex-1 flex gap-2" method="GET">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="search"
                  placeholder="Search listings..."
                  defaultValue={params.search || ""}
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900"
                />
              </div>
              <select
                name="category"
                defaultValue={params.category || ""}
                className="px-4 py-2 rounded-lg text-gray-900"
              >
                <option value="">All Categories</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                name="campus"
                defaultValue={params.campus || ""}
                className="px-4 py-2 rounded-lg text-gray-900"
              >
                <option value="">All Campuses</option>
                {CAMPUS_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {listings.length} Listings Found
          </h2>
          <Link
            href="/listings/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            + List Item
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No listings found</p>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <Link
              href="/listings/new"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 inline-block"
            >
              Be the first to list
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: any) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {listing.image_url && (
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={listing.image_url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {listing.category}
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {listing.price_etb} ETB
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {listing.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
