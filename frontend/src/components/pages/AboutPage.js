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
            Title
          </h1>
          <p className="text-xl text-gray-600">
            Subtitle
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            OUR STORY
          </h2>
          <p className="text-gray-600 mb-6">Subtitle</p>
          <p className="text-gray-700 leading-relaxed">
            This sample unit is a template unit for the website's behind the scenes process. Any content that conveys the history of how the organization came to fruition would be appropriate here. For instance, a narrative about the process that occurred with the company's initiation and the circumstances that led to it would be an appropriate choice. Ultimately, this unit aims to showcase the origin and trajectory of the organization, providing an in-depth background.
          </p>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                OUR VISION
              </h2>
              <p className="text-gray-600 mb-6">Subtitle</p>
              <p className="text-gray-700 leading-relaxed">
                This text box unit is a filling space for the website's behind the scenes process. Any content that conveys that outline and plan tangled have on where and how the company will be in the future can fit into the unit. For instance, a narrative about the future of the business and the circumstances that led to the company being a step ahead can be an appropriate choice.
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
              <p className="text-gray-600 mb-6">Subtitle</p>
              <p className="text-gray-700 leading-relaxed">
                This text box unit is a filling space for the website's behind the scenes process. Any content that conveys that outline and plan tangled have on where and how the company will be in the future can fit into the unit. For instance, a narrative about the future of the business and the circumstances that led to the company being a step ahead can be an appropriate choice.
              </p>
            </div>
            <div className="bg-gray-200 h-64 rounded-lg order-1 md:order-2"></div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <p className="text-gray-600 mb-12">Subtitle</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value Card 1 */}
            <div className="bg-gray-200 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Content Title
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                This text briefly describes the specific content that is being spotlighted in the card, making sure that users and show interest and interact with the card. The writing is essential to the card's overall impact.
              </p>
            </div>

            {/* Value Card 2 */}
            <div className="bg-gray-200 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Content Title
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                This text briefly describes the specific content that is being spotlighted in the card, making sure that users and show interest and interact with the card. The writing is essential to the card's overall impact.
              </p>
            </div>

            {/* Value Card 3 */}
            <div className="bg-gray-200 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Content Title
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                This text briefly describes the specific content that is being spotlighted in the card, making sure that users and show interest and interact with the card. The writing is essential to the card's overall impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Title
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Subtitle
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
