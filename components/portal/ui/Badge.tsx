import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "green" | "red" | "orange" | "yellow" | "gray" | "purple" | "slate";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "gray", ...props }, ref) => {
    const variants = {
      blue: "bg-blue-600/15 text-blue-500 dark:text-blue-400",
      green: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      red: "bg-red-500/15 text-red-600 dark:text-red-400",
      orange: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
      yellow: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
      gray: "bg-slate-400/15 text-slate-600 dark:text-slate-400",
      purple: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
      slate: "bg-slate-400/15 text-slate-600 dark:text-slate-400",
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold gap-1 ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
