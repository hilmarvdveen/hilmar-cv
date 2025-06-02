import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Users,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Calendar,
  BookOpen,
  Search,
  Settings,
  Award,
  Brain,
  Lightbulb,
  MessageSquare,
  Clock,
  BarChart3,
} from "lucide-react";

export default function TechnicalConsultingPage() {
  const consultingAreas = [
    {
      category: "Architecture & Strategy",
      items: [
        {
          name: "System Architecture Review",
          description: "Scalability and maintainability assessment",
          level: "Expert",
        },
        {
          name: "Technology Stack Planning",
          description: "Future-proof technology decisions",
          level: "Expert",
        },
        {
          name: "Performance Optimization",
          description: "Speed and efficiency improvements",
          level: "Advanced",
        },
        {
          name: "Security Auditing",
          description: "Vulnerability assessment & best practices",
          level: "Advanced",
        },
      ],
    },
    {
      category: "Team & Process",
      items: [
        {
          name: "Code Review & Quality",
          description: "Best practices and code standards",
          level: "Expert",
        },
        {
          name: "Development Workflows",
          description: "CI/CD and deployment optimization",
          level: "Advanced",
        },
        {
          name: "Team Mentoring",
          description: "Skills development and knowledge transfer",
          level: "Expert",
        },
        {
          name: "Agile Implementation",
          description: "Process optimization and team efficiency",
          level: "Advanced",
        },
      ],
    },
    {
      category: "Technical Leadership",
      items: [
        {
          name: "Project Planning",
          description: "Timeline and resource estimation",
          level: "Expert",
        },
        {
          name: "Risk Assessment",
          description: "Technical and business risk evaluation",
          level: "Advanced",
        },
        {
          name: "Vendor Evaluation",
          description: "Technology partner selection guidance",
          level: "Advanced",
        },
      ],
    },
  ];

  const processes = [
    {
      title: "Discovery & Assessment",
      description:
        "Understanding your current state, challenges, and objectives",
      icon: Search,
      details: [
        "Current system analysis",
        "Team capability assessment",
        "Business goal alignment",
        "Challenge identification",
      ],
    },
    {
      title: "Strategic Planning",
      description: "Developing actionable recommendations and roadmaps",
      icon: Target,
      details: [
        "Solution architecture design",
        "Implementation roadmap",
        "Resource requirement planning",
        "Risk mitigation strategies",
      ],
    },
    {
      title: "Implementation Support",
      description: "Hands-on guidance during execution and knowledge transfer",
      icon: Settings,
      details: [
        "Technical implementation guidance",
        "Team training and mentoring",
        "Progress monitoring",
        "Problem-solving support",
      ],
    },
    {
      title: "Optimization & Growth",
      description: "Continuous improvement and scaling for long-term success",
      icon: TrendingUp,
      details: [
        "Performance monitoring",
        "Process refinement",
        "Scaling strategy development",
        "Ongoing advisory support",
      ],
    },
  ];

  const benefits = [
    {
      icon: Brain,
      title: "Expert Insights",
      description:
        "15+ years of experience solving complex technical challenges",
    },
    {
      icon: Zap,
      title: "Accelerated Progress",
      description: "Avoid common pitfalls and reach your goals faster",
    },
    {
      icon: Shield,
      title: "Risk Mitigation",
      description:
        "Identify and address potential issues before they become problems",
    },
    {
      icon: TrendingUp,
      title: "Strategic Advantage",
      description:
        "Make informed decisions that position you for long-term success",
    },
    {
      icon: Award,
      title: "Team Development",
      description: "Upskill your team and build internal capabilities",
    },
    {
      icon: BarChart3,
      title: "Measurable Results",
      description: "Clear KPIs and metrics to track improvement and ROI",
    },
  ];

  const deliverables = [
    {
      title: "Technical Assessment Report",
      description:
        "Comprehensive analysis of current systems, processes, and opportunities",
      icon: BookOpen,
    },
    {
      title: "Strategic Roadmap",
      description:
        "Detailed plan with timelines, milestones, and resource requirements",
      icon: Target,
    },
    {
      title: "Implementation Guidelines",
      description: "Step-by-step instructions and best practices for execution",
      icon: Settings,
    },
    {
      title: "Team Training Program",
      description: "Customized education and skill development plan",
      icon: Users,
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-900 via-orange-800 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              {
                label: "Services",
                href: "/services",
                translationKey: "nav.services",
              },
              { label: "Technical Consulting" },
            ]}
          />

          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-8 h-8 text-orange-300" />
              <span className="text-orange-300 font-medium">
                Technical Consulting
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Strategic Technical
              <br />
              <span className="text-orange-300">Guidance</span>
            </h1>

            <p className="text-xl text-orange-100 mb-8 max-w-3xl leading-relaxed">
              Leverage my extensive experience to solve complex technical
              challenges. I provide architecture reviews, performance
              optimization, team mentoring, and strategic guidance to help your
              projects succeed and your team grow.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <Lightbulb className="w-5 h-5 text-orange-300" />
                <span className="text-orange-100">Strategic insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-orange-300" />
                <span className="text-orange-100">Clear communication</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/book"
                className="inline-flex items-center space-x-2 bg-white text-orange-700 px-8 py-4 rounded-lg font-bold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Consultation</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 border-2 border-orange-300 text-orange-300 px-8 py-4 rounded-lg font-bold hover:bg-orange-300 hover:text-orange-900 transition-all duration-300"
              >
                <span>Discuss Challenges</span>
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
              Comprehensive Consulting Package
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Strategic guidance, actionable insights, and hands-on support to
              accelerate your technical initiatives.
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
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-orange-600" />
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
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-orange-600" />
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

      {/* Consulting Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Areas of Expertise
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive technical consulting across all aspects of software
              development and team leadership.
            </p>
          </div>

          <div className="space-y-12">
            {consultingAreas.map((category) => (
              <div key={category.category}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-8 bg-orange-600 rounded-full mr-4"></div>
                  {category.category}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((area) => (
                    <div
                      key={area.name}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-bold text-gray-900">
                          {area.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            area.level === "Expert"
                              ? "bg-green-100 text-green-700"
                              : area.level === "Advanced"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {area.level}
                        </span>
                      </div>
                      <p className="text-gray-600">{area.description}</p>
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
              Consulting Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A structured approach to understanding your challenges and
              delivering actionable solutions that drive real results.
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
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-orange-600 font-medium mb-1">
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
                        <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
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

      {/* Testimonial/Experience Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-orange-50 rounded-2xl p-12">
            <div className="flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-orange-600 mr-3" />
              <span className="text-3xl font-bold text-orange-900">15+</span>
              <span className="text-lg text-orange-700 ml-2">
                Years Experience
              </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Proven Track Record
            </h3>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              I&apos;ve helped dozens of companies overcome technical
              challenges, optimize their development processes, and build
              stronger engineering teams. From startups to enterprise
              organizations, my consulting delivers measurable results.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  50+
                </div>
                <div className="text-gray-700">Projects Consulted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  100+
                </div>
                <div className="text-gray-700">Developers Mentored</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  25+
                </div>
                <div className="text-gray-700">Companies Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Overcome Your Technical Challenges?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your specific challenges and create a strategic
            plan to achieve your technical goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center space-x-2 bg-white text-orange-700 px-8 py-4 rounded-lg font-bold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Consultation</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center space-x-2 border-2 border-orange-300 text-orange-300 px-8 py-4 rounded-lg font-bold hover:bg-orange-300 hover:text-orange-900 transition-all duration-300"
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
