import * as React from "react";
import { type BitProgressProps, Progress } from "@/components/ui/8bit-progress";

export interface ManaBarProps extends React.ComponentProps<"div"> {
  className?: string;
  props?: BitProgressProps;
  variant?: "retro" | "default";
  value?: number;
}

export default function ManaBar({
  className,
  variant = "retro",
  value = 100,
  ...props
}: ManaBarProps) {
  return (
    <Progress
      {...props}
      value={value}
      variant={variant}
      className={className}
      progressBg="bg-blue-500"
    />
  );
}
