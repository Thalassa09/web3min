import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const cardVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

export interface BitCardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

export function Card({ className, font, children, ...props }: BitCardProps) {
  return (
    <div
      className={cn(
        "relative bg-card text-card-foreground border-y-4 md:border-y-6 border-foreground dark:border-ring p-0",
        font !== "normal" && "retro",
        className
      )}
      {...props}
    >
      <div className="w-full h-full flex flex-col bg-card text-card-foreground p-5">
        {children}
      </div>

      <div
        className="absolute inset-0 border-x-4 md:border-x-6 -mx-1 md:-mx-1.5 border-inherit pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

export function CardHeader({ className, font, ...props }: BitCardProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 pb-4", font !== "normal" && "retro", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, font, ...props }: BitCardProps) {
  return (
    <h3
      className={cn(
        "font-bold leading-none tracking-tight text-sm md:text-base",
        font !== "normal" && "retro",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, font, ...props }: BitCardProps) {
  return (
    <p
      className={cn(
        "text-xs text-muted-foreground",
        font !== "normal" && "retro",
        className
      )}
      {...props}
    />
  );
}

export function CardAction({ className, font, ...props }: BitCardProps) {
  return (
    <div
      className={cn(font !== "normal" && "retro", className)}
      {...props}
    />
  );
}

export function CardContent({ className, font, ...props }: BitCardProps) {
  return (
    <div
      className={cn("flex-1", font !== "normal" && "retro", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, font, ...props }: BitCardProps) {
  return (
    <div
      className={cn("flex items-center pt-4", font !== "normal" && "retro", className)}
      {...props}
    />
  );
}

export default Card;
