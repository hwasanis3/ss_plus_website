import { HTMLAttributes, forwardRef } from "react";

export interface AlertStripProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "red" | "orange" | "yellow" | "blue" | "gray";
  icon?: React.ReactNode;
}

export const AlertStrip = forwardRef<HTMLDivElement, AlertStripProps>(
  ({ className = "", variant = "gray", icon, children, ...props }, ref) => {
    const variants = {
      red: "bg-red-500/10 border-red-500/30 text-slate-900 dark:text-slate-100",
      orange: "bg-orange-500/10 border-orange-500/30 text-slate-900 dark:text-slate-100",
      yellow: "bg-yellow-500/10 border-yellow-500/30 text-slate-900 dark:text-slate-100",
      blue: "bg-blue-500/10 border-blue-500/30 text-slate-900 dark:text-slate-100",
      gray: "bg-slate-500/10 border-slate-500/30 text-slate-900 dark:text-slate-100",
    };

    return (
      <div
        ref={ref}
        className={`rounded-lg py-3 px-4 flex items-center gap-3 text-sm border ${variants[variant]} ${className}`}
        {...props}
      >
        {icon && <span className="flex-shrink-0 text-base">{icon}</span>}
        <div className="flex-1">{children}</div>
      </div>
    );
  }
);
AlertStrip.displayName = "AlertStrip";
