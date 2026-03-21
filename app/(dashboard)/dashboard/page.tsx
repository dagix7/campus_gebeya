import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Edit2 } from "lucide-react";
import DeleteListingButton from "@/components/delete-listing-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get user's listings
  const { data: listingsData } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const listings = listingsData || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-coffee-50/30 to-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">Dashboard</h1>
          <p className="text-lg text-gray-700 dark:text-gray-400 font-medium">Manage your listings and profile</p>
        </div>

        {/* Profile Card */}
        {profile && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Name</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {profile.full_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Campus</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {profile.campus_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Telegram</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {profile.telegram_handle}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/profile"
              className="inline-block bg-coffee-900 dark:bg-coffee-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-coffee-800 dark:hover:bg-coffee-600 transition shadow-md hover:shadow-lg"
            >
              Edit Profile
            </Link>
          </div>
        )}

        {/* Listings Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Listings</h2>
            <Link
              href="/listings/new"
              className="bg-coffee-900 dark:bg-coffee-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-coffee-800 dark:hover:bg-coffee-600 transition shadow-md hover:shadow-lg"
            >
              + New Listing
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold mb-4">No listings yet</p>
              <Link
                href="/listings/new"
                className="text-coffee-700 dark:text-coffee-400 font-bold hover:text-coffee-800 dark:hover:text-coffee-300 text-lg"
              >
                Create your first listing
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {listings.map((listing: any) => (
                  <div key={listing.id} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="text-coffee-700 dark:text-coffee-400 hover:text-coffee-800 dark:hover:text-coffee-300 font-bold text-lg flex-1"
                      >
                        {listing.title}
                      </Link>
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ml-3 ${
                          listing.status === "Active"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 mb-3 font-medium">
                      <span>{listing.category}</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{listing.price_etb.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex gap-3 pt-3 border-t-2 border-gray-200 dark:border-gray-600">
                      <Link
                        href={`/listings/${listing.id}/edit`}
                        className="flex-1 inline-flex items-center justify-center gap-2 text-coffee-700 dark:text-coffee-400 hover:text-coffee-800 dark:hover:text-coffee-300 py-2.5 px-4 bg-coffee-50 dark:bg-coffee-900/30 rounded-lg text-sm font-bold border-2 border-coffee-200 dark:border-coffee-800"
                      >
                        <Edit2 size={16} />
                        Edit
                      </Link>
                      <div className="flex-1">
                        <DeleteListingButton
                          listingId={listing.id}
                          listingTitle={listing.title}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-gray-100">
                        Title
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-gray-100">
                        Category
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-gray-100">
                        Price
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-gray-100">
                        Status
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-gray-100">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing: any) => (
                      <tr key={listing.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="py-4 px-4">
                          <Link
                            href={`/listings/${listing.id}`}
                            className="text-coffee-700 dark:text-coffee-400 hover:text-coffee-800 dark:hover:text-coffee-300 font-bold"
                          >
                            {listing.title}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-gray-800 dark:text-gray-300 font-medium">{listing.category}</td>
                        <td className="py-4 px-4 font-bold text-gray-900 dark:text-gray-100">
                          {listing.price_etb.toLocaleString()} ETB
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                              listing.status === "Active"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {listing.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 space-x-2">
                          <Link
                            href={`/listings/${listing.id}/edit`}
                            className="inline-flex items-center gap-1 text-coffee-700 dark:text-coffee-400 hover:text-coffee-800 dark:hover:text-coffee-300 font-bold"
                          >
                            <Edit2 size={16} />
                            Edit
                          </Link>
                          <DeleteListingButton
                            listingId={listing.id}
                            listingTitle={listing.title}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
