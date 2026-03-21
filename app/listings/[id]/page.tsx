import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { MessageCircle, Clock, User, MapPin, Send } from "lucide-react";
import ShareButton from "@/components/share-button";
import Breadcrumbs from "@/components/breadcrumbs";

// Helper function to format time ago
function timeAgo(date: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  return 'Just now';
}

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

  // Get related listings (same category, excluding current)
  const { data: relatedListings } = await supabase
    .from("listings")
    .select("id, title, price_etb, image_url, category")
    .eq("category", listing.category)
    .eq("status", "Active")
    .neq("id", id)
    .limit(4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-coffee-50/30 to-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs
          items={[
            { label: 'Listings', href: '/' },
            { label: listing.category, href: `/?category=${listing.category}` },
            { label: listing.title },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left - Image */}
          <div className="md:col-span-2">
            {listing.image_url ? (
              <div className="relative w-full aspect-[4/3] rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br from-coffee-50 to-coffee-100 dark:from-coffee-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <Image
                  src={listing.image_url}
                  alt={listing.title}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhBhMiMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAABQf/xAAcEQABBAMBAAAAAAAAAAAAAAABAAIDBAUREiH/2gAMAwEAAhEDEQA/ANk63ZQWRjSCKNFx4qO1m+uf/9k="
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center text-gray-600 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600">
                <p className="text-lg font-medium">No Image Available</p>
              </div>
            )}

            {/* Details */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {listing.title}
              </h1>

              <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Category</p>
                  <p className="text-lg font-bold text-coffee-900 dark:text-coffee-400 px-4 py-2 bg-coffee-50 dark:bg-coffee-900/30 rounded-lg inline-block">
                    {listing.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</p>
                  <p
                    className={`text-lg font-bold px-4 py-2 rounded-lg inline-block ${
                      listing.status === "Active"
                        ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
                        : "text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {listing.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Posted</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg inline-flex items-center gap-2">
                    <Clock size={18} className="text-gray-500 dark:text-gray-400" />
                    {timeAgo(listing.created_at)}
                  </p>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Description
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                  {listing.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right - Price & Seller Info */}
          <div>
            {/* Price Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-6 mb-6 sticky top-20">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Price</p>
              <p className="text-5xl font-bold text-coffee-900 dark:text-coffee-400 mb-2">
                {listing.price_etb.toLocaleString()}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Ethiopian Birr</p>

              <a
                href={`https://t.me/${listing.profiles?.telegram_handle?.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-coffee-900 dark:bg-coffee-700 text-white py-4 rounded-xl font-bold hover:bg-coffee-800 dark:hover:bg-coffee-600 flex items-center justify-center gap-2 mb-3 transition shadow-md hover:shadow-lg text-lg"
              >
                <MessageCircle size={24} />
                Contact on Telegram
              </a>

              <ShareButton
                title={listing.title}
                url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/listings/${id}`}
              />
            </div>

            {/* Seller Info Card */}
            {listing.profiles && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Seller Info
                </h3>

                {/* Seller Avatar & Name */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-14 h-14 bg-gradient-to-br from-coffee-100 to-coffee-200 dark:from-coffee-800 dark:to-coffee-900 rounded-full flex items-center justify-center">
                    <User size={28} className="text-coffee-600 dark:text-coffee-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {listing.profiles.full_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin size={14} />
                      {listing.profiles.campus_name}
                    </p>
                  </div>
                </div>

                {/* Contact Button */}
                <a
                  href={`https://t.me/${listing.profiles.telegram_handle?.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg"
                >
                  <Send size={18} />
                  Message on Telegram
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  {listing.profiles.telegram_handle}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings && relatedListings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Similar Listings
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedListings.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/listings/${item.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border-2 border-gray-100 dark:border-gray-700 hover:border-coffee-300 dark:hover:border-coffee-600"
                >
                  {item.image_url && (
                    <div className="relative w-full h-32 bg-gradient-to-br from-coffee-50 to-coffee-100 dark:from-coffee-900 dark:to-gray-800">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1 line-clamp-1 group-hover:text-coffee-700 dark:group-hover:text-coffee-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-coffee-900 dark:text-coffee-400 font-bold">
                      {item.price_etb.toLocaleString()} ETB
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
