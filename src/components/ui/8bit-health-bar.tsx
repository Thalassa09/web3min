import * as React from "react";
import { type BitProgressProps, Progress } from "@/components/ui/8bit-progress";

export interface HealthBarProps extends React.ComponentProps<"div"> {
  className?: string;
  props?: BitProgressProps;
  variant?: "retro" | "default";
  value?: number;
}

export default function HealthBar({
  className,
  variant = "retro",
  value = 100,
  ...props
}: HealthBarProps) {
  return (
    <Progress
      {...props}
      value={value}
      variant={variant}
      className={className}
      progressBg="bg-red-500"
    />
  );
}
