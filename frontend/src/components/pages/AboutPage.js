import Footer from "../UI Components/Footer";
import Button from "../UI Components/Button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About FOMO
          </h1>
          <p className="text-xl text-gray-300">
            Connecting people through unforgettable experiences
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed text-center mb-8">
            At FOMO, we believe that life's most memorable moments happen when people come together. 
            Our mission is to make discovering and attending events easier than ever, connecting individuals 
            with experiences that inspire, educate, and entertain.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              FOMO was born from a simple observation: people were missing out on incredible events 
              happening right in their neighborhoods. Whether it was a concert, workshop, festival, 
              or networking opportunity, great experiences were going unnoticed.
            </p>
            <p>
              We set out to change that. In 2024, we launched FOMO with a vision to create a platform 
              that not only helps people discover events but also empowers organizers to reach their 
              ideal audience. Today, we're proud to serve thousands of event-goers and organizers 
              across Kenya and beyond.
            </p>
            <p>
              What started as a local initiative has grown into a thriving community of people who 
              share a passion for experiences that matter. From intimate gatherings to large-scale 
              festivals, FOMO is your gateway to what's happening now.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-600">
                We prioritize building genuine connections and fostering a sense of belonging 
                among our users.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Experiences</h3>
              <p className="text-gray-600">
                We curate and promote events that deliver value, entertainment, and memorable 
                moments for attendees.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our platform with cutting-edge features that make event 
                discovery seamless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: "Sarah Johnson", role: "CEO & Founder", emoji: "👩‍💼" },
              { name: "Michael Chen", role: "CTO", emoji: "👨‍💻" },
              { name: "Amina Hassan", role: "Head of Operations", emoji: "👩‍💼" },
              { name: "David Kiprop", role: "Community Manager", emoji: "👨‍💼" }
            ].map((member, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-6 shadow-sm">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            FOMO by the Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900 mb-2">10K+</p>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900 mb-2">500+</p>
              <p className="text-gray-600">Event Organizers</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900 mb-2">2K+</p>
              <p className="text-gray-600">Events Hosted</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900 mb-2">50K+</p>
              <p className="text-gray-600">Tickets Sold</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Join the FOMO Community?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start discovering amazing events or create your own today
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button variant="primary" className="bg-white text-black hover:bg-gray-200">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
