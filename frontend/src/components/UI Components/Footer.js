import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xl">📸</span>
              </div>
              <span className="text-xl font-bold">FOMO</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Email: info@fomo.com</p>
            <p className="text-sm text-gray-600">Phone No: 0712345678</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link></li>
              <li><Link href="/events" className="text-gray-600 hover:text-gray-900 transition-colors">Events</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link href="/signup" className="text-gray-600 hover:text-gray-900 transition-colors">Sign Up</Link></li>
              <li><Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">Log In</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Social Media</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Facebook</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Instagram</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">X</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">LinkedIn</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">YouTube</Link></li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Legal Policies</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 pt-8 border-t border-gray-200">
          ©2025 FOMO. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

