import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Code,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Zap,
  Eye,
  Search,
  Users,
  BarChart3,
  Globe,
  Palette,
  Calendar,
} from "lucide-react";

export default function FrontendDevelopmentPage() {
  const technologies = [
    {
      name: "React",
      description: "Component-based UI library",
      level: "Expert",
    },
    {
      name: "Next.js",
      description: "Full-stack React framework",
      level: "Expert",
    },
    {
      name: "Vue.js",
      description: "Progressive JavaScript framework",
      level: "Advanced",
    },
    {
      name: "TypeScript",
      description: "Type-safe JavaScript",
      level: "Expert",
    },
    {
      name: "Tailwind CSS",
      description: "Utility-first CSS framework",
      level: "Expert",
    },
    {
      name: "Redux/Zustand",
      description: "State management",
      level: "Advanced",
    },
  ];

  const processes = [
    {
      title: "Discovery & Planning",
      description:
        "Understanding your users, business goals, and technical requirements",
      icon: Search,
      details: [
        "User research and personas",
        "Technical architecture planning",
        "Performance budget definition",
        "Accessibility requirements",
      ],
    },
    {
      title: "Design System Creation",
      description: "Building consistent, scalable design foundations",
      icon: Palette,
      details: [
        "Component library development",
        "Design token implementation",
        "Style guide creation",
        "Brand consistency guidelines",
      ],
    },
    {
      title: "Development & Testing",
      description: "Building robust, performant frontend applications",
      icon: Code,
      details: [
        "Component-driven development",
        "Cross-browser testing",
        "Performance optimization",
        "Accessibility compliance",
      ],
    },
    {
      title: "Deployment & Optimization",
      description: "Launching and continuously improving your application",
      icon: Zap,
      details: [
        "CI/CD pipeline setup",
        "Performance monitoring",
        "SEO optimization",
        "Analytics integration",
      ],
    },
  ];

  const benefits = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description:
        "Responsive layouts that work flawlessly across all devices and screen sizes",
    },
    {
      icon: Zap,
      title: "Lightning Performance",
      description:
        "Optimized for speed with lazy loading, code splitting, and efficient bundling",
    },
    {
      icon: Eye,
      title: "Accessibility Focus",
      description:
        "WCAG 2.1 compliant interfaces that work for users with all abilities",
    },
    {
      icon: Search,
      title: "SEO Optimized",
      description:
        "Built with search engine optimization and discoverability in mind",
    },
    {
      icon: Users,
      title: "User-Centered",
      description:
        "Interfaces designed with user experience and conversion optimization as priorities",
    },
    {
      icon: BarChart3,
      title: "Analytics Ready",
      description:
        "Integrated tracking and analytics to measure success and user behavior",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: "Services", href: "/services" },
              { label: "Frontend Development" },
            ]}
          />

          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <Code className="w-8 h-8 text-blue-300" />
              <span className="text-blue-300 font-medium">
                Frontend Development
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Modern Frontend
              <br />
              <span className="text-blue-300">That Converts</span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl leading-relaxed">
              I build high-performance, user-centered frontend applications
              using React, Next.js, and modern JavaScript. From interactive
              dashboards to e-commerce platforms, I create experiences that
              engage users and drive business results.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-blue-300" />
                <span className="text-blue-100">
                  Cross-platform compatibility
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-blue-300" />
                <span className="text-blue-100">Optimized performance</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/book"
                className="inline-flex items-center space-x-2 bg-white text-blue-700 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Consultation</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 border-2 border-blue-300 text-blue-300 px-8 py-4 rounded-lg font-bold hover:bg-blue-300 hover:text-blue-900 transition-all duration-300"
              >
                <span>Discuss Project</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What I Deliver */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What You Get
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Modern frontend solutions built with performance, accessibility,
              and user experience as core principles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Technologies & Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              I work with modern, battle-tested technologies to ensure your
              application is scalable, maintainable, and future-proof.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    {tech.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tech.level === "Expert"
                        ? "bg-green-100 text-green-700"
                        : tech.level === "Advanced"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tech.level}
                  </span>
                </div>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              My Development Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A proven methodology that ensures quality, performance, and
              alignment with your business goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {processes.map((process, index) => {
              const Icon = process.icon;
              return (
                <div
                  key={process.title}
                  className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-600 font-medium mb-1">
                        Step {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {process.title}
                      </h3>
                      <p className="text-gray-600">{process.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {process.details.map((detail) => (
                      <li key={detail} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your frontend needs and create a solution that
            delights your users and drives your business forward.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center space-x-2 bg-white text-blue-700 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Consultation</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center space-x-2 border-2 border-blue-300 text-blue-300 px-8 py-4 rounded-lg font-bold hover:bg-blue-300 hover:text-blue-900 transition-all duration-300"
            >
              <span>View All Services</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
