import { FC } from "react";
import {
  Lightbulb,
  Cpu,
  Paintbrush,
  ArrowLeftRight,
  Users,
  Rocket,
  Code2,
  Building2,
  TrendingUp,
  Zap,
  Award,
  MapPin,
  GraduationCap,
  Database,
  Cloud,
  Layers,
  Calendar,
  Phone,
} from "lucide-react";

export type IconName =
  | "idea"
  | "ai"
  | "design"
  | "integration"
  | "mentorship"
  | "scale"
  | "code"
  | "enterprise"
  | "results"
  | "shipping"
  | "award"
  | "location"
  | "education"
  | "database"
  | "cloud"
  | "architecture"
  | "calendar"
  | "phone";

const iconMap: Record<IconName, FC<{ className?: string }>> = {
  idea: Lightbulb,
  ai: Cpu,
  design: Paintbrush,
  integration: ArrowLeftRight,
  mentorship: Users,
  scale: Rocket,
  code: Code2,
  enterprise: Building2,
  results: TrendingUp,
  shipping: Zap,
  award: Award,
  location: MapPin,
  education: GraduationCap,
  database: Database,
  cloud: Cloud,
  architecture: Layers,
  calendar: Calendar,
  phone: Phone,
};

interface IconProps {
  name: IconName;
  className?: string;
}

export const Icon: FC<IconProps> = ({ name, className = "w-6 h-6" }) => {
  const IconComponent = iconMap[name];
  return <IconComponent className={className} aria-hidden="true" />;
};
