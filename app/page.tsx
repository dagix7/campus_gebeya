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

  // Build the base query with profile join for campus filtering
  let query = supabase
    .from("listings")
    .select("*, profiles!inner(campus_name)", { count: 'exact' })
    .eq("status", "Active");

  if (params.category) {
    query = query.eq("category", params.category);
  }
  if (params.campus) {
    query = query.eq("profiles.campus_name", params.campus);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-coffee-50/30 to-gray-100 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-coffee-900 to-coffee-700 dark:from-coffee-800 dark:to-coffee-600 text-white py-16 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif tracking-tight">CampusGebeya</h1>
          <p className="text-xl text-coffee-100 mb-10 font-medium">
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
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-2 border-transparent focus:border-earth-300 dark:border-gray-700 shadow-sm outline-none transition"
                  aria-label="Search listings"
                />
              </div>
              <select
                name="category"
                defaultValue={params.category || ""}
                className="px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm outline-none"
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
                className="px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm outline-none"
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
                className="px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm outline-none"
                aria-label="Sort by"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-earth-300 text-coffee-900 px-6 py-3 rounded-lg font-bold hover:bg-earth-400 transition shadow-md hover:shadow-lg"
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {totalCount} {totalCount === 1 ? 'Listing' : 'Listings'} Found
          </h2>
          <Link
            href="/listings/new"
            className="bg-coffee-900 dark:bg-coffee-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-coffee-800 dark:hover:bg-coffee-600 transition shadow-md hover:shadow-lg"
          >
            + List Item
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-coffee-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-coffee-600 dark:text-gray-400" />
              </div>
              <p className="text-gray-800 dark:text-gray-200 text-xl font-semibold mb-2">No listings found</p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
              <Link
                href="/listings/new"
                className="bg-coffee-900 dark:bg-coffee-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-coffee-800 dark:hover:bg-coffee-600 inline-block transition shadow-md hover:shadow-lg"
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
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 border-gray-100 dark:border-gray-700 hover:border-coffee-300 dark:hover:border-coffee-600"
                >
                  {listing.image_url && (
                    <div className="relative w-full h-56 bg-gradient-to-br from-coffee-50 to-coffee-100 dark:from-coffee-900 dark:to-gray-800 flex items-center justify-center">
                      <Image
                        src={listing.image_url}
                        alt={listing.title}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 right-3 bg-coffee-900 dark:bg-coffee-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10">
                        {listing.category}
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-coffee-700 dark:group-hover:text-coffee-400 transition-colors line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {listing.description}
                    </p>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-2xl font-bold text-coffee-900 dark:text-coffee-400">
                        {listing.price_etb.toLocaleString()} <span className="text-base font-normal text-gray-600 dark:text-gray-400">ETB</span>
                      </span>
                      <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
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
