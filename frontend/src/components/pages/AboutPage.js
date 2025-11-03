import Footer from "../UI Components/Footer";
import Button from "../UI Components/Button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            About FOMO
          </h1>
          <p className="text-xl text-gray-600">
            Discover what's happening around you — never miss out again.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            OUR STORY
          </h2>
          <p className="text-gray-600 mb-6">How a Missed Party Sparked a Movement</p>
          <p className="text-gray-700 leading-relaxed">
            FOMO began with a simple realization — people were constantly missing out on great events because they didn't know where to look. What started as a small idea among friends grew into a mission to make event discovery effortless and inclusive. Today, FOMO connects users to experiences of all kinds, helping them find, share, and never miss what matters most.
          </p>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-200 h-64 rounded-lg">
              <img 
                src="/vision.jpg"
                alt="vision depiction"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                OUR VISION
              </h2>
              <p className="text-gray-600 mb-6">A World Where No One Misses Out</p>
              <p className="text-gray-700 leading-relaxed">
                Our vision is to create a world where everyone has access to the events and experiences that inspire them. FOMO strives to become the leading platform for discovering what's happening anywhere, anytime — helping people stay connected, engaged, and part of something bigger. We believe that every moment worth sharing should be just one tap away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                OUR MISSION
              </h2>
              <p className="text-gray-600 mb-6">Connecting People Through Shared Experiences</p>
              <p className="text-gray-700 leading-relaxed">
                At FOMO, our mission is to bring people closer to the moments that make life exciting. We aim to simplify event discovery by giving users a single place to explore what's happening around them — from concerts and meetups to festivals and workshops. By connecting people through shared interests and real-world experiences, we help communities grow and memories take shape.
              </p>
            </div>
            <div className="bg-gray-200 h-64 rounded-lg order-1 md:order-2">
              <img 
                src="/mission.jpg"
                alt="mission depiction"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <p className="text-gray-600 mb-12">What drives us to keep people connected, curious, and involved.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value Card 1 */}
            <div className="bg-gray-200 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Community
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                We value meaningful connections and aim to bring people together through shared experiences that build a sense of belonging and fun.
              </p>
            </div>

            {/* Value Card 2 */}
            <div className="bg-gray-200 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">🧭</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Discovery
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                We inspire curiosity by helping users explore new events, interests, and opportunities that make every moment exciting.
              </p>
            </div>

            {/* Value Card 3 */}
            <div className="bg-gray-200 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Accessibility
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                We believe everyone should have equal access to great experiences, no matter who they are or where they are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get Started with FOMO
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the community, explore events, and start making every moment count.
          </p>
          <Link href="/signup">
            <Button variant="primary" className="bg-black text-white hover:bg-gray-800">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
