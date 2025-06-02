import { FC } from "react";
import {
  Lightbulb,
  Cpu,
  Paintbrush,
  ArrowLeftRight,
  Users,
  Rocket,
} from "lucide-react";

export type IconName =
  | "idea"
  | "ai"
  | "design"
  | "integration"
  | "mentorship"
  | "scale";

const iconMap: Record<IconName, FC<{ className?: string }>> = {
  idea: Lightbulb,
  ai: Cpu,
  design: Paintbrush,
  integration: ArrowLeftRight,
  mentorship: Users,
  scale: Rocket,
};

interface IconProps {
  name: IconName;
  className?: string;
}

export const Icon: FC<IconProps> = ({ name, className = "w-6 h-6" }) => {
  const IconComponent = iconMap[name];
  return <IconComponent className={className} aria-hidden="true" />;
};
