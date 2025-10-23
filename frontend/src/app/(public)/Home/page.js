import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components";

export default function PublicHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-100 to-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Moments That Matter
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find . Join . Enjoy
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Explore Events
          </button>
        </div>
      </section>

      {/* Discover Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Discover. Connect. Experience
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Find events that match your passions
          </p>
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Step to the forefront with what's happening around you. Explore the things you're really into, and let your curiosity lead you to events that'll make memories. Whether you're vibing with new faces or chilling with your squad, there's always something to get into happening online and around you.
            </p>
          </div>
        </div>
      </section>

      {/* Your Next Great Event Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Next Great Event Awaits
          </h2>
          <p className="text-gray-600 mb-8">
            Discover exciting experiences, connect with others, and create lasting memories
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Get Started
          </button>
        </div>
      </section>

      {/* Find Moments Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Find Moments That Move You
          </h2>
          <p className="text-xl text-center text-gray-600 mb-8">
            Explore events that bring people together
          </p>
          <div className="bg-gray-50 rounded-xl p-8">
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6">
              From live concerts and art exhibitions to community gatherings and networking events, FOMO connects you with experiences that matter. Whether you're looking to learn something new, meet like-minded people, or simply have a great time, we've got you covered. Our platform makes it easy to discover, plan, and attend events that align with your interests and schedule.
            </p>
            <div className="text-center">
              <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Event Management Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Effortless Event Management, All in One Place
          </h2>
          <p className="text-gray-600 mb-12">
            Plan, organize, and track every detail — without the usual hassle.
          </p>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12">
            We know organizing events can be overwhelming, which is why our platform simplifies everything — from creating events to managing registrations and tracking attendance. With powerful tools and intuitive features, you'll have everything you need for successful events, right here.
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Seamless Organization
              </h3>
              <p className="text-gray-600">
                Easily create and manage events with our intuitive tools designed for efficiency
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Meaningful Connections
              </h3>
              <p className="text-gray-600">
                Foster genuine relationships through shared experiences and common interests
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Smart Insights
              </h3>
              <p className="text-gray-600">
                Get valuable data and analytics to understand your audience and improve events
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Make It Happen?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Create, share, or join events that inspire you. Your next adventure begins here.
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Create an Event
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
