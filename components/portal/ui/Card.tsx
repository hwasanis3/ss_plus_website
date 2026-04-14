import { HTMLAttributes, forwardRef } from "react";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-[10px] shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] ${className}`}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
