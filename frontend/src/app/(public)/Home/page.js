"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components";
import { Smartphone, Link as LinkIcon, Lightbulb, Calendar, Users, Sparkles, ArrowUp } from "lucide-react";

export default function PublicHome() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section id="hero" className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070"
            alt="Events Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-white text-sm font-medium">Discover Amazing Events Near You</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Moments That <span className="text-[#FF6B35]">Matter</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
              Find . Join . Enjoy
            </p>
            
            <p className="text-lg text-gray-300 mb-10 max-w-2xl">
              Connect with experiences that inspire you. From concerts to workshops, networking events to festivals — your next unforgettable moment starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signin">
                <button className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white px-8 py-4 rounded-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200 text-lg">
                  Explore Events
                </button>
              </Link>
              <Link href="/signin">
                <button className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 text-lg">
                  Sign Up Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section id="discover" className="py-16 md:py-24 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover. Connect. Experience
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 font-medium">
              Find events that match your passions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {/* Quick Stats Cards */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105">
              <div className="bg-gradient-to-br from-[#FF6B35]/10 to-[#FF6B35]/5 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-[#FF6B35]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">10+ Categories</h3>
              <p className="text-gray-600">From music to tech, find events across diverse interests</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105">
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Growing Community</h3>
              <p className="text-gray-600">Join thousands of event enthusiasts nationwide</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105">
              <div className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Seamless Booking</h3>
              <p className="text-gray-600">Book tickets instantly with secure M-PESA payments</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50 rounded-3xl p-8 md:p-12 text-center border border-gray-200">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Step to the forefront with what's happening around you. Explore
              the things you're really into, and let your curiosity lead you to
              events that'll make memories. Whether you're vibing with new faces
              or chilling with your squad, there's always something to get into
              happening online and around you.
            </p>
          </div>
        </div>
      </section>

      {/* Your Next Great Event Section */}
      <section id="features" className="py-16 md:py-24 px-6 relative overflow-hidden bg-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-teal-50 opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,107,53,0.05),transparent_50%)]"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Next Great Event Awaits
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Discover exciting experiences, connect with others, and create
            lasting memories that you'll cherish forever
          </p>
          <Link href="/signin">
            <button className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white px-10 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200 text-lg">
              Get Started Free →
            </button>
          </Link>
        </div>
      </section>

      {/* Find Moments Section */}
      <section id="about" className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Moments That Move You
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 font-medium">
              Explore events that bring people together
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                From live concerts and art exhibitions to community gatherings and
                networking events, FOMO connects you with experiences that matter.
                Whether you're looking to learn something new, meet like-minded
                people, or simply have a great time, we've got you covered.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our platform makes it easy to discover, plan, and attend events that
                align with your interests and schedule. Join thousands of event-goers
                who trust FOMO for their next adventure.
              </p>
              <div className="pt-4">
                <Link href="/signin">
                  <button className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 text-lg inline-flex items-center gap-2">
                    Browse Events
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800"
                    alt="Concert"
                    className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800"
                    alt="Workshop"
                    className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=800"
                    alt="Networking"
                    className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800"
                    alt="Festival"
                    className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
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
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12">
            We know organizing events can be overwhelming, which is why our
            platform simplifies everything — from creating events to managing
            registrations and tracking attendance. With powerful tools and
            intuitive features, you'll have everything you need for successful
            events, right here.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="text-black mb-4 flex justify-center">
                <Smartphone className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-[#FF6B35] mb-3">
                Seamless Organization
              </h3>
              <p className="text-gray-600">
                Easily create and manage events with our intuitive tools
                designed for efficiency
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="text-black mb-4 flex justify-center">
                <LinkIcon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-[#FF6B35] mb-3">
                Meaningful Connections
              </h3>
              <p className="text-gray-600">
                Foster genuine relationships through shared experiences and
                common interests
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="text-black mb-4 flex justify-center">
                <Lightbulb className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-[#FF6B35] mb-3">
                Smart Insights
              </h3>
              <p className="text-gray-600">
                Get valuable data and analytics to understand your audience and
                improve events
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
          <p className="text-xl text-gray-600 mb-8">
            Create, share, or join events that inspire you. Your next adventure
            begins here.
          </p>
          <Link href="/signin">
            <button className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] px-8 py-3 rounded-lg font-medium hover:shadow-xl hover:scale-105 transition-all duration-200 text-white">
              Get Started Today
            </button>
          </Link>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 bg-[#FF6B35] hover:bg-[#E55A2B] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
}
