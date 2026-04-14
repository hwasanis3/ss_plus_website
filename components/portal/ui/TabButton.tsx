import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

export interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: ReactNode;
}

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ className = "", active = false, icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-4 py-2 rounded-lg font-semibold text-[13px] cursor-pointer border-none transition-all duration-200 ${
          active
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        } ${className}`}
        {...props}
      >
        <div className="flex items-center gap-2">
          {icon}
          {children}
        </div>
      </button>
    );
  }
);
TabButton.displayName = "TabButton";
