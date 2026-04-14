import { HTMLAttributes, forwardRef } from "react";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  color?: string;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className = "", value, color = "bg-blue-600", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${className}`}
        {...props}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";
