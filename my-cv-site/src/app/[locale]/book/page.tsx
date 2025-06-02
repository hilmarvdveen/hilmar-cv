import { BookingForm } from "@/components/BookingForm";
import { Rocket, Star, Headphones, ArrowDown } from "lucide-react";

export default function BookPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Main Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-800/50 px-4 py-2 rounded-full text-emerald-100 text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                <span>15+ Years Experience</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                Let&apos;s Build
                <br />
                <span className="text-emerald-300">Something Amazing</span>
                <br />
                Together
              </h1>

              <p className="text-xl text-emerald-100 mb-8 max-w-xl leading-relaxed">
                Ready to bring your vision to life? From quick consultations to
                complete projects, I&apos;m here to help you succeed with
                professional development solutions.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3 bg-emerald-800/30 rounded-lg p-4">
                  <Rocket className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white">Fast Delivery</h3>
                    <p className="text-sm text-emerald-200">
                      2-8 weeks typical
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-emerald-800/30 rounded-lg p-4">
                  <Headphones className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white">Full Support</h3>
                    <p className="text-sm text-emerald-200">
                      Ongoing maintenance
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex items-center space-x-4">
                <a
                  href="#booking-form"
                  className="inline-flex items-center space-x-2 bg-white text-emerald-700 px-8 py-4 rounded-lg font-bold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>Start Your Project</span>
                  <ArrowDown className="w-5 h-5" />
                </a>
                <div className="text-emerald-200 text-sm">
                  <div className="font-semibold">
                    Free consultation included
                  </div>
                  <div>€85-150/hour • Projects from €5k</div>
                </div>
              </div>
            </div>

            {/* Right Column - Pricing Cards */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Hourly Consulting
                  </h3>
                  <div className="bg-emerald-300 text-emerald-900 px-3 py-1 rounded-full text-sm font-bold">
                    Flexible
                  </div>
                </div>
                <div className="text-3xl font-bold text-emerald-300 mb-2">
                  €85-150/hour
                </div>
                <p className="text-emerald-100 mb-4">
                  Perfect for ongoing work and quick fixes
                </p>
                <ul className="space-y-2 text-emerald-200 text-sm">
                  <li>✓ Pay as you go</li>
                  <li>✓ Maximum flexibility</li>
                  <li>✓ €150/hour for urgent projects</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Fixed Projects
                  </h3>
                  <div className="bg-emerald-300 text-emerald-900 px-3 py-1 rounded-full text-sm font-bold">
                    Popular
                  </div>
                </div>
                <div className="text-3xl font-bold text-emerald-300 mb-2">
                  €5k - €50k+
                </div>
                <p className="text-emerald-100 mb-4">
                  Complete solutions with defined scope
                </p>
                <ul className="space-y-2 text-emerald-200 text-sm">
                  <li>✓ Fixed timeline & scope</li>
                  <li>✓ Better value for large projects</li>
                  <li>✓ Comprehensive deliverables</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tell me about your project and I&apos;ll get back to you within 24
              hours with a detailed proposal.
            </p>
          </div>

          <BookingForm />
        </div>
      </section>
    </div>
  );
}
