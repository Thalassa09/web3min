import React from "react";
import { Sparkles } from "lucide-react";

export interface SkillTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  icon?: React.ReactNode;
  level?: string | number;
  className?: string;
}

/**
 * Atlassian Rovo UI — Skill Tag
 * Primary visual identifier for an AI skill or verified agent capability.
 */
export function SkillTag({
  name,
  icon = <Sparkles className="size-3 text-[#0B63F6]" />,
  level,
  className = "",
  ...props
}: SkillTagProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[12px]
        bg-[#E4F0FF] border-2 border-[#8FC2FF] text-[#0B4FD1]
        text-[11px] font-extrabold shadow-[0_2px_0_#C2DBFA]
        select-none transition-all
        ${className}
      `}
      {...props}
    >
      {icon}
      <span>{name}</span>
      {level !== undefined && (
        <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-white/80 text-[#0B63F6] border border-[#8FC2FF]/60 font-bold">
          {level}
        </span>
      )}
    </span>
  );
}

export interface RovoGenerativeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isGenerating?: boolean;
  className?: string;
}

/**
 * Atlassian Rovo UI — Generative Surface Card
 * Wraps AI-powered insights, mascot dialogues, or live interactive evaluations
 * with a dynamic generative shimmer border during active thought/generation.
 */
export function RovoGenerativeCard({
  children,
  isGenerating = false,
  className = "",
  ...props
}: RovoGenerativeCardProps) {
  return (
    <div
      className={`
        relative rounded-[22px] bg-white p-5 md:p-6
        border-2 border-[#B9CFE9] shadow-[0_6px_0_#C8DBF0,0_18px_34px_-18px_rgba(9,48,102,0.3)]
        ${isGenerating ? "rovo-generative-border border-transparent" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
