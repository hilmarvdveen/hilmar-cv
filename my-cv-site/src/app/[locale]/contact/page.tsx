"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Star,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  Globe,
  MessageSquare,
  Download,
  ExternalLink,
} from "lucide-react";

export default function ContactPage() {
  const clients = [
    { name: "Belastingdienst", logo: "/logos/belastingdienst.svg" },
    { name: "Postcode Loterij", logo: "/logos/postcode-loterij.svg" },
    { name: "Randstad", logo: "/logos/randstad.svg" },
    { name: "FedEx", logo: "/logos/fedex.svg" },
    { name: "Athlon", logo: "/logos/athlon.svg" },
    { name: "Canvas", logo: "/logos/canvas.svg" },
  ];

  const testimonials = [
    {
      quote:
        "Hilmar's expertise in frontend architecture transformed our development process. His systematic approach and attention to detail made our complex project successful.",
      author: "Project Manager",
      company: "Belastingdienst",
      role: "Government Digital Services",
    },
    {
      quote:
        "Working with Hilmar was exceptional. He delivered a scalable solution that exceeded our expectations and continues to serve us well years later.",
      author: "Technical Lead",
      company: "Postcode Loterij",
      role: "Digital Platform Development",
    },
    {
      quote:
        "Hilmar's ability to translate complex requirements into seamless user experiences is unmatched. A true professional who delivers on time and beyond scope.",
      author: "Head of Engineering",
      company: "Randstad",
      role: "Enterprise Solutions",
    },
  ];

  const projectHighlights = [
    {
      title: "Government Digital Transformation",
      client: "Belastingdienst",
      description:
        "Led frontend architecture for critical tax filing system serving millions of Dutch citizens",
      tech: ["React", "TypeScript", "Accessibility", "Performance"],
      result: "40% faster load times, 99.9% uptime",
    },
    {
      title: "E-commerce Platform Redesign",
      client: "Postcode Loterij",
      description:
        "Complete frontend overhaul with modern design system and improved conversion rates",
      tech: ["Next.js", "Design System", "Analytics", "A/B Testing"],
      result: "25% increase in conversions",
    },
    {
      title: "Enterprise Application Suite",
      client: "Randstad",
      description:
        "Scalable frontend solution for global HR management platform",
      tech: ["Angular", "Microfrontends", "Internationalization"],
      result: "Deployed across 15+ countries",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "hilmar.van.der.veen@the-future-group.com",
      href: "mailto:hilmar.van.der.veen@the-future-group.com",
      description: "For project inquiries and detailed discussions",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+31 6 8014 9947",
      href: "tel:+31680149947",
      description: "Direct line for urgent matters",
    },
    {
      icon: Calendar,
      title: "Schedule Meeting",
      value: "Book a consultation",
      href: "https://calendly.com/hilmarvdveen/kennismaking",
      description: "30-minute free consultation call",
      external: true,
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[{ label: "Contact", translationKey: "nav.contact" }]}
          />

          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="w-8 h-8 text-emerald-300" />
              <span className="text-emerald-300 font-medium">Get In Touch</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Transforming Complex Requirements into
              <br />
              <span className="text-emerald-300">
                Seamless User Experiences
              </span>
            </h1>

            <p className="text-xl text-emerald-100 mb-8 max-w-3xl leading-relaxed">
              Ready to elevate your project? Let&apos;s discuss how we can
              create scalable, high-performance solutions that drive real
              business results.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-emerald-300" />
                <span className="text-emerald-100">
                  Response within 24 hours
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-emerald-300" />
                <span className="text-emerald-100">15+ years experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a
                  key={method.title}
                  href={method.href}
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noopener noreferrer" : undefined}
                  className="group bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    {method.title}
                    {method.external && (
                      <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
                    )}
                  </h3>
                  <p className="text-emerald-600 font-semibold mb-2">
                    {method.value}
                  </p>
                  <p className="text-gray-600 text-sm">{method.description}</p>
                </a>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Let&apos;s Discuss How We Can Elevate Your Project
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Share your project details and I&apos;ll provide a customized
                solution proposal within 24 hours.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Organizations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              I&apos;ve had the privilege of working with industry leaders
              across government, finance, and enterprise sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {clients.map((client) => (
              <div
                key={client.name}
                className="group flex items-center justify-center p-6 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white transition-all duration-300 hover:shadow-md"
              >
                <div className="w-full h-16 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                    {client.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Clients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real feedback from project partners and team members who&apos;ve
              experienced the impact of professional frontend development.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-emerald-600 font-medium">
                    {testimonial.company}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Project Highlights
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Significant projects showcasing challenges faced, solutions
              implemented, and measurable results achieved.
            </p>
          </div>

          <div className="space-y-8">
            {projectHighlights.map((project, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-8 border border-gray-200"
              >
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {project.title}
                        </h3>
                        <p className="text-emerald-600 font-medium">
                          {project.client}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                      Results Achieved
                    </h4>
                    <p className="text-gray-700">{project.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-emerald-900 rounded-2xl p-12 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Stay Ahead with Frontend Insights
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Subscribe to receive monthly insights on frontend innovations,
              best practices, and industry trends from 15+ years of experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <button className="px-8 py-3 bg-white text-emerald-900 rounded-lg font-bold hover:bg-emerald-50 transition-colors duration-200 flex items-center justify-center">
                Subscribe
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            <p className="text-emerald-200 text-sm mt-4">
              Monthly insights • No spam • Unsubscribe anytime
            </p>
          </div>
        </div>
      </section>

      {/* Location & Additional Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Based in the Netherlands, Working Globally
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Located in the heart of Europe, I work with teams across the
                globe. Whether you need on-site collaboration or remote
                expertise, I&apos;m equipped to deliver exceptional results.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">
                    Netherlands • Available for EU travel
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">
                    Remote collaboration worldwide
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">English & Dutch fluency</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Quick Resources
              </h3>
              <div className="space-y-4">
                <a
                  href="/cv/hilmar-van-der-veen.pdf"
                  download
                  className="flex items-center space-x-3 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <Download className="w-5 h-5" />
                  <span>Download CV</span>
                </a>
                <Link
                  href="/projects"
                  className="flex items-center space-x-3 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>View Portfolio</span>
                </Link>
                <Link
                  href="/services"
                  className="flex items-center space-x-3 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Explore Services</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
