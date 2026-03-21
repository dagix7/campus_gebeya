'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORY_OPTIONS } from "@/lib/utils";
import { Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function NewListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Gear');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);
    };

    checkAuth();
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please login first');
      return;
    }

    if (!title || !description || !price || !category) {
      setError('Please fill in all required fields');
      return;
    }

    if (!file) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload image to storage
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file);

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);

      // Create listing in database
      const { data: listing, error: dbError } = await supabase
        .from('listings')
        .insert([
          {
            title,
            description,
            price_etb: parseInt(price),
            category,
            image_url: urlData.publicUrl,
            user_id: user.id,
            status: 'Active',
          },
        ])
        .select()
        .single();

      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }

      // Redirect to listing detail page with success toast
      toast.success('Listing created successfully!');
      router.push(`/listings/${listing.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-100 via-earth-100/50 to-coffee-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-coffee-200/30 dark:bg-coffee-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-earth-200/40 dark:bg-earth-900/20 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-coffee-900 dark:bg-coffee-700 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
            ✨ New Listing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">What are you selling?</h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg">Fill in the details below to create your listing</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-coffee-200 dark:border-gray-700 p-8 md:p-10 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
          {/* Decorative top bar */}
          <div className="flex gap-2 mb-8 pb-6 border-b-2 border-coffee-100 dark:border-gray-700">
            <div className="w-3 h-3 rounded-full bg-coffee-900" />
            <div className="w-3 h-3 rounded-full bg-earth-400" />
            <div className="w-3 h-3 rounded-full bg-coffee-700" />
          </div>
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you selling?"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-transparent outline-none"
              disabled={loading}
              required
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-transparent outline-none"
              disabled={loading}
              required
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Price (ETB) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-transparent outline-none"
              disabled={loading}
              required
              min="0"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item, condition, and why you're selling..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-transparent outline-none"
              disabled={loading}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Image * <span className="text-coffee-700 dark:text-coffee-400">📸</span>
            </label>
            <div className="border-2 border-dashed border-coffee-300 dark:border-gray-600 rounded-2xl p-6 text-center hover:border-coffee-500 dark:hover:border-coffee-400 transition bg-gradient-to-br from-coffee-50 to-earth-100/30 dark:from-gray-700 dark:to-gray-800">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                disabled={loading}
                required
              />
              <label htmlFor="file-input" className="cursor-pointer">
                {preview ? (
                  <div>
                    <div className="relative w-full aspect-video mb-4 bg-white dark:bg-gray-900 rounded-2xl border-2 border-coffee-200 dark:border-gray-700 shadow-lg overflow-hidden">
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-contain p-4"
                        unoptimized
                      />
                    </div>
                    <p className="text-sm text-coffee-700 dark:text-coffee-400 font-bold">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="w-20 h-20 mx-auto mb-4 bg-coffee-900 dark:bg-coffee-700 rounded-full flex items-center justify-center shadow-lg">
                      <Upload className="text-white" size={40} />
                    </div>
                    <p className="text-gray-900 dark:text-gray-100 font-bold mb-2 text-lg">
                      Upload your product image
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coffee-900 dark:bg-coffee-700 text-white py-3 rounded-lg font-semibold hover:bg-coffee-800 dark:hover:bg-coffee-600 disabled:opacity-50 transition"
          >
            {loading ? 'Creating Listing...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
