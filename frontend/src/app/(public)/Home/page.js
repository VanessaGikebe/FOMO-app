import Image from "next/image";
import Link from "next/link";

export default function PublicHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#FF6B35] via-[#6C5CE7] to-[#00D9C0] bg-clip-text text-transparent mb-4">
            Moments That Matter
          </h1>
          <p className="text-xl text-gray-800 mb-8 font-semibold">
            Find . Join . Enjoy
          </p>
          <Link href="/p-events">
            <button className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
              Explore Events
            </button>
          </Link>
        </div>
      </section>

      {/* Discover Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Discover. Connect. Experience
          </h2>
          <p className="text-xl text-center text-gray-800 mb-12 font-medium">
            Find events that match your passions
          </p>
          <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl p-8 text-center border border-orange-100">
            <p className="text-gray-800 leading-relaxed max-w-3xl mx-auto font-medium">
              Step to the forefront with what's happening around you. Explore the things you're really into, and let your curiosity lead you to events that'll make memories. Whether you're vibing with new faces or chilling with your squad, there's always something to get into happening online and around you.
            </p>
          </div>
        </div>
      </section>

      {/* Your Next Great Event Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-50 via-white to-teal-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Your Next Great Event Awaits
          </h2>
          <p className="text-gray-800 mb-8 font-medium text-lg">
            Discover exciting experiences, connect with others, and create lasting memories
          </p>
          <Link href="/signin">
            <button className="bg-gradient-to-r from-[#6C5CE7] to-[#5B4BCF] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Find Moments Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Find Moments That Move You
          </h2>
          <p className="text-xl text-center text-gray-800 mb-8 font-medium">
            Explore events that bring people together
          </p>
          <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-xl p-8 border border-teal-100">
            <p className="text-gray-800 leading-relaxed max-w-3xl mx-auto mb-6 font-medium">
              From live concerts and art exhibitions to community gatherings and networking events, FOMO connects you with experiences that matter. Whether you're looking to learn something new, meet like-minded people, or simply have a great time, we've got you covered. Our platform makes it easy to discover, plan, and attend events that align with your interests and schedule.
            </p>
            <div className="text-center">
              <Link href="/p-events">
                <button className="bg-gradient-to-r from-[#00D9C0] to-[#00C4AC] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
                  Browse Events
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Event Management Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-orange-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Effortless Event Management, All in One Place
          </h2>
          <p className="text-gray-800 mb-12 font-medium text-lg">
            Plan, organize, and track every detail — without the usual hassle.
          </p>
          <p className="text-gray-800 leading-relaxed max-w-3xl mx-auto mb-12 font-medium">
            We know organizing events can be overwhelming, which is why our platform simplifies everything — from creating events to managing registrations and tracking attendance. With powerful tools and intuitive features, you'll have everything you need for successful events, right here.
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-transparent hover:border-[#FF6B35] transition-all duration-200">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Seamless Organization
              </h3>
              <p className="text-gray-800 font-medium">
                Easily create and manage events with our intuitive tools designed for efficiency
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-transparent hover:border-[#6C5CE7] transition-all duration-200">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Meaningful Connections
              </h3>
              <p className="text-gray-800 font-medium">
                Foster genuine relationships through shared experiences and common interests
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-transparent hover:border-[#00D9C0] transition-all duration-200">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Smart Insights
              </h3>
              <p className="text-gray-800 font-medium">
                Get valuable data and analytics to understand your audience and improve events
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-100 via-orange-50 to-teal-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Make It Happen?
          </h2>
          <p className="text-xl text-gray-800 mb-8 font-medium">
            Create, share, or join events that inspire you. Your next adventure begins here.
          </p>
          <Link href="/signin">
            <button className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] px-8 py-3 rounded-lg font-medium hover:shadow-xl hover:scale-105 transition-all duration-200">
              Get Started Today
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
