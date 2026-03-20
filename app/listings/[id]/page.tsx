import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import ShareButton from "@/components/share-button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from('listings')
    .select('title, description, image_url, price_etb, category')
    .eq('id', id)
    .single();

  if (!listing) {
    return {
      title: 'Listing Not Found',
    };
  }

  return {
    title: listing.title,
    description: listing.description.substring(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description,
      images: listing.image_url ? [listing.image_url] : [],
      type: 'website',
    },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Get listing
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*, profiles(full_name, campus_name, telegram_handle)")
    .eq("id", id)
    .single();

  if (error || !listing) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
          ← Back to Listings
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left - Image */}
          <div className="md:col-span-2">
            {listing.image_url ? (
              <div className="relative w-full h-96 rounded-lg shadow-lg overflow-hidden bg-gray-200">
                <Image
                  src={listing.image_url}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600">
                No Image Available
              </div>
            )}

            {/* Details */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {listing.title}
              </h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {listing.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p
                    className={`text-lg font-semibold ${
                      listing.status === "Active"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {listing.status}
                  </p>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right - Price & Seller Info */}
          <div>
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-20">
              <p className="text-sm text-gray-600 mb-2">Price</p>
              <p className="text-4xl font-bold text-blue-600 mb-6">
                {listing.price_etb} ETB
              </p>

              <a
                href={`https://t.me/${listing.profiles?.telegram_handle?.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 mb-3 transition"
              >
                <MessageCircle size={20} />
                Contact on Telegram
              </a>

              <ShareButton
                title={listing.title}
                url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/listings/${id}`}
              />
            </div>

            {/* Seller Info Card */}
            {listing.profiles && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Seller Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">
                      {listing.profiles.full_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Campus</p>
                    <p className="font-semibold text-gray-900">
                      {listing.profiles.campus_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Telegram</p>
                    <a
                      href={`https://t.me/${listing.profiles.telegram_handle?.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {listing.profiles.telegram_handle}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
