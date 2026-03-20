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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your listings and profile</p>
        </div>

        {/* Profile Card */}
        {profile && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.full_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Campus</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.campus_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Telegram</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.telegram_handle}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/profile"
              className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </Link>
          </div>
        )}

        {/* Listings Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
            <Link
              href="/listings/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + New Listing
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No listings yet</p>
              <Link
                href="/listings/new"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Create your first listing
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing: any) => (
                    <tr key={listing.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {listing.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{listing.category}</td>
                      <td className="py-3 px-4 font-semibold">
                        {listing.price_etb} ETB
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            listing.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {listing.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        <Link
                          href={`/listings/${listing.id}/edit`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
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
          )}
        </div>
      </div>
    </div>
  );
}
