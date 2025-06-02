import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Palette,
  ArrowRight,
  CheckCircle,
  Layers,
  Zap,
  Users,
  Globe,
  Calendar,
  Grid,
  Code,
  BookOpen,
  Sparkles,
  Workflow,
  RefreshCw,
  Target,
} from "lucide-react";

export default function DesignSystemsPage() {
  const technologies = [
    {
      category: "Design Tools",
      items: [
        {
          name: "Figma",
          description: "Collaborative interface design",
          level: "Expert",
        },
        {
          name: "Sketch",
          description: "Vector-based design tool",
          level: "Advanced",
        },
        {
          name: "Adobe Creative Suite",
          description: "Professional design software",
          level: "Advanced",
        },
        {
          name: "Principle",
          description: "Interactive prototyping",
          level: "Intermediate",
        },
      ],
    },
    {
      category: "Development",
      items: [
        {
          name: "React/Storybook",
          description: "Component development & documentation",
          level: "Expert",
        },
        {
          name: "Styled Components",
          description: "CSS-in-JS styling solution",
          level: "Expert",
        },
        {
          name: "Design Tokens",
          description: "Systematic design decisions",
          level: "Advanced",
        },
        {
          name: "TypeScript",
          description: "Type-safe component development",
          level: "Advanced",
        },
      ],
    },
    {
      category: "Documentation",
      items: [
        {
          name: "GitBook",
          description: "Team documentation platform",
          level: "Advanced",
        },
        {
          name: "Notion",
          description: "Collaborative workspace",
          level: "Advanced",
        },
        {
          name: "Markdown",
          description: "Lightweight markup language",
          level: "Expert",
        },
      ],
    },
  ];

  const processes = [
    {
      title: "Design Audit & Discovery",
      description:
        "Analyzing existing patterns and identifying opportunities for systematization",
      icon: Target,
      details: [
        "Current design inventory",
        "Component pattern analysis",
        "Brand guideline review",
        "User experience assessment",
      ],
    },
    {
      title: "System Architecture",
      description: "Creating the foundational structure and design principles",
      icon: Grid,
      details: [
        "Design token definition",
        "Component hierarchy planning",
        "Naming convention standards",
        "Accessibility guidelines",
      ],
    },
    {
      title: "Component Library",
      description:
        "Building reusable, documented components with clear guidelines",
      icon: Code,
      details: [
        "Interactive component development",
        "Usage documentation",
        "Code examples & snippets",
        "Responsive behavior definitions",
      ],
    },
    {
      title: "Implementation & Training",
      description:
        "Rolling out the system with team education and ongoing support",
      icon: Users,
      details: [
        "Team training sessions",
        "Implementation guidelines",
        "Version control workflows",
        "Continuous improvement process",
      ],
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Development Velocity",
      description:
        "Accelerate product development with pre-built, tested components",
    },
    {
      icon: Layers,
      title: "Consistent Experience",
      description:
        "Maintain brand coherence across all touchpoints and platforms",
    },
    {
      icon: RefreshCw,
      title: "Reduced Maintenance",
      description:
        "Centralized updates automatically propagate across all products",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Bridge design and development with shared language and tools",
    },
    {
      icon: Globe,
      title: "Scalable Foundation",
      description:
        "Support rapid growth without compromising quality or consistency",
    },
    {
      icon: BookOpen,
      title: "Self-Service Design",
      description:
        "Empower team members to create on-brand designs independently",
    },
  ];

  const deliverables = [
    {
      title: "Design Token Library",
      description:
        "Colors, typography, spacing, and other foundational design decisions",
      icon: Palette,
    },
    {
      title: "Component Library",
      description: "Reusable UI components with variants and states",
      icon: Grid,
    },
    {
      title: "Usage Guidelines",
      description: "Clear documentation on when and how to use each component",
      icon: BookOpen,
    },
    {
      title: "Code Implementation",
      description: "Production-ready React components with TypeScript",
      icon: Code,
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              {
                label: "Services",
                href: "/services",
                translationKey: "nav.services",
              },
              { label: "Design Systems" },
            ]}
          />

          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="w-8 h-8 text-purple-300" />
              <span className="text-purple-300 font-medium">
                Design Systems
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Scalable Design
              <br />
              <span className="text-purple-300">Consistency</span>
            </h1>

            <p className="text-xl text-purple-100 mb-8 max-w-3xl leading-relaxed">
              I create comprehensive design systems and component libraries that
              ensure consistency across your digital products. From style guides
              to reusable React components, I help teams build faster and
              maintain brand coherence.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-purple-300" />
                <span className="text-purple-100">Brand consistency</span>
              </div>
              <div className="flex items-center space-x-3">
                <Workflow className="w-5 h-5 text-purple-300" />
                <span className="text-purple-100">Streamlined workflow</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/book"
                className="inline-flex items-center space-x-2 bg-white text-purple-700 px-8 py-4 rounded-lg font-bold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Consultation</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 border-2 border-purple-300 text-purple-300 px-8 py-4 rounded-lg font-bold hover:bg-purple-300 hover:text-purple-900 transition-all duration-300"
              >
                <span>Discuss Project</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Complete Design System Package
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything your team needs to create consistent, scalable digital
              experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {deliverables.map((deliverable) => {
              const Icon = deliverable.icon;
              return (
                <div
                  key={deliverable.title}
                  className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {deliverable.title}
                  </h3>
                  <p className="text-gray-600">{deliverable.description}</p>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
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
              Tools & Technologies
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Industry-leading tools for creating, maintaining, and implementing
              design systems.
            </p>
          </div>

          <div className="space-y-12">
            {technologies.map((category) => (
              <div key={category.category}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-8 bg-purple-600 rounded-full mr-4"></div>
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
              Design System Development Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A strategic approach to creating design systems that truly scale
              with your organization.
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
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-purple-600 font-medium mb-1">
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
                        <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
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
      <section className="bg-purple-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Scale Your Design Process?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Let&apos;s create a design system that empowers your team and
            ensures consistent experiences across all your products.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center space-x-2 bg-white text-purple-700 px-8 py-4 rounded-lg font-bold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Consultation</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center space-x-2 border-2 border-purple-300 text-purple-300 px-8 py-4 rounded-lg font-bold hover:bg-purple-300 hover:text-purple-900 transition-all duration-300"
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
