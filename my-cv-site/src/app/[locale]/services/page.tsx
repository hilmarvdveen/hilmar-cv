import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Code,
  Zap,
  Palette,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Globe,
} from "lucide-react";
import { PageSEO } from "@/components/SEO/PageSEO";
import { servicesSEO } from "@/lib/seo.pages";
import {
  generateSEOMetadata,
  generateStructuredData,
} from "@/lib/generateSEOMetadata";
import { siteConfig } from "@/lib/seo.config";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const config = servicesSEO(locale);
  return generateSEOMetadata(locale, config);
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const config = servicesSEO(locale);
  const currentUrl = `${siteConfig.url}/${locale}/services`;
  const structuredData = generateStructuredData(config, locale, currentUrl);

  const services = [
    {
      id: "frontend",
      title: "Frontend Development",
      icon: Code,
      shortDescription:
        "Modern, responsive user interfaces that engage users and drive conversions.",
      fullDescription:
        "I specialize in building high-performance frontend applications using React, Next.js, Vue.js, and modern JavaScript. From interactive dashboards to e-commerce platforms, I create user experiences that are both beautiful and functional.",
      technologies: [
        "React",
        "Next.js",
        "Vue.js",
        "TypeScript",
        "Tailwind CSS",
        "Redux",
      ],
      benefits: [
        "Mobile-first responsive design",
        "SEO optimized architecture",
        "Lightning-fast performance",
        "Accessibility compliant (WCAG 2.1)",
      ],
      href: "/services/frontend",
      color: "bg-blue-500",
      accent: "text-blue-600",
    },
    {
      id: "fullstack",
      title: "Full-Stack Solutions",
      icon: Zap,
      shortDescription:
        "Complete web applications with robust backend architecture and seamless integrations.",
      fullDescription:
        "End-to-end development of scalable web applications. I handle everything from database design and API development to frontend implementation and deployment, ensuring your application performs reliably at scale.",
      technologies: [
        "Node.js",
        "Express",
        "PostgreSQL",
        "MongoDB",
        "AWS",
        "Docker",
      ],
      benefits: [
        "Scalable architecture design",
        "API development & integration",
        "Database optimization",
        "Cloud deployment & DevOps",
      ],
      href: "/services/fullstack",
      color: "bg-emerald-500",
      accent: "text-emerald-600",
    },
    {
      id: "design-systems",
      title: "Design Systems",
      icon: Palette,
      shortDescription:
        "Consistent, scalable component libraries that streamline development and enhance user experience.",
      fullDescription:
        "I create comprehensive design systems and component libraries that ensure consistency across your digital products. From style guides to reusable React components, I help teams build faster and maintain brand coherence.",
      technologies: [
        "Storybook",
        "Figma",
        "React",
        "Styled Components",
        "Sass",
        "Design Tokens",
      ],
      benefits: [
        "Improved development velocity",
        "Consistent brand experience",
        "Reduced design debt",
        "Enhanced team collaboration",
      ],
      href: "/services/design-systems",
      color: "bg-purple-500",
      accent: "text-purple-600",
    },
    {
      id: "consulting",
      title: "Technical Consulting",
      icon: Users,
      shortDescription:
        "Strategic technical guidance, code reviews, and team mentoring from 15+ years of experience.",
      fullDescription:
        "Leverage my extensive experience to solve complex technical challenges. I provide architecture reviews, performance optimization, team mentoring, and strategic guidance to help your projects succeed and your team grow.",
      technologies: [
        "Architecture Review",
        "Performance Audit",
        "Code Review",
        "Team Training",
        "Process Optimization",
      ],
      benefits: [
        "Reduced technical debt",
        "Improved team productivity",
        "Optimized performance",
        "Strategic technology decisions",
      ],
      href: "/services/consulting",
      color: "bg-orange-500",
      accent: "text-orange-600",
    },
  ];

  return (
    <>
      <PageSEO structuredData={structuredData} />

      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <Breadcrumb
              items={[{ label: "Services", translationKey: "nav.services" }]}
            />

            <header className="max-w-4xl">
              <div className="flex items-center space-x-3 mb-6">
                <Star className="w-6 h-6 text-emerald-300" />
                <span className="text-emerald-300 font-medium">
                  15+ Years Experience
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                Frontend Development Services
                <br />
                <span className="text-emerald-300">That Drive Results</span>
              </h1>

              <p className="text-xl text-emerald-100 mb-8 max-w-3xl leading-relaxed">
                From concept to delivery, I provide comprehensive technical
                solutions that help companies and entrepreneurs build scalable,
                successful digital products using React, Next.js, and Angular.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-emerald-300" />
                  <span className="text-emerald-100">Remote & On-site</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-emerald-300" />
                  <span className="text-emerald-100">Flexible Engagement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                  <span className="text-emerald-100">Proven Track Record</span>
                </div>
              </div>

              <Link
                href="/book"
                className="inline-flex items-center space-x-2 bg-white text-emerald-700 px-8 py-4 rounded-lg font-bold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </header>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <header className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Web Development Services
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Whether you need a complete application, frontend expertise, or
                strategic guidance, I have the experience to deliver exceptional
                results using modern technologies like React, Next.js, and
                TypeScript.
              </p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4 mb-6">
                      <div
                        className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-600">
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {service.fullDescription}
                    </p>

                    {/* Technologies */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Technologies & Tools
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Key Benefits
                      </h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit) => (
                          <li
                            key={benefit}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle
                              className={`w-4 h-4 ${service.accent}`}
                            />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={service.href}
                      className={`group inline-flex items-center space-x-2 ${service.accent} font-semibold hover:underline`}
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your needs and find the perfect solution for
              your business goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center space-x-2 bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center space-x-2 border-2 border-emerald-600 text-emerald-400 px-8 py-4 rounded-lg font-bold hover:bg-emerald-600 hover:text-white transition-all duration-300"
              >
                <span>Get In Touch</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
