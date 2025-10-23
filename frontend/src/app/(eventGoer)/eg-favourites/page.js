import { Footer } from "@/components";

export default function FavouritesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Favourites</h1>
          <p className="text-gray-600">Your favourite events will appear here.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
