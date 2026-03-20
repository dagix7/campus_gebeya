import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CAMPUS_OPTIONS, CATEGORY_OPTIONS } from "@/lib/utils";
import { Search, ArrowUpDown } from "lucide-react";
import Pagination from "@/components/pagination";

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', column: 'created_at', ascending: false },
  { value: 'oldest', label: 'Oldest First', column: 'created_at', ascending: true },
  { value: 'price_low', label: 'Price: Low to High', column: 'price_etb', ascending: true },
  { value: 'price_high', label: 'Price: High to Low', column: 'price_etb', ascending: false },
] as const;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; campus?: string; search?: string; page?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Parse page number
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Get sort option
  const sortOption = SORT_OPTIONS.find(opt => opt.value === params.sort) || SORT_OPTIONS[0];

  // Build the base query
  let query = supabase.from("listings").select("*", { count: 'exact' }).eq("status", "Active");

  if (params.category) {
    query = query.eq("category", params.category);
  }
  if (params.campus) {
    // Note: campus is stored in the profile, so we'll need to filter after joining
  }
  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
  }

  // Apply sort order and pagination
  query = query.order(sortOption.column, { ascending: sortOption.ascending });
  query = query.range(offset, offset + ITEMS_PER_PAGE - 1);

  const { data: listingsData, error, count } = await query;
  const listings = listingsData || [];
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Build search params for pagination links
  const paginationParams: Record<string, string> = {};
  if (params.category) paginationParams.category = params.category;
  if (params.campus) paginationParams.campus = params.campus;
  if (params.search) paginationParams.search = params.search;
  if (params.sort) paginationParams.sort = params.sort;

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
            <form className="flex-1 flex gap-2 flex-wrap" method="GET">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="search"
                  placeholder="Search listings..."
                  defaultValue={params.search || ""}
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900"
                  aria-label="Search listings"
                />
              </div>
              <select
                name="category"
                defaultValue={params.category || ""}
                className="px-4 py-2 rounded-lg text-gray-900"
                aria-label="Filter by category"
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
                aria-label="Filter by campus"
              >
                <option value="">All Campuses</option>
                {CAMPUS_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                name="sort"
                defaultValue={params.sort || "newest"}
                className="px-4 py-2 rounded-lg text-gray-900"
                aria-label="Sort by"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
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
            {totalCount} {totalCount === 1 ? 'Listing' : 'Listings'} Found
          </h2>
          <Link
            href="/listings/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + List Item
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg mb-4">No listings found</p>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              <Link
                href="/listings/new"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 inline-block transition"
              >
                Be the first to list
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing: any) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group"
                >
                  {listing.image_url && (
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={listing.image_url}
                        alt={listing.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                        {listing.category}
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {listing.price_etb.toLocaleString()} ETB
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {listing.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/"
              searchParams={paginationParams}
            />
          </>
        )}
      </div>
    </div>
  );
}
