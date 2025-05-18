import { FC } from "react";
import {
  LightBulbIcon,
  CpuChipIcon,
  PaintBrushIcon,
  ArrowsRightLeftIcon,
  UsersIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

export type IconName =
  | "idea"
  | "ai"
  | "design"
  | "integration"
  | "mentorship"
  | "scale";

const iconMap: Record<IconName, FC<{ className?: string }>> = {
  idea: LightBulbIcon,
  ai: CpuChipIcon,
  design: PaintBrushIcon,
  integration: ArrowsRightLeftIcon,
  mentorship: UsersIcon,
  scale: RocketLaunchIcon,
};

interface IconProps {
  name: IconName;
  className?: string;
}

export const Icon: FC<IconProps> = ({ name, className = "w-6 h-6" }) => {
  const IconComponent = iconMap[name];
  return <IconComponent className={className} aria-hidden="true" />;
};
