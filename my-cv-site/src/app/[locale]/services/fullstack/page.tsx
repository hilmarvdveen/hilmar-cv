import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Zap,
  ArrowRight,
  CheckCircle,
  Database,
  Cloud,
  Shield,
  Layers,
  Globe,
  Server,
  Calendar,
  Cpu,
  Lock,
  Workflow,
  GitBranch,
} from "lucide-react";

export default function FullStackSolutionsPage() {
  const technologies = [
    {
      category: "Backend",
      items: [
        {
          name: "Node.js",
          description: "Scalable server-side runtime",
          level: "Expert",
        },
        {
          name: "Express",
          description: "Fast, minimal web framework",
          level: "Expert",
        },
        {
          name: "GraphQL",
          description: "Efficient API query language",
          level: "Advanced",
        },
        {
          name: "REST APIs",
          description: "RESTful service architecture",
          level: "Expert",
        },
      ],
    },
    {
      category: "Databases",
      items: [
        {
          name: "PostgreSQL",
          description: "Robust relational database",
          level: "Advanced",
        },
        {
          name: "MongoDB",
          description: "Flexible document database",
          level: "Advanced",
        },
        {
          name: "Redis",
          description: "In-memory data structure store",
          level: "Intermediate",
        },
      ],
    },
    {
      category: "Cloud & DevOps",
      items: [
        {
          name: "AWS",
          description: "Comprehensive cloud platform",
          level: "Advanced",
        },
        {
          name: "Docker",
          description: "Containerization platform",
          level: "Advanced",
        },
        {
          name: "CI/CD",
          description: "Continuous integration/deployment",
          level: "Advanced",
        },
      ],
    },
  ];

  const processes = [
    {
      title: "Architecture Design",
      description:
        "Strategic system planning for scalability and maintainability",
      icon: Layers,
      details: [
        "System architecture planning",
        "Database schema design",
        "API architecture definition",
        "Performance requirements analysis",
      ],
    },
    {
      title: "Backend Development",
      description: "Robust server-side logic and database integration",
      icon: Server,
      details: [
        "RESTful API development",
        "Database design & optimization",
        "Authentication & authorization",
        "Third-party integrations",
      ],
    },
    {
      title: "Frontend Integration",
      description:
        "Seamless connection between user interface and backend systems",
      icon: Globe,
      details: [
        "State management implementation",
        "API client development",
        "Real-time features (WebSockets)",
        "Progressive Web App features",
      ],
    },
    {
      title: "Deployment & Monitoring",
      description:
        "Production deployment with continuous monitoring and optimization",
      icon: Cloud,
      details: [
        "Cloud infrastructure setup",
        "Automated deployment pipelines",
        "Performance monitoring",
        "Security auditing & updates",
      ],
    },
  ];

  const benefits = [
    {
      icon: Layers,
      title: "Scalable Architecture",
      description:
        "Built to grow with your business, from MVP to enterprise scale",
    },
    {
      icon: Shield,
      title: "Security First",
      description:
        "Industry-standard security practices with encryption and authentication",
    },
    {
      icon: Database,
      title: "Optimized Performance",
      description: "Fast queries, efficient caching, and optimized data flow",
    },
    {
      icon: Workflow,
      title: "API-First Design",
      description:
        "Flexible APIs that enable future integrations and mobile apps",
    },
    {
      icon: Cloud,
      title: "Cloud Native",
      description: "Modern deployment with auto-scaling and high availability",
    },
    {
      icon: GitBranch,
      title: "DevOps Integration",
      description: "Automated testing, deployment, and monitoring workflows",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              {
                label: "Services",
                href: "/services",
                translationKey: "nav.services",
              },
              { label: "Full-Stack Solutions" },
            ]}
          />

          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="w-8 h-8 text-emerald-300" />
              <span className="text-emerald-300 font-medium">
                Full-Stack Development
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Complete Digital
              <br />
              <span className="text-emerald-300">Solutions</span>
            </h1>

            <p className="text-xl text-emerald-100 mb-8 max-w-3xl leading-relaxed">
              End-to-end development of scalable web applications. I handle
              everything from database design and API development to frontend
              implementation and cloud deployment, ensuring your application
              performs reliably at scale.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <Cpu className="w-5 h-5 text-emerald-300" />
                <span className="text-emerald-100">
                  High-performance backend
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-emerald-300" />
                <span className="text-emerald-100">
                  Enterprise-grade security
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/book"
                className="inline-flex items-center space-x-2 bg-white text-emerald-700 px-8 py-4 rounded-lg font-bold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Consultation</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 border-2 border-emerald-300 text-emerald-300 px-8 py-4 rounded-lg font-bold hover:bg-emerald-300 hover:text-emerald-900 transition-all duration-300"
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
              Complete System Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive applications built with modern architecture,
              security best practices, and scalable infrastructure.
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
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-600" />
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
              Technology Stack
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Modern, proven technologies chosen for reliability, performance,
              and long-term maintainability.
            </p>
          </div>

          <div className="space-y-12">
            {technologies.map((category) => (
              <div key={category.category}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-8 bg-emerald-600 rounded-full mr-4"></div>
                  {category.category}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((tech) => (
                    <div
                      key={tech.name}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-bold text-gray-900">
                          {tech.name}
                        </h4>
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
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Development Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A systematic approach to building robust, scalable applications
              from concept to production.
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
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm text-emerald-600 font-medium mb-1">
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
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
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
      <section className="bg-emerald-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Build Your Application?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your requirements and create a scalable solution
            that grows with your business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center space-x-2 bg-white text-emerald-700 px-8 py-4 rounded-lg font-bold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Consultation</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center space-x-2 border-2 border-emerald-300 text-emerald-300 px-8 py-4 rounded-lg font-bold hover:bg-emerald-300 hover:text-emerald-900 transition-all duration-300"
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
